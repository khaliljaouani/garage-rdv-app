// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

/* ========= CORS ========= */
const explicitAllowed = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://garage-rdv-app.vercel.app",
  "https://garage-rdv-8e4wqaknx-khalils-projects-164cc693.vercel.app",
];

function corsOrigin(origin, callback) {
  // Requêtes sans origin (Electron, Postman, etc.) => on autorise
  if (!origin) return callback(null, true);

  // Domaines explicitement autorisés
  if (explicitAllowed.includes(origin)) {
    return callback(null, true);
  }

  // Tous les sous-domaines vercel.app (préviews)
  if (origin.endsWith(".vercel.app")) {
    return callback(null, true);
  }

  // Sinon refus
  return callback(new Error("Not allowed by CORS: " + origin));
}

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Pré-flight OPTIONS
app.options("*", cors({ origin: corsOrigin }));
/* ======================== */

app.use(express.json());

// Initialisation DB Neon
require("./db");

// Routes
const rdvRoutes = require("./routes/rdvRoutes");
app.use("/api/rdv", rdvRoutes);

// ⚠️ PORT corrigé : 5000 en local, PORT de Render en prod
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend en écoute sur http://localhost:${PORT}`);
});
