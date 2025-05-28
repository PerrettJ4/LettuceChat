const express = require("express");
const app = express();

const groupsRouter = require("./routes/groups");
const chatsRouter = require("./routes/chats");

app.use(express.json());

app.use("/api/groups", groupsRouter); // Handles /api/groups and /api/groups/:id/chats
app.use("/api/groups", chatsRouter); // Handles /api/groups/:groupId/chats for GET and POST (group messages)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
