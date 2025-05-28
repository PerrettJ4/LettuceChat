const pool = require("./config.db");

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone_number TEXT UNIQUE,
        display_name TEXT,
        color TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        group_name TEXT,
        is_group BOOLEAN DEFAULT true
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_participants (
        chat_id INT REFERENCES chats(id),
        user_id INT REFERENCES users(id),
        last_read_at TIMESTAMP DEFAULT NULL,
        PRIMARY KEY (chat_id, user_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INT REFERENCES chats(id),
        sender_id INT REFERENCES users(id),
        content TEXT,
        timestamp TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query("COMMIT");
    console.log("Tables created or verified");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = createTables;
