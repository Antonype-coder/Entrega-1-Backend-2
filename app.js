import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./src/config/config.js";
import usersApiRoutes from "./src/routes/api/users.js";
import sessionsApiRoutes from "./src/routes/api/sessions.js";
import usersViewRoutes from "./src/routes/views/user.js";
import passport from "./src/middlewares/passport.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsApiRoutes);
app.use("/users", usersViewRoutes);

app.get("/", (req, res) => {
  res.send(`
    <div style="padding: 20px; text-align: center;">
      <h1>🚀 Sistema de Usuarios</h1>
      <p><a href="/users/register">Registrarse</a> | <a href="/users/login">Login</a></p>
    </div>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});
