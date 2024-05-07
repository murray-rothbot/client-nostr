import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const baseUrl = process.env.SERVICE_MURRAY_SERVICE;

export const Difficulty = {
  cron: "0 45 9,18,23 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${baseUrl}/blockchain/difficulty`);
      const fields = result.data.data?.fields;

      if (fields) {
        const messageArr = [];
        const currentProgress = fields.currentProgress.value.toFixed(2);
        const progressMessage = Utils.createProgressMessage(currentProgress);

        messageArr.push(`🦾 Bitcoin Difficulty Adjustment`);
        messageArr.push(``);
        messageArr.push(fields.currentProgress.description);
        messageArr.push(``);
        messageArr.push(progressMessage);
        messageArr.push(``);
        messageArr.push(
          `${fields.estimatedDate.description}: ${Utils.formatDate(new Date(fields.estimatedDate.value))}`
        );
        messageArr.push(``);
        messageArr.push(`Current Change   : ${fields.estimateChange.value}`);
        messageArr.push(`Previous Change : ${fields.previousChange.value}`);
        messageArr.push(``);
        messageArr.push(`#Bitcoin #DifficultyAdjustment #GracePeriod`);

        const message = messageArr.join("\n");

        await Utils.sendEvent({
          relay,
          sk,
          content: message,
          tags: [["Bitcoin", "DifficultyAdjustment", "GracePeriod"]],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
