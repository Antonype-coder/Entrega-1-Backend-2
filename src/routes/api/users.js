import express from "express";
import User from "../../models/user.js";
import jwt from "jsonwebtoken";
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
            return res.status(400).json({ status: "error", message: "Faltan datos" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: "error", message: "Email ya registrado" });

        const user = new User({ first_name, last_name, email, age, password, role });
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ status: "success", data: userResponse });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (password) user.password = password;
        if (role) user.role = role;

        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({ status: "success", data: userResponse });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        await user.deleteOne();
        res.json({ status: "success", data: user });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default router;
