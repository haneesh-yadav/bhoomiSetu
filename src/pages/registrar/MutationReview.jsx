import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMutationRequests } from "../../database/Transfers";
import Navbar2 from "../../components/Navbar2";

const MUTATION_META = {
  Inheritance:   { icon: "science",    color: "#5B4FD4", tabBg: "#5B4FD4", tabColor: "#fff"    },
  Correction:    { icon: "straighten", color: "#2EC4A0", tabBg: "#2EC4A0", tabColor: "#0D3D2B" },
  Partition:     { icon: "call_split", color: "#F07060", tabBg: "#F07060", tabColor: "#fff"    },
  "Name Change": { icon: "badge",      color: "#C8F135", tabBg: "#C8F135", tabColor: "#0D3D2B" },
};

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
  .mr2-page {
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
  .mr2-header {
    background: #fff;
    border-bottom: 2px solid rgba(13, 61, 43, 0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .mr2-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .mr2-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
  }

  .mr2-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }

  .mr2-page-sub {
    font-size: 0.78rem;
    color: rgba(13, 61, 43, 0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Content ── */
  .mr2-content { padding: 1.5rem 1.5rem 3rem; }

  .mr2-sec-lbl {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.85rem;
  }

  /* ── Mutation list ── */
  .mr2-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Mutation card ── */
  .mr2-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
    animation: fadeUp 0.4s ease both;
  }

  .mr2-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .mr2-card-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .mr2-card-tab {
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

  .mr2-card-body { padding: 1.1rem 1.25rem; }

  .mr2-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .mr2-card-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: rgba(13, 61, 43, 0.35);
  }

  .mr2-card-status {
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 800;
    border: 1.5px solid;
  }

  .mr2-card-type {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }

  .mr2-card-prop {
    font-size: 0.78rem;
    color: rgba(13, 61, 43, 0.5);
    margin-bottom: 0.35rem;
  }

  .mr2-card-reason {
    font-size: 0.75rem;
    color: rgba(13, 61, 43, 0.45);
    line-height: 1.4;
  }

  .mr2-card-footer {
    border-top: 1.5px solid rgba(13, 61, 43, 0.08);
    padding: 0.55rem 1.25rem;
    display: flex;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .mr2-card-filer { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }

  .mr2-card-docs { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .mr2-card-docs span { background: rgba(13, 61, 43, 0.06); border-radius: 4px; padding: 1px 6px; font-weight: 700; }

  /* ── Detail view ── */
  .mr2-detail-view { animation: slideIn 0.25s ease both; }

  .mr2-back-btn {
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

  .mr2-back-btn .material-icons-sharp { font-size: 15px; }
  .mr2-back-btn:hover { background: #0D3D2B; color: #C8F135; border-color: #0D3D2B; }

  .mr2-detail {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }

  .mr2-detail-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 6px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .mr2-detail-tab {
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

  .mr2-detail-body { padding: 1.25rem; }

  /* ── Type banner ── */
  .mr2-type-banner {
    border-radius: 10px;
    padding: 0.85rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    border: 1.5px solid rgba(13,61,43,0.1);
  }

  .mr2-type-icon {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    border: 1.5px solid rgba(13,61,43,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(13,61,43,0.08);
  }

  .mr2-type-name { font-size: 0.95rem; font-weight: 800; color: #0D3D2B; }

  .mr2-type-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: rgba(13, 61, 43, 0.4);
    margin-top: 0.1rem;
  }

  /* ── Info rows ── */
  .mr2-info-rows {
    display: flex;
    flex-direction: column;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .mr2-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0.85rem;
  }

  .mr2-info-row:not(:last-child) { border-bottom: 1px solid rgba(13, 61, 43, 0.07); }
  .mr2-info-lbl { font-size: 0.62rem; color: rgba(13, 61, 43, 0.45); font-weight: 600; }
  .mr2-info-val { font-size: 0.75rem; font-weight: 700; color: #0D3D2B; }

  /* ── Reason box ── */
  .mr2-reason-box {
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 9px;
    padding: 0.85rem;
    background: rgba(13,61,43,0.02);
    margin-bottom: 1rem;
  }

  .mr2-reason-lbl {
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.38);
    margin-bottom: 0.35rem;
  }

  .mr2-reason-text {
    font-size: 0.8rem;
    color: rgba(13, 61, 43, 0.65);
    line-height: 1.55;
  }

  /* ── Documents ── */
  .mr2-docs-lbl {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .mr2-docs-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .mr2-doc-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.45rem 0.75rem;
    border: 1.5px solid rgba(13, 61, 43, 0.1);
    border-radius: 7px;
    background: rgba(13,61,43,0.02);
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .mr2-doc-item:hover { border-color: #2EC4A0; }
  .mr2-doc-name { font-size: 0.75rem; font-weight: 700; color: #0D3D2B; flex: 1; }
  .mr2-doc-view { font-size: 0.62rem; font-weight: 800; color: #2EC4A0; }

  /* ── Notes ── */
  .mr2-notes-lbl {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .mr2-notes-input {
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 2px solid rgba(13, 61, 43, 0.18);
    border-radius: 8px;
    background: rgba(13,61,43,0.02);
    color: #0D3D2B;
    font-size: 0.8rem;
    font-family: inherit;
    resize: vertical;
    min-height: 70px;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 1rem;
  }

  .mr2-notes-input:focus { border-color: #0D3D2B; }
  .mr2-notes-input::placeholder { color: rgba(13, 61, 43, 0.32); }

  /* ── Actions ── */
  .mr2-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mr2-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 10px;
    font-size: 0.85rem;
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

  .mr2-btn:hover    { opacity: 0.88; transform: translateY(-1px); }
  .mr2-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .mr2-btn-approve { background: #2EC4A0; color: #0D3D2B; border-color: #2EC4A0; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .mr2-btn-query   { background: #C8F135; color: #0D3D2B; border-color: #0D3D2B; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .mr2-btn-reject  { background: #fff; color: #F07060; border-color: #F07060; }

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
  .mr2-actioned {
    text-align: center;
    padding: 1.5rem 1rem;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    background: rgba(13,61,43,0.02);
  }

  .mr2-actioned-icon  { margin-bottom: 0.5rem; display: flex; justify-content: center; }
  .mr2-actioned-title { font-size: 0.92rem; font-weight: 800; color: #0D3D2B; }

  .mr2-actioned-sub {
    font-size: 0.72rem;
    color: rgba(13, 61, 43, 0.45);
    margin-top: 0.3rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .mr2-actioned-btn {
    padding: 0.6rem 1.25rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    background: #2EC4A0;
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
    .mr2-content { padding: 1.25rem 1rem 3rem; }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 10px; }
  }
`;

export default function MutationReview() {
  const { user, logout } = useAuth();

  const [detailView, setDetailView] = useState(null);
  const [notes, setNotes]           = useState("");
  const [loading, setLoading]       = useState(null);
  const [decisions, setDecisions]   = useState({});

  const mutations = getMutationRequests();

  const doAction = async (action) => {
    setLoading(action);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(null);
    setDecisions(d => ({ ...d, [detailView?.id]: action }));
    setNotes("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mr2-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="page-container">

          {/* Header */}
          <div className="mr2-header">
            <div className="mr2-header-left">
              <span className="mr2-page-label">MUTATION REVIEW</span>
              <span className="mr2-page-title">Mutation Review</span>
              <span className="mr2-page-sub">Approve or query pending mutation requests</span>
            </div>
          </div>

          {/* Content */}
          <div className="mr2-content">
            {detailView ? (
              /* Detail view */
              <div className="mr2-detail-view">
                <button className="mr2-back-btn" onClick={() => setDetailView(null)}>
                  <span className="material-icons-sharp">arrow_back</span>
                  Back to Requests
                </button>

                <div className="mr2-detail">
                  <div className="mr2-detail-chrome">
                    <div className="mr2-detail-tab" style={{ background: "#2EC4A0", color: "#0D3D2B", minWidth: 100 }}>
                      {detailView.id}
                    </div>
                    <div className="mr2-detail-tab" style={{ background: "#C8F135", color: "#0D3D2B", minWidth: 70 }}>
                      REVIEW
                    </div>
                  </div>

                  <div className="mr2-detail-body">
                    {(() => {
                      const meta = MUTATION_META[detailView.type] || MUTATION_META["Inheritance"];
                      return (
                        <div className="mr2-type-banner" style={{ background: `${meta.color}15` }}>
                          <div className="mr2-type-icon" style={{ background: `${meta.color}25` }}>
                            <span className="material-icons-sharp" style={{ fontSize: 20, color: meta.color }}>
                              {meta.icon}
                            </span>
                          </div>
                          <div>
                            <div className="mr2-type-name">{detailView.type} Request</div>
                            <div className="mr2-type-id">{detailView.id}</div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="mr2-info-rows">
                      {[
                        { label: "Property",    value: detailView.propertyTitle },
                        { label: "Property ID", value: detailView.propertyId    },
                        { label: "Filed By",    value: detailView.filer         },
                        { label: "Submitted",   value: detailView.submittedOn   },
                        { label: "Status",      value: detailView.status        },
                      ].map((r, i) => (
                        <div key={i} className="mr2-info-row">
                          <span className="mr2-info-lbl">{r.label}</span>
                          <span className="mr2-info-val">{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mr2-reason-box">
                      <div className="mr2-reason-lbl">STATED REASON</div>
                      <div className="mr2-reason-text">{detailView.reason}</div>
                    </div>

                    {detailView.documents?.length > 0 && (
                      <>
                        <div className="mr2-docs-lbl">SUPPORTING DOCUMENTS ({detailView.documents.length})</div>
                        <div className="mr2-docs-list">
                          {detailView.documents.map((d, i) => (
                            <div key={i} className="mr2-doc-item">
                              <span className="material-icons-sharp" style={{ fontSize: 18, color: "rgba(13,61,43,0.4)" }}>
                                description
                              </span>
                              <span className="mr2-doc-name">{d}</span>
                              <span className="mr2-doc-view">View</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {decisions[detailView.id] ? (
                      <div className="mr2-actioned">
                        <div className="mr2-actioned-icon">
                          <span
                            className="material-icons-sharp"
                            style={{
                              fontSize: 36,
                              color:
                                decisions[detailView.id] === "approve" ? "#2EC4A0" :
                                decisions[detailView.id] === "reject"  ? "#F07060" : "#5B4FD4",
                            }}
                          >
                            {decisions[detailView.id] === "approve" ? "check_circle" :
                             decisions[detailView.id] === "reject"  ? "cancel" : "help"}
                          </span>
                        </div>
                        <div className="mr2-actioned-title">
                          {decisions[detailView.id] === "approve" ? "Mutation Approved" :
                           decisions[detailView.id] === "reject"  ? "Mutation Rejected" : "Clarification Requested"}
                        </div>
                        <div className="mr2-actioned-sub">
                          {decisions[detailView.id] === "approve" ? "Land records updated." : "Notification sent to applicant."}
                        </div>
                        <button className="mr2-actioned-btn" onClick={() => setDetailView(null)}>
                          Back to Requests
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mr2-notes-lbl">REGISTRAR NOTES</div>
                        <textarea
                          className="mr2-notes-input"
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Add remarks or reason for decision..."
                        />
                        <div className="mr2-actions">
                          <button
                            className="mr2-btn mr2-btn-approve"
                            onClick={() => doAction("approve")}
                            disabled={!!loading}
                          >
                            {loading === "approve" ? (
                              <><span className="spinner" /> Approving...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>check_circle</span> Approve Mutation</>
                            )}
                          </button>
                          <button
                            className="mr2-btn mr2-btn-query"
                            onClick={() => doAction("query")}
                            disabled={!!loading}
                          >
                            {loading === "query" ? (
                              <><span className="spinner" /> Sending...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>help</span> Request Clarification</>
                            )}
                          </button>
                          <button
                            className="mr2-btn mr2-btn-reject"
                            onClick={() => doAction("reject")}
                            disabled={!!loading}
                          >
                            {loading === "reject" ? (
                              <><span className="spinner" /> Rejecting...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>cancel</span> Reject Mutation</>
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
              <div>
                <div className="mr2-sec-lbl">MUTATION REQUESTS ({mutations.length})</div>
                <div className="mr2-list">
                  {mutations.map((m, i) => {
                    const meta = MUTATION_META[m.type] || MUTATION_META["Inheritance"];
                    const dec  = decisions[m.id];
                    return (
                      <div
                        key={m.id}
                        className="mr2-card"
                        style={{ animationDelay: `${i * 0.08}s` }}
                        onClick={() => setDetailView(m)}
                      >
                        <div className="mr2-card-chrome">
                          <div className="mr2-card-tab" style={{ background: meta.tabBg, color: meta.tabColor, minWidth: 100 }}>
                            <span className="material-icons-sharp" style={{ fontSize: 14, marginRight: 4, verticalAlign: "middle" }}>
                              {meta.icon}
                            </span>
                            {m.type}
                          </div>
                          {dec && (
                            <div
                              className="mr2-card-tab"
                              style={{
                                background: dec === "approve" ? "#2EC4A0" : dec === "reject" ? "#F07060" : "#C8F135",
                                color: "#0D3D2B",
                                marginLeft: 4,
                              }}
                            >
                              {dec === "approve" ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>check</span>Approved</>
                              ) : dec === "reject" ? (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>close</span>Rejected</>
                              ) : (
                                <><span className="material-icons-sharp" style={{ fontSize: 12, verticalAlign: "middle", marginRight: 2 }}>help</span>Queried</>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mr2-card-body">
                          <div className="mr2-card-meta">
                            <span className="mr2-card-id">{m.id}</span>
                            <span
                              className="mr2-card-status"
                              style={{ background: `${m.statusColor}15`, color: m.statusColor, borderColor: `${m.statusColor}40` }}
                            >
                              {dec ? (dec === "approve" ? "Approved" : dec === "reject" ? "Rejected" : "Queried") : m.status}
                            </span>
                          </div>
                          <div className="mr2-card-type">{m.type} Request</div>
                          <div className="mr2-card-prop">{m.propertyTitle} · {m.propertyId}</div>
                          <div className="mr2-card-reason">{m.reason}</div>
                        </div>
                        <div className="mr2-card-footer">
                          <span className="mr2-card-filer">Filed by {m.filer}</span>
                          <span className="mr2-card-docs"><span>{m.documents?.length || 0}</span> docs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
