import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isValidEmail } from "../utils.js";

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: normalizedEmail, password_hash });

    return res.status(201).json({
      token: signToken(user._id.toString()),
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail) || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: signToken(user._id.toString()),
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};
