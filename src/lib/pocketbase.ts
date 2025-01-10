import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

export const pb = new PocketBase("https://api.vxlverse.com");

export function useClient() {
  const [client] = useState(() => new PocketBase("https://api.vxlverse.com"));
  useEffect(() => {
    // You can add auth state management here if needed
  }, [client]);

  return client;
}
