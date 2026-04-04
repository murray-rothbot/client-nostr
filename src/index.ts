import { CronJob } from "cron";
import { Relay } from "nostr-tools";
import { Start } from "./start";

let activeRelay: Relay | null = null;
let activeCrons: CronJob<null, null>[] = [];
let isRestarting = false;

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection caught:", reason);
  restart();
});

const cleanup = () => {
  activeCrons.forEach((job) => job.stop());
  activeCrons = [];

  if (activeRelay) {
    try {
      activeRelay.close();
    } catch (_) {}
    activeRelay = null;
  }
};

const init = async () => {
  try {
    console.log(`Starting Murray Rothbot on Nostr`);
    console.log(`PORT: ${process.env.PORT}\n`);

    cleanup();

    const { relay, sk } = await Start.Nostr();
    activeRelay = relay;

    activeCrons = await Start.Schedules({ relay, sk });

    relay.onclose = () => {
      console.log(`Relay connection closed. Restarting...`);
      restart();
    };
  } catch (error) {
    console.error("Init error:", error);
    restart();
  }
};

const restart = () => {
  if (isRestarting) return;
  isRestarting = true;

  console.log(`Murray Rothbot is restarting in 60s...`);
  cleanup();

  setTimeout(() => {
    isRestarting = false;
    init();
  }, 1000 * 60);
};

init();
