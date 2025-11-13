import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import exphbs from "express-handlebars";

import connectDB from "./src/config/config.js";
import usersApiRoutes from "./src/routes/api/users.js";
import usersViewRoutes from "./src/routes/views/user.js";
import sessionsRoutes from "./src/routes/api/sessions.js";
import passport from "./src/middlewares/passport.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/users", usersViewRoutes);

app.get("/", (req, res) => {
  res.send('Servidor activo. Ir a <a href="/users/login">/users/login</a>');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});