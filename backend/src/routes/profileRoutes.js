const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/profiles", protect, profileController.getAllProfiles);

router.get("/profiles/:id", protect, profileController.getProfileById);

router.post("/profiles", protect, profileController.createProfile);

router.delete("/profiles/:id", protect, profileController.deleteProfile);

router.patch("/profiles/:id", protect, profileController.updateProfile);

module.exports = router;
