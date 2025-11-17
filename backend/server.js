// backend/server.js
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

// charge backend/.env en local
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// 🔌 Initialisation DB Neon
require("./db");

// Routes
const rdvRoutes = require("./routes/rdvRoutes");
app.use("/api/rdv", rdvRoutes);

// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend en écoute sur port ${PORT}`);
});
