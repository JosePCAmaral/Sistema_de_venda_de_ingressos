const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

connectDB();
const app = express();

app.use(express.json());
app.use(cors());

// Rotas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./frontend/views");
