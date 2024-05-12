import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const SERVICE_MURRAY_SERVICE = process.env.SERVICE_MURRAY_SERVICE;

export const Halving = {
  cron: "0 15 9,12,14,19,21 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${SERVICE_MURRAY_SERVICE}/blockchain/halving`);
      const fields = result.data?.data?.fields;
      const title = result.data?.data?.title;

      if (fields && title) {
        const currentProgress = fields.completedPercentageRaw.value.toFixed(2);
        const progressMessage = Utils.createProgressMessage({ currentProgress });
        const nextHalvingDate = Utils.formatDate({ date: new Date(fields.nextHalvingDate.value) });

        const messageLines = [];

        messageLines.push(title);
        messageLines.push(``);
        messageLines.push(progressMessage);
        messageLines.push(``);
        messageLines.push(`${fields.halvingCountdown.description}: ${fields.halvingCountdown.value}`);
        messageLines.push(``);
        messageLines.push(`${fields.nextHalvingBlock.description}: ${fields.nextHalvingBlock.value}`);
        messageLines.push(`${fields.height.description}: ${fields.height.value}`);
        messageLines.push(``);
        messageLines.push(`${fields.daysUntilHalving.description}: ${fields.daysUntilHalving.value}`);
        messageLines.push(`${fields.nextHalvingDate.description}: ${nextHalvingDate}`);
        messageLines.push(`${fields.halvingEra.description}: ${fields.halvingEra.value}`);
        messageLines.push(``);
        messageLines.push(`#Bitcoin #Halving`);

        const message = messageLines.join("\n");

        await Utils.sendEvent({
          relay,
          sk,
          content: message,
          tags: [["Bitcoin", "Halving"]],
        });
      }
    } finally {
      console.log("Halving message.");
    }
  },
};
