const pool = require("./config/config.db");

async function dropTables() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Drop tables in order or use CASCADE to handle dependencies
    await client.query(`DROP TABLE IF EXISTS messages CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS chat_participants CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS chats CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);

    await client.query("COMMIT");
    console.log("Tables dropped successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error dropping tables:", err);
  } finally {
    client.release();
  }
}

dropTables();
