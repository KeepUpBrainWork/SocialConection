const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/swipe", protect, matchController.swipe);

module.exports = router;
