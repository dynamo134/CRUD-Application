const User = require("../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex = /^(\+\d{1,3})?\d{10}$/; // Matches optional country code + 10 digit phone number


exports.getUsers = async (req, res) => {
  const users = await User.find();
  console.log(req.body);
  res.json(users);
};

exports.addUser = async (req, res) => {
  const { name, phone, email, hobbies } = req.body;

  // Validate input
  if (!name || !phone || !email || !hobbies) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }
  
  //validate the email formate
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  //validate the phone number
  if (!phoneRegex.test(phone)) {
     return res.status(400).json({message:"Invalid phone number."});
   }
  try {
    const user = new User({ name, phone, email, hobbies });
    // Save user to database
    await user.save();
    //console.log(user);
    res.status(201).json(user);
  } catch (error) {
    // Handle errors (e.g., database errors)
    res.status(500).json({ message: "Server error", error });
  }
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