const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
} = require("../controller/messageController");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getAllMessages);

module.exports = router;
