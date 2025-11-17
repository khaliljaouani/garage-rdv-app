// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Initialisation DB Neon
require("./db");

// Routes
const rdvRoutes = require("./routes/rdvRoutes");
app.use("/api/rdv", rdvRoutes);

// Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend en écoute sur http://localhost:${PORT}`);
});
