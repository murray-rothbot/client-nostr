import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

const baseUrl = process.env.SERVICE_MURRAY_SERVICE;

export const MarketCap = {
  cron: "0 45 10,19 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${baseUrl}/market/capitalization`);
      const fields = result.data.data?.fields;

      if (fields) {
        const messageArr = [];

        messageArr.push(`💰 Bitcoin Market Cap`);
        messageArr.push(``);
        messageArr.push(`🇺🇸 Price: ${fields.btcusd.value.price.value}`);
        messageArr.push(`⚡ Sats/USD: ${fields.btcusd.value.satsPerFiat.value}`);
        messageArr.push(`💰 Market Cap: ${fields.btcusd.value.marketCap.value}`);
        messageArr.push(``);
        messageArr.push(`🇧🇷 Price: ${fields.btcbrl.value.price.value}`);
        messageArr.push(`⚡ Sats/BRL: ${fields.btcbrl.value.satsPerFiat.value}`);
        messageArr.push(`💰 Market Cap: ${fields.btcbrl.value.marketCap.value}`);
        messageArr.push(``);
        messageArr.push(`#Bitcoin #MarketCap #price`);

        const message = messageArr.join("\n");

        await Utils.sendEvent({ relay, sk, content: message, tags: [["Bitcoin", "MarketCap", "price"]] });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
