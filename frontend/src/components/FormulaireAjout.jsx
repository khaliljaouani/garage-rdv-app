import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const FormulaireAjout = ({ onAdded }) => {
  const [formData, setFormData] = useState({
    vehicule: '',
    immatriculation: '',
    intervention: '',
    client: '',
    tarif: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/rdv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur lors de l\'envoi');
      setFormData({ vehicule: '', immatriculation: '', intervention: '', client: '', tarif: '', date: '' });
      onAdded();
    } catch (err) {
      alert('Erreur : ' + err.message);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Ajouter un rendez-vous</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col><Form.Control name="vehicule" placeholder="Véhicule" value={formData.vehicule} onChange={handleChange} required /></Col>
            <Col><Form.Control name="immatriculation" placeholder="Immatriculation" value={formData.immatriculation} onChange={handleChange} required /></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Control name="client" placeholder="Client" value={formData.client} onChange={handleChange} required /></Col>
            <Col><Form.Control name="tarif" placeholder="Tarif" value={formData.tarif} type="number" onChange={handleChange} required /></Col>
          </Row>
          <Row className="mb-3">
            <Col><Form.Control name="date" placeholder="Date" type="date" value={formData.date} onChange={handleChange} required /></Col>
            <Col><Form.Control as="textarea" rows={2} name="intervention" placeholder="Intervention" value={formData.intervention} onChange={handleChange} required /></Col>
          </Row>
          <Button variant="primary" type="submit">Ajouter</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormulaireAjout;