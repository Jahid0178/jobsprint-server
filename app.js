require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

const userRouter = require("./routes/user.route");
const authenticatedMiddleware = require("./middlewares/authenticated-middleware");

app.use(cookieParser());
app.use(express.json());

app.get("/", authenticatedMiddleware, (req, res) => {
  res.send("Server is running");
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("db_connection_success");
  } catch (error) {
    console.log("db_connection_error", error);
  }
};

connectDB();
