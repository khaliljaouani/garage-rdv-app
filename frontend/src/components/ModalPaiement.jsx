// ModalPaiement.jsx
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

// 👉 même logique que App.jsx / FormulaireAjout
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ModalPaiement = ({ show, handleClose, onValider, rdvId }) => {
  const [moyen, setMoyen] = useState("");

  const validerPaiement = async () => {
    if (!moyen || !rdvId) return;
    try {
      const res = await fetch(`${API_URL}/api/rdv/${rdvId}/terminer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moyenPaiement: moyen }),
      });

      if (!res.ok) throw new Error("Erreur HTTP " + res.status);

      if (onValider) onValider();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors du paiement : " + err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Choisir le mode de paiement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {moyen ? (
          <div className="text-center">
            <p>
              Confirmer le paiement avec <strong>{moyen}</strong> ?
            </p>
            <Button variant="success" onClick={validerPaiement}>
              Confirmer
            </Button>
          </div>
        ) : (
          <div className="d-flex justify-content-around">
            <Button variant="success" onClick={() => setMoyen("espèces")}>
              Espèces
            </Button>
            <Button variant="primary" onClick={() => setMoyen("carte bleue")}>
              Carte Bleue
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalPaiement;
