import { useState, useEffect } from "react";

const STORAGE_KEY = "groupsData";

export function useGroups(userId, isOnline) {
  const [groups, setGroups] = useState(() => {
    // Initialize state from localStorage if offline or no fetch yet
    if (!isOnline) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setGroups([]);
      return;
    }

    let intervalId;

    const fetchGroups = () => {
      setLoading(true);
      setError(null);

      fetch(`http://localhost:4000/api/groups?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Error fetching groups: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setGroups(data);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {
            // Ignore localStorage errors
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    if (isOnline) {
      fetchGroups(); // initial fetch immediately
      intervalId = setInterval(fetchGroups, 5000);
    } else {
      // Offline: load from localStorage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setGroups(saved ? JSON.parse(saved) : []);
      } catch {
        setGroups([]);
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [userId, isOnline]);

  return { groups, loading, error };
}
