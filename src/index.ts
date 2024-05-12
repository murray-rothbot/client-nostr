import { Start } from "./start";

const init = async () => {
  try {
    console.log(`Starting Murray Rothbot on Nostr`);
    console.log(`PORT: ${process.env.PORT}\n`);

    const { relay, sk } = await Start.Nostr();

    await Start.Schedules({ relay, sk });

    relay.onclose = () => {
      console.log(`Murray Rothbot is restarting!`);
      restart();
    };
  } catch (error) {
    console.log(error);
    console.log(`Murray Rothbot is restarting!`);
    restart();
  }
};

init();

const restart = () => {
  setTimeout(() => {
    init();
  }, 1000 * 60);
};
