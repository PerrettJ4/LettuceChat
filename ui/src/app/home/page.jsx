"use client";

import { useGroups } from "@/app/hooks/useGroups";
import { useUser } from "@/app/context/UserContext";

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
          <a key={group.id} href={`/chat/${group.id}`}>
            <a>{group.group_name}</a>
          </a>
        ))}
      </ul>
    </div>
  );
}
