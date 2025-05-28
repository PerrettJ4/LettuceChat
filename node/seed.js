const createTables = require("./config/createTables");
const seedData = require("./config/seedData");

(async () => {
  try {
    await createTables();
    await seedData();
    console.log("DB setup and seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
