import express from "express";
import User from "../../models/user.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
    res.json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ status: "error", message: "Faltan datos obligatorios" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ status: "error", message: "El email ya está registrado" });

    const user = new User({ first_name, last_name, email, age, password, role });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ status: "success", data: userResponse });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;