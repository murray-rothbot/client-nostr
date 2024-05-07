import "dotenv/config";
import "websocket-polyfill";

import * as NostrTools from "nostr-tools";

const NOSTR_RELAY = `${process.env.NOSTR_RELAY}`;
const NOSTR_NSEC = `${process.env.NOSTR_NSEC}`;

export const Nostr = async (): Promise<{
  relay: NostrTools.Relay;
  sk: Uint8Array;
}> => {
  const { data } = NostrTools.nip19.decode(NOSTR_NSEC);
  const pk = NostrTools.getPublicKey(data as Uint8Array);

  const npub = NostrTools.nip19.npubEncode(pk);
  console.log(`https://primal.net/p/${npub}`);

  const relay = await NostrTools.Relay.connect(NOSTR_RELAY);

  return {
    relay,
    sk: data as Uint8Array,
  };
};
