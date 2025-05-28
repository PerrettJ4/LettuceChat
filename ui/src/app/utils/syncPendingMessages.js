const LOCAL_STORAGE_PENDING_KEY = "pendingMessages";

export async function syncPendingMessages() {
  const pendingJSON = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
  console.log("syncing messages", pendingJSON);
  if (!pendingJSON) return;

  let pendingMessages;
  try {
    pendingMessages = JSON.parse(pendingJSON);
    if (!Array.isArray(pendingMessages) || pendingMessages.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_PENDING_KEY);
      return;
    }
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_PENDING_KEY);
    return;
  }

  for (const msg of pendingMessages) {
    try {
      const res = await fetch(
        `http://localhost:4000/api/groups/${msg.groupId}/chats`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender_id: msg.sender_id,
            content: msg.content,
          }),
        }
      );

      if (!res.ok) {
        console.error(`Failed to post pending message: ${res.status}`);
        // Optionally: break or continue depending on your desired retry strategy
        continue;
      }
    } catch (err) {
      console.error("Error posting pending message:", err);
      continue;
    }
  }

  // Clear pending messages after all attempts
  localStorage.removeItem(LOCAL_STORAGE_PENDING_KEY);
}
