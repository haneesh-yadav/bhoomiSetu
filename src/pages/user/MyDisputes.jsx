import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   CSS
══════════════════════════════════════════════════ */
const styles = `
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
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* ── Page ── */
  .dp-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }
  .dp-main {
    display: flex; flex-direction: column; gap: 16px;
    padding: 16px 28px 56px;
    max-width: 1280px; margin: 0 auto;
    overflow-x: hidden; min-width: 0;
  }

  /* ── Top bar ── */
  .dp-topbar {
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    flex-wrap: wrap; gap: 10px;
  }
  .dp-heading { font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .dp-heading span { color: #e07a5f; }
  .dp-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .dp-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 6px 13px; font-size: 10.5px; font-weight: 600; color: #888;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .dp-meta-chip .mi { font-size: 13px; color: #e07a5f; }

  .dp-file-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 7px 16px; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .dp-file-btn:hover { background: #e07a5f; }
  .dp-file-btn .mi { font-size: 15px; }

  /* ── Zone / section card ── */
  .dp-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .dp-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .dp-zone-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .dp-zone-title .mi { font-size: 17px; color: #e07a5f; }
  .dp-zone-title span { color: #e07a5f; }
  .dp-zone-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .dp-zone-action {
    background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15);
    border-radius: 10px; color: rgba(255,255,255,0.75);
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; padding: 5px 13px;
    display: flex; align-items: center; gap: 5px; transition: all 0.15s;
  }
  .dp-zone-action:hover { background: rgba(255,255,255,0.14); color: #fff; border-color: rgba(255,255,255,0.3); }
  .dp-zone-action .mi { font-size: 14px; }

  /* ── Dispute rows ── */
  .dp-disputes-list { display: flex; flex-direction: column; }

  .dp-dispute-row {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 15px 20px;
    border-bottom: 1.5px solid #f0f0ee;
    transition: background 0.15s; cursor: default;
    animation: fadeUp 0.3s ease both;
  }
  .dp-dispute-row:last-child { border-bottom: none; }
  .dp-dispute-row:hover { background: #fafaf8; }

  .dp-dispute-icon-wrap {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: rgba(224,122,95,0.1);
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .dp-dispute-icon-wrap .mi { font-size: 18px; color: #e07a5f; }

  .dp-dispute-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
  .dp-dispute-id {
    font-family: 'DM Mono', monospace; font-size: 9.5px;
    font-weight: 500; color: #e07a5f; letter-spacing: 0.04em;
  }
  .dp-dispute-type { font-size: 13px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .dp-dispute-desc {
    font-size: 10.5px; color: #aaa; line-height: 1.5;
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .dp-dispute-prop-tag {
    display: inline-flex; align-items: center; gap: 4px; margin-top: 2px;
    font-size: 10px; font-weight: 600; color: #e07a5f;
  }
  .dp-dispute-prop-tag .mi { font-size: 12px; }

  .dp-dispute-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;
  }
  .dp-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; padding: 3px 10px;
    border-radius: 20px; white-space: nowrap;
  }
  .dp-status-pill .pdot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .s-orange { color: #b45309; background: rgba(217,119,6,0.12); }
  .s-orange .pdot { background: #d97706; }
  .s-green  { color: #e07a5f; background: rgba(224,122,95,0.12); }
  .s-green  .pdot { background: #e07a5f; }
  .s-red    { color: #b91c1c; background: rgba(220,38,38,0.1); }
  .s-red    .pdot { background: #dc2626; }
  .s-gray   { color: #555; background: #f3f4f6; }
  .s-gray   .pdot { background: #9ca3af; }

  .dp-dispute-meta {
    font-family: 'DM Mono', monospace; font-size: 9.5px;
    font-weight: 500; color: #bbb; text-align: right;
  }

  /* ── Empty state ── */
  .dp-empty-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .dp-empty-header {
    padding: 13px 20px; background: #1a1a1a;
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .dp-empty-header .mi { font-size: 17px; color: #e07a5f; }
  .dp-empty-body {
    padding: 48px 24px; display: flex; flex-direction: column; align-items: center;
    gap: 10px; text-align: center;
  }
  .dp-empty-icon-wrap {
    width: 56px; height: 56px; border-radius: 16px;
    background: rgba(224,122,95,0.08); border: 1.5px solid rgba(224,122,95,0.15);
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
  .dp-empty-icon-wrap .mi { font-size: 26px; color: #e07a5f; }
  .dp-empty-title { font-size: 15px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .dp-empty-sub   { font-size: 12px; color: #aaa; line-height: 1.7; max-width: 360px; }
  .dp-empty-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 10px 22px; margin-top: 6px;
    font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: background 0.15s;
  }
  .dp-empty-btn:hover { background: #e07a5f; }
  .dp-empty-btn .mi { font-size: 14px; }

  /* ── Loading ── */
  .dp-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 72px 20px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .dp-spinner {
    width: 28px; height: 28px; border: 2.5px solid #e0e0e0;
    border-top-color: #e07a5f; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .dp-loading-text { font-size: 12px; font-weight: 600; color: #bbb; }

  @media (max-width: 768px) {
    .dp-main { padding: 12px 14px 48px; }
    .dp-dispute-row { flex-wrap: wrap; gap: 10px; }
    .dp-dispute-right { align-items: flex-start; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

function statusMeta(status) {
  if (status === "ACTIVE")    return { pillCls: "s-orange", text: "Under Investigation" };
  if (status === "RESOLVED")  return { pillCls: "s-green",  text: "Resolved" };
  if (status === "REJECTED")  return { pillCls: "s-red",    text: "Rejected" };
  return { pillCls: "s-gray", text: status || "Submitted" };
}

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function MyDisputes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myDisputes, setMyDisputes] = useState([]);
  const [loading, setLoading]       = useState(true);

  const onFileNew = () => navigate("/user/disputes/file");

  useEffect(() => {
    if (user) {
      api.get("/disputes/my-disputes")
        .then(res => setMyDisputes(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const total    = myDisputes.length;
  const active   = myDisputes.filter(d => d.status === "ACTIVE").length;
  const resolved = myDisputes.filter(d => d.status === "RESOLVED").length;

  return (
    <>
      <style>{styles}</style>
      <div className="dp-page">
        <div className="dp-main">

          {/* ══ TOP BAR ══ */}
          <div className="dp-topbar">
            <div className="dp-heading">
              My <span>Disputes</span>
            </div>
            <div className="dp-topbar-right">
              <div className="dp-meta-chip">
                <MI name="gavel" /> Dispute Management
              </div>
              <button type="button" className="dp-file-btn" onClick={onFileNew}>
                <MI name="add" /> File dispute
              </button>
            </div>
          </div>

          {/* ══ BODY ══ */}
          {loading ? (
            <div className="dp-loading">
              <div className="dp-spinner" />
              <div className="dp-loading-text">Loading your disputes…</div>
            </div>

          ) : myDisputes.length === 0 ? (
            <div className="dp-empty-zone">
              <div className="dp-empty-header">
                <MI name="gavel" /> Dispute Applications
              </div>
              <div className="dp-empty-body">
                <div className="dp-empty-icon-wrap">
                  <MI name="gavel" />
                </div>
                <div className="dp-empty-title">No disputes filed</div>
                <div className="dp-empty-sub">
                  You haven't raised any property disputes yet. If you have a grievance
                  regarding a property record, you can file a formal dispute below.
                </div>
                <button className="dp-empty-btn" onClick={onFileNew}>
                  <MI name="add" /> File a Dispute
                </button>
              </div>
            </div>

          ) : (
            <div className="dp-zone">
              {/* Section header */}
              <div className="dp-zone-header">
                <div className="dp-zone-title">
                  <MI name="gavel" />
                  Dispute <span>History</span>
                  <span className="dp-zone-pill">
                    {active > 0 ? `${active} active` : `${total} total`}
                  </span>
                </div>
                <button className="dp-zone-action" onClick={onFileNew}>
                  File new <MI name="add" />
                </button>
              </div>

              {/* Rows */}
              <div className="dp-disputes-list">
                {myDisputes.map((d, i) => {
                  const { pillCls, text } = statusMeta(d.status);
                  const filedOn = d.createdAt
                    ? new Date(d.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })
                    : "Recently";

                  return (
                    <div key={d.id ?? i} className="dp-dispute-row" style={{ animationDelay: `${i * 0.04}s` }}>
                      <div className="dp-dispute-icon-wrap">
                        <MI name="gavel" />
                      </div>
                      <div className="dp-dispute-body">
                        <div className="dp-dispute-id">DSP-{d.id}</div>
                        <div className="dp-dispute-type">{d.caseNumber || "Dispute"}</div>
                        <div className="dp-dispute-desc">{d.description}</div>
                        {d.propertyId && (
                          <div className="dp-dispute-prop-tag">
                            <MI name="home" /> PROP-{d.propertyId}
                          </div>
                        )}
                      </div>
                      <div className="dp-dispute-right">
                        <div className={`dp-status-pill ${pillCls}`}>
                          <span className="pdot" />
                          {text}
                        </div>
                        <div className="dp-dispute-meta">Filed {filedOn}</div>
                        {d.remarks && (
                          <div className="dp-dispute-meta" style={{ maxWidth: 160, textAlign: "right" }}>
                            {d.remarks}
                          </div>
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