"use client";

import { useUser } from "@/app/context/UserContext";
import { useOnlineStatus } from "@/app/context/OnlineStatusContext";
import { useSendMessage } from "@/app/hooks/useSendMessages";
import { useMessages } from "@/app/hooks/useMessages";
import { useCallback, useState } from "react";
import styles from "@/app/styles/chat.module.css";
import { FaTrash } from "react-icons/fa";
import Header from "../../components/Header";
import { useDeleteGroup } from "../../hooks/useDeleteGroup";
import { useRouter } from "next/navigation";

export default function Chat({ id }) {
  const { user } = useUser();
  const router = useRouter();
  const { isOnline } = useOnlineStatus();

  const { messages, loading, handleAddMessage } = useMessages(
    id,
    null,
    null,
    isOnline
  );
  const { sendMessage, sending } = useSendMessage(
    { handleAddMessage },
    isOnline
  );
  const { deleteGroup } = useDeleteGroup();

  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;

    const success = await sendMessage({
      groupId: id,
      userId: user.id,
      userDisplayName: user.displayName,
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

  const handleDeleteGroup = useCallback(async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this group?"
    );
    if (!confirmed) return;

    const success = await deleteGroup(id);
    if (success) {
      alert("Group deleted!");
      router.back();
    }
  }, [id]);

  return (
    <div>
      <Header
        title={`Chat for Group ${id}`}
        onRightIcon={handleDeleteGroup}
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
