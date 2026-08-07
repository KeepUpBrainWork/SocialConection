const db = require("../config/db");

const getAllProfiles = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Помилка при отриманні профілів із бази даних" });
  }
};

const getProfileById = async (req, res) => {
  try {
    const profileId = Number(req.params.id);
    const result = await db.query("SELECT * FROM users WHERE id = $1", [
      profileId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Профіль не знайдено в базі 😢" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Помилка при отриманні профілю із бази даних" });
  }
};

const createProfile = async (req, res) => {
  try {
    const { name, age, bio } = req.body;

    if (!name || !age) {
      return res
        .status(400)
        .json({ message: "Ім'я та вік є обов'язковими полями" });
    }
    const qeryText =
      "INSERT INTO users (name, age, bio) VALUES ($1, $2, $3) RETURNING *";
    const values = [name, Number(age), bio || ""];
    const result = await db.query(qeryText, values);
    res.status(201).json({
      message: "Профіль успішно збережено в хмарі! 🎉",
      profile: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при створенні профілю" });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profileId = Number(req.params.id);
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [profileId],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Профіль для видалення не знайдено ❌" });
    }
    res.status(200).json({ message: "Профіль успішно видалено з хмари! 🗑️" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при видаленні профілю" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profileId = Number(req.params.id);
    const { name, age, bio } = req.body;
    const checkUser = await db.query("SELECT * FROM users WHERE id = $1", [
      profileId,
    ]);

    if (checkUser.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Профіль для оновлення не знайдено ❌" });
    }
    const curentUser = checkUser.rows[0];
    const updatedName = name || curentUser.name;
    const updatedAge = age ? Number(age) : curentUser.age;
    const updatedBio = bio !== undefined ? bio : curentUser.bio;
    const queryText =
      "UPDATE users SET name = $1, age = $2, bio = $3 WHERE id = $4 RETURNING *";
    const values = [updatedName, updatedAge, updatedBio, profileId];
    const result = await db.query(queryText, values);
    res.status(200).json({
      message: "Профіль в базі успішно оновлено! 🔄",
      profile: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка при оновленні профілю" });
  }
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  deleteProfile,
  updateProfile,
};
