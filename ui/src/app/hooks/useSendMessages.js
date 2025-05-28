import { useState } from "react";

const LOCAL_STORAGE_PENDING_KEY = "pendingMessages";

export function useSendMessage({ handleAddMessage } = {}, isOnline) {
  const [sending, setSending] = useState(false);

  const sendMessage = async ({ groupId, userId, userDisplayName, content }) => {
    if (!groupId || !userId || !content.trim()) {
      console.warn("Missing groupId, userId, or content");
      return false;
    }

    const trimmedContent = content.trim();

    if (!isOnline) {
      // Offline: save message to localStorage as pending
      try {
        const pending =
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_KEY)) || [];

        // Build the message object (mimicking server response)
        const newMsg = {
          id: `local-${Date.now()}`, // temp ID
          groupId,
          sender_id: userId,
          sender_name: userDisplayName,
          content: trimmedContent,
          timestamp: new Date().toISOString(),
          pending: true, // flag for local-only message
        };

        pending.push(newMsg);
        localStorage.setItem(
          LOCAL_STORAGE_PENDING_KEY,
          JSON.stringify(pending)
        );

        if (typeof handleAddMessage === "function") {
          handleAddMessage(newMsg);
        }

        return true;
      } catch (err) {
        console.error("Failed to save message locally", err);
        return false;
      }
    }

    // Online: send to server
    setSending(true);

    try {
      const res = await fetch(
        `http://localhost:4000/api/groups/${groupId}/chats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: userId,
            content: trimmedContent,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      if (typeof handleAddMessage === "function") {
        handleAddMessage({
          id: `local-${Date.now()}`, // temp ID
          groupId,
          sender_id: userId,
          sender_name: userDisplayName,
          content: trimmedContent,
          timestamp: new Date().toISOString(),
        });
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setSending(false);
    }
  };

  return { sendMessage, sending };
}
