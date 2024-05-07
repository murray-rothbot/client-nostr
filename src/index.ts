import { Start } from "./start";

const init = async () => {
  try {
    console.log(`Starting Murray Rothbot on Nostr`);
    console.log(`PORT: ${process.env.PORT}\n`);

    const { relay, sk } = await Start.Nostr();

    await Start.Schedules({ relay, sk });
  } catch (error) {
    console.log(error);
  }
};

init();
