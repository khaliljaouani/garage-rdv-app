// controllers/rdvController.js
const rdvModel = require("../models/rdvModel");

// 🔁 GET /api/rdv
async function listerRDV(req, res) {
  try {
    const data = await rdvModel.getAllRDV();
    res.json(data);
  } catch (error) {
    console.error("❌ Erreur dans listerRDV :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des RDV." });
  }
}

// 🆕 POST /api/rdv
async function ajouterRDV(req, res) {
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

    console.log("📥 Données reçues :", req.body);

    const inserted = await rdvModel.createRDV({
      vehicule,
      immatriculation,
      client,
      telephone,
      intervention,
      tarif,
      date,
      prisePar,
      typeIntervention,
    });

    res.json({ success: true, id: inserted.id });
  } catch (error) {
    console.error("❌ Erreur dans ajouterRDV :", error);
    res.status(500).json({ error: "Erreur lors de l’ajout du RDV." });
  }
}

// ✏️ PUT /api/rdv/:id
async function modifierRDV(req, res) {
  try {
    const { id } = req.params;

    const existing = await rdvModel.getRDVById(id);
    if (!existing) {
      return res.status(404).json({ error: "RDV introuvable" });
    }

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

    await rdvModel.updateRDV(id, {
      vehicule,
      immatriculation,
      client,
      telephone,
      intervention,
      tarif,
      date,
      prisePar,
      typeIntervention,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur dans modifierRDV :", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du RDV." });
  }
}

// 💰 PATCH /api/rdv/:id/terminer
async function payerRDV(req, res) {
  try {
    const { id } = req.params;
    const { moyenPaiement } = req.body;

    await rdvModel.updatePaiement(id, moyenPaiement);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur dans payerRDV :", error);
    res.status(500).json({ error: "Erreur lors du paiement." });
  }
}

// 🗑 PATCH /api/rdv/:id/supprimer
async function supprimerRDV(req, res) {
  try {
    const { id } = req.params;

    const existing = await rdvModel.getRDVById(id);
    if (!existing) {
      return res.status(404).json({ error: "RDV introuvable" });
    }

    await rdvModel.softDeleteRDV(id);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur dans supprimerRDV :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du RDV." });
  }
}

// ♻️ PATCH /api/rdv/:id/restaurer
async function restaurerRDV(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const existing = await rdvModel.getRDVById(id);
    if (!existing) {
      return res.status(404).json({ error: "RDV introuvable" });
    }

    await rdvModel.restoreRDV(id, date);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur dans restaurerRDV :", error);
    res.status(500).json({ error: "Erreur lors de la restauration du RDV." });
  }
}

module.exports = {
  listerRDV,
  ajouterRDV,
  modifierRDV,
  payerRDV,
  supprimerRDV,
  restaurerRDV,
};
