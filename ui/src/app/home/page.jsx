"use client";

import { useGroups } from "@/app/hooks/useGroups";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const userId = user?.id;

  const { groups, loading, error } = useGroups(userId);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!groups.length) return <p>No groups found</p>;

  return (
    <div>
      <h1>LettuceChat</h1>
      <ul
        style={{
          flexDirection: "column",
          display: "flex",
          gap: "6px",
          marginTop: "20px",
        }}
      >
        {groups.map((group) => (
          <Link key={group.id} href={`/chat/${group.id}`}>
            <p>{group.group_name}</p>
          </Link>
        ))}
      </ul>
    </div>
  );
}
