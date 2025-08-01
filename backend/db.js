const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const dbFile = './database.sqlite';

// ✅ Crée la base si elle n'existe pas
if (!fs.existsSync(dbFile)) {
  const db = new sqlite3.Database(dbFile);
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS rdvs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicule TEXT,
        immatriculation TEXT,
        client TEXT,
        intervention TEXT,
        tarif REAL,
        date TEXT,
        etat TEXT DEFAULT 'en attente',
        moyenPaiement TEXT
      );
    `);
  });
  db.close();
}
