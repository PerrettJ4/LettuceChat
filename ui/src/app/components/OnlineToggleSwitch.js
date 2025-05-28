import React, { useContext } from "react";
import { OnlineStatusContext } from "@/app/context/OnlineStatusContext";
import { useUser } from "../context/UserContext";

export function OnlineToggleSwitch() {
  const { isOnline, setIsOnline } = useContext(OnlineStatusContext);
  const { user } = useUser();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        zIndex: 9999,
        color: "white",
        userSelect: "none",
        backgroundColor: isOnline ? "green" : "red",
        opacity: 0.8,
      }}
    >
      <input
        id="online-toggle"
        type="checkbox"
        checked={isOnline}
        onChange={(e) => setIsOnline(e.target.checked)}
        style={{ width: 40, height: 20, cursor: "pointer" }}
      />
      {isOnline ? (
        <label htmlFor="online-toggle" style={{ cursor: "pointer" }}>
          Online {user && `as ${user.displayName}`}
        </label>
      ) : (
        <label htmlFor="online-toggle" style={{ cursor: "pointer" }}>
          Offline {user && `as ${user.displayName}`}
        </label>
      )}
    </div>
  );
}
