import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

export const Fees = {
  cron: "0 0 0,2,4,6,8,10,12,14,16,18,20,22,23 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/blockchain/fees/recommended`);
      const fields = result.data?.data?.fields;

      if (fields) {
        const messageLines = [];

        messageLines.push(`💸 Bitcoin Fees`);
        messageLines.push(``);
        messageLines.push(`🐇 Fastest : ${fields.fastestFee.value.replace("vByte", "vB")}`);
        messageLines.push(`🐢 +30 min : ${fields.halfHourFee.value.replace("vByte", "vB")}`);
        messageLines.push(`🐌 +60 min : ${fields.hourFee.value.replace("vByte", "vB")}`);
        messageLines.push(`🦥 +90 min : ${fields.economy.value.replace("vByte", "vB")}`);
        messageLines.push(``);
        messageLines.push(`🔥 Purge Limit : ${fields.minimum.value.replace("vByte", "vB")}`);
        messageLines.push(``);
        messageLines.push(`#Bitcoin #fees`);

        const message = messageLines.join("\n");

        await Utils.sendEvent({
          relay,
          sk,
          content: message,
          tags: [["bitcoin", "fees"]],
        });
      }
    } finally {
      console.log("Fees message.");
    }
  },
};
