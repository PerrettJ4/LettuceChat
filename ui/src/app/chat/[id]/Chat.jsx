"use client";

import { useUser } from "@/app/context/UserContext";
import { useSendMessage } from "@/app/hooks/useSendMessages";
import { useMessages } from "@/app/hooks/useMessages";
import { useState } from "react";
import styles from "@/app/styles/chat.module.css";
import { FaTrash } from "react-icons/fa";
import Header from "../../components/Header";

export default function Chat({ id }) {
  console.log("Client component received id:", id); // Debug: should log correct id
  const { user } = useUser();

  const { messages, loading, handleAddMessage } = useMessages(id);
  const { sendMessage, sending } = useSendMessage({ handleAddMessage });

  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;
    console.log({
      groupId: id,
      userId: user?.id,
      content: newMessage,
    });
    const success = await sendMessage({
      groupId: id,
      userId: user?.id,
      content: newMessage,
    });

    if (success) {
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <Header
        title={`Chat for Group ${id}`}
        onRightIcon={() => console.log("toast")}
        RightIcon={FaTrash}
      ></Header>
      {loading && <p style={{ marginTop: "20px" }}>Loading messages...</p>}
      {!loading && !messages?.length && (
        <p style={{ marginTop: "20px" }}>Spruce it up, send a message :D</p>
      )}
      <ul
        style={{
          flexGrow: 1,
          overflowY: "auto",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {messages.map((msg) => {
          const isMine = user?.id === msg.sender_id;
          return (
            <li
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMine ? "flex-end" : "flex-start",
                marginTop: "12px",
                gap: "4px",
              }}
            >
              <div
                style={{
                  backgroundColor: isMine ? "green" : "grey",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                }}
              >
                <strong>{msg.sender_name}</strong>
                <p style={{ margin: "4px 0" }}>{msg.content}</p>
                <small style={{ fontSize: "10px", color: "#666" }}>
                  {msg.timestamp}
                </small>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.container}>
        <textarea
          className={styles.textarea}
          rows={1}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSubmit}
          disabled={sending}
          className={styles.button}
        >
          Send
        </button>
      </div>
    </div>
  );
}
