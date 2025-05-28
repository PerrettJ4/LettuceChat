import { useState } from "react";

export function useSendMessage({ handleAddMessage } = {}) {
  const [sending, setSending] = useState(false);

  const sendMessage = async ({ groupId, userId, content }) => {
    if (!groupId || !userId || !content.trim()) {
      console.warn("Missing groupId, userId, or content");
      return false;
    }

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
            content: content.trim(),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const newMsg = await res.json();

      if (typeof handleAddMessage === "function") {
        handleAddMessage(newMsg);
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
