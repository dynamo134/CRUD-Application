const User = require("../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();


exports.getUsers = async (req, res) => {
  const users = await User.find();
  console.log(req.body);
  res.json(users);
};

exports.addUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

exports.sendMail = async (req, res) => {
  // res.json({message: "sending mail"})
  const { userIds, to } = req.body;
  // res.json({
  //   userIds,to
  // })

  if (!userIds || !to) {
    return res
      .status(400)
      .json({ error: "Missing userIds or recipient email" });
  }

  try {
    // Fetch users from the database based on userIds
    const users = await User.find({ _id: { $in: userIds } });

    // Create a transport object using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or any other service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const userContent = users
      .map(
        (user) => `
      Name: ${user.name}
      Email: ${user.email}
      Phone: ${user.phone}
      Hobbies: ${user.hobbies}
    `
      )
      .join("\n\n");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "User Information",
      text: `Here is the information of the selected users:\n\n${userContent}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log("Email user:", process.env.EMAIL_USER);
    console.log("Email user:", process.env.EMAIL_PASS);
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
