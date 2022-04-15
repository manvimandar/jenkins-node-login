const express = require("express");
const app = express();

// Read dotenv files
require("dotenv").config();

const userRouter = require("./routes/users");

// Parse json data
app.use(express.json());

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "Node-Mongodb-Login API ⚡" });
});

// mongoose
const mongoose = require("mongoose");

// mongodb connect
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// PORT
const PORT = 8080;

// Listen to PORT
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
