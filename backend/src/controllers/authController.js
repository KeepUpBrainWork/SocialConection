const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, name, age, bio } = req.body;

    if (!email || !password || !name || !age) {
      return res
        .status(400)
        .json({ message: "Усі поля, окрім біографії, є обов'язаковими!" });
    }

    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Користувач з таким Email вже зареєстрований ❌" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const queryText =
      "INSERT INTO users (email, password, name, age, bio) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, age, bio;";

    const values = [email, hashedPassword, name, Number(age), bio || ""];
    const result = await db.query(queryText, values);

    res.status(201).json({
      message: "Реєстрація пройшла успішно! 🎉",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера при реєстрації" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Будь ласка, введіть Email та пароль!" });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Невірний Email або пароль ❌" });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Невірний Email або пароль ❌" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(200).json({
      message: "Вхід виконано успішно! 🔓",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера при спробі входу" });
  }
};

module.exports = {
  register,
  login,
};
