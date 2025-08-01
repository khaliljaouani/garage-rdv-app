// ✅ App.jsx
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [formData, setFormData] = useState({
    vehicule: "",
    immatriculation: "",
    intervention: "",
    client: "",
    tarif: "",
    date: "",
  });
  const [rdvs, setRdvs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [selectedPaiement, setSelectedPaiement] = useState("");

  const fetchRDV = async () => {
    const res = await fetch("http://localhost:5000/api/rdv");
    const data = await res.json();
    setRdvs(data);
  };

  useEffect(() => {
    fetchRDV();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/rdv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de l’envoi");
      setMessage("RDV ajouté avec succès !");
      setFormData({ vehicule: "", immatriculation: "", intervention: "", client: "", tarif: "", date: "" });
      fetchRDV();
      setModalOpen(false);
    } catch (err) {
      setMessage("Erreur : " + err.message);
    }
  };

  const openPaiementModal = (rdv, moyen) => {
    setSelectedRdv(rdv);
    setSelectedPaiement(moyen);
    setConfirmModal(true);
  };

  const confirmPaiement = async () => {
    try {
      await fetch(`http://localhost:5000/api/rdv/${selectedRdv.id}/terminer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moyenPaiement: selectedPaiement }),
      });
      fetchRDV();
      setConfirmModal(false);
      setSelectedRdv(null);
    } catch {
      alert("Erreur lors du paiement");
    }
  };

  const resetFilter = () => {
    setSearch("");
    setSearchDate("");
  };

  const filteredRDV = rdvs.filter(
    (r) =>
      (r.client.toLowerCase().includes(search.toLowerCase()) ||
        r.immatriculation.toLowerCase().includes(search.toLowerCase())) &&
      (!searchDate || r.date === searchDate)
  );

  return (
    <Container className="py-4">
      {/* ➕ Bouton pour ouvrir le modal d’ajout */}
      <Button className="mb-3" variant="primary" onClick={() => setModalOpen(true)}>
        Prendre un rendez-vous
      </Button>

      {/* Modal Ajout RDV */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Véhicule</Form.Label>
              <Form.Control name="vehicule" value={formData.vehicule} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Immatriculation</Form.Label>
              <Form.Control name="immatriculation" value={formData.immatriculation} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Intervention</Form.Label>
              <Form.Control as="textarea" rows={3} name="intervention" value={formData.intervention} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Client</Form.Label>
              <Form.Control name="client" value={formData.client} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tarif</Form.Label>
              <Form.Control type="number" name="tarif" value={formData.tarif} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" variant="success">Ajouter</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal Confirmation Paiement */}
      <Modal show={confirmModal} onHide={() => setConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirmez-vous le paiement <strong>{selectedPaiement}</strong> pour le client <strong>{selectedRdv?.client}</strong> ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>Annuler</Button>
          <Button variant="success" onClick={confirmPaiement}>Confirme</Button>
        </Modal.Footer>
      </Modal>

      {/* Tableau des rendez-vous */}
      <Card>
        <Card.Body>
          <Card.Title>Liste des rendez-vous</Card.Title>

          <div className="d-flex gap-2 mb-3">
            <Form.Control placeholder="Nom ou immatriculation" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Form.Control type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            <Button variant="outline-secondary" onClick={resetFilter}>Réinitialiser</Button>
          </div>

          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Immatriculation</th>
                <th>Client</th>
                <th>Intervention</th>
                <th>Tarif</th>
                <th>Date</th>
                <th>État</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRDV.map((rdv) => (
                <tr key={rdv.id} className={rdv.etat === "termine" ? "table-success" : ""}>
                  <td>{rdv.vehicule}</td>
                  <td>{rdv.immatriculation}</td>
                  <td>{rdv.client}</td>
                  <td><Form.Control as="textarea" rows={2} readOnly value={rdv.intervention} /></td>
                  <td>{rdv.tarif} €</td>
                  <td>{rdv.date}</td>
                  <td>
                    {rdv.etat === "termine" ? (
                      <span className="badge bg-success">Payé ({rdv.moyenPaiement})</span>
                    ) : (
                      <span className="badge bg-warning text-dark">En attente</span>
                    )}
                  </td>
                  <td>
                    {rdv.etat !== "termine" && (
                      <>
                        <Button size="sm" variant="primary" onClick={() => openPaiementModal(rdv, "espèces")} className="me-1">Espèces</Button>
                        <Button size="sm" variant="info" onClick={() => openPaiementModal(rdv, "carte bleue")}>Carte</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default App;
