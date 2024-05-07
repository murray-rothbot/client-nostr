import "dotenv/config";

import axios from "axios";
import { Relay } from "nostr-tools";
import { Utils } from "../utils";

type Props = {
  relay: Relay;
  sk: Uint8Array;
};

const baseUrl = process.env.SERVICE_MURRAY_SERVICE;

export const Prices = {
  cron: "0 40 1,3,5,7,9,11,13,15,17,19,21,23 * * *",
  action: async ({ relay, sk }: Props): Promise<void> => {
    try {
      const result = await axios.get(`${baseUrl}/prices`);
      const fields = result.data.data?.fields;
      const title = result.data.data?.title;

      if (fields && title) {
        const messageArr = [];

        messageArr.push(title);
        messageArr.push(``);

        Object.keys(fields).forEach((key) => {
          const price = fields[key];
          const values = price.value.split("\n");

          messageArr.push(price.description);
          messageArr.push(values[0]);
          messageArr.push(values[1].trim());
          messageArr.push(``);
        });

        messageArr.push(`#Bitcoin`);

        const message = messageArr.join("\n");

        await Utils.sendEvent({ relay, sk, content: message, tags: [["Bitcoin", "Price"]] });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
