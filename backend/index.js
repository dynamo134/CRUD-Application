const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
// app.get("/", (req, res) => {
//   res.json({ message: "Server is running!" });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
