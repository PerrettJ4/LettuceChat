const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // for JSON requests

app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
