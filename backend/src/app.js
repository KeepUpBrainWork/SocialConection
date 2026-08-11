const express = require("express");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");
const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");

const matchRoutes = require("./routes/matchRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const createTables = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      age INTEGER NOT NULL,
      bio TEXT DEFAULT ''
    );
  `;

  const createMatchesTable = `
    CREATE TABLE IF NOT EXISTS matches (
      id SERIAL PRIMARY KEY,
      liker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      liked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL, --'like' або 'dislike'
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (liker_id, liked_id) -- Захист під капотом: користувач не зможе лайкнути одну й ту саму анкету двічі
    );
  `;
  try {
    await db.query(createUsersTable);
    await db.query(createMatchesTable);
    console.log("📋 Усі таблиці бази даних успішно перевірені/створені.");
  } catch (err) {
    console.error("❌ Помилка створення таблиць:", err);
  }
};

createTables();

app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", matchRoutes);

app.get("/", (req, res) => {
  res.send("Сервер сайту знайомств успішно працює! 🚀");
});

app.listen(PORT, () => {
  console.log(`Сервер запущенно на порту ${PORT}`);
});
