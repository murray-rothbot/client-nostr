import { Relay, nip19 } from "nostr-tools";
import { Messages } from "../messages";
import { Utils } from "../utils";

type Props = {
  relay: Relay;
  sk: Uint8Array;
};

export const Schedules = async ({ relay, sk }: Props): Promise<void> => {
  Object.keys(Messages).forEach((key) => {
    const schedule = Messages[key as keyof typeof Messages];

    if (schedule) {
      Utils.createCron({
        cron: schedule.cron,
        action: () => schedule.action({ relay, sk }),
      });
    }
  });
};
