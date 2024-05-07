import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const baseUrl = process.env.SERVICE_MURRAY_SERVICE;

export const Halving = {
  cron: "0 15 9,12,14,19,21 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${baseUrl}/blockchain/halving`);
      const fields = result.data.data?.fields;

      if (fields) {
        const messageArr = [];
        const currentProgress = fields.completedPercentageRaw.value.toFixed(2);
        const progressMessage = Utils.createProgressMessage(currentProgress);

        messageArr.push(result.data.data.title);
        messageArr.push(``);
        messageArr.push(progressMessage);
        messageArr.push(``);
        messageArr.push(`${fields.halvingCountdown.description}: ${fields.halvingCountdown.value}`);
        messageArr.push(``);
        messageArr.push(`${fields.nextHalvingBlock.description}: ${fields.nextHalvingBlock.value}`);
        messageArr.push(`${fields.height.description}: ${fields.height.value}`);
        messageArr.push(``);
        messageArr.push(`${fields.daysUntilHalving.description}: ${fields.daysUntilHalving.value}`);
        messageArr.push(
          `${fields.nextHalvingDate.description}: ${Utils.formatDate(new Date(fields.nextHalvingDate.value))}`
        );
        messageArr.push(`${fields.halvingEra.description}: ${fields.halvingEra.value}`);
        messageArr.push(``);
        messageArr.push(`#Bitcoin #Halving`);

        const message = messageArr.join("\n");

        await Utils.sendEvent({
          relay,
          sk,
          content: message,
          tags: [["Bitcoin", "Halving"]],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
