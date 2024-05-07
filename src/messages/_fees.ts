import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const baseUrl = process.env.SERVICE_MURRAY_SERVICE;

export const Fees = {
  cron: "0 0 0,2,4,6,8,10,12,14,16,18,20,22,23 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${baseUrl}/blockchain/fees/recommended`);
      const fields = result.data.data?.fields;

      if (fields) {
        const messageArr = [];
        const { fastestFee, halfHourFee, hourFee, economy, minimum } = fields;

        messageArr.push(`💸 Bitcoin Fees`);
        messageArr.push(``);
        messageArr.push(`🐇 Fastest : ${fastestFee.value.replace("vByte", "vB")}`);
        messageArr.push(`🐢 +30 min : ${halfHourFee.value.replace("vByte", "vB")}`);
        messageArr.push(`🐌 +60 min : ${hourFee.value.replace("vByte", "vB")}`);
        messageArr.push(`🦥 +90 min : ${economy.value.replace("vByte", "vB")}`);
        messageArr.push(``);
        messageArr.push(`🔥 Purge Limit : ${minimum.value.replace("vByte", "vB")}`);
        messageArr.push(``);
        messageArr.push(`#Bitcoin #fees`);

        const message = messageArr.join("\n");

        await Utils.sendEvent({ relay, sk, content: message, tags: [["bitcoin", "fees"]] });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
