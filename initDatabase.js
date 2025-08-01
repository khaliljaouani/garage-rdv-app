const Database = require("better-sqlite3");
const db = new Database("garage.db");

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

console.log("✅ Base de données initialisée avec la table 'rdv'.");

module.exports = db;
