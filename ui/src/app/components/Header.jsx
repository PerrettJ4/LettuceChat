"use client";

import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Header({ title, onBack, onRightIcon, RightIcon }) {
  const router = useRouter();

  const handleBack = onBack || (() => router.back());

  return (
    <header style={styles.header}>
      <button
        onClick={handleBack}
        aria-label="Go back"
        style={styles.iconButton}
        type="button"
      >
        <FaArrowLeft size={24} />
      </button>

      {/* Title centered */}
      <h1 style={styles.title}>{title || ""}</h1>

      {RightIcon && onRightIcon ? (
        <button
          onClick={onRightIcon}
          aria-label="Custom action"
          style={styles.iconButton}
          type="button"
        >
          <RightIcon size={24} />
        </button>
      ) : (
        // If no right icon, keep spacing so title is centered
        <div style={{ width: 32, height: 32 }} />
      )}
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    borderBottom: "1px solid #ccc",
    position: "relative",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    flexShrink: 0,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: "600",
    userSelect: "none",
  },
};
