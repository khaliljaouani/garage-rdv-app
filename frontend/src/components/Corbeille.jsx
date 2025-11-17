import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Card, Badge } from "react-bootstrap";
import { FaSortUp, FaSortDown, FaTools, FaStethoscope } from "react-icons/fa";

const Corbeille = () => {
  const [rdvs, setRdvs] = useState([]);
  const [restoreModal, setRestoreModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [newDate, setNewDate] = useState("");

  const fetchDeletedRDV = async () => {
    const res = await fetch("http://localhost:5000/api/rdv");
    const data = await res.json();
    setRdvs(data.filter(rdv => rdv.deleted === 1)); // ✅ seulement supprimés
  };

  useEffect(() => {
    fetchDeletedRDV();
  }, []);

  const openRestoreModal = (rdv) => {
    setSelectedRdv(rdv);
    setNewDate(rdv.date);
    setRestoreModal(true);
  };

  const confirmRestore = async () => {
    try {
      await fetch(`http://localhost:5000/api/rdv/${selectedRdv.id}/restaurer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate })
      });
      fetchDeletedRDV();
      setRestoreModal(false);
    } catch {
      alert("Erreur lors de la restauration.");
    }
  };

  const renderBadge = (type) => {
    switch (type) {
      case "diagnostic":
        return <Badge bg="info"><FaStethoscope className="me-1" /> Diagnostic</Badge>;
      case "mecanique":
        return <Badge bg="warning" text="dark"><FaTools className="me-1" /> Mécanique</Badge>;
      default:
        return type;
    }
  };

  return (
    <Card className="p-3">
      <h3>🗑️ Corbeille - Rendez-vous supprimés</h3>

      <Table bordered hover responsive className="text-center align-middle mt-3">
        <thead>
          <tr>
            <th>Véhicule</th>
            <th>Immatriculation</th>
            <th>Client</th>
            <th>Téléphone</th>
            <th>Intervention</th>
            <th>Tarif (€)</th>
            <th>Date</th>
            <th>Type</th>
            <th>Pris par</th>
            <th>État</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rdvs.map(rdv => (
            <tr key={rdv.id}>
              <td>{rdv.vehicule}</td>
              <td>{rdv.immatriculation}</td>
              <td>{rdv.client}</td>
              <td>{rdv.telephone || "-"}</td>
              <td><Form.Control as="textarea" rows={2} value={rdv.intervention} readOnly /></td>
              <td>{rdv.tarif} €</td>
              <td>{rdv.date}</td>
              <td>{renderBadge(rdv.typeIntervention)}</td>
              <td>{rdv.prisePar || "-"}</td>
              <td>
                {rdv.etat === "termine"
                  ? <Badge bg="success">Payé ({rdv.moyenPaiement})</Badge>
                  : <Badge bg="warning" text="dark">En attente</Badge>}
              </td>
              <td>
                <Button variant="success" size="sm" onClick={() => openRestoreModal(rdv)}>
                  Restaurer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal restauration */}
      <Modal show={restoreModal} onHide={() => setRestoreModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Restaurer le rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Vous allez restaurer le rendez-vous de <strong>{selectedRdv?.client}</strong>.<br />
            Choisissez une nouvelle date :
          </p>
          <Form.Control
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRestoreModal(false)}>Annuler</Button>
          <Button variant="success" onClick={confirmRestore}>Restaurer</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Corbeille;
