const express = require("express");
const router = express.Router();
const pool = require("../config/config.db");

// GET /api/groups/:groupId/chats
router.get("/:groupId/chats", async (req, res) => {
  const { groupId } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT m.id, m.sender_id, u.display_name AS sender_name, m.content, m.timestamp
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = $1
       ORDER BY m.timestamp ASC`,
      [groupId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/groups/:groupId/chats
router.post("/:groupId/chats", async (req, res) => {
  const { groupId } = req.params;
  const { sender_id, content } = req.body;

  if (!sender_id || !content) {
    return res
      .status(400)
      .json({ error: "sender_id and content are required" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO messages (chat_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [groupId, sender_id, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
