const pool = require("./config.db");

async function seedData() {
  const client = await pool.connect();

  try {
    const resUsers = await client.query("SELECT COUNT(*) FROM users");
    if (parseInt(resUsers.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO users (phone_number, display_name, color) VALUES
        ('+12345678901', 'Alice', 'red'),
        ('+12345678902', 'Bob', 'blue'),
        ('+12345678903', 'Charlie', 'green'),
        ('+12345678904', 'Diana', 'purple'),
        ('+12345678905', 'Eve', 'orange');
      `);
      console.log("Seeded users");
    } else {
      console.log("Users already seeded");
    }

    const resChats = await client.query("SELECT COUNT(*) FROM chats");
    if (parseInt(resChats.rows[0].count, 10) === 0) {
      await client.query(`
        INSERT INTO chats (group_name, is_group) VALUES
        ('Friends Group', true),
        (NULL, false);
      `);
      console.log("Seeded chats");
    } else {
      console.log("Chats already seeded");
    }

    const users = (await client.query("SELECT id FROM users ORDER BY id")).rows;
    const chats = (
      await client.query("SELECT id, is_group FROM chats ORDER BY id")
    ).rows;

    const resParticipants = await client.query(
      "SELECT COUNT(*) FROM chat_participants"
    );
    if (parseInt(resParticipants.rows[0].count, 10) === 0) {
      const groupChatId = chats.find((c) => c.is_group).id;
      for (const user of users) {
        await client.query(
          `INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2)`,
          [groupChatId, user.id]
        );
      }
      const directChatId = chats.find((c) => !c.is_group).id;
      await client.query(
        `INSERT INTO chat_participants (chat_id, user_id) VALUES ($1, $2), ($1, $3)`,
        [directChatId, users[0].id, users[1].id]
      );
      console.log("Seeded chat participants");
    } else {
      console.log("Chat participants already seeded");
    }

    const resMessages = await client.query("SELECT COUNT(*) FROM messages");
    if (parseInt(resMessages.rows[0].count, 10) === 0) {
      const groupChatId = chats.find((c) => c.is_group).id;
      const directChatId = chats.find((c) => !c.is_group).id;

      await client.query(`
        INSERT INTO messages (chat_id, sender_id, content) VALUES
        (${groupChatId}, ${users[0].id}, 'Hey everyone!'),
        (${groupChatId}, ${users[1].id}, 'Hi Alice! How are you?'),
        (${directChatId}, ${users[0].id}, 'Hey Bob, ready for the meeting?'),
        (${directChatId}, ${users[1].id}, 'Yes, almost. Give me 5 minutes.');
      `);
      console.log("Seeded messages");
    } else {
      console.log("Messages already seeded");
    }
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    client.release();
  }
}

module.exports = seedData;
