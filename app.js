require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const userRouter = require("./routes/user.route");
const jobRouter = require("./routes/job.route");
const authenticatedMiddleware = require("./middlewares/authenticated-middleware");

const corsOptions = {
  origin: "*",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get("/", authenticatedMiddleware, (req, res) => {
  res.send("Server is running");
});

app.get("/users/me", authenticatedMiddleware, (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User found",
      data: req.user,
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.use("/users", userRouter);
app.use("/jobs", jobRouter);

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
