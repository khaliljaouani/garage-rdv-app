import React, { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";

/* même logique que dans App.jsx */
const API_URL = window.location.origin.includes("vercel.app")
  ? "https://garage-rdv-app-4.onrender.com"
  : "http://localhost:5000";

const FormulaireAjout = ({ onAdded }) => {
  const [formData, setFormData] = useState({
    vehicule: "",
    immatriculation: "",
    client: "",
    telephone: "",
    prisePar: "",
    date: "",
    tarif: "",
    intervention: "",
    heureDebut: "",
    heureFin: "",
    typeIntervention: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/rdv`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      setFormData({
        vehicule: "",
        immatriculation: "",
        client: "",
        telephone: "",
        prisePar: "",
        date: "",
        tarif: "",
        intervention: "",
        heureDebut: "",
        heureFin: "",
        typeIntervention: "",
      });
      onAdded();
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Card className="mb-4 border-0" style={{ width: "100%" }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Ligne 1 */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Véhicule</Form.Label>
                  <Form.Control
                    name="vehicule"
                    placeholder="Véhicule"
                    value={formData.vehicule}
                    onChange={handleChange}
                    required
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
                      let value = e.target.value.toUpperCase();
                      value = value.replace(/[^A-Z0-9]/g, "");

                      if (value.length > 2 && value.length <= 5) {
                        value = value.slice(0, 2) + "-" + value.slice(2);
                      } else if (value.length > 5) {
                        value =
                          value.slice(0, 2) +
                          "-" +
                          value.slice(2, 5) +
                          "-" +
                          value.slice(5, 7);
                      }

                      setFormData((prev) => ({
                        ...prev,
                        immatriculation: value,
                      }));
                    }}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 2 */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Client</Form.Label>
                  <Form.Control
                    name="client"
                    placeholder="Nom du client"
                    value={formData.client}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Numéro de téléphone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telephone"
                    placeholder="Ex: 06 12 34 56 78"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Personne qui a donné le rendez-vous</Form.Label>
                  <Form.Control
                    name="prisePar"
                    placeholder="Nom de la personne"
                    value={formData.prisePar}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Intervention */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Intervention</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="intervention"
                    placeholder="Détail de l'intervention"
                    value={formData.intervention}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Ligne 3 */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tarif (€)</Form.Label>
                  <Form.Control
                    type="number"
                    name="tarif"
                    placeholder="Montant"
                    value={formData.tarif}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Type */}
            <Form.Group className="mb-4">
              <Form.Label>Type d’intervention</Form.Label>
              <Form.Select
                name="typeIntervention"
                value={formData.typeIntervention}
                onChange={handleChange}
              >
                <option value="">-- Sélectionner --</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="mecanique">Mécanique</option>
              </Form.Select>
            </Form.Group>

            <div className="text-end">
              <Button variant="primary" type="submit">
                Ajouter le rendez-vous
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FormulaireAjout;
