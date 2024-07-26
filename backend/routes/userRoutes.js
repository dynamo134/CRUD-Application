const express = require("express");
const {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  sendMail,
} = require("../controllers/userController");
const router = express.Router();

router.route("/").get(getUsers).post(addUser);
router.route("/:id").delete(deleteUser).put(updateUser);
// Route to handle sending emails
router.route("/send-mail").post(sendMail);

module.exports = router;
