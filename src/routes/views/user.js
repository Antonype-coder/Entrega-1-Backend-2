import express from "express";
import User from "../../models/user.js";
import { authenticate } from "../../middlewares/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.send("Faltan datos obligatorios");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send("Usuario ya existe");

    const newUser = new User({ first_name, last_name, email, age, password });
    await newUser.save();
    res.redirect("/users/login");
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).send("Error al registrar usuario");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.redirect("/users/login");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("currentUser", token, { httpOnly: true });
    res.redirect("/users/current");
  } catch (error) {
    res.redirect("/users/login");
  }
});

router.get("/current", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  res.render("current", { user });
});

router.get("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/users/login");
});

export default router;
