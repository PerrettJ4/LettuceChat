import { useState, useEffect } from "react";

export function useMessages(id, limit = 20, since = null) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchMessages() {
      setLoading(true);
      try {
        // Build query params dynamically
        // const params = new URLSearchParams({ groupId: id });
        // if (limit) params.append("limit", limit);
        // if (since) params.append("since", since);

        const res = await fetch(`http://localhost:4000/api/groups/${id}/chats`);
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error(error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [id, limit, since]);

  return { messages, loading };
}
