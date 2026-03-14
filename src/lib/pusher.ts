import PusherServer from "pusher";
import PusherClient from "pusher-js";

// Lazy-initialized Pusher Server
let pusherServerInstance: PusherServer | null = null;

export const getPusherServer = () => {
  if (!pusherServerInstance) {
    pusherServerInstance = new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: true,
    });
  }
  return pusherServerInstance;
};

// Lazy-initialized Pusher Client
let pusherClientInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (!pusherClientInstance) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) {
      throw new Error("Pusher client keys not defined");
    }
    pusherClientInstance = new PusherClient(key, {
      cluster: cluster,
      forceTLS: true,
      authEndpoint: "/api/chat/pusher-auth",
    });
  }
  return pusherClientInstance;
};
