import { useState, useEffect } from "react";

export function useGroups(userId) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setGroups([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:4000/api/groups?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching groups: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGroups(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  return { groups, loading, error };
}
