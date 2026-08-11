const db = require("../config/db");

const swipe = async (req, res) => {
  try {
    const likerId = req.user.id;
    const { likedId, status } = req.body;

    if (!likedId || !status) {
      return res
        .status(400)
        .json({ message: "Необхідно вказати likedId та status!" });
    }

    if (likerId === likedId) {
      return res
        .status(400)
        .json({
          message: "Ви не можете лайкнути чи дізлайкнути самого себе! 😂",
        });
    }

    const insertQuery = `
            INSERT INTO matches (liker_id, liked_id, status)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

    await db.query(insertQuery, [likerId, Number(likedId), status]);

    if (status === "dislike") {
      return res
        .status(200)
        .json({ isMatch: false, message: "Дізлайк успішно збережено." });
    }

    const checkMatchQuery = `
            SELECT * FROM matches
            WHERE liker_id = $1 AND liked_id = $2 AND status = 'like';
        `;
    const matchResult = await db.query(checkMatchQuery, [
      Number(likedId),
      likerId,
    ]);

    if (matchResult.rows.length > 0) {
      return res
        .status(200)
        .json({
          isMatch: true,
          message:
            "У вас новий матч! Обидва користувачі сподобалися один одному! ❤️🎉",
          partnerId: Number(likedId),
        });
    }

    res
      .status(200)
      .json({
        isMatch: false,
        message: "Лайк успішно збережено. Чекаємо на взаємність! 👍",
      });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ message: "Ви вже оцінювали цей профіль! ❌" });
    }
    res.status(500).json({ message: "Помилка сервера при обробці свайпу" });
  }
};

module.exports = { swipe };
