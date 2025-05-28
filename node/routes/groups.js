const express = require("express");
const router = express.Router();
const pool = require("../config/config.db");

// GET /api/groups?userId=1234
router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId)
    return res.status(400).json({ error: "userId query param required" });

  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.group_name, c.is_group
       FROM chats c
       JOIN chat_participants cp ON cp.chat_id = c.id
       WHERE cp.user_id = $1 AND c.is_group = true`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/groups
router.post("/", async (req, res) => {
  const { group_name, participant_ids } = req.body;
  if (
    !group_name ||
    !Array.isArray(participant_ids) ||
    participant_ids.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "group_name and participant_ids are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertGroup = await client.query(
      `INSERT INTO chats (group_name, is_group)
       VALUES ($1, true)
       RETURNING id`,
      [group_name]
    );

    const groupId = insertGroup.rows[0].id;

    for (const userId of participant_ids) {
      await client.query(
        `INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)`,
        [groupId, userId]
      );
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({ groupId, group_name, participants: participant_ids });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  const groupId = req.params.id;

  if (!groupId) {
    return res.status(400).json({ error: "Group ID is required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete messages related to this chat/group first
    await client.query(`DELETE FROM messages WHERE chat_id = $1`, [groupId]);

    // Delete chat participants
    await client.query(`DELETE FROM chat_participants WHERE chat_id = $1`, [
      groupId,
    ]);

    // Delete the group chat
    const deleteResult = await client.query(
      `DELETE FROM chats WHERE id = $1 AND is_group = true`,
      [groupId]
    );

    await client.query("COMMIT");

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    client.release();
  }
});

module.exports = router;
