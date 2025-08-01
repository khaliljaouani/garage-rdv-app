// ✅ ModalPaiement.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalPaiement = ({ show, handleClose, onValider, rdvId }) => {
  const [moyen, setMoyen] = useState('');

  const validerPaiement = async () => {
    try {
      await fetch(`http://localhost:5000/api/rdv/${rdvId}/terminer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moyenPaiement: moyen })
      });
      onValider();
      handleClose();
    } catch (err) {
      alert('Erreur lors du paiement');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Choisir le mode de paiement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {moyen ? (
          <div>
            <p>Confirmer le paiement avec <strong>{moyen}</strong> ?</p>
            <Button variant="success" onClick={validerPaiement}>Confirmer</Button>
          </div>
        ) : (
          <div className="d-flex justify-content-around">
            <Button variant="success" onClick={() => setMoyen('espèces')}>Espèces</Button>
            <Button variant="primary" onClick={() => setMoyen('carte bleue')}>Carte Bleue</Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalPaiement;