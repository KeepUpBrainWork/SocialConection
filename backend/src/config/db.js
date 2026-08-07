const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Помилка підключення до бази даних Neon:", err.stack);
  } else {
    console.log("⚡ Хмарна база даних PostgreSQL успішно підключена!");
  }
});

module.exports = pool;
