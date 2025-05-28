"use client";

import { useMessages } from "@/app/hooks/useMessages";

export default function Chat({ id }) {
  console.log("Client component received id:", id); // Debug: should log correct id

  const { messages, loading } = useMessages(id);

  if (loading) return <p>Loading messages...</p>;
  if (!messages?.length) return <p>No messages found for group {id}</p>;

  return (
    <div>
      <h1>Chat for Group {id}</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
