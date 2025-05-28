import { useState, useEffect } from "react";

const STORAGE_KEY = "messagesData";

export function useMessages(id, limit = 20, since = null, isOnline) {
  const [messages, setMessages] = useState(() => {
    if (!isOnline) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setMessages([]);
      return;
    }

    let intervalId;

    async function fetchMessages() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit);
        if (since) params.append("since", since);

        const res = await fetch(
          `http://localhost:4000/api/groups/${id}/chats?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch messages");

        const data = await res.json();
        setMessages(data);

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
          // Ignore localStorage errors
        }
      } catch (error) {
        console.error(error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    if (isOnline) {
      fetchMessages();
      intervalId = setInterval(fetchMessages, 5000);
    } else {
      // Offline: load messages from localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setMessages(saved ? JSON.parse(saved) : []);
      } catch {
        setMessages([]);
      }
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, limit, since, isOnline]);

  const handleAddMessage = (msg) => {
    setMessages((prev) => [...prev, msg]); // You can sort/dedupe here if needed
  };

  return { messages, loading, handleAddMessage };
}
