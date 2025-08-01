const db = require('../db');

const rdvModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM rdv ORDER BY date ASC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  create: (rdv) => {
    const { vehicule, immatriculation, intervention, client, tarif, date } = rdv;
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO rdv (vehicule, immatriculation, intervention, client, tarif, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [vehicule, immatriculation, intervention, client, tarif, date], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  },

  terminer: (id, moyenPaiement) => {
    return new Promise((resolve, reject) => {
      db.run(`
        UPDATE rdv
        SET etat = 'termine', moyenPaiement = ?
        WHERE id = ?
      `, [moyenPaiement, id], function (err) {
        if (err) reject(err);
        else resolve({ updated: this.changes });
      });
    });
  }
};

module.exports = rdvModel;
