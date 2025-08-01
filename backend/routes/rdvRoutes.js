// backend/routes/rdvRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllRDV,
  createRDV,
  terminerRDV
} = require('../controllers/rdvController');

// GET /api/rdv → récupérer tous les rendez-vous
router.get('/', getAllRDV);

// POST /api/rdv → ajouter un rendez-vous
router.post('/', createRDV);

// PATCH /api/rdv/:id/terminer → marquer comme terminé
router.patch('/:id/terminer', terminerRDV);

module.exports = router;
