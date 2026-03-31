import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getRegistrarDisputes } from "../../database/Transfers";
import Navbar2 from "../../components/Navbar2";

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
  .dm-page {
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
  .dm-header {
    background: #fff;
    border-bottom: 2px solid rgba(13, 61, 43, 0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .dm-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .dm-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
  }

  .dm-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }

  .dm-page-sub {
    font-size: 0.78rem;
    color: rgba(13, 61, 43, 0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Content ── */
  .dm-content {
    padding: 1.5rem 1.5rem 3rem;
  }

  /* ── Dispute list ── */
  .dm-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Dispute card ── */
  .dm-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: transform 0.18s, box-shadow 0.18s;
    animation: fadeUp 0.4s ease both;
  }

  .dm-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }

  .dm-card-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .dm-card-tab {
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

  .dm-card-body { padding: 1.1rem 1.25rem; }

  .dm-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .dm-card-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    color: rgba(13, 61, 43, 0.35);
  }

  .dm-pri-high {
    background: #F07060;
    color: #fff;
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 800;
  }

  .dm-pri-normal {
    background: #C8F135;
    color: #0D3D2B;
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 800;
    border: 1.5px solid rgba(13,61,43,0.1);
  }

  .dm-card-type {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }

  .dm-card-prop {
    font-size: 0.78rem;
    color: rgba(13, 61, 43, 0.5);
    margin-bottom: 0.35rem;
  }

  .dm-card-desc {
    font-size: 0.75rem;
    color: rgba(13, 61, 43, 0.5);
    line-height: 1.45;
  }

  .dm-card-footer {
    border-top: 1.5px solid rgba(13, 61, 43, 0.08);
    padding: 0.55rem 1.25rem;
    display: flex;
    justify-content: space-between;
    background: rgba(13,61,43,0.02);
  }

  .dm-card-filer { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }
  .dm-card-date  { font-size: 0.62rem; color: rgba(13, 61, 43, 0.4); }

  .dm-card-status {
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 800;
    border: 1.5px solid;
  }

  /* ── Detail view ── */
  .dm-detail-view { animation: slideIn 0.25s ease both; }

  .dm-back-btn {
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

  .dm-back-btn .material-icons-sharp { font-size: 15px; }
  .dm-back-btn:hover { background: #0D3D2B; color: #C8F135; border-color: #0D3D2B; }

  .dm-detail {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }

  .dm-detail-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 6px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }

  .dm-detail-tab {
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

  .dm-detail-body { padding: 1.25rem; }

  .dm-detail-type {
    font-size: 1rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }

  .dm-detail-id {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: rgba(13, 61, 43, 0.35);
    margin-bottom: 1rem;
  }

  /* ── Info rows ── */
  .dm-info-rows {
    display: flex;
    flex-direction: column;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .dm-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0.85rem;
  }

  .dm-info-row:not(:last-child) { border-bottom: 1px solid rgba(13, 61, 43, 0.07); }
  .dm-info-lbl { font-size: 0.65rem; color: rgba(13, 61, 43, 0.45); font-weight: 600; }
  .dm-info-val { font-size: 0.78rem; font-weight: 700; color: #0D3D2B; }

  /* ── Description box ── */
  .dm-desc-box {
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    padding: 0.85rem;
    background: rgba(13,61,43,0.02);
    margin-bottom: 1rem;
  }

  .dm-desc-lbl {
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.38);
    margin-bottom: 0.35rem;
  }

  .dm-desc-text {
    font-size: 0.8rem;
    color: rgba(13, 61, 43, 0.65);
    line-height: 1.55;
  }

  /* ── Evidence ── */
  .dm-evidence-title {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .dm-evidence-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .dm-evidence-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem 0.75rem;
    border: 1.5px solid rgba(13, 61, 43, 0.1);
    border-radius: 7px;
    background: rgba(13,61,43,0.02);
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .dm-evidence-item:hover { border-color: #5B4FD4; }
  .dm-evidence-name { font-size: 0.75rem; font-weight: 700; color: #0D3D2B; flex: 1; }
  .dm-evidence-view { font-size: 0.65rem; font-weight: 800; color: #5B4FD4; }

  /* ── Resolution ── */
  .dm-resolution-title {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13, 61, 43, 0.4);
    margin-bottom: 0.5rem;
  }

  .dm-resolution-input {
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

  .dm-resolution-input:focus { border-color: #0D3D2B; }
  .dm-resolution-input::placeholder { color: rgba(13, 61, 43, 0.32); }

  /* ── Actions ── */
  .dm-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dm-btn {
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

  .dm-btn:hover    { opacity: 0.88; transform: translateY(-1px); }
  .dm-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .dm-btn-resolve     { background: #2EC4A0; color: #0D3D2B; border-color: #2EC4A0; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .dm-btn-investigate { background: #C8F135; color: #0D3D2B; border-color: #0D3D2B; box-shadow: 0 2px 8px rgba(13,61,43,0.06); }
  .dm-btn-dismiss     { background: #fff; color: #F07060; border-color: #F07060; }

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
  .dm-actioned {
    text-align: center;
    padding: 1.5rem 1rem;
    border: 2px solid rgba(13, 61, 43, 0.1);
    border-radius: 10px;
    background: rgba(13,61,43,0.02);
  }

  .dm-actioned-icon  { margin-bottom: 0.5rem; display: flex; justify-content: center; }
  .dm-actioned-title { font-size: 0.92rem; font-weight: 800; color: #0D3D2B; }

  .dm-actioned-sub {
    font-size: 0.72rem;
    color: rgba(13, 61, 43, 0.45);
    margin-top: 0.3rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .dm-actioned-btn {
    padding: 0.6rem 1.25rem;
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
    .dm-content { padding: 1.25rem 1rem 3rem; }
  }

  @media (max-width: 480px) {
    .page-container { margin: 0.65rem; border-radius: 10px; }
  }
`;

export default function DisputeManagement() {
  const { user, logout } = useAuth();

  const [detailView, setDetailView] = useState(null);
  const [resolution, setResolution] = useState("");
  const [loading, setLoading]       = useState(null);
  const [actioned, setActioned]     = useState({});

  const disputes = getRegistrarDisputes();

  const doAction = async (action) => {
    setLoading(action);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(null);
    setActioned(a => ({ ...a, [detailView?.id]: action }));
    setResolution("");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dm-page">
        <Navbar2 user={user} onLogout={logout} />

        <div className="page-container">

          {/* Header */}
          <div className="dm-header">
            <div className="dm-header-left">
              <span className="dm-page-label">DISPUTE MANAGEMENT</span>
              <span className="dm-page-title">Dispute Management</span>
              <span className="dm-page-sub">Investigate and resolve property ownership disputes</span>
            </div>
          </div>

          {/* Content */}
          <div className="dm-content">
            {detailView ? (
              /* Detail view */
              <div className="dm-detail-view">
                <button className="dm-back-btn" onClick={() => setDetailView(null)}>
                  <span className="material-icons-sharp">arrow_back</span>
                  Back to Disputes
                </button>

                <div className="dm-detail">
                  <div className="dm-detail-chrome">
                    <div className="dm-detail-tab" style={{ background: "#5B4FD4", color: "#fff", minWidth: 100 }}>
                      {detailView.id}
                    </div>
                    <div className="dm-detail-tab" style={{ background: "#C8F135", color: "#0D3D2B", minWidth: 70 }}>
                      REVIEW
                    </div>
                  </div>

                  <div className="dm-detail-body">
                    <div className="dm-detail-type">{detailView.type}</div>
                    <div className="dm-detail-id">{detailView.propertyId}</div>

                    <div className="dm-info-rows">
                      {[
                        { label: "Property", value: detailView.propertyTitle },
                        { label: "Filed By", value: detailView.filer },
                        { label: "Filed On", value: detailView.filedOn },
                        { label: "Priority", value: detailView.priority },
                        { label: "Status",   value: detailView.status },
                      ].map((r, i) => (
                        <div key={i} className="dm-info-row">
                          <span className="dm-info-lbl">{r.label}</span>
                          <span className="dm-info-val">{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="dm-desc-box">
                      <div className="dm-desc-lbl">DESCRIPTION</div>
                      <div className="dm-desc-text">{detailView.description}</div>
                    </div>

                    <div className="dm-evidence-title">EVIDENCE ({detailView.evidence?.length || 0})</div>
                    <div className="dm-evidence-list">
                      {(detailView.evidence || []).map((e, i) => (
                        <div key={i} className="dm-evidence-item">
                          <span className="material-icons-sharp" style={{ fontSize: 18, color: "rgba(13,61,43,0.45)" }}>
                            attach_file
                          </span>
                          <span className="dm-evidence-name">{e}</span>
                          <span className="dm-evidence-view">View</span>
                        </div>
                      ))}
                    </div>

                    {actioned[detailView.id] ? (
                      <div className="dm-actioned">
                        <div className="dm-actioned-icon">
                          <span
                            className="material-icons-sharp"
                            style={{
                              fontSize: 36,
                              color:
                                actioned[detailView.id] === "resolve"     ? "#2EC4A0" :
                                actioned[detailView.id] === "investigate" ? "#C8F135" : "#F07060",
                            }}
                          >
                            {actioned[detailView.id] === "resolve"     ? "check_circle" :
                             actioned[detailView.id] === "investigate" ? "policy" : "cancel"}
                          </span>
                        </div>
                        <div className="dm-actioned-title">
                          {actioned[detailView.id] === "resolve"     ? "Dispute Resolved" :
                           actioned[detailView.id] === "investigate" ? "Investigation Opened" : "Dispute Dismissed"}
                        </div>
                        <div className="dm-actioned-sub">Status updated. All parties have been notified.</div>
                        <button className="dm-actioned-btn" onClick={() => setDetailView(null)}>
                          Back to Disputes
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="dm-resolution-title">RESOLUTION NOTES</div>
                        <textarea
                          className="dm-resolution-input"
                          value={resolution}
                          onChange={e => setResolution(e.target.value)}
                          placeholder="Document your findings and resolution decision..."
                        />
                        <div className="dm-actions">
                          <button
                            className="dm-btn dm-btn-resolve"
                            onClick={() => doAction("resolve")}
                            disabled={!!loading}
                          >
                            {loading === "resolve" ? (
                              <><span className="spinner" /> Resolving...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>check_circle</span> Mark as Resolved</>
                            )}
                          </button>
                          <button
                            className="dm-btn dm-btn-investigate"
                            onClick={() => doAction("investigate")}
                            disabled={!!loading}
                          >
                            {loading === "investigate" ? (
                              <><span className="spinner" /> Opening...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>policy</span> Open Investigation</>
                            )}
                          </button>
                          <button
                            className="dm-btn dm-btn-dismiss"
                            onClick={() => doAction("dismiss")}
                            disabled={!!loading}
                          >
                            {loading === "dismiss" ? (
                              <><span className="spinner" /> Dismissing...</>
                            ) : (
                              <><span className="material-icons-sharp" style={{ fontSize: 16 }}>cancel</span> Dismiss Dispute</>
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
              <div className="dm-list">
                {disputes.map((d, i) => (
                  <div
                    key={i}
                    className="dm-card"
                    style={{ animationDelay: `${i * 0.08}s` }}
                    onClick={() => setDetailView(d)}
                  >
                    <div className="dm-card-chrome">
                      <div
                        className="dm-card-tab"
                        style={{ background: d.priority === "High" ? "#F07060" : "#5B4FD4", color: "#fff", minWidth: 100 }}
                      >
                        <span className="material-icons-sharp" style={{ fontSize: 13, marginRight: 4, verticalAlign: "middle" }}>
                          gavel
                        </span>
                        {d.type}
                      </div>
                    </div>
                    <div className="dm-card-body">
                      <div className="dm-card-meta">
                        <span className="dm-card-id">{d.id}</span>
                        <span className={d.priority === "High" ? "dm-pri-high" : "dm-pri-normal"}>{d.priority}</span>
                      </div>
                      <div className="dm-card-type">{d.type}</div>
                      <div className="dm-card-prop">{d.propertyTitle} · {d.propertyId}</div>
                      <div className="dm-card-desc">{d.description}</div>
                    </div>
                    <div className="dm-card-footer">
                      <span className="dm-card-filer">Filed by {d.filer}</span>
                      <span className="dm-card-date">{d.filedOn}</span>
                      <span
                        className="dm-card-status"
                        style={{ background: `${d.statusColor}15`, color: d.statusColor, borderColor: `${d.statusColor}50` }}
                      >
                        {d.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
