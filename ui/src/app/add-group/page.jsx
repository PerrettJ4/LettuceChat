"use client";

import React, { useState } from "react";
import users from "../data/users";
import { FaArrowRight } from "react-icons/fa";
import { useCreateGroup } from "../hooks/useCreateGroup";
import Header from "../components/Header";

export default function GroupCreator() {
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const { createGroup, loading, error } = useCreateGroup();

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (selectedIds.length === 0) {
      alert("Please select at least one user");
      return;
    }

    const result = await createGroup({
      groupName,
      participantIds: selectedIds,
    });

    if (result) {
      alert(`Group "${groupName}" created!`);
      // Reset UI or navigate as needed
    }
  }

  return (
    <>
      <main
        style={{
          maxWidth: 400,
          margin: "2rem auto",
          fontFamily: "sans-serif",
          paddingBottom: "60px", // space for fixed button
        }}
      >
        <Header title="Create Group" />

        <input
          type="text"
          placeholder="Group name..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "1rem",
            marginBottom: "1rem",
            boxSizing: "border-box",
          }}
        />

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {users.length === 0 && (
            <li style={{ padding: "8px", color: "#888" }}>No users found</li>
          )}
          {users.map((user) => {
            const isSelected = selectedIds.includes(user.id);

            return (
              <li
                key={user.id}
                onClick={() => toggleSelect(user.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  marginBottom: "4px",
                  borderRadius: 4,
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#0070f3" : "#f0f0f0",
                  color: isSelected ? "white" : "black",
                  userSelect: "none",
                  transition: "background-color 0.2s",
                }}
              >
                <div
                  style={{
                    backgroundColor: user.color,
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  {user.displayName.charAt(0)}
                </div>

                <span>{user.displayName}</span>
              </li>
            );
          })}
        </ul>
        <button
          onClick={handleSubmit}
          aria-label="Create Group"
          style={{
            position: "relative",
            bottom: 20,
            right: 0,
            top: "50px",
            backgroundColor: "#0070f3",
            border: "none",
            borderRadius: "50%",
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 24,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "background-color 0.2s",
            marginLeft: "auto",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#005bb5")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0070f3")
          }
        >
          <FaArrowRight />
        </button>
      </main>
    </>
  );
}
