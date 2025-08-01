const rdvModel = require('../models/rdvModel');

exports.getAllRDV = async (req, res) => {
  try {
    const rows = await rdvModel.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération RDV' });
  }
};

exports.createRDV = async (req, res) => {
  try {
    const result = await rdvModel.create(req.body);
    res.status(201).json({ success: true, id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout RDV' });
  }
};

exports.terminerRDV = async (req, res) => {
  const { id } = req.params;
  const { moyenPaiement } = req.body;

  try {
    const result = await rdvModel.terminer(id, moyenPaiement);
    if (result.updated > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'RDV non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour RDV' });
  }
};
