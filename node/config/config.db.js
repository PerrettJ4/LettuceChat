const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:yourpassword@localhost:5432/your_database",
});

module.exports = pool;
