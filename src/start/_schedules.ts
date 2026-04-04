import { CronJob } from "cron";
import { Relay } from "nostr-tools";
import { Messages } from "../messages";
import { Utils } from "../utils";

type Props = { relay: Relay; sk: Uint8Array };

export const Schedules = async ({ relay, sk }: Props): Promise<CronJob[]> => {
  try {
    const jobs: CronJob[] = [];

    for (const key of Object.keys(Messages)) {
      const schedule = Messages[key as keyof typeof Messages];

      if (schedule) {
        const job = await Utils.createCron({
          cron: schedule.cron,
          action: () => schedule.action({ relay, sk }),
        });
        jobs.push(job);
      }
    }

    return jobs;
  } finally {
    console.log("Schedules connected");
  }
};
