const User = require("../models/user.model");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords do not match" });
    }

    const existingUser = await User.findOne({ email }).exec();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: req.body.role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("register user error", error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email }).exec();

    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const passwordMatched = await bcypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      data: existingUser,
    });
  } catch (error) {
    console.log("login user error", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jobsprint-auth-token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("logout user error", error);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
