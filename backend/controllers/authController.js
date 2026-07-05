import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sendAuth = (res, user, status = 200) => {
  res.status(status).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("Email already registered");
    }
    const user = await User.create({ name, email, password });
    sendAuth(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.json({ message: "Logged out successfully. Remove token on client." });
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    await user.save();
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword))) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  res.json({ message: "Password reset link sent if this email exists. Dummy implementation." });
};
