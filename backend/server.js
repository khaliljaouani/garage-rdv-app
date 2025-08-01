const express = require("express");
const cors = require("cors");
const path = require("path");
const os = require("os");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();

// ✅ Définir le dossier où stocker la base de données
const userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'GarageRDV');
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// ✅ Chemin complet vers la base SQLite
const dbPath = path.join(userDataPath, 'garage.db');
const db = new Database(dbPath);

// ✅ Créer la table 'rdv' si elle n'existe pas
db.prepare(`
  CREATE TABLE IF NOT EXISTS rdv (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicule TEXT,
    immatriculation TEXT,
    intervention TEXT,
    client TEXT,
    tarif TEXT,
    date TEXT,
    etat TEXT DEFAULT 'en attente',
    moyenPaiement TEXT
  )
`).run();

console.log("✅ Base de données initialisée : " + dbPath);

app.use(cors());
app.use(express.json());

// ➕ Ajouter un RDV
app.post("/api/rdv", (req, res) => {
  const { vehicule, immatriculation, intervention, client, tarif, date } = req.body;
  const stmt = db.prepare("INSERT INTO rdv (vehicule, immatriculation, intervention, client, tarif, date) VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(vehicule, immatriculation, intervention, client, tarif, date);
  res.sendStatus(200);
});

// 🔄 Marquer RDV terminé + paiement
app.patch("/api/rdv/:id/terminer", (req, res) => {
  const { moyenPaiement } = req.body;
  const { id } = req.params;
  const stmt = db.prepare("UPDATE rdv SET etat = 'termine', moyenPaiement = ? WHERE id = ?");
  stmt.run(moyenPaiement, id);
  res.sendStatus(200);
});

// 🔍 Lister tous les RDV
app.get("/api/rdv", (req, res) => {
  const rows = db.prepare("SELECT * FROM rdv ORDER BY date DESC").all();
  res.json(rows);
});

app.listen(5000, () => {
  console.log("🚀 Backend en écoute sur http://localhost:5000");
});
