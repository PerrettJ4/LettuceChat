import { useState } from "react";

export function useCreateGroup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createGroup({ groupName, participantIds }) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:4000/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_name: groupName,
          participant_ids: participantIds,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create group");
      }

      const data = await res.json();
      setLoading(false);
      return data; // optionally return created group info
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { createGroup, loading, error };
}
