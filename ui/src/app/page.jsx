"use client";
import Image from "next/image";
import styles from "./page.module.css";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

import users from "./data/users";
import { FaUserCircle } from "react-icons/fa";

export default function Home() {
  const { user, setUser } = useUser();

  const handleSelect = (user) => {
    setUser(user);
  };

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  return (
    <div>
      <h1>Select a user</h1>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() =>
              handleSelect({ id: user.id, displayName: user.displayName })
            }
            style={{
              backgroundColor: user.color,
              color: "white",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "none",
              width: "150px",
              height: "150px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <FaUserCircle size={40} style={{ marginBottom: "0.5rem" }} />
            {user.displayName}
          </button>
        ))}
      </div>
    </div>
  );
}
