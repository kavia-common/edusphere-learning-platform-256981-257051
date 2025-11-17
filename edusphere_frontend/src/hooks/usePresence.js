import React from "react";
import { getSupabase } from "../lib/supabaseClient";

// PUBLIC_INTERFACE
export function usePresence(topic, key) {
  /** Tracks presence within a Supabase channel */
  const [members, setMembers] = React.useState([]);

  React.useEffect(() => {
    const client = getSupabase();
    const channel = client.channel(topic, { config: { presence: { key } } });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users = Object.values(state).flat().map((s) => s);
      setMembers(users);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ key, online_at: new Date().toISOString() });
      }
    });

    return () => {
      client.removeChannel(channel);
    };
  }, [topic, key]);

  return { members };
}
