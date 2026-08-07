const express = require("express");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      age INTEGER NOT NULL,
      bio TEXT DEFAULT ''
    );
  `;
  try {
    await db.query(queryText);
    console.log("📋 Таблиця 'users' перевірена/створена успішно.");
  } catch (err) {
    console.error("❌ Помилка створення таблиці:", err);
  }
};

createTables();

app.use("/api", profileRoutes);

app.get("/", (req, res) => {
  res.send("Сервер сайту знайомств успішно працює! 🚀");
});

app.listen(PORT, () => {
  console.log(`Сервер запущенно на порту ${PORT}`);
});
