const express = require("express");
require("dotenv").config();

const profileRoutes = require("./routes/profileRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", profileRoutes);

app.get("/", (req, res) => {
  res.send("Сервер сайту знайомств успішно працює");
});

app.listen(PORT, () => {
  console.log(`Сервер запущенно на порту ${PORT}`);
});
