import express from "express";
import User from "../../models/user.js";
import { authenticate } from "../../middlewares/auth.js";
import jwt from "jsonwebtoken";

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

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.send("El email ya está registrado");
    }

    const user = new User({ 
      first_name, 
      last_name, 
      email: email.toLowerCase(), 
      age, 
      password 
    });
    await user.save();

    res.redirect("/users/login");

  } catch (error) {
    console.error("Error en registro:", error);
    res.send("Error al registrar usuario");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.comparePassword(password)) {
      return res.redirect("/users/login");
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("currentUser", token, { 
      signed: true,
      httpOnly: true
    });

    res.redirect("/users/current");

  } catch (error) {
    console.error("Error en login:", error);
    res.redirect("/users/login");
  }
});

router.get("/current", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return res.redirect("/users/login");
    }

    res.render("current", { 
      user: user,
      title: "Mi Perfil"
    });

  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.redirect("/users/login");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/users/login");
});

export default router;
