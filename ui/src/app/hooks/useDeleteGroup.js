export function useDeleteGroup() {
  async function deleteGroup(groupId) {
    if (!groupId) {
      alert("Group ID is required");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete group");
        return false;
      }

      return true;
    } catch (err) {
      alert(err.message);
      return false;
    }
  }

  return { deleteGroup };
}
