// backend/db.js
const { Pool } = require("pg");
const path = require("path");
const dotenv = require("dotenv");

// charge backend/.env en local
dotenv.config({ path: path.join(__dirname, ".env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function initDb() {
  try {
    console.log("📦 Connexion à Neon/PostgreSQL...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS rdv (
        id SERIAL PRIMARY KEY,
        vehicule TEXT,
        immatriculation TEXT,
        client TEXT,
        telephone TEXT,
        intervention TEXT,
        tarif REAL,
        date TEXT,
        typeIntervention TEXT,
        prisePar TEXT,
        etat TEXT DEFAULT 'en_attente',
        moyenPaiement TEXT,
        deleted INTEGER DEFAULT 0
      );
    `);

    console.log("✅ Table rdv prête sur Neon");
  } catch (err) {
    console.error("❌ Erreur init DB:", err);
  }
}

initDb();

module.exports = {
  async run(sql, params = []) {
    return pool.query(sql, params);
  },
  async all(sql, params = []) {
    const r = await pool.query(sql, params);
    return r.rows;
  },
  async get(sql, params = []) {
    const r = await pool.query(sql, params);
    return r.rows[0] || null;
  },
};
