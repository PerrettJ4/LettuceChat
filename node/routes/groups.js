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

module.exports = router;
