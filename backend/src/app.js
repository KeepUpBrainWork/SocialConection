const express = require("express");
require("dotenv").config();
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const matchRoutes = require("./routes/matchRoutes");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173", // Дозволяємо нашому React-фронтенду
    credentials: true, // Дозволяємо передачу Cookies та сесій
  }),
);
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

  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await db.query(createUsersTable);
    await db.query(createMatchesTable);
    await db.query(createMessagesTable);
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

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(
    `🔌 Новий користувач підключився до мережі чатів. ID сокета: ${socket.id}`,
  );
  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(
      `👤 Користувач ${userId} тепер ОНЛАЙН. ID сокета: ${socket.id}`,
    );
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message } = data;
    try {
      // А. Зберігаємо повідомлення в хмарну базу даних Neon
      const insertQuery = `
                INSERT INTO messages (sender_id, receiver_id, message)
                VALUES ($1, $2, $3) RETURNING *;
            `;
      const result = await db.query(insertQuery, [
        senderId,
        receiverId,
        message,
      ]);
      const savedMessage = result.rows[0];

      // Б. Перевіряємо, чи є отримувач зараз онлайн
      const receiverSocketId = onlineUsers[receiverId];

      if (receiverSocketId) {
        // Якщо людина онлайн, миттєво штовхаємо повідомлення в її персональний тунель
        io.to(receiverSocketId).emit("receiveMessage", savedMessage);
        console.log(
          `📩 Повідомлення миттєво доставлено користувачу ${receiverId} в реальному часі.`,
        );
      }

      // Також відправляємо копію повідомлення назад автору, щоб його фронтенд підтвердив успішну доставку
      socket.emit("messageSentConfirmation", savedMessage);
    } catch (error) {
      console.error("Помилка чату:", error);
    }
  });

  // Коли користувач закриває додаток або вкладку браузера
  socket.on("disconnect", () => {
    // Видаляємо користувача зі списку онлайн
    Object.keys(onlineUsers).forEach((userId) => {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log(`❌ Користувач ${userId} вийшов з мережі (ОФЛАЙН).`);
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущенно на порту ${PORT}`);
});
