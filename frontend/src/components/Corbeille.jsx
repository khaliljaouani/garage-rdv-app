// Corbeille.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaTools,
  FaStethoscope,
  FaCar,
  FaCalendarAlt,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ===== Textarea auto-height (autogrow) ===== */
function AutoGrowTextarea({ value = "", className, style, ...props }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <Form.Control
      as="textarea"
      ref={ref}
      value={value}
      readOnly
      rows={1}
      className={className}
      style={{
        overflow: "hidden",
        resize: "none",
        whiteSpace: "pre-wrap",
        ...style,
      }}
      {...props}
    />
  );
}
/* ========================================== */

const Corbeille = () => {
  const [rdvs, setRdvs] = useState([]);
  const [restoreModal, setRestoreModal] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // compat colonnes (SQLite / Postgres)
  const getTypeIntervention = (rdv) =>
    rdv.typeIntervention ?? rdv.typeintervention ?? "";

  const getPrisPar = (rdv) => rdv.prisePar ?? rdv.prisepar ?? "";

  const getMoyenPaiement = (rdv) =>
    rdv.moyenPaiement ?? rdv.moyenpaiement ?? "";

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchDeletedRDV = async () => {
    const res = await fetch(`${API_URL}/api/rdv`);
    const data = await res.json();
    setRdvs(data.filter((rdv) => rdv.deleted === 1)); // ✅ seulement supprimés
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
    if (!selectedRdv) return;
    try {
      const res = await fetch(
        `${API_URL}/api/rdv/${selectedRdv.id}/restaurer`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: newDate }),
        }
      );

      if (!res.ok) throw new Error("Erreur HTTP " + res.status);

      await fetchDeletedRDV();
      setRestoreModal(false);
      setSelectedRdv(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la restauration : " + err.message);
    }
  };

  const renderBadge = (type) => {
    switch (type) {
      case "diagnostic":
        return (
          <Badge bg="info">
            <FaStethoscope className="me-1" /> Diagnostic
          </Badge>
        );
      case "mecanique":
        return (
          <Badge bg="warning" text="dark">
            <FaTools className="me-1" /> Mécanique
          </Badge>
        );
      default:
        return type;
    }
  };

  /* ========== Rendu mobile (cartes) ========== */
  const renderMobile = () => (
    <div className="d-flex flex-column gap-3">
      {rdvs.map((rdv) => (
        <Card key={rdv.id} className="app-mobile-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="app-card-title d-flex align-items-center gap-2">
                  <FaCar />
                  <span>{rdv.vehicule || "Véhicule"}</span>
                </div>
                <small className="text-muted">
                  {rdv.immatriculation} • {rdv.client}
                </small>
              </div>
              <div className="text-end">
                <div className="app-mobile-chip mb-1">
                  <FaCalendarAlt className="me-1" />
                  {rdv.date}
                </div>
                <div>{renderBadge(getTypeIntervention(rdv))}</div>
              </div>
            </div>

            <div className="mb-2">
              <small className="text-muted">Intervention</small>
              <AutoGrowTextarea value={rdv.intervention} />
            </div>

            <Row className="mb-2">
              <Col xs={6}>
                <small className="text-muted d-block">Téléphone</small>
                <span>{rdv.telephone || "-"}</span>
              </Col>
              <Col xs={6} className="text-end">
                <small className="text-muted d-block">Tarif</small>
                <span>
                  {rdv.tarif != null && rdv.tarif !== ""
                    ? `${rdv.tarif} €`
                    : "-"}
                </span>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={6}>
                <small className="text-muted d-block">Pris par</small>
                <span>{getPrisPar(rdv) || "-"}</span>
              </Col>
              <Col xs={6} className="text-end">
                <small className="text-muted d-block">État</small>
                {rdv.etat === "termine" ? (
                  <Badge bg="success">
                    Payé ({getMoyenPaiement(rdv) || "?"})
                  </Badge>
                ) : (
                  <Badge bg="warning" text="dark">
                    En attente
                  </Badge>
                )}
              </Col>
            </Row>

            <div className="d-grid mt-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => openRestoreModal(rdv)}
              >
                Restaurer
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  /* ========== Rendu desktop (table) ========== */
  const renderDesktop = () => (
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
        {rdvs.map((rdv) => (
          <tr key={rdv.id}>
            <td>{rdv.vehicule}</td>
            <td>{rdv.immatriculation}</td>
            <td>{rdv.client}</td>
            <td>{rdv.telephone || "-"}</td>
            <td style={{ minWidth: 260 }}>
              <AutoGrowTextarea value={rdv.intervention} />
            </td>
            <td>
              {rdv.tarif != null && rdv.tarif !== "" ? `${rdv.tarif} €` : "-"}
            </td>
            <td>{rdv.date}</td>
            <td>{renderBadge(getTypeIntervention(rdv))}</td>
            <td>{getPrisPar(rdv) || "-"}</td>
            <td>
              {rdv.etat === "termine" ? (
                <Badge bg="success">
                  Payé ({getMoyenPaiement(rdv) || "?"})
                </Badge>
              ) : (
                <Badge bg="warning" text="dark">
                  En attente
                </Badge>
              )}
            </td>
            <td>
              <Button
                variant="success"
                size="sm"
                onClick={() => openRestoreModal(rdv)}
              >
                Restaurer
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Card className="p-3 app-card">
      <h3 className="mb-3">🗑️ Corbeille - Rendez-vous supprimés</h3>

      {rdvs.length === 0 ? (
        <p className="text-muted">Aucun rendez-vous dans la corbeille.</p>
      ) : isMobile ? (
        renderMobile()
      ) : (
        renderDesktop()
      )}

      {/* Modal restauration */}
      <Modal show={restoreModal} onHide={() => setRestoreModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Restaurer le rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Vous allez restaurer le rendez-vous de{" "}
            <strong>{selectedRdv?.client}</strong>.<br />
            Choisissez une nouvelle date :
          </p>
          <Form.Control
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRestoreModal(false)}>
            Annuler
          </Button>
          <Button variant="success" onClick={confirmRestore}>
            Restaurer
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Corbeille;
