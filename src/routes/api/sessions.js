import express from "express";
import passport from "../../middlewares/passport.js";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ status: "error", message: "Error del servidor" });
    if (!user) return res.status(400).json({ status: "error", message: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("currentUser", token, {
      signed: true,
      httpOnly: true,
      maxAge: 3600000
    });

    res.json({ 
      status: "success", 
      message: "Login exitoso",
      user: { 
        id: user._id, 
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email, 
        role: user.role 
      }
    });
  })(req, res, next);
});

router.get("/current", 
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      status: "success",
      data: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.json({ status: "success", message: "Logout exitoso" });
});

export default router;