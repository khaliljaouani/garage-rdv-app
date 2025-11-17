// models/rdvModel.js
const db = require("../db");

async function getAllRDV() {
  return db.all("SELECT * FROM rdv ORDER BY date DESC");
}

async function getRDVById(id) {
  return db.get("SELECT * FROM rdv WHERE id=$1", [id]);
}

async function createRDV(data) {
  const row = await db.get(
    `
    INSERT INTO rdv (
      vehicule, immatriculation, client, telephone, intervention,
      tarif, date, prisePar, typeIntervention, etat, deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'en_attente',0)
    RETURNING id
  `,
    [
      data.vehicule,
      data.immatriculation,
      data.client,
      data.telephone,
      data.intervention,
      data.tarif,
      data.date,
      data.prisePar,
      data.typeIntervention,
    ]
  );
  return { id: row.id };
}

async function updateRDV(id, data) {
  await db.run(
    `
    UPDATE rdv SET
      vehicule=$1, immatriculation=$2, client=$3, telephone=$4,
      intervention=$5, tarif=$6, date=$7,
      prisePar=$8, typeIntervention=$9
    WHERE id=$10
  `,
    [
      data.vehicule,
      data.immatriculation,
      data.client,
      data.telephone,
      data.intervention,
      data.tarif,
      data.date,
      data.prisePar,
      data.typeIntervention,
      id,
    ]
  );
}

async function updatePaiement(id, moyen) {
  await db.run(
    `UPDATE rdv SET etat='termine', moyenPaiement=$1 WHERE id=$2`,
    [moyen, id]
  );
}

async function softDeleteRDV(id) {
  await db.run(`UPDATE rdv SET deleted=1 WHERE id=$1`, [id]);
}

async function restoreRDV(id, date) {
  await db.run(`UPDATE rdv SET deleted=0, date=$1 WHERE id=$2`, [date, id]);
}

module.exports = {
  getAllRDV,
  getRDVById,
  createRDV,
  updateRDV,
  updatePaiement,
  softDeleteRDV,
  restoreRDV,
};
