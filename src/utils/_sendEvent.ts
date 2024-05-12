import "dotenv/config";
import "websocket-polyfill";

import * as NostrTools from "nostr-tools";

type SendEventProps = {
  sk: Uint8Array;
  relay: NostrTools.Relay;
  content?: string;
  tags?: string[][];
  kind?: number;
};

const CONSOLE_MODE = process.env.CONSOLE_MODE;

export const sendEvent = async ({ sk, relay, content = "", tags = [], kind = 1 }: SendEventProps): Promise<void> => {
  const event = NostrTools.finalizeEvent(
    {
      kind,
      created_at: Math.floor(Date.now() / 1000),
      tags,
      content,
    },
    sk
  );

  const verified = NostrTools.verifyEvent(event);

  if (!verified) {
    throw new Error("Failed to verify event");
  }

  const signedEvent = NostrTools.finalizeEvent(event, sk);

  if (CONSOLE_MODE === "true") return;

  await relay.publish(signedEvent);
};
