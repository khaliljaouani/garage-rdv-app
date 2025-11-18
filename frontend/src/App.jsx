import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  Container, Button, Table, Modal, Form, Card, Badge, Row, Col
} from "react-bootstrap";
import {
  FaSortUp, FaSortDown, FaTools, FaStethoscope,
  FaMoneyBillWave, FaCreditCard, FaPencilAlt, FaTrash,
  FaCar, FaCalendarAlt
} from "react-icons/fa";

import FormulaireAjout from "./components/FormulaireAjout";
import ModalEditionRDV from "./components/ModalEditionRDV";

/* ===== Textarea auto-height ===== */
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

const App = () => {
  const [rdvs, setRdvs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedType, setSelectedType] = useState("tous");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [editModalRdv, setEditModalRdv] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState("");
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [filteredMode, setFilteredMode] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Helpers : compatibilité avec les anciens champs DB
  const getTypeIntervention = (rdv) =>
    rdv.typeIntervention ?? rdv.typeintervention ?? "";

  const getPrisPar = (rdv) =>
    rdv.prisePar ?? rdv.prisepar ?? "";

  const getMoyenPaiement = (rdv) =>
    rdv.moyenPaiement ?? rdv.moyenpaiement ?? "";

  // détecter mobile
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* 🔄 Charger RDV */
  const fetchRDV = async () => {
    try {
      const res = await fetch("https://garage-rdv-app-4.onrender.com/api/rdv");
      const data = await res.json();
      setRdvs(data);
    } catch (e) {
      console.log("❌ Erreur de chargement", e);
    }
  };

  useEffect(() => {
    fetchRDV();
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];

  // Filtrage
  let filteredRDV;
  if (search.trim() !== "") {
    filteredRDV = rdvs.filter((rdv) => {
      const matchSearch = `${rdv.client} ${rdv.vehicule} ${rdv.immatriculation} ${rdv.telephone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const typeField = getTypeIntervention(rdv);
      const matchType = selectedType === "tous" || typeField === selectedType;
      return matchSearch && matchType && rdv.deleted !== 1;
    });
  } else {
    filteredRDV = rdvs.filter((rdv) => {
      const typeField = getTypeIntervention(rdv);
      const matchType = selectedType === "tous" || typeField === selectedType;

      if (filteredMode === "previous") return matchType && rdv.date < todayDate && rdv.deleted !== 1;
      if (filteredMode === "next") return matchType && rdv.date > todayDate && rdv.deleted !== 1;

      return matchType && rdv.date === selectedDate && rdv.deleted !== 1;
    });
  }

  // Tri
  const sortedRDV = [...filteredRDV].sort((a, b) => {
    if (!sortConfig.key) {
      if (a.date >= todayDate && b.date >= todayDate)
        return new Date(a.date) - new Date(b.date);

      if (a.date < todayDate && b.date < todayDate)
        return new Date(b.date) - new Date(a.date);

      return a.date >= todayDate ? -1 : 1;
    }

    if (sortConfig.key === "etat") {
      const order = { en_attente: 0, termine: 1 };
      const valA = order[a.etat] ?? 0;
      const valB = order[b.etat] ?? 0;
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    }

    if (sortConfig.key === "tarif") {
      return sortConfig.direction === "asc"
        ? (a.tarif || 0) - (b.tarif || 0)
        : (b.tarif || 0) - (a.tarif || 0);
    }

    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

    const valA = a[sortConfig.key] ?? "";
    const valB = b[sortConfig.key] ?? "";
    return sortConfig.direction === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const renderSortIcon = (key) =>
    sortConfig.key === key ? (
      sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />
    ) : null;

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

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const showAllPreviousDays = () => {
    setFilteredMode("previous");
    setSelectedDate("");
  };

  const showAllNextDays = () => {
    setFilteredMode("next");
    setSelectedDate("");
  };

  const goToToday = () => {
    setFilteredMode(null);
    setSelectedDate(todayDate);
  };

  const resetFilter = () => {
    setSearch("");
    setSelectedType("tous");
    setFilteredMode(null);
    setSelectedDate(todayDate);
    setSortConfig({ key: null, direction: "asc" });
  };

  /* Paiement */
  const openPaiementModal = (rdv, moyen) => {
    setSelectedRdv(rdv);
    setSelectedPaiement(moyen);
    setConfirmModal(true);
  };

  const confirmPaiement = async () => {
    await fetch(`https://garage-rdv-app-4.onrender.com/api/rdv/${selectedRdv.id}/terminer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moyenPaiement: selectedPaiement })
    });

    fetchRDV();
    setConfirmModal(false);
  };

  /* suppression */
  const openDeleteModal = (rdv) => {
    setSelectedRdv(rdv);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    await fetch(`https://garage-rdv-app-4.onrender.com/api/rdv/${selectedRdv.id}/supprimer`, {
      method: "PATCH"
    });
    fetchRDV();
    setDeleteModal(false);
  };

  /* ======= Rendu mobile ======= */
  const renderMobileList = () => (
    <div>
      {sortedRDV.map((rdv) => (
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
                {rdv.telephone || "-"}
              </Col>
              <Col xs={6} className="text-end">
                <small className="text-muted d-block">Tarif</small>
                {rdv.tarif != null ? `${rdv.tarif} €` : "-"}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={6}>
                <small className="text-muted d-block">Pris par</small>
                {getPrisPar(rdv) || "-"}
              </Col>
              <Col xs={6} className="text-end">
                <small className="text-muted d-block">État</small>
                {rdv.etat === "termine" ? (
                  <Badge bg="success">Payé ({getMoyenPaiement(rdv)})</Badge>
                ) : (
                  <Badge bg="warning" text="dark">En attente</Badge>
                )}
              </Col>
            </Row>

            {rdv.etat !== "termine" ? (
              <div className="d-grid gap-2 mt-2">
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-fill"
                    onClick={() => openPaiementModal(rdv, "espèces")}
                  >
                    <FaMoneyBillWave className="me-1" /> Espèces
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    className="flex-fill"
                    onClick={() => openPaiementModal(rdv, "carte bleue")}
                  >
                    <FaCreditCard className="me-1" /> Carte
                  </Button>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    className="flex-fill"
                    onClick={() => setEditModalRdv(rdv)}
                  >
                    <FaPencilAlt />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="flex-fill"
                    onClick={() => openDeleteModal(rdv)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted mt-2">—</div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  /* ======= Rendu desktop ======= */
  const renderDesktopTable = () => (
    <Table bordered hover responsive className="text-center">
      <thead>
        <tr>
          <th onClick={() => handleSort("vehicule")}>Véhicule {renderSortIcon("vehicule")}</th>
          <th onClick={() => handleSort("immatriculation")}>Immatriculation {renderSortIcon("immatriculation")}</th>
          <th onClick={() => handleSort("client")}>Client {renderSortIcon("client")}</th>
          <th>Téléphone</th>
          <th style={{ width: 320 }}>Intervention</th>
          <th onClick={() => handleSort("tarif")}>Tarif (€) {renderSortIcon("tarif")}</th>
          <th onClick={() => handleSort("date")}>Date {renderSortIcon("date")}</th>
          <th>Type</th>
          <th>Pris par</th>
          <th onClick={() => handleSort("etat")}>État {renderSortIcon("etat")}</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {sortedRDV.map((rdv) => (
          <tr key={rdv.id} className={rdv.etat === "termine" ? "table-success" : ""}>
            <td>{rdv.vehicule}</td>
            <td>{rdv.immatriculation}</td>
            <td>{rdv.client}</td>
            <td>{rdv.telephone || "-"}</td>
            <td><AutoGrowTextarea value={rdv.intervention} /></td>
            <td>{rdv.tarif != null ? `${rdv.tarif} €` : "-"}</td>
            <td>{rdv.date}</td>
            <td>{renderBadge(getTypeIntervention(rdv))}</td>
            <td>{getPrisPar(rdv) || "-"}</td>
            <td>
              {rdv.etat === "termine" ? (
                <Badge bg="success">Payé ({getMoyenPaiement(rdv)})</Badge>
              ) : (
                <Badge bg="warning" text="dark">En attente</Badge>
              )}
            </td>
            <td>
              {rdv.etat !== "termine" ? (
                <div className="d-grid gap-1">
                  <div className="d-flex gap-1">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openPaiementModal(rdv, "espèces")}
                    >
                      <FaMoneyBillWave className="me-1" /> Espèces
                    </Button>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => openPaiementModal(rdv, "carte bleue")}
                    >
                      <FaCreditCard className="me-1" /> Carte
                    </Button>
                  </div>

                  <div className="d-flex gap-1">
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => setEditModalRdv(rdv)}
                    >
                      <FaPencilAlt />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openDeleteModal(rdv)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ) : (
                <span className="text-muted">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Container fluid className="p-3 p-md-4">

      {/* 🔵 AJOUT DU BOUTON RAFRAÎCHIR ICI */}
      <Button
        className="mb-3 w-100 btn-refresh"
        variant="outline-success"
        onClick={fetchRDV}
      >
        🔄 Rafraîchir les rendez-vous
      </Button>

      <Button
        className="mb-3 w-100 app-header-button"
        onClick={() => setModalOpen(true)}
      >
        Prendre un rendez-vous
      </Button>

      {/* Modal ajout */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un rendez-vous</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormulaireAjout
            onAdded={() => {
              fetchRDV();
              setModalOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Modal édition */}
      {editModalRdv && (
        <ModalEditionRDV
          rdv={editModalRdv}
          onClose={() => setEditModalRdv(null)}
          onUpdated={() => {
            fetchRDV();
            setEditModalRdv(null);
          }}
        />
      )}

      {/* Modal paiement */}
      <Modal show={confirmModal} onHide={() => setConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Confirmer le paiement <strong>{selectedPaiement}</strong> pour{" "}
          <strong>{selectedRdv?.client}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>Annuler</Button>
          <Button variant="success" onClick={confirmPaiement}>Confirmer</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal suppression */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Voulez-vous vraiment supprimer le rendez-vous de{" "}
          <strong>{selectedRdv?.client}</strong> prévu le{" "}
          <strong>{selectedRdv?.date}</strong> ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>

      {/* Corps du tableau */}
      <Card className="app-card">
        <Card.Body>
          <Card.Title className="mb-3 app-section-title">
            Liste des rendez-vous
          </Card.Title>

          <Row className="mb-3 g-2">
            <Col md={6}>
              <Form.Control
                placeholder="Nom, véhicule, immatriculation ou téléphone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Button className="w-100" variant="dark" onClick={resetFilter}>
                Réinitialiser
              </Button>
            </Col>
          </Row>

          <Row className="mb-3 g-2">
            <Col xs={12} md={4}>
              <Button variant="outline-primary" className="w-100" onClick={showAllPreviousDays}>
                ← Tous les jours précédents
              </Button>
            </Col>

            <Col xs={12} md={4}>
              <Button variant="outline-secondary" className="w-100" onClick={goToToday}>
                Aujourd'hui
              </Button>
            </Col>

            <Col xs={12} md={4}>
              <Button variant="outline-primary" className="w-100" onClick={showAllNextDays}>
                Tous les jours suivants →
              </Button>
            </Col>
          </Row>

          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <Button
              variant={selectedType === "diagnostic" ? "info" : "outline-info"}
              className="w-100"
              onClick={() => setSelectedType("diagnostic")}
            >
              Diagnostic
            </Button>

            <Button
              variant={selectedType === "mecanique" ? "warning" : "outline-warning"}
              className="w-100"
              onClick={() => setSelectedType("mecanique")}
            >
              Mécanique
            </Button>

            <Button
              variant={selectedType === "tous" ? "dark" : "outline-dark"}
              className="w-100"
              onClick={() => setSelectedType("tous")}
            >
              Tous
            </Button>
          </div>

          {isMobile ? renderMobileList() : renderDesktopTable()}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default App;
