import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPendingApprovals, getCompletedApprovals } from "../../database/Transfers";
import Navbar2 from "../../components/Navbar2";

const FILTERS    = ["All", "High Priority", "Normal", "Completed"];
const TYPE_ICONS = { Residential: "home", Agricultural: "grass", Commercial: "store" };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #EFEFEB; }
  ::-webkit-scrollbar-thumb { background: #0D3D2B; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  @keyframes spin {
    from { transform: rotate(0); }
    to   { transform: rotate(360deg); }
  }

  /* ── Page shell ── */
  .aq-page {
    font-family: 'Poppins', sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  /* ── Page container ── */
  .page-container {
    margin: 1.5rem 2rem 2rem;
    border-radius: 20px;
    overflow: hidden;
    border: 1.5px solid rgba(13,61,43,0.12);
    box-shadow: 0 4px 6px rgba(13,61,43,0.04), 0 20px 40px rgba(13,61,43,0.08);
    background: #f7f7f3;
    position: relative;
    z-index: 2;
  }

  /* ── Header ── */
  .aq-header {
    background: #fff;
    border-bottom: 2px solid rgba(13, 61, 43, 0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .aq-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .aq-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .aq-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
  }

  .aq-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }

  .aq-page-sub {
    font-size: 0.78rem;
    color: rgba(13, 61, 43, 0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Filter tabs ── */
  .aq-filter-tabs {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .aq-filter-tab {
    padding: 0.35rem 0.85rem;
    border: 1.5px solid rgba(13, 61, 43, 0.18);
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(13, 61, 43, 0.5);
    background: #fff;
    font-family: 'Poppins', sans-serif;
    transition: all 0.18s;
  }

  .aq-filter-tab:hover { border-color: #0D3D2B; }

  .aq-filter-active {
    background: #0D3D2B;
    color: #fff;
    border-color: #0D3D2B;
    font-weight: 700;
  }

  /* ── Toolbar ── */
  .aq-toolbar {
    background: rgba(13,61,43,0.02);
    border-bottom: 1.5px solid rgba(13, 61, 43, 0.1);
  }

  .aq-toolbar-inner {
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .aq-search-wrap {
    flex: 1;
    min-width: 200px;
    position: relative;
  }

  .aq-search-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    opacity: 0.3;
    pointer-events: none;
  }

  .aq-search {
    width: 100%;
    padding: 0.6rem 1rem 0.6rem 2.4rem;
    border: 2px solid rgba(13, 61, 43, 0.2);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    font-size: 0.85rem;
    font-family: inherit;
    color: #0D3D2B;
    outline: none;
    transition: border-color 0.2s;
  }

  .aq-search:focus { border-color: #0D3D2B; background: #fff; }
  .aq-search::placeholder { color: rgba(13, 61, 43, 0.32); }

  .aq-count {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(13, 61, 43, 0.4);
    white-space: nowrap;
  }

  /* ── Content ── */
  .aq-content { padding: 1.5rem 1.5rem 3rem; }

  /* ── Approval cards ── */
  .aq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .aq-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
    animation: fadeUp 0.4s ease both;
  }

  .aq-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .aq-card-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .aq-card-tab {
    height: 22px;
    border-radius: 5px 5px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 0.6rem;
    font-weight: 800;
  }

  .aq-card-body { padding: 1.1rem 1.25rem; }

  .aq-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
  }

  .aq-card-id { font-family: 'DM Mono', monospace; font-size: 0.6rem; color: rgba(13, 61, 43, 0.35); }

  .aq-pri-high   { background: #F07060; color: #fff; border-radius: 5px; padding: 2px 8px; font-size: 0.6rem; font-weight: 800; }
  .aq-pri-normal { background: #C8F135; color: #0D3D2B; border-radius: 5px; padding: 2px 8px; font-size: 0.6rem; font-weight: 800; border: 1.5px solid rgba(13,61,43,0.1); }

  .aq-card-title   { font-size: 0.92rem; font-weight: 800; color: #0D3D2B; margin-bottom: 0.2rem; }
  .aq-card-parties { font-size: 0.75rem; color: rgba(13, 61, 43, 0.5); margin-bottom: 0.7rem; }

  .aq-card-chips {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.4rem;
  }

  .aq-chip     { background: rgba(13,61,43,0.02); border: 1.5px solid rgba(13, 61, 43, 0.1); border-radius: 7px; padding: 0.4rem 0.6rem; }
  .aq-chip-lbl { font-size: 0.55rem; font-weight: 800; letter-spacing: 0.06em; color: rgba(13, 61, 43, 0.38); margin-bottom: 0.1rem; }
  .aq-chip-val { font-size: 0.75rem; font-weight: 700; color: #0D3D2B; }

  .aq-card-footer {
    border-top: 1.5px solid rgba(13, 61, 43, 0.08);
    padding: 0.55rem 1.25rem;
    display: flex;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .aq-card-date { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .aq-card-docs { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .aq-card-docs span { background: rgba(13, 61, 43, 0.06); border-radius: 4px; padding: 1px 6px; font-weight: 700; }

  /* ── Detail view ── */
  .aq-detail-view { animation: slideIn 0.25s ease both; }

  .aq-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.38rem 0.9rem;
    border: 2px solid rgba(13, 61, 43, 0.2);
    border-radius: 8px;
    background: #fff;
    color: #0D3D2B;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    margin-bottom: 1.25rem;
    box-shadow: 2px 2px 0 rgba(13, 61, 43, 0.1);
  }

  .aq-back-btn .material-icons-sharp { font-size: 15px; }
  .aq-back-btn:hover { background: #0D3D2B; color: #C8F135; border-color: #0D3D2B; }

  .aq-detail {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }

  .aq-detail-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 6px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .aq-detail-tab {
    height: 24px;
    border-radius: 6px 6px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 0.62rem;
    font-weight: 800;
  }

  .aq-detail-body { padding: 1.25rem; }

  .aq-detail-title {
    font-size: 1rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }

  .aq-detail-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: rgba(13, 61, 43, 0.35);
    margin-bottom: 1rem;
  }

  /* ── Parties ── */
  .aq-parties {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .aq-party {
    border: 2px solid rgba(13, 61, 43, 0.12);
    border-radius: 10px;
    padding: 0.85rem;
    background: rgba(13,61,43,0.02);
  }

  .aq-party-role    { font-size: 0.58rem; font-weight: 800; letter-spacing: 0.1em; color: rgba(13, 61, 43, 0.4); margin-bottom: 0.35rem; }
  .aq-party-name    { font-size: 0.85rem; font-weight: 800; color: #0D3D2B; margin-bottom: 0.15rem; }
  .aq-party-aadhaar { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }

  /* ── Info rows ── */
  .aq-info-rows {
    display: flex;
    flex-direction: column;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1.25rem;
  }

  .aq-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0.85rem;
  }

  .aq-info-row:not(:last-child) { border-bottom: 1px solid rgba(13, 61, 43, 0.07); }
  .aq-info-lbl { font-size: 0.65rem; color: rgba(13, 61, 43, 0.45); font-weight: 600; }
  .aq-info-val { font-size: 0.78rem; font-weight: 700; color: #0D3D2B; }

  /* ── Documents ── */
  .aq-docs-title {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.6rem;
  }

  .aq-docs-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }

  .aq-doc-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    border: 1.5px solid rgba(13, 61, 43, 0.1);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    cursor: pointer;
    transition: all 0.18s;
  }

  .aq-doc-item:hover { border-color: #5B4FD4; }
  .aq-doc-name { font-size: 0.78rem; font-weight: 700; color: #0D3D2B; flex: 1; }
  .aq-doc-view { font-size: 0.65rem; font-weight: 800; color: #5B4FD4; }

  /* ── Notes + actions ── */
  .aq-notes-title {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .aq-notes-input {
    width: 100%;
    padding: 0.65rem 0.85rem;
    border: 2px solid rgba(13, 61, 43, 0.18);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    color: #0D3D2B;
    font-size: 0.82rem;
    font-family: inherit;
    resize: vertical;
    min-height: 80px;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 1rem;
  }

  .aq-notes-input:focus { border-color: #0D3D2B; }
  .aq-notes-input::placeholder { color: rgba(13, 61, 43, 0.32); }

  .aq-actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .aq-btn {
    width: 100%;
    padding: 0.78rem;
    border-radius: 10px;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.18s;
    border: 2.5px solid;
  }

  .aq-btn:hover    { opacity: 0.88; transform: translateY(-1px); }
  .aq-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .aq-btn-approve { background: #2EC4A0; color: #0D3D2B; border-color: #2EC4A0; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .aq-btn-clarify { background: #C8F135; color: #0D3D2B; border-color: #0D3D2B; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .aq-btn-reject  { background: #fff; color: #F07060; border-color: #F07060; }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ── Actioned state ── */
  .aq-actioned {
    text-align: center;
    padding: 1.5rem 1rem;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    background: rgba(13,61,43,0.02);
  }

  .aq-actioned-icon  { margin-bottom: 0.5rem; display: flex; justify-content: center; }
  .aq-actioned-title { font-size: 0.92rem; font-weight: 800; color: #0D3D2B; }
  .aq-actioned-sub   { font-size: 0.72rem; color: rgba(13, 61, 43, 0.45); margin-top: 0.3rem; margin-bottom: 1rem; }

  .aq-actioned-btn {
    padding: 0.55rem 1.25rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.78rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 6px rgba(13,61,43,0.08);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .page-container { margin: 1rem; border-radius: 12px; }
    .aq-content { padding: 1.25rem 1rem 3rem; }
    .aq-toolbar-inner { padding: 0.85rem 1rem; }
    .aq-card-chips { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 10px; }
  }
`;

export default function ApprovalsQueue() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeFilter, setFilter]    = useState("All");
  const [search,       setSearch]    = useState("");
  const [detailView,   setDetailView]= useState(null);
  const [notes,        setNotes]     = useState("");
  const [loading,      setLoading]   = useState(null);
  const [actioned,     setActioned]  = useState({});

  const pending   = getPendingApprovals();
  const completed = getCompletedApprovals();
  const allItems  = [...pending, ...completed];

  const filtered = allItems.filter(t => {
    const matchFilter =
      activeFilter === "All"           ? true :
      activeFilter === "High Priority" ? t.priority === "High" :
      activeFilter === "Normal"        ? t.priority === "Normal" :
      activeFilter === "Completed"     ? (t.status === "Approved" || t.status === "Completed") : true;

    const q = search.toLowerCase();
    return matchFilter && (
      !q ||
      t.id.toLowerCase().includes(q) ||
      t.propertyTitle?.toLowerCase().includes(q) ||
      t.sellerName?.toLowerCase().includes(q) ||
      t.buyerName?.toLowerCase().includes(q)
    );
  });

  const doAction = async (action) => {
    setLoading(action);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(null);
    setActioned(a => ({ ...a, [detailView?.id]: action }));
    setNotes("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="aq-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="page-container">

          {/* Header */}
          <div className="aq-header">
            <div className="aq-header-left">
              <span className="aq-page-label">APPROVALS QUEUE</span>
              <span className="aq-page-title">Approvals Queue</span>
              <span className="aq-page-sub">Review and process pending transfer requests</span>
            </div>
            <div className="aq-header-right">
              <div className="aq-filter-tabs">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`aq-filter-tab ${activeFilter === f ? "aq-filter-active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(13,61,43,0.4)" }}>
                {filtered.length} pending
              </span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="aq-toolbar">
            <div className="aq-toolbar-inner">
              <div className="aq-search-wrap">
                <span className="aq-search-icon material-icons-sharp">search</span>
                <input
                  className="aq-search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by ID, property, seller or buyer..."
                />
              </div>
              <span className="aq-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Content */}
          <div className="aq-content">
            {detailView ? (
              /* Detail view */
              <div className="aq-detail-view">
                <button className="aq-back-btn" onClick={() => setDetailView(null)}>
                  <span className="material-icons-sharp">arrow_back</span>
                  Back to Queue
                </button>

                <div className="aq-detail">
                  <div className="aq-detail-chrome">
                    <div className="aq-detail-tab" style={{ background: "#5B4FD4", color: "#fff", minWidth: 100 }}>
                      {detailView.id}
                    </div>
                    <div className="aq-detail-tab" style={{ background: "#C8F135", color: "#0D3D2B", minWidth: 70 }}>
                      REVIEW
                    </div>
                  </div>

                  <div className="aq-detail-body">
                    <div className="aq-detail-title">{detailView.propertyTitle}</div>
                    <div className="aq-detail-id">{detailView.propertyId} · {detailView.surveyNo}</div>

                    <div className="aq-parties">
                      <div className="aq-party">
                        <div className="aq-party-role">SELLER</div>
                        <div className="aq-party-name">{detailView.sellerName}</div>
                        <div className="aq-party-aadhaar">{detailView.sellerAadhaar || "—"}</div>
                      </div>
                      <div className="aq-party">
                        <div className="aq-party-role">BUYER</div>
                        <div className="aq-party-name">{detailView.buyerName}</div>
                        <div className="aq-party-aadhaar">{detailView.buyerAadhaar || "—"}</div>
                      </div>
                    </div>

                    <div className="aq-info-rows">
                      {[
                        { label: "Sale Value", value: detailView.saleValue },
                        { label: "Area",       value: detailView.area      || "—" },
                        { label: "District",   value: detailView.district  || "—" },
                        { label: "Survey No.", value: detailView.surveyNo  || "—" },
                        { label: "Submitted",  value: detailView.submittedOn || detailView.completedOn },
                        { label: "Priority",   value: detailView.priority  || "—" },
                      ].map((r, i) => (
                        <div key={i} className="aq-info-row">
                          <span className="aq-info-lbl">{r.label}</span>
                          <span className="aq-info-val">{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="aq-docs-title">DOCUMENTS ({detailView.documents?.length || 0})</div>
                    <div className="aq-docs-list">
                      {(detailView.documents || []).map((d, i) => (
                        <div key={i} className="aq-doc-item">
                          <span className="material-icons-sharp" style={{ fontSize: 18, color: "rgba(13,61,43,0.4)" }}>
                            insert_drive_file
                          </span>
                          <span className="aq-doc-name">{d}</span>
                          <span className="aq-doc-view">View</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <button
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1.5px solid rgba(13,61,43,0.1)",
                          borderRadius: "10px",
                          background: "#0D3D2B",
                          color: "#C8F135",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          boxShadow: "3px 3px 0 rgba(13,61,43,0.3)",
                        }}
                        onClick={() => navigate(`/registrar/review/${detailView.id}`)}
                      >
                        <span className="material-icons-sharp" style={{ fontSize: 18 }}>manage_search</span>
                        Open Full Review
                      </button>
                    </div>

                    {actioned[detailView.id] ? (
                      <div className="aq-actioned">
                        <div className="aq-actioned-icon">
                          <span
                            className="material-icons-sharp"
                            style={{
                              fontSize: 36,
                              color:
                                actioned[detailView.id] === "approve" ? "#2EC4A0" :
                                actioned[detailView.id] === "reject"  ? "#F07060" : "#5B4FD4",
                            }}
                          >
                            {actioned[detailView.id] === "approve" ? "check_circle" :
                             actioned[detailView.id] === "reject"  ? "cancel" : "help"}
                          </span>
                        </div>
                        <div className="aq-actioned-title">
                          {actioned[detailView.id] === "approve" ? "Transfer Approved" :
                           actioned[detailView.id] === "reject"  ? "Transfer Rejected" : "Clarification Requested"}
                        </div>
                        <div className="aq-actioned-sub">Action recorded on blockchain ledger.</div>
                        <button
                          className="aq-actioned-btn"
                          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                          onClick={() => setDetailView(null)}
                        >
                          Back to Queue
                          <span className="material-icons-sharp" style={{ fontSize: 14 }}>arrow_forward</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="aq-notes-title">NOTES / REASON</div>
                        <textarea
                          className="aq-notes-input"
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Add notes, remarks or reason for rejection..."
                        />
                        <div className="aq-actions">
                          <button
                            className="aq-btn aq-btn-approve"
                            onClick={() => doAction("approve")}
                            disabled={!!loading}
                          >
                            {loading === "approve" ? (
                              <><span className="spinner" /> Approving...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>check_circle</span> Approve Transfer</>
                            )}
                          </button>
                          <button
                            className="aq-btn aq-btn-clarify"
                            onClick={() => doAction("clarify")}
                            disabled={!!loading}
                          >
                            {loading === "clarify" ? (
                              <><span className="spinner" /> Sending...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>edit_note</span> Request Clarification</>
                            )}
                          </button>
                          <button
                            className="aq-btn aq-btn-reject"
                            onClick={() => doAction("reject")}
                            disabled={!!loading}
                          >
                            {loading === "reject" ? (
                              <><span className="spinner" /> Rejecting...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>cancel</span> Reject Transfer</>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* List view */
              <div className="aq-list">
                {filtered.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "rgba(13,61,43,0.4)", fontSize: "0.88rem" }}>
                    No results found.
                  </div>
                ) : (
                  filtered.map((t, i) => {
                    const done = actioned[t.id];
                    return (
                      <div
                        key={t.id}
                        className="aq-card"
                        style={{ animationDelay: `${i * 0.06}s` }}
                        onClick={() => setDetailView(t)}
                      >
                        <div className="aq-card-chrome">
                          <div
                            className="aq-card-tab"
                            style={{
                              background: t.priority === "High" ? "#F07060" : "#C8F135",
                              color: t.priority === "High" ? "#fff" : "#0D3D2B",
                              minWidth: 80,
                            }}
                          >
                            <span className="material-icons-sharp" style={{ fontSize: 14, marginRight: 4, verticalAlign: "middle" }}>
                              {TYPE_ICONS[t.type] || "home"}
                            </span>
                            {t.type || "Transfer"}
                          </div>
                          {done && (
                            <div
                              className="aq-card-tab"
                              style={{
                                background: done === "approve" ? "#2EC4A0" : done === "reject" ? "#F07060" : "#C8F135",
                                color: "#0D3D2B",
                                marginLeft: 4,
                              }}
                            >
                              {done === "approve" ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>check</span>Approved</>
                              ) : done === "reject" ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>close</span>Rejected</>
                              ) : (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>help</span>Clarify</>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="aq-card-body">
                          <div className="aq-card-meta">
                            <span className="aq-card-id">{t.id}</span>
                            <span className={t.priority === "High" ? "aq-pri-high" : "aq-pri-normal"}>{t.priority}</span>
                          </div>
                          <div className="aq-card-title">{t.propertyTitle}</div>
                          <div className="aq-card-parties">{t.sellerName} → {t.buyerName}</div>
                          <div className="aq-card-chips">
                            <div className="aq-chip"><div className="aq-chip-lbl">AREA</div><div className="aq-chip-val">{t.area || "—"}</div></div>
                            <div className="aq-chip"><div className="aq-chip-lbl">DISTRICT</div><div className="aq-chip-val">{t.district || "—"}</div></div>
                            <div className="aq-chip"><div className="aq-chip-lbl">VALUE</div><div className="aq-chip-val">{t.saleValue}</div></div>
                          </div>
                        </div>
                        <div className="aq-card-footer">
                          <span className="aq-card-date">Submitted {t.submittedOn || t.completedOn}</span>
                          <span className="aq-card-docs"><span>{t.documents?.length || 0}</span> docs</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
