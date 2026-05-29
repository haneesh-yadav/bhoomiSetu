import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const MUTATION_TYPES = [
  {
    id: "inheritance",
    shortLabel: "Inheritance",
    icon: "family_restroom",
    desc: "Transfer ownership to legal heirs after the recorded owner's death.",
  },
  {
    id: "correction",
    shortLabel: "Survey Correction",
    icon: "straighten",
    desc: "Correct survey number, extent, or boundary details in revenue records.",
  },
  {
    id: "partition",
    shortLabel: "Partition",
    icon: "call_split",
    desc: "Divide a single registered parcel into separate sub-plots for co-owners.",
  },
  {
    id: "name_change",
    shortLabel: "Name Change",
    icon: "edit",
    desc: "Update the owner's name on revenue records after a legal name change.",
  },
];

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

function parseMutationLabel(reason) {
  if (!reason) return "Mutation request";
  const match = reason.match(/^\[([^\]]+)\]/);
  return match ? match[1] : reason.split(":")[0]?.trim() || "Mutation request";
}

function statusDisplay(status) {
  if (status === "PENDING")  return { text: "Under Review",        cls: "s-pending"  };
  if (status === "APPROVED") return { text: "Approved",            cls: "s-approved" };
  if (status === "REJECTED") return { text: "Rejected / Queried",  cls: "s-rejected" };
  return { text: status || "Submitted", cls: "s-pending" };
}

/* ══════════════════════════════════════════════════
   CSS — MyProperties design system
══════════════════════════════════════════════════ */
const MUTATION_LIST_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .mi {
    font-family: 'Material Icons Sharp';
    font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    user-select: none;
    font-feature-settings: 'liga';
    -webkit-font-feature-settings: 'liga';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* ── Page ── */
  .mm-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }
  .mm-main {
    display: flex; flex-direction: column; gap: 16px;
    padding: 16px 28px 56px;
    max-width: 1280px; margin: 0 auto;
    overflow-x: hidden; min-width: 0;
  }

  /* ── Top bar ── */
  .mm-topbar {
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    flex-wrap: wrap; gap: 10px;
  }
  .mm-heading { font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .mm-heading span { color: #e07a5f; }
  .mm-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .mm-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 6px 13px; font-size: 10.5px; font-weight: 600; color: #888;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .mm-meta-chip .mi { font-size: 13px; color: #e07a5f; }

  .mm-file-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 7px 16px; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .mm-file-btn:hover { background: #e07a5f; }
  .mm-file-btn .mi { font-size: 15px; }

  /* ── Stat strip ── */
  .mm-stats {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    display: grid; grid-template-columns: repeat(4, 1fr);
  }
  .mm-stat {
    padding: 16px 20px; cursor: default; transition: background 0.15s;
    display: flex; flex-direction: column; gap: 5px; background: #f9f9f7;
  }
  .mm-stat:not(:last-child) { border-right: 1.5px solid #eeeeec; }
  .mm-stat:hover { background: #f3f3f0; }
  .mm-stat-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #aaa; }
  .mm-stat-value { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: #e07a5f; }
  .mm-stat-value.warning { color: #d97706; }
  .mm-stat-value.danger  { color: #b91c1c; }

  /* ── Section card ── */
  .mm-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mm-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .mm-zone-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .mm-zone-title .mi { font-size: 17px; color: #e07a5f; }
  .mm-zone-title span { color: #e07a5f; }
  .mm-zone-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .mm-zone-pill.warning {
    background: rgba(217,119,6,0.12); color: #b45309;
    border-color: rgba(217,119,6,0.2);
  }

  /* ── Mutation rows ── */
  .mm-list { display: flex; flex-direction: column; }

  .mm-row {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 15px 20px;
    border-bottom: 1.5px solid #f0f0ee;
    transition: background 0.15s; cursor: default;
    animation: fadeUp 0.3s ease both;
  }
  .mm-row:last-child { border-bottom: none; }
  .mm-row:hover { background: #fafaf8; }

  .mm-icon-wrap {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: rgba(224,122,95,0.1);
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .mm-icon-wrap .mi { font-size: 18px; color: #e07a5f; }

  .mm-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .mm-id {
    font-family: 'DM Mono', monospace; font-size: 9.5px;
    font-weight: 500; color: #e07a5f; letter-spacing: 0.04em;
  }
  .mm-type { font-size: 13px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .mm-reason {
    font-size: 10.5px; color: #aaa; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .mm-prop-tag {
    display: inline-flex; align-items: center; gap: 4px; margin-top: 2px;
    font-size: 10px; font-weight: 600; color: #e07a5f;
  }
  .mm-prop-tag .mi { font-size: 12px; }

  .mm-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;
  }
  .mm-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; padding: 3px 10px;
    border-radius: 20px; white-space: nowrap;
  }
  .mm-status .dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .s-pending  { color: #b45309; background: rgba(217,119,6,0.12);  }
  .s-pending  .dot { background: #d97706; }
  .s-approved { color: #e07a5f; background: rgba(224,122,95,0.12); }
  .s-approved .dot { background: #e07a5f; }
  .s-rejected { color: #b91c1c; background: rgba(220,38,38,0.1);   }
  .s-rejected .dot { background: #dc2626; }

  .mm-meta {
    font-family: 'DM Mono', monospace; font-size: 9.5px;
    font-weight: 500; color: #bbb; text-align: right;
  }
  .mm-officer {
    font-size: 10px; font-weight: 600; color: #aaa; text-align: right; max-width: 160px;
  }

  /* ── Row divider line (between groups) ── */
  .mm-divider {
    height: 1px; background: #f0f0ee; margin: 0 20px;
  }

  /* ── Empty / zero state ── */
  .mm-empty-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mm-empty-header {
    padding: 13px 20px; background: #1a1a1a;
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .mm-empty-header .mi { font-size: 17px; color: #e07a5f; }
  .mm-empty-body {
    padding: 36px 24px; display: flex; flex-direction: column; align-items: center;
    gap: 10px; text-align: center;
  }
  .mm-empty-icon-wrap {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(224,122,95,0.08); border: 1.5px solid rgba(224,122,95,0.15);
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
  .mm-empty-icon-wrap .mi { font-size: 26px; color: #e07a5f; }
  .mm-empty-title { font-size: 15px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .mm-empty-sub   { font-size: 12px; color: #aaa; line-height: 1.7; max-width: 400px; }

  /* ── Type grid (empty state quick-start) ── */
  .mm-type-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    margin-top: 14px; width: 100%; max-width: 560px;
  }
  .mm-type-card {
    background: #f7f7f5; border: 1.5px solid #e0e0e0; border-radius: 16px;
    padding: 14px 12px; display: flex; flex-direction: column; align-items: center;
    gap: 6px; text-align: center; cursor: pointer; font-family: 'Poppins', sans-serif;
    transition: all 0.15s;
  }
  .mm-type-card:hover { border-color: #e07a5f; background: #fff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
  .mm-type-card .mi { font-size: 22px; color: #e07a5f; }
  .mm-type-label { font-size: 11px; font-weight: 700; color: #1a1a1a; }
  .mm-type-desc  { font-size: 9.5px; color: #aaa; line-height: 1.4; }

  /* ── Loading spinner ── */
  .mm-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 72px 20px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mm-spinner {
    width: 30px; height: 30px; border: 2.5px solid #e0e0e0;
    border-top-color: #e07a5f; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .mm-loading-text { font-size: 12px; font-weight: 600; color: #bbb; }

  @media (max-width: 768px) {
    .mm-main { padding: 12px 14px 48px; }
    .mm-stats { grid-template-columns: repeat(2, 1fr); }
    .mm-type-grid { grid-template-columns: repeat(2, 1fr); }
    .mm-row { flex-wrap: wrap; gap: 10px; }
    .mm-right { align-items: flex-start; }
  }
  @media (max-width: 480px) {
    .mm-type-grid { grid-template-columns: 1fr 1fr; }
  }
`;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function MyMutations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mutations, setMutations] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/mutations/my-mutations")
      .then(res => setMutations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  /* ── Derived stats ── */
  const total    = mutations.length;
  const pending  = mutations.filter(m => m.status === "PENDING").length;
  const approved = mutations.filter(m => m.status === "APPROVED").length;
  const rejected = mutations.filter(m => m.status === "REJECTED").length;

  return (
    <>
      <style>{MUTATION_LIST_STYLES}</style>

      <div className="mm-page">
        <div className="mm-main">

          {/* ══ TOP BAR ══ */}
          <div className="mm-topbar">
            <div className="mm-heading">
              My <span>Mutation Requests</span>
            </div>
            <div className="mm-topbar-right">
              <div className="mm-meta-chip">
                <MI name="edit_document" /> Revenue Record Updates
              </div>
              <button type="button" className="mm-file-btn" onClick={() => navigate("/user/mutation/file")}>
                <MI name="add" /> File new mutation
              </button>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="mm-stats">
            <div className="mm-stat">
              <div className="mm-stat-label">Total Filed</div>
              <div className="mm-stat-value">{total}</div>
            </div>
            <div className="mm-stat">
              <div className="mm-stat-label">Under Review</div>
              <div className={`mm-stat-value${pending > 0 ? " warning" : ""}`}>{pending}</div>
            </div>
            <div className="mm-stat">
              <div className="mm-stat-label">Approved</div>
              <div className="mm-stat-value">{approved}</div>
            </div>
            <div className="mm-stat">
              <div className="mm-stat-label">Rejected</div>
              <div className={`mm-stat-value${rejected > 0 ? " danger" : ""}`}>{rejected}</div>
            </div>
          </div>

          {/* ══ BODY ══ */}
          {loading ? (
            <div className="mm-loading">
              <div className="mm-spinner" />
              <div className="mm-loading-text">Loading your mutation requests…</div>
            </div>

          ) : mutations.length === 0 ? (
            <div className="mm-empty-zone">
              <div className="mm-empty-header">
                <MI name="edit_document" />
                Mutation Applications
              </div>
              <div className="mm-empty-body">
                <div className="mm-empty-icon-wrap">
                  <MI name="description" />
                </div>
                <div className="mm-empty-title">No mutation requests yet</div>
                <div className="mm-empty-sub">
                  You have not filed any revenue record mutation requests yet. Choose a mutation
                  type below to begin an official application.
                </div>
                <div className="mm-type-grid">
                  {MUTATION_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className="mm-type-card"
                      onClick={() => navigate(`/user/mutation/file?type=${t.id}`)}
                    >
                      <MI name={t.icon} />
                      <span className="mm-type-label">{t.shortLabel}</span>
                      <span className="mm-type-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          ) : (
            <div className="mm-zone">
              {/* Section header */}
              <div className="mm-zone-header">
                <div className="mm-zone-title">
                  <MI name="edit_document" />
                  Application <span>History</span>
                </div>
                <div className={`mm-zone-pill${pending > 0 ? " warning" : ""}`}>
                  {pending > 0 ? `${pending} pending` : `${total} total`}
                </div>
              </div>

              {/* Rows */}
              <div className="mm-list">
                {mutations.map((m, i) => {
                  const { text, cls } = statusDisplay(m.status);
                  const filedOn = m.createdAt
                    ? new Date(m.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : "Recently";
                  return (
                    <div key={m.id ?? i} className="mm-row" style={{ animationDelay: `${i * 0.04}s` }}>
                      {/* Icon */}
                      <div className="mm-icon-wrap">
                        <MI name="edit_document" />
                      </div>

                      {/* Body */}
                      <div className="mm-body">
                        <div className="mm-id">MUT-{m.id}</div>
                        <div className="mm-type">{parseMutationLabel(m.reason)}</div>
                        <div className="mm-reason">{m.reason}</div>
                        {m.propertyTitle && (
                          <div className="mm-prop-tag">
                            <MI name="home" /> {m.propertyTitle}
                          </div>
                        )}
                      </div>

                      {/* Right */}
                      <div className="mm-right">
                        <div className={`mm-status ${cls}`}>
                          <span className="dot" />
                          {text}
                        </div>
                        <div className="mm-meta">PROP-{m.propertyId}</div>
                        <div className="mm-meta">Filed {filedOn}</div>
                        {m.remarks && (
                          <div className="mm-officer">Officer: {m.remarks}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}