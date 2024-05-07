import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const baseUrl = process.env.SERVICE_MURRAY_SERVICE;

export const LightningNetwork = {
  cron: "0 30 10,19 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${baseUrl}/lightning/statistics`);
      const fields = result.data.data?.fields;

      if (fields) {
        const messageArr = [];
        const { nodes, clearNet, tor, avgCapacity, totalCapacity, channels, avgFee, avgBaseFee } = fields;

        messageArr.push(`⚡ Lightning Network`);
        messageArr.push(``);
        messageArr.push(`${totalCapacity.description}: ${totalCapacity.value}`);
        messageArr.push(`${avgCapacity.description}: ${avgCapacity.value}`);
        messageArr.push(``);
        messageArr.push(`${nodes.description}: ${nodes.value}`);
        messageArr.push(`🤵‍♂️ Clearnet: ${clearNet.value}`);
        messageArr.push(`🕵️ Tor: ${tor.value}`);
        messageArr.push(`${channels.description}: ${channels.value}`);
        messageArr.push(``);
        messageArr.push(`${avgFee.description}: ${avgFee.value}`);
        messageArr.push(`${avgBaseFee.description}: ${avgBaseFee.value}`);
        messageArr.push(``);
        messageArr.push(`#Bitcoin #LightningNetwork`);

        const message = messageArr.join("\n");

        await Utils.sendEvent({ relay, sk, content: message, tags: [["Bitcoin", "LightningNetwork"]] });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
