import React, { createContext, useContext, useState, useEffect } from "react";
import { syncPendingMessages } from "@/app/utils/syncPendingMessages"; // import your sync function

export const OnlineStatusContext = createContext({
  isOnline: true,
  setIsOnline: () => {},
});

export function OnlineStatusProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (isOnline) {
      syncPendingMessages();
    }
  }, [isOnline]);

  return (
    <OnlineStatusContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus() {
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error(
      "useOnlineStatus must be used within an OnlineStatusProvider"
    );
  }
  return context;
}
