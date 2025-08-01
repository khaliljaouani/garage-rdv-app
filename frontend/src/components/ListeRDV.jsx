// ✅ ListeRDV.jsx
import React, { useEffect, useState } from 'react';
import { Table, Card, Form, Row, Col, Button } from 'react-bootstrap';
import ModalPaiement from './ModalPaiement';

const ListeRDV = () => {
  const [rdvs, setRdvs] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRDV = async () => {
    const res = await fetch('http://localhost:5000/api/rdv');
    const data = await res.json();
    setRdvs(data);
  };

  useEffect(() => {
    fetchRDV();
  }, []);

  const filtered = rdvs.filter(r =>
    (r.client.toLowerCase().includes(search.toLowerCase()) ||
     r.immatriculation.toLowerCase().includes(search.toLowerCase())) &&
    (dateFilter === '' || r.date === dateFilter)
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">Liste des rendez-vous</Card.Title>

        <Row className="mb-3">
          <Col><Form.Control placeholder="Rechercher par nom ou immatriculation" value={search} onChange={e => setSearch(e.target.value)} /></Col>
          <Col><Form.Control type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} /></Col>
          <Col xs="auto"><Button onClick={() => { setSearch(''); setDateFilter(''); }}>Réinitialiser</Button></Col>
        </Row>

        <Table striped bordered hover responsive>
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
            {filtered.map(rdv => (
              <tr key={rdv.id} className={rdv.etat === 'termine' ? 'table-success' : ''}>
                <td>{rdv.vehicule}</td>
                <td>{rdv.immatriculation}</td>
                <td>{rdv.client}</td>
                <td><Form.Control as="textarea" rows={2} value={rdv.intervention} readOnly /></td>
                <td>{rdv.tarif} €</td>
                <td>{rdv.date}</td>
                <td>
                  {rdv.etat === 'termine' ? (
                    <span className="badge bg-success">Payé ({rdv.moyenPaiement})</span>
                  ) : (
                    <span className="badge bg-warning text-dark">En attente</span>
                  )}
                </td>
                <td>
                  {rdv.etat !== 'termine' && (
                    <Button size="sm" onClick={() => { setSelectedId(rdv.id); setShowModal(true); }}>Paiement</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>

      <ModalPaiement
        show={showModal}
        handleClose={() => setShowModal(false)}
        rdvId={selectedId}
        onValider={fetchRDV}
      />
    </Card>
  );
};

export default ListeRDV;