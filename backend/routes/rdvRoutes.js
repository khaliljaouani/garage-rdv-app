// routes/rdvRoutes.js
const express = require("express");
const db = require("../db");
const router = express.Router();

// Lister tous les RDV
router.get("/", async (req, res) => {
  try {
    const rdvs = await db.all("SELECT * FROM rdv ORDER BY date DESC");
    res.json(rdvs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des RDV." });
  }
});

// Ajouter un RDV
router.post("/", async (req, res) => {
  try {
    const {
      vehicule,
      immatriculation,
      client,
      telephone,
      intervention,
      tarif,
      date,
      prisePar,
      typeIntervention,
    } = req.body;

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
        vehicule,
        immatriculation,
        client,
        telephone,
        intervention,
        tarif,
        date,
        prisePar,
        typeIntervention,
      ]
    );

    res.json({ success: true, id: row.id });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l’ajout du RDV." });
  }
});

// Modifier un RDV
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await db.get("SELECT * FROM rdv WHERE id = $1", [id]);
    if (!existing) return res.status(404).json({ error: "RDV introuvable" });

    const {
      vehicule,
      immatriculation,
      client,
      telephone,
      intervention,
      tarif,
      date,
      prisePar,
      typeIntervention,
    } = req.body;

    await db.run(
      `
      UPDATE rdv
      SET vehicule=$1, immatriculation=$2, client=$3, telephone=$4,
          intervention=$5, tarif=$6, date=$7, prisePar=$8,
          typeIntervention=$9
      WHERE id=$10
    `,
      [
        vehicule,
        immatriculation,
        client,
        telephone,
        intervention,
        tarif,
        date,
        prisePar,
        typeIntervention,
        id,
      ]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification." });
  }
});

// Paiement
router.patch("/:id/terminer", async (req, res) => {
  try {
    const { id } = req.params;
    const { moyenPaiement } = req.body;

    const existing = await db.get("SELECT * FROM rdv WHERE id=$1", [id]);
    if (!existing) return res.status(404).json({ error: "RDV introuvable" });

    await db.run(
      `UPDATE rdv SET etat='termine', moyenPaiement=$1 WHERE id=$2`,
      [moyenPaiement, id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du paiement." });
  }
});

// Suppression logique
router.patch("/:id/supprimer", async (req, res) => {
  try {
    const { id } = req.params;

    await db.run("UPDATE rdv SET deleted=1 WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

// Restauration
router.patch("/:id/restaurer", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    await db.run("UPDATE rdv SET deleted=0, date=$1 WHERE id=$2", [date, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la restauration." });
  }
});

module.exports = router;
