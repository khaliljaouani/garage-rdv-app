import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalEditionRDV = ({ rdv, onClose, onUpdated }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (rdv) {
      setFormData({
        vehicule: rdv.vehicule || "",
        immatriculation: rdv.immatriculation || "",
        client: rdv.client || "",
        telephone: rdv.telephone || "", // ✅ Ajout
        intervention: rdv.intervention || "",
        tarif: rdv.tarif || "",
        date: rdv.date || "",
        prisePar: rdv.prisePar || "",
        typeIntervention: rdv.typeIntervention || ""
      });
    }
  }, [rdv]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rdv/${rdv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        onUpdated();
        onClose();
        window.location.reload();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch (err) {
      alert("Erreur de la mise à jour.");
    }
  };

  if (!formData) return null;

  return (
    <Modal show={!!rdv} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier un rendez-vous</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Véhicule</Form.Label>
                <Form.Control
                  name="vehicule"
                  value={formData.vehicule}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Immatriculation</Form.Label>
                <Form.Control
                  name="immatriculation"
                  placeholder="Ex: AZ-123-ET"
                  value={formData.immatriculation}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase(); // ✅ met en majuscule
                    value = value.replace(/[^A-Z0-9]/g, ""); // ✅ garde seulement lettres/chiffres
              
                    // ✅ Formattage dynamique
                    if (value.length > 2 && value.length <= 5) {
                      value = value.slice(0, 2) + "-" + value.slice(2);
                    } else if (value.length > 5) {
                      value = value.slice(0, 2) + "-" + value.slice(2, 5) + "-" + value.slice(5, 7);
                    }
              
                    setFormData(prev => ({ ...prev, immatriculation: value }));
                  }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Client</Form.Label>
                <Form.Control
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Numéro de téléphone</Form.Label> {/* ✅ Ajout */}
                <Form.Control
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Personne qui a donné le rendez-vous</Form.Label>
                <Form.Control
                  name="prisePar"
                  value={formData.prisePar}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Intervention</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="intervention"
              value={formData.intervention}
              onChange={handleChange}
            />
          </Form.Group>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tarif (€)</Form.Label>
                <Form.Control
                  type="number"
                  name="tarif"
                  value={formData.tarif}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Type d’intervention</Form.Label>
            <Form.Select
              name="typeIntervention"
              value={formData.typeIntervention || ""}
              onChange={handleChange}
            >
              <option value="">-- Sélectionner --</option>
              <option value="diagnostic">Diagnostic</option>
              <option value="mecanique">Mécanique</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Modifier
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditionRDV;
