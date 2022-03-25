const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getAllUsers,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser);
router.get("/", protect, getAllUsers);
router.post("/login", authUser);

module.exports = router;
