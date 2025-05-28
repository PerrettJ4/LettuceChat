"use client";

import { useGroups } from "@/app/hooks/useGroups";
import { useUser } from "@/app/context/UserContext";

import Link from "next/link";

import { FaPlus } from "react-icons/fa";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/app/context/OnlineStatusContext";

export default function Home() {
  const { user, setUser } = useUser();
  const { isOnline } = useOnlineStatus();
  const userId = user?.id;

  const router = useRouter();
  const { groups, loading, error } = useGroups(userId, isOnline);

  if (loading) return <p>Loading groups...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!groups.length) return <p>No groups found</p>;

  const onBack = async () => {
    await setUser(null);
    router.push("/");
  };
  const onRightIcon = async () => {
    router.push("/add-group");
  };

  return (
    <div>
      <Header
        title={`LettuceChat`}
        onBack={onBack}
        onRightIcon={onRightIcon}
        RightIcon={FaPlus}
      ></Header>

      <ul
        style={{
          flexDirection: "column",
          display: "flex",
          gap: "6px",
          marginTop: "20px",
        }}
      >
        {groups.map((group) => (
          <Link
            key={group.id}
            href={`/chat/${group.id}?groupName=${encodeURIComponent(
              group.group_name
            )}`}
          >
            <p>{group.group_name}</p>
          </Link>
        ))}
      </ul>
    </div>
  );
}
