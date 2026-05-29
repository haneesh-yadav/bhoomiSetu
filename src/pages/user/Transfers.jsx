import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   CONSTANTS & HELPERS
══════════════════════════════════════════════════ */
const STEPS = [
  { num: "01", label: "Select Property" },
  { num: "02", label: "Buyer Details"   },
  { num: "03", label: "Documents"       },
  { num: "04", label: "Review & Submit" },
];

const REQUIRED_DOCS = [
  { id: "sale_deed", label: "Sale Deed",                    required: true  },
  { id: "ec",        label: "Encumbrance Certificate (EC)", required: true  },
  { id: "aadhaar",   label: "Identity Proof (Aadhaar)",     required: true  },
  { id: "patta",     label: "Patta / Chitta",               required: false },
  { id: "noc",       label: "No Objection Certificate",     required: false },
];

const TYPE_META = {
  Residential:  { icon: "home",     iconBg: "#e07a5f" },
  Agricultural: { icon: "grass",    iconBg: "#e07a5f" },
  Commercial:   { icon: "business", iconBg: "#1a1a1a" },
};

const MIcon = ({ name, style }) => (
  <span className="mi" style={style}>{name}</span>
);

/* ══════════════════════════════════════════════════
   MODAL: CONFIRM INCOMING TRANSFER (BUYER)
══════════════════════════════════════════════════ */
function ConfirmModal({ transfer, onClose, onConfirm, onDecline }) {
  const [consent,  setConsent]  = useState(false);
  const [password, setPassword] = useState("");
  const [pwError,  setPwError]  = useState("");
  const [loading,  setLoading]  = useState(null);
  const [done,     setDone]     = useState(null);

  const handleConfirm = async () => {
    if (!consent)              { setPwError("Please accept the declaration."); return; }
    if (!password.trim())      { setPwError("Please enter your account password."); return; }
    if (password !== "user123"){ setPwError("Incorrect password. Please try again."); return; }
    setPwError("");
    setLoading("confirm");
    await new Promise(r => setTimeout(r, 1200));
    setLoading(null);
    setDone("confirmed");
    onConfirm?.();
  };

  const handleDecline = async () => {
    setLoading("decline");
    await new Promise(r => setTimeout(r, 900));
    setLoading(null);
    setDone("declined");
    onDecline?.();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-icon">
              <MIcon name="gavel" />
            </div>
            <div>
              <div className="modal-title">Confirm <span>Transfer</span></div>
              <div className="modal-subtitle">Response recorded on the blockchain ledger</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <MIcon name="close" />
          </button>
        </div>

        <div className="modal-body">
          {done ? (
            <div className="modal-done-state">
              <div className={`modal-done-icon ${done === "confirmed" ? "success" : "danger"}`}>
                <MIcon name={done === "confirmed" ? "check_circle" : "cancel"} />
              </div>
              <div className="modal-done-title">
                {done === "confirmed" ? "Transfer Confirmed!" : "Transfer Declined"}
              </div>
              <div className="modal-done-sub">
                {done === "confirmed"
                  ? `You've confirmed the purchase of ${transfer.propertyTitle}. The transfer has moved to the registrar queue.`
                  : `You've declined the transfer of ${transfer.propertyTitle}. The seller has been notified.`
                }
              </div>
              <button className="modal-btn-save" onClick={onClose} style={{ marginTop: 0 }}>Close</button>
            </div>
          ) : (
            <>
              <div className="modal-prop-summary">
                <div className="modal-prop-title">{transfer.propertyTitle}</div>
                <div className="modal-prop-meta">{transfer.propertyId} · {transfer.district}</div>
                <div className="modal-prop-value">{transfer.saleValue} · Seller: {transfer.sellerName}</div>
              </div>

              <div className="modal-field-group" style={{ marginBottom: 0 }}>
                <div className="modal-field-label">Declaration</div>
              </div>
              <div
                className={`modal-declaration ${consent ? "checked" : ""}`}
                onClick={() => { setConsent(c => !c); setPwError(""); }}
              >
                <div className={`modal-decl-box ${consent ? "checked" : ""}`}>
                  <MIcon name="check" />
                </div>
                <span className="modal-decl-text">
                  I confirm I am the intended buyer of this property and agree to proceed with the ownership transfer as listed. I understand this action is irreversible once approved by the registrar.
                </span>
              </div>

              <div className="modal-field-group">
                <div className="modal-field-label">Account Password</div>
                <div className="modal-input-wrap">
                  <span className="mi modal-input-icon">lock</span>
                  <input
                    type="password"
                    className={`modal-input ${pwError ? "error" : ""}`}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPwError(""); }}
                    placeholder="Enter your account password"
                  />
                </div>
                {pwError && (
                  <span className="modal-field-error">
                    <MIcon name="warning" /> {pwError}
                  </span>
                )}
              </div>

              <div className="modal-footer">
                <button className="modal-btn-cancel" style={{ flex: 1, color: "#dc2626", borderColor: "rgba(220,38,38,0.25)", background: "rgba(220,38,38,0.05)" }}
                  onClick={handleDecline} disabled={!!loading}>
                  {loading === "decline" ? <><span className="modal-spinner" /> Declining…</> : <><MIcon name="close" /> Decline</>}
                </button>
                <button className="modal-btn-save" onClick={handleConfirm} disabled={!!loading}>
                  {loading === "confirm" ? <><span className="modal-spinner" /> Confirming…</> : <><MIcon name="check" /> Confirm Transfer</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MODAL: OUTGOING TRANSFER TIMELINE DETAILS
══════════════════════════════════════════════════ */
function OutgoingDetailModal({ transfer, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-header-icon">
              <MIcon name="swap_horiz" />
            </div>
            <div>
              <div className="modal-title">Transfer <span>Details</span></div>
              <div className="modal-subtitle">{transfer.id}</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <MIcon name="close" />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-prop-summary">
            <div className="modal-prop-title">{transfer.propertyTitle}</div>
            <div className="modal-prop-meta">{transfer.propertyId} · {transfer.district}</div>
            <div className="modal-prop-value">{transfer.saleValue} · Buyer: {transfer.buyerName}</div>
          </div>

          <div className="modal-field-label" style={{ marginBottom: 10 }}>
            Transfer Timeline
            <span style={{ marginLeft: 8, fontWeight: 400, color: "#e07a5f", textTransform: "none", letterSpacing: 0 }}>
              ({transfer.status})
            </span>
          </div>

          <div className="tr-tl-list">
            {transfer.timeline.map((s, i) => {
              const isDone = s.done;
              const isNext = !s.done && (i === 0 || transfer.timeline[i - 1]?.done);
              const dotCls = isDone ? "done" : isNext ? "active" : "";
              const lineDone = isDone && i < transfer.timeline.length - 1;
              return (
                <div key={i} className="tr-tl-item">
                  <div className="tr-tl-spine">
                    <div className={`tr-tl-dot ${dotCls}`} />
                    {i < transfer.timeline.length - 1 && (
                      <div className={`tr-tl-line ${lineDone ? "done" : ""}`} />
                    )}
                  </div>
                  <div className="tr-tl-content">
                    <div className={`tr-tl-step ${!isDone && !isNext ? "pending" : ""}`}>{s.step}</div>
                    {s.actor && <div className="tr-tl-actor">by {s.actor}</div>}
                    {s.date  && <div className="tr-tl-date">{s.date}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {transfer.notes && (
            <div className="tr-notes" style={{ marginTop: 14 }}>
              <div className="tr-notes-label">Registrar Notes</div>
              <div className="tr-notes-text">{transfer.notes}</div>
            </div>
          )}

          <div className="modal-footer" style={{ marginTop: 18 }}>
            <button className="modal-btn-save" style={{ flex: 1 }} onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CSS — Transfers page, matching MyProperties design system
══════════════════════════════════════════════════ */
const TRANSFERS_CSS = `
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
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ── Page root ── */
  .tr-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }

  /* ── Main container ── */
  .tr-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 28px 56px;
    max-width: 1280px;
    margin: 0 auto;
    overflow-x: hidden;
    min-width: 0;
  }

  /* ══ TOP BAR ══ */
  .tr-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .tr-heading { font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .tr-heading span { color: #e07a5f; }
  .tr-topbar-right { display: flex; align-items: center; gap: 8px; }
  .tr-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    padding: 6px 13px; font-size: 10.5px; font-weight: 600; color: #888;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .tr-meta-chip .mi { font-size: 13px; color: #e07a5f; }

  /* ══ STAT STRIP ══ */
  .tr-stats {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .tr-stat {
    padding: 16px 20px;
    cursor: default;
    transition: background 0.15s;
    position: relative;
    display: flex; flex-direction: column; gap: 5px;
    background: #f9f9f7;
  }
  .tr-stat:not(:last-child) { border-right: 1.5px solid #eeeeec; }
  .tr-stat:hover { background: #f3f3f0; }
  .tr-stat-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #aaa; }
  .tr-stat-value { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: #e07a5f; }
  .tr-stat-value.warning { color: #d97706; }
  .tr-stat-value.success { color: #16a34a; }

  /* ══ DASHBOARD GRID ══ */
  .tr-dashboard-grid {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .tr-dashboard-grid { grid-template-columns: 1fr; }
    .tr-stats { grid-template-columns: repeat(2, 1fr); }
  }

  /* RIGHT STACK */
  .tr-dashboard-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ══ SECTION CARD ══ */
  .tr-section-zone {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .tr-section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .tr-section-title-row { display: flex; align-items: center; gap: 10px; }
  .tr-section-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .tr-section-title .mi { font-size: 17px; color: #e07a5f; }
  .tr-count-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .tr-count-pill.warning {
    background: rgba(217,119,6,0.12); color: #b45309;
    border-color: rgba(217,119,6,0.2);
  }
  .tr-section-body { padding: 18px 20px; }
  .tr-step-pill {
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5);
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* ══ STEP PROGRESS ══ */
  .tr-progress-bar {
    background: #f9f9f7; border-bottom: 1.5px solid #f0f0ee;
    padding: 12px 20px;
    display: flex; align-items: center; gap: 0;
    overflow: hidden;
  }
  .tr-step-item { display: flex; align-items: center; gap: 8px; }
  .tr-step-connector { flex: 1; height: 2px; background: #e0e0e0; margin: 0 6px; transition: background 0.3s; min-width: 20px; }
  .tr-step-connector.done { background: #e07a5f; }
  .tr-step-bubble {
    width: 30px; height: 30px; border-radius: 9px;
    border: 2px solid #e0e0e0;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 800;
    color: #bbb; background: #fff; flex-shrink: 0;
    transition: all 0.2s;
  }
  .tr-step-bubble.active { background: #1a1a1a; border-color: #1a1a1a; color: #fff; box-shadow: 0 2px 8px rgba(26,26,26,0.2); }
  .tr-step-bubble.done   { background: #e07a5f; border-color: #e07a5f; color: #fff; }
  .tr-step-bubble .mi { font-size: 14px; }
  .tr-step-info { display: flex; flex-direction: column; gap: 1px; }
  .tr-step-name { font-size: 10.5px; font-weight: 600; color: #bbb; white-space: nowrap; }
  .tr-step-name.active { color: #1a1a1a; font-weight: 700; }
  .tr-step-name.done   { color: #e07a5f; }

  /* ══ PROPERTY LIST (step 1) ══ */
  .tr-prop-list { display: flex; flex-direction: column; gap: 8px; }
  .tr-prop-card {
    background: #f9f9f7; border: 1.5px solid #e0e0e0; border-radius: 16px; padding: 13px 15px;
    display: flex; align-items: center; gap: 12px;
    cursor: pointer; transition: all 0.18s; position: relative; overflow: hidden;
  }
  .tr-prop-card:hover { border-color: #e07a5f; background: #fff; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.07); }
  .tr-prop-card.selected { background: #1a1a1a; border-color: #1a1a1a; }
  .tr-prop-card-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(circle at 85% 10%, rgba(224,122,95,0.12) 0%, transparent 55%);
  }
  .tr-prop-icon-wrap {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(224,122,95,0.1);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .tr-prop-icon-wrap .mi { font-size: 18px; color: #e07a5f; }
  .tr-prop-card.selected .tr-prop-icon-wrap { background: rgba(224,122,95,0.2); }
  .tr-prop-card-body { flex: 1; min-width: 0; }
  .tr-prop-card-id { font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 500; color: #aaa; margin-bottom: 2px; }
  .tr-prop-card.selected .tr-prop-card-id { color: rgba(255,255,255,0.4); }
  .tr-prop-card-title { font-size: 12.5px; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tr-prop-card.selected .tr-prop-card-title { color: #fff; }
  .tr-prop-card-district { font-size: 10.5px; color: #999; margin-top: 1px; }
  .tr-prop-card.selected .tr-prop-card-district { color: rgba(255,255,255,0.4); }
  .tr-prop-card-chips { display: flex; gap: 6px; margin-left: auto; flex-shrink: 0; }
  .tr-prop-card-chip { background: rgba(0,0,0,0.04); border-radius: 9px; padding: 5px 9px; text-align: center; }
  .tr-prop-card.selected .tr-prop-card-chip { background: rgba(255,255,255,0.07); }
  .tr-prop-card-chip-label { font-size: 8.5px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.04em; }
  .tr-prop-card.selected .tr-prop-card-chip-label { color: rgba(255,255,255,0.35); }
  .tr-prop-card-chip-val   { font-size: 10.5px; font-weight: 800; color: #1a1a1a; }
  .tr-prop-card.selected .tr-prop-card-chip-val { color: rgba(255,255,255,0.85); }
  .tr-prop-check {
    width: 24px; height: 24px; border-radius: 7px;
    border: 1.5px solid #e0e0e0; background: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s;
  }
  .tr-prop-check .mi { font-size: 13px; color: #e0e0e0; }
  .tr-prop-check.checked { background: #e07a5f; border-color: #e07a5f; }
  .tr-prop-check.checked .mi { color: #fff; }

  /* ══ FIELDS (step 2) ══ */
  .tr-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
  .tr-field { display: flex; flex-direction: column; gap: 5px; }
  .tr-field-full { grid-column: 1 / -1; }
  .tr-label { font-size: 10px; font-weight: 700; letter-spacing: 0.07em; color: #999; text-transform: uppercase; }
  .tr-input {
    background: #f7f7f5; border: 1.5px solid #e0e0e0; border-radius: 11px; padding: 9px 13px;
    font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 500;
    color: #1a1a1a; outline: none; transition: all 0.18s; width: 100%;
  }
  .tr-input:focus { border-color: #e07a5f; background: #fff; box-shadow: 0 0 0 3px rgba(224,122,95,0.08); }
  .tr-input::placeholder { color: #ccc; }
  .tr-input.error { border-color: #dc2626; background: rgba(220,38,38,0.03); }
  .tr-hint { font-size: 10px; font-weight: 500; color: #bbb; }
  .tr-err-msg { font-size: 10.5px; font-weight: 700; color: #dc2626; display: flex; align-items: center; gap: 4px; }
  .tr-err-msg .mi { font-size: 13px; }

  /* ══ DOCUMENTS (step 3) ══ */
  .tr-doc-list { display: flex; flex-direction: column; gap: 7px; }
  .tr-doc-row {
    background: #f7f7f5; border-radius: 13px; padding: 11px 13px;
    display: flex; align-items: center; gap: 11px;
    transition: all 0.18s; border: 1.5px solid #eeeeec;
  }
  .tr-doc-row:hover { background: #fff; border-color: #e0e0e0; }
  .tr-doc-row.uploaded { background: rgba(224,122,95,0.04); border-color: rgba(224,122,95,0.25); }
  .tr-doc-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: #eeeeec;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .tr-doc-icon .mi { font-size: 16px; color: #888; }
  .tr-doc-row.uploaded .tr-doc-icon { background: rgba(224,122,95,0.1); }
  .tr-doc-row.uploaded .tr-doc-icon .mi { color: #e07a5f; }
  .tr-doc-name { font-size: 12px; font-weight: 700; color: #1a1a1a; flex: 1; }
  .tr-doc-req-badge {
    font-size: 8.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
    background: #1a1a1a; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;
  }
  .tr-doc-req-badge.optional { background: #f3f3f1; color: #bbb; border: 1px solid #e8e8e8; }
  .tr-doc-upload-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 9px;
    padding: 6px 13px; font-family: 'Poppins', sans-serif;
    font-size: 10.5px; font-weight: 700; cursor: pointer; transition: background 0.15s; flex-shrink: 0;
  }
  .tr-doc-upload-btn:hover { background: #e07a5f; }
  .tr-doc-done-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #e07a5f; flex-shrink: 0; }
  .tr-doc-done-badge .mi { font-size: 15px; }

  /* ══ REVIEW (step 4) ══ */
  .tr-review-block { background: #f7f7f5; border-radius: 14px; overflow: hidden; border: 1.5px solid #eeeeec; }
  .tr-review-block-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 13px; border-bottom: 1px solid #eeeeec;
    background: #f3f3f1;
  }
  .tr-review-block-label { font-size: 9.5px; font-weight: 700; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em; }
  .tr-review-edit-btn {
    background: none; border: 1.5px solid #e0e0e0; border-radius: 7px; padding: 3px 10px;
    font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 700; color: #999;
    cursor: pointer; transition: all 0.15s;
  }
  .tr-review-edit-btn:hover { background: #e07a5f; color: #fff; border-color: #e07a5f; }
  .tr-review-rows { padding: 2px 0; }
  .tr-review-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 13px; }
  .tr-review-row:not(:last-child) { border-bottom: 1px solid #eeeeec; }
  .tr-review-row-key { font-size: 11px; font-weight: 600; color: #aaa; }
  .tr-review-row-val { font-size: 11.5px; font-weight: 700; color: #1a1a1a; font-family: 'DM Mono', monospace; }
  .tr-review-row-val.accent { color: #e07a5f; font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 4px; }
  .tr-review-row-val.accent .mi { font-size: 14px; }

  /* ══ DECLARATION ══ */
  .tr-declaration {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 13px; background: #f7f7f5; border-radius: 13px;
    cursor: pointer; border: 1.5px solid #eeeeec; transition: border-color 0.18s; margin-top: 4px;
  }
  .tr-declaration:hover { border-color: #e07a5f; background: #fff; }
  .tr-declaration.checked { background: rgba(224,122,95,0.04); border-color: rgba(224,122,95,0.3); }
  .tr-checkbox {
    width: 21px; height: 21px; min-width: 21px; border-radius: 6px;
    border: 1.5px solid #e0e0e0; background: #fff;
    display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all 0.15s;
  }
  .tr-checkbox .mi { font-size: 12px; color: #ddd; }
  .tr-checkbox.checked { background: #1a1a1a; border-color: #1a1a1a; }
  .tr-checkbox.checked .mi { color: #e07a5f; }
  .tr-decl-text { font-size: 11.5px; font-weight: 500; color: #888; line-height: 1.65; }

  /* ══ NAV BUTTONS ══ */
  .tr-nav { display: flex; gap: 9px; align-items: center; padding-top: 4px; }
  .tr-btn-back {
    background: #f7f7f5; color: #666; border: 1.5px solid #e0e0e0; border-radius: 12px;
    padding: 10px 18px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: all 0.15s; white-space: nowrap;
  }
  .tr-btn-back:hover { background: #eeeeec; color: #111; border-color: #ccc; }
  .tr-btn-back .mi { font-size: 15px; }
  .tr-btn-next {
    flex: 1; background: #1a1a1a; color: #fff; border: none; border-radius: 12px;
    padding: 10px 18px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s;
  }
  .tr-btn-next:hover { background: #e07a5f; }
  .tr-btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
  .tr-btn-next .mi { font-size: 15px; }
  .tr-btn-next.submit { background: rgba(224,122,95,0.1); color: #e07a5f; border: 1.5px solid rgba(224,122,95,0.25); }
  .tr-btn-next.submit:hover { background: rgba(224,122,95,0.18); }

  /* ══ SUCCESS ══ */
  .tr-success-wrap {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 36px 24px; animation: fadeUp 0.4s ease both;
  }
  .tr-success-icon {
    width: 64px; height: 64px; background: #1a1a1a;
    border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
  }
  .tr-success-icon .mi { font-size: 30px; color: #e07a5f; }
  .tr-success-title { font-size: 21px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; margin-bottom: 7px; }
  .tr-success-title span { color: #e07a5f; }
  .tr-success-sub { font-size: 12px; color: #999; line-height: 1.7; max-width: 380px; margin-bottom: 20px; }
  .tr-success-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .tr-suc-btn-primary {
    background: #1a1a1a; color: #fff; border: none; border-radius: 12px; padding: 10px 20px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s;
  }
  .tr-suc-btn-primary:hover { background: #e07a5f; }

  /* ══ EMPTY STATE ══ */
  .tr-empty {
    text-align: center; padding: 32px 20px;
    background: #f9f9f7; border: 1.5px solid #eeeeec; border-radius: 14px;
    color: #aaa; font-size: 12px;
  }
  .tr-empty .mi { font-size: 28px; color: #ddd; display: block; margin: 0 auto 8px; }
  .tr-empty-title { font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 3px; }
  .tr-empty-sub   { font-size: 11px; color: #bbb; line-height: 1.5; }

  /* ══ CARDS LIST ══ */
  .tr-cards-list { display: flex; flex-direction: column; gap: 8px; }

  /* Outgoing card */
  .tr-txn-card {
    background: #f9f9f7; border: 1.5px solid #e0e0e0; border-radius: 16px; padding: 13px 15px;
    display: flex; flex-direction: column; gap: 9px;
    cursor: pointer; transition: all 0.18s;
    position: relative; overflow: hidden; animation: fadeUp 0.35s ease both;
  }
  .tr-txn-card:hover { border-color: #e07a5f; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); background: #fff; }
  .tr-txn-card-id { font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 500; color: #e07a5f; }
  .tr-txn-card-title { font-size: 12.5px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .tr-txn-card-sub { font-size: 10.5px; color: #aaa; }
  .tr-txn-card-badge {
    display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 20px;
    font-size: 9px; font-weight: 700; width: fit-content;
  }
  .tr-mini-steps { display: flex; align-items: center; gap: 3px; }
  .tr-mini-step { flex: 1; height: 3px; border-radius: 2px; background: #e8e8e8; transition: background 0.3s; }
  .tr-mini-step.done   { background: #e07a5f; }
  .tr-mini-step.active { background: #c05030; }
  .tr-txn-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 7px; border-top: 1.5px solid #f0f0ee;
  }
  .tr-txn-card-date { font-size: 10px; font-weight: 600; color: #ccc; }
  .tr-txn-card-val  { font-size: 11px; font-weight: 800; color: #1a1a1a; }

  /* Incoming card */
  .tr-inc-card {
    background: #f9f9f7; border: 1.5px solid rgba(217,119,6,0.35);
    border-radius: 16px; padding: 13px 15px;
    display: flex; flex-direction: column; gap: 9px;
    cursor: pointer; transition: all 0.18s;
    position: relative; overflow: hidden; animation: fadeUp 0.35s ease both;
  }
  .tr-inc-card:hover { background: #fff; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(217,119,6,0.1); }
  .tr-inc-pulse {
    width: 7px; height: 7px; border-radius: 50%;
    background: #d97706; box-shadow: 0 0 0 3px rgba(217,119,6,0.2);
    flex-shrink: 0; animation: pulse 1.4s ease-in-out infinite;
  }
  .tr-inc-badge {
    background: rgba(217,119,6,0.1); color: #b45309;
    border-radius: 20px; padding: 2px 9px;
    font-size: 9.5px; font-weight: 700;
    display: inline-flex; align-items: center; gap: 4px; width: fit-content;
  }
  .tr-inc-value { font-size: 11.5px; font-weight: 800; color: #1a1a1a; }
  .tr-inc-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 7px; border-top: 1px solid rgba(217,119,6,0.15);
  }

  /* ══ TIMELINE (modal) ══ */
  .tr-tl-list { display: flex; flex-direction: column; }
  .tr-tl-item { display: flex; gap: 11px; }
  .tr-tl-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .tr-tl-dot {
    width: 12px; height: 12px; border-radius: 4px; border: 1.5px solid #e0e0e0;
    background: #fff; flex-shrink: 0; margin-top: 3px; transition: all 0.2s;
  }
  .tr-tl-dot.done   { background: #e07a5f; border-color: #e07a5f; }
  .tr-tl-dot.active { background: #c05030; border-color: #c05030; }
  .tr-tl-line { flex: 1; width: 2px; background: #e8e8e8; margin: 2px 0; min-height: 18px; transition: background 0.3s; border-radius: 99px; }
  .tr-tl-line.done { background: #e07a5f; }
  .tr-tl-content { flex: 1; padding-bottom: 13px; }
  .tr-tl-step { font-size: 12px; font-weight: 700; color: #1a1a1a; margin-bottom: 2px; }
  .tr-tl-step.pending { color: #ccc; font-weight: 500; }
  .tr-tl-actor { font-size: 10.5px; color: #bbb; }
  .tr-tl-date  { font-size: 10px; font-weight: 600; color: #bbb; margin-top: 2px; }

  /* Notes box */
  .tr-notes { background: #f7f7f5; border: 1.5px solid #eeeeec; border-radius: 12px; padding: 11px 13px; }
  .tr-notes-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em; color: #bbb; text-transform: uppercase; margin-bottom: 5px; }
  .tr-notes-text  { font-size: 11.5px; color: #777; line-height: 1.6; }

  /* ══ GLOBAL MODAL (matches MyProperties) ══ */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 2000;
    background: rgba(26,26,26,0.5); backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .modal-card {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 24px; width: 100%; max-width: 460px;
    overflow: hidden; font-family: 'Poppins', sans-serif;
    animation: fadeUp 0.25s ease both; box-shadow: 0 20px 60px rgba(26,26,26,0.15);
  }
  .modal-header {
    background: #1a1a1a; padding: 16px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .modal-header-left { display: flex; align-items: center; gap: 12px; }
  .modal-header-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(224,122,95,0.15);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .modal-header-icon .mi { font-size: 18px; color: #e07a5f; }
  .modal-title { font-size: 14px; font-weight: 800; color: #fff; }
  .modal-title span { color: #e07a5f; }
  .modal-subtitle { font-size: 10.5px; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .modal-close-btn {
    background: rgba(255,255,255,0.07); border: none; border-radius: 8px;
    width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center;
    justify-content: center; flex-shrink: 0; transition: background 0.15s;
  }
  .modal-close-btn:hover { background: rgba(255,255,255,0.12); }
  .modal-close-btn .mi { font-size: 16px; color: rgba(255,255,255,0.5); }
  .modal-body { padding: 20px; max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; }

  /* Modal property summary */
  .modal-prop-summary {
    background: #f7f7f5; border: 1.5px solid #eeeeec; border-radius: 14px; padding: 12px 14px;
  }
  .modal-prop-title { font-size: 13px; font-weight: 800; color: #1a1a1a; }
  .modal-prop-meta  { font-size: 10.5px; color: #bbb; margin-top: 2px; }
  .modal-prop-value { font-size: 11.5px; font-weight: 700; color: #1a1a1a; margin-top: 6px; }

  /* Modal declaration */
  .modal-declaration {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 13px; background: #f7f7f5; border: 1.5px solid #eeeeec;
    border-radius: 12px; cursor: pointer; transition: all 0.15s;
  }
  .modal-declaration:hover { border-color: #e07a5f; background: #fff; }
  .modal-declaration.checked { background: rgba(224,122,95,0.04); border-color: rgba(224,122,95,0.3); }
  .modal-decl-box {
    width: 19px; height: 19px; min-width: 19px; border: 1.5px solid #e0e0e0;
    border-radius: 5px; background: #fff;
    display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all 0.15s;
  }
  .modal-decl-box .mi { font-size: 11px; color: #e0e0e0; }
  .modal-decl-box.checked { background: #1a1a1a; border-color: #1a1a1a; }
  .modal-decl-box.checked .mi { color: #e07a5f; }
  .modal-decl-text { font-size: 11px; color: #888; line-height: 1.6; }

  /* Modal fields */
  .modal-field-group { display: flex; flex-direction: column; gap: 6px; }
  .modal-field-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.07em;
    color: #999; text-transform: uppercase;
  }
  .modal-input-wrap {
    background: #f7f7f5; border: 1.5px solid #e0e0e0;
    border-radius: 11px; display: flex; align-items: center; gap: 8px; padding: 0 12px;
    transition: border-color 0.15s;
  }
  .modal-input-wrap:focus-within { border-color: #e07a5f; background: #fff; }
  .modal-input-icon { font-size: 15px; color: #ccc; flex-shrink: 0; }
  .modal-input {
    border: none; outline: none; background: transparent;
    font-family: 'Poppins', sans-serif; font-size: 12.5px; color: #1a1a1a;
    padding: 9px 0; width: 100%; font-weight: 500;
  }
  .modal-input::placeholder { color: #ccc; }
  .modal-input.error { color: #dc2626; }
  .modal-field-error { font-size: 10.5px; font-weight: 700; color: #dc2626; display: flex; align-items: center; gap: 4px; }
  .modal-field-error .mi { font-size: 13px; }

  /* Modal footer & buttons */
  .modal-footer {
    display: flex; gap: 10px; padding-top: 4px;
  }
  .modal-btn-cancel {
    flex: 1; padding: 10px 16px; border: 1.5px solid #e0e0e0; border-radius: 12px;
    background: #f7f7f5; color: #666; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s;
  }
  .modal-btn-cancel:hover { background: #eeeeec; color: #333; border-color: #ccc; }
  .modal-btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }
  .modal-btn-save {
    flex: 1; padding: 10px 16px; border: none; border-radius: 12px;
    background: #1a1a1a; color: #fff; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s;
  }
  .modal-btn-save:hover { background: #e07a5f; }
  .modal-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
  .modal-btn-save .mi, .modal-btn-cancel .mi { font-size: 15px; }

  /* Modal done state */
  .modal-done-state { text-align: center; padding: 8px 8px 4px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
  .modal-done-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
  .modal-done-icon.success { background: rgba(224,122,95,0.1); }
  .modal-done-icon.danger  { background: rgba(220,38,38,0.08); }
  .modal-done-icon.success .mi { font-size: 30px; color: #e07a5f; }
  .modal-done-icon.danger  .mi { font-size: 30px; color: #dc2626; }
  .modal-done-title { font-size: 16px; font-weight: 800; color: #1a1a1a; }
  .modal-done-sub   { font-size: 11.5px; color: #aaa; line-height: 1.65; max-width: 320px; }

  /* SPINNER */
  .modal-spinner {
    width: 13px; height: 13px; border: 2px solid currentColor;
    border-top-color: transparent; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }

  /* LOADING */
  .tr-loading {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; padding: 80px 20px; color: #aaa;
  }
  .tr-loading-spinner {
    width: 32px; height: 32px; border: 2.5px solid #e0e0e0;
    border-top-color: #e07a5f; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .tr-loading-text { font-size: 12px; font-weight: 600; color: #bbb; }

  @media (max-width: 640px) {
    .tr-main { padding: 12px 14px 48px; }
    .tr-fields-grid { grid-template-columns: 1fr; }
    .tr-field-full  { grid-column: 1; }
    .tr-step-name   { display: none; }
    .tr-prop-card-chips { display: none; }
    .modal-footer { flex-direction: column; }
    .tr-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function Transfers() {
  const { user } = useAuth();

  const [loading,       setLoading]       = useState(true);
  const [step,          setStep]          = useState(1);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitted,     setSubmitted]     = useState(false);
  const [errors,        setErrors]        = useState({});
  const [declared,      setDeclared]      = useState(false);
  const [uploadedDocs,  setUploadedDocs]  = useState({});
  const [selectedProp,  setSelectedProp]  = useState(null);
  const [buyer,         setBuyer]         = useState({ name: "", email: "", phone: "", aadhaar: "", saleValue: "" });
  const [properties,    setProperties]    = useState([]);
  const [outgoing,      setOutgoing]      = useState([]);
  const [activeOutgoingDetail, setActiveOutgoingDetail] = useState(null);
  const [incoming,      setIncoming]      = useState([]);
  const [activeIncomingDetail, setActiveIncomingDetail] = useState(null);
  const [showConfirm,   setShowConfirm]   = useState(false);

  const refreshData = useCallback(async () => {
    if (!user) return;
    try {
      const propRes  = await api.get("/properties/my-properties");
      setProperties(propRes.data);

      const transRes = await api.get("/transfers/my-transfers");
      const transfers = transRes.data;

      const out = transfers
        .filter(t => t.sellerName === user.name)
        .map(t => ({
          ...t,
          timeline: [
            { step: "Initiated", actor: "You",         date: "Today", done: true },
            { step: "Review",    actor: "Registrar",                  done: t.status !== "PENDING" },
          ],
        }));
      setOutgoing(out);

      const inc = transfers
        .filter(t => t.buyerName === user.name || t.buyerEmail === user.email)
        .map(t => ({
          ...t,
          ownershipTimeline: [
            { event: "Sale Initiated", from: t.sellerName, to: "You", status: "PENDING" },
          ],
        }));
      setIncoming(inc);
    } catch (err) {
      console.error("Failed to load transfer dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const setB = (k, v) => {
    setBuyer(b => ({ ...b, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = s => {
    const e = {};
    if (s === 1 && !selectedProp) e.prop = "Please select a property.";
    if (s === 2) {
      if (!buyer.name.trim())                              e.name    = "Buyer name is required.";
      if (!buyer.aadhaar.match(/^\d{12}$/))               e.aadhaar = "Enter a valid 12-digit Aadhaar.";
      if (!buyer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
      if (!buyer.phone.match(/^[6-9]\d{9}$/))            e.phone   = "Enter a valid 10-digit mobile number.";
      if (!buyer.saleValue.trim())                        e.saleValue = "Sale value is required.";
    }
    if (s === 3) {
      const missing = REQUIRED_DOCS.filter(d => d.required && !uploadedDocs[d.id]);
      if (missing.length) e.docs = `Please upload: ${missing.map(d => d.label).join(", ")}`;
    }
    if (s === 4 && !declared) e.declared = "Please accept the declaration to proceed.";
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const e = validate(4);
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoadingSubmit(true);
    try {
      await api.post("/transfers", {
        propertyId: selectedProp,
        buyerEmail: buyer.email,
        remarks: "Sale deed attached, buyer details verified.",
      });
      setSubmitted(true);
      refreshData();
    } catch (err) {
      console.error("Failed to submit transfer request", err);
      setErrors({ api: err.response?.data?.message || "Failed to initiate transfer." });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetWizard = () => {
    setStep(1); setSubmitted(false); setDeclared(false);
    setUploadedDocs({}); setSelectedProp(null);
    setBuyer({ name: "", email: "", phone: "", aadhaar: "", saleValue: "" });
    setErrors({});
  };

  const stepState = n => step === n ? "active" : step > n ? "done" : "inactive";
  const prop = properties.find(p => p.id === selectedProp);

  /* ── Stats ── */
  const totalTransfers  = outgoing.length + incoming.length;
  const pendingIncoming = incoming.length;
  const completedOut    = outgoing.filter(t => t.status === "COMPLETED" || t.status === "APPROVED").length;
  const pendingOut      = outgoing.filter(t => t.status === "PENDING").length;

  return (
    <>
      <style>{TRANSFERS_CSS}</style>

      <div className="tr-page">
        <div className="tr-main">

          {/* ══ TOP BAR ══ */}
          <div className="tr-topbar">
            <h1 className="tr-heading">
              Property <span>Transfers</span>
            </h1>
            <div className="tr-topbar-right">
              <div className="tr-meta-chip">
                <MIcon name="verified_user" />
                Seller · Buyer · Registrar workflow
              </div>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="tr-stats">
            <div className="tr-stat">
              <div className="tr-stat-label">Total Transfers</div>
              <div className="tr-stat-value">{totalTransfers}</div>
            </div>
            <div className="tr-stat">
              <div className="tr-stat-label">Incoming Pending</div>
              <div className={`tr-stat-value${pendingIncoming > 0 ? " warning" : ""}`}>{pendingIncoming}</div>
            </div>
            <div className="tr-stat">
              <div className="tr-stat-label">Outgoing Active</div>
              <div className={`tr-stat-value${pendingOut > 0 ? " warning" : ""}`}>{pendingOut}</div>
            </div>
            <div className="tr-stat">
              <div className="tr-stat-label">Completed</div>
              <div className={`tr-stat-value${completedOut > 0 ? " success" : ""}`}>{completedOut}</div>
            </div>
          </div>

          {/* ══ DASHBOARD ══ */}
          {loading ? (
            <div className="tr-loading">
              <div className="tr-loading-spinner" />
              <div className="tr-loading-text">Loading transfer data…</div>
            </div>
          ) : (
            <div className="tr-dashboard-grid">

              {/* ── LEFT: INITIATE TRANSFER WIZARD ── */}
              <div className="tr-section-zone">
                <div className="tr-section-header">
                  <div className="tr-section-title-row">
                    <div className="tr-section-title">
                      <MIcon name="swap_horiz" />
                      {submitted ? <>Transfer <span style={{ color: "#e07a5f" }}>Submitted!</span></> : <>Initiate <span style={{ color: "#e07a5f" }}>Transfer</span></>}
                    </div>
                  </div>
                  {!submitted && (
                    <span className="tr-step-pill">Step {step} of 4</span>
                  )}
                </div>

                {/* Step progress */}
                {!submitted && (
                  <div className="tr-progress-bar">
                    {STEPS.map((s, i) => {
                      const st = stepState(i + 1);
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "initial" }}>
                          <div className="tr-step-item">
                            <div className={`tr-step-bubble ${st}`}>
                              {st === "done" ? <MIcon name="check" /> : s.num}
                            </div>
                            <div className="tr-step-info">
                              <div className={`tr-step-name ${st}`}>{s.label}</div>
                            </div>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`tr-step-connector ${step > i + 1 ? "done" : ""}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="tr-section-body">
                  {submitted ? (
                    <div className="tr-success-wrap">
                      <div className="tr-success-icon">
                        <MIcon name="check_circle" />
                      </div>
                      <div className="tr-success-title">Request <span>Submitted!</span></div>
                      <div className="tr-success-sub">
                        Your transfer request has been queued for registrar review.<br />
                        The buyer will receive a confirmation request at <strong>{buyer.email}</strong>.
                      </div>
                      <div className="tr-success-actions">
                        <button className="tr-suc-btn-primary" onClick={resetWizard}>
                          <MIcon name="add" /> Initiate Another Transfer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* ─ Step 1: Select Property ─ */}
                      {step === 1 && (
                        properties.length === 0 ? (
                          <div className="tr-empty">
                            <MIcon name="home_work" />
                            <div className="tr-empty-title">No properties found</div>
                            <div className="tr-empty-sub">No registered properties found in your account.</div>
                          </div>
                        ) : (
                          <div className="tr-prop-list">
                            {errors.prop && (
                              <div className="tr-err-msg"><MIcon name="warning" /> {errors.prop}</div>
                            )}
                            {properties.map(p => {
                              const meta = TYPE_META[p.type] || TYPE_META.Residential;
                              const isSel = selectedProp === p.id;
                              return (
                                <div
                                  key={p.id}
                                  className={`tr-prop-card ${isSel ? "selected" : ""}`}
                                  onClick={() => { setSelectedProp(p.id); setErrors({}); }}
                                >
                                  {isSel && <div className="tr-prop-card-glow" />}
                                  <div className="tr-prop-icon-wrap">
                                    <MIcon name={meta.icon} />
                                  </div>
                                  <div className="tr-prop-card-body">
                                    <div className="tr-prop-card-id">{p.propertyId || p.id}</div>
                                    <div className="tr-prop-card-title">{p.title}</div>
                                    <div className="tr-prop-card-district">{p.district}, {p.state}</div>
                                  </div>
                                  <div className="tr-prop-card-chips">
                                    <div className="tr-prop-card-chip">
                                      <div className="tr-prop-card-chip-label">Type</div>
                                      <div className="tr-prop-card-chip-val">{p.type?.slice(0, 3) || "—"}</div>
                                    </div>
                                    <div className="tr-prop-card-chip">
                                      <div className="tr-prop-card-chip-label">Area</div>
                                      <div className="tr-prop-card-chip-val">{p.area?.split(" ")[0] || "—"}</div>
                                    </div>
                                  </div>
                                  <div className={`tr-prop-check ${isSel ? "checked" : ""}`}>
                                    <MIcon name="check" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )
                      )}

                      {/* ─ Step 2: Buyer Details ─ */}
                      {step === 2 && (
                        <div className="tr-fields-grid">
                          <div className="tr-field tr-field-full">
                            <div className="tr-label">Buyer Full Name</div>
                            <input className={`tr-input ${errors.name ? "error" : ""}`}
                              value={buyer.name} onChange={e => setB("name", e.target.value)}
                              placeholder="e.g. Arjun Sharma" />
                            {errors.name && <div className="tr-err-msg"><MIcon name="warning" />{errors.name}</div>}
                          </div>
                          <div className="tr-field">
                            <div className="tr-label">Email Address</div>
                            <input className={`tr-input ${errors.email ? "error" : ""}`}
                              value={buyer.email} onChange={e => setB("email", e.target.value)}
                              placeholder="buyer@email.com" />
                            {errors.email && <div className="tr-err-msg"><MIcon name="warning" />{errors.email}</div>}
                          </div>
                          <div className="tr-field">
                            <div className="tr-label">Mobile Number</div>
                            <input className={`tr-input ${errors.phone ? "error" : ""}`}
                              value={buyer.phone} onChange={e => setB("phone", e.target.value)}
                              placeholder="10-digit mobile" />
                            {errors.phone && <div className="tr-err-msg"><MIcon name="warning" />{errors.phone}</div>}
                          </div>
                          <div className="tr-field">
                            <div className="tr-label">Aadhaar Number</div>
                            <input className={`tr-input ${errors.aadhaar ? "error" : ""}`}
                              value={buyer.aadhaar} onChange={e => setB("aadhaar", e.target.value)}
                              placeholder="12-digit Aadhaar" maxLength={12} />
                            {errors.aadhaar && <div className="tr-err-msg"><MIcon name="warning" />{errors.aadhaar}</div>}
                          </div>
                          <div className="tr-field tr-field-full">
                            <div className="tr-label">Agreed Sale Value</div>
                            <input className={`tr-input ${errors.saleValue ? "error" : ""}`}
                              value={buyer.saleValue} onChange={e => setB("saleValue", e.target.value)}
                              placeholder='e.g. "₹ 45,00,000"' />
                            {errors.saleValue && <div className="tr-err-msg"><MIcon name="warning" />{errors.saleValue}</div>}
                          </div>
                        </div>
                      )}

                      {/* ─ Step 3: Documents ─ */}
                      {step === 3 && (
                        <div className="tr-doc-list">
                          {errors.docs && <div className="tr-err-msg"><MIcon name="warning" />{errors.docs}</div>}
                          {REQUIRED_DOCS.map(doc => {
                            const uploaded = !!uploadedDocs[doc.id];
                            return (
                              <div key={doc.id} className={`tr-doc-row ${uploaded ? "uploaded" : ""}`}>
                                <div className="tr-doc-icon">
                                  <MIcon name={uploaded ? "task" : "description"} />
                                </div>
                                <div className="tr-doc-name">{doc.label}</div>
                                <span className={`tr-doc-req-badge ${doc.required ? "" : "optional"}`}>
                                  {doc.required ? "Required" : "Optional"}
                                </span>
                                {uploaded ? (
                                  <div className="tr-doc-done-badge">
                                    <MIcon name="check_circle" /> Uploaded
                                  </div>
                                ) : (
                                  <button
                                    className="tr-doc-upload-btn"
                                    onClick={() => setUploadedDocs(d => ({ ...d, [doc.id]: true }))}
                                  >
                                    Upload
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* ─ Step 4: Review & Submit ─ */}
                      {step === 4 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {/* Property */}
                          <div className="tr-review-block">
                            <div className="tr-review-block-head">
                              <div className="tr-review-block-label">Selected Property</div>
                              <button className="tr-review-edit-btn" onClick={() => setStep(1)}>Edit</button>
                            </div>
                            <div className="tr-review-rows">
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Title</span>
                                <span className="tr-review-row-val">{prop?.title || "—"}</span>
                              </div>
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Property ID</span>
                                <span className="tr-review-row-val">{prop?.propertyId || prop?.id || "—"}</span>
                              </div>
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Location</span>
                                <span className="tr-review-row-val">{prop ? `${prop.district}, ${prop.state}` : "—"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Buyer */}
                          <div className="tr-review-block">
                            <div className="tr-review-block-head">
                              <div className="tr-review-block-label">Buyer Details</div>
                              <button className="tr-review-edit-btn" onClick={() => setStep(2)}>Edit</button>
                            </div>
                            <div className="tr-review-rows">
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Name</span>
                                <span className="tr-review-row-val">{buyer.name || "—"}</span>
                              </div>
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Email</span>
                                <span className="tr-review-row-val">{buyer.email || "—"}</span>
                              </div>
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Aadhaar</span>
                                <span className="tr-review-row-val">{buyer.aadhaar ? `XXXX-XXXX-${buyer.aadhaar.slice(-4)}` : "—"}</span>
                              </div>
                              <div className="tr-review-row">
                                <span className="tr-review-row-key">Sale Value</span>
                                <span className="tr-review-row-val accent">
                                  <MIcon name="currency_rupee" /> {buyer.saleValue || "—"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="tr-review-block">
                            <div className="tr-review-block-head">
                              <div className="tr-review-block-label">Documents</div>
                              <button className="tr-review-edit-btn" onClick={() => setStep(3)}>Edit</button>
                            </div>
                            <div className="tr-review-rows">
                              {REQUIRED_DOCS.map(doc => (
                                <div key={doc.id} className="tr-review-row">
                                  <span className="tr-review-row-key">{doc.label}</span>
                                  {uploadedDocs[doc.id]
                                    ? <span className="tr-review-row-val accent"><MIcon name="check_circle" /> Uploaded</span>
                                    : <span className="tr-review-row-val" style={{ color: "#ccc" }}>Not uploaded</span>
                                  }
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Declaration */}
                          <div
                            className={`tr-declaration ${declared ? "checked" : ""}`}
                            onClick={() => { setDeclared(d => !d); setErrors(e => ({ ...e, declared: "" })); }}
                          >
                            <div className={`tr-checkbox ${declared ? "checked" : ""}`}>
                              <MIcon name="check" />
                            </div>
                            <span className="tr-decl-text">
                              I hereby declare that all information provided is accurate and complete. I am the rightful owner of the selected property and authorise this transfer request to the buyer named above.
                            </span>
                          </div>
                          {errors.declared && <div className="tr-err-msg"><MIcon name="warning" />{errors.declared}</div>}
                          {errors.api     && <div className="tr-err-msg"><MIcon name="error" />{errors.api}</div>}
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="tr-nav" style={{ marginTop: 14 }}>
                        {step > 1 && (
                          <button className="tr-btn-back" onClick={() => setStep(s => s - 1)}>
                            <MIcon name="arrow_back" /> Back
                          </button>
                        )}
                        {step < 4 ? (
                          <button className="tr-btn-next" onClick={next}>
                            {STEPS[step].label} <MIcon name="arrow_forward" />
                          </button>
                        ) : (
                          <button className="tr-btn-next submit" onClick={handleSubmit} disabled={loadingSubmit}>
                            {loadingSubmit
                              ? <><span className="modal-spinner" /> Submitting…</>
                              : <>Submit Transfer <MIcon name="send" /></>
                            }
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="tr-dashboard-stack">

                {/* INCOMING REQUESTS */}
                <div className="tr-section-zone">
                  <div className="tr-section-header">
                    <div className="tr-section-title-row">
                      <div className="tr-section-title">
                        <MIcon name="move_to_inbox" />
                        Incoming <span style={{ color: "#e07a5f" }}>Requests</span>
                      </div>
                      {incoming.length > 0 && (
                        <span className="tr-count-pill warning">{incoming.length} pending</span>
                      )}
                    </div>
                  </div>
                  <div className="tr-section-body">
                    {incoming.length === 0 ? (
                      <div className="tr-empty">
                        <MIcon name="inbox" />
                        <div className="tr-empty-title">No incoming requests</div>
                        <div className="tr-empty-sub">Transfer requests requiring your confirmation as buyer will appear here.</div>
                      </div>
                    ) : (
                      <div className="tr-cards-list">
                        {incoming.map((t, i) => (
                          <div
                            key={t.id}
                            className="tr-inc-card"
                            style={{ animationDelay: `${i * 0.05}s` }}
                            onClick={() => { setActiveIncomingDetail(t); setShowConfirm(true); }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span className="tr-inc-pulse" />
                              <span className="tr-txn-card-id">{t.id}</span>
                            </div>
                            <div>
                              <div className="tr-txn-card-title">{t.propertyTitle}</div>
                              <div className="tr-txn-card-sub">From {t.sellerName}</div>
                            </div>
                            <div className="tr-inc-value">{t.saleValue}</div>
                            <div className="tr-inc-footer">
                              <span className="tr-txn-card-date">Sent {t.initiatedOn}</span>
                              <span className="tr-inc-badge">
                                Review <MIcon name="arrow_forward" style={{ fontSize: 12 }} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* OUTGOING STATUS */}
                <div className="tr-section-zone">
                  <div className="tr-section-header">
                    <div className="tr-section-title-row">
                      <div className="tr-section-title">
                        <MIcon name="outbox" />
                        Outgoing <span style={{ color: "#e07a5f" }}>Status</span>
                      </div>
                      {outgoing.length > 0 && (
                        <span className="tr-count-pill">{outgoing.length} total</span>
                      )}
                    </div>
                  </div>
                  <div className="tr-section-body">
                    {outgoing.length === 0 ? (
                      <div className="tr-empty">
                        <MIcon name="swap_horiz" />
                        <div className="tr-empty-title">No transfers initiated</div>
                        <div className="tr-empty-sub">Property transfers you initiate as seller will be tracked here.</div>
                      </div>
                    ) : (
                      <div className="tr-cards-list">
                        {outgoing.map((t, i) => {
                          const doneCount = t.timeline.filter(s => s.done).length;
                          return (
                            <div
                              key={t.id}
                              className="tr-txn-card"
                              style={{ animationDelay: `${i * 0.05}s` }}
                              onClick={() => setActiveOutgoingDetail(t)}
                            >
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                <div>
                                  <div className="tr-txn-card-id">{t.id}</div>
                                  <div className="tr-txn-card-title">{t.propertyTitle}</div>
                                  <div className="tr-txn-card-sub">{t.sellerName} → {t.buyerName}</div>
                                </div>
                                <div className="tr-txn-card-badge"
                                  style={{ background: "rgba(224,122,95,0.1)", color: "#e07a5f", flexShrink: 0 }}>
                                  {t.status}
                                </div>
                              </div>
                              <div className="tr-mini-steps">
                                {t.timeline.map((s, j) => (
                                  <div key={j} className={`tr-mini-step ${s.done ? "done" : j === doneCount ? "active" : ""}`} />
                                ))}
                              </div>
                              <div className="tr-txn-card-footer">
                                <span className="tr-txn-card-date">Initiated {t.initiatedOn}</span>
                                <span className="tr-txn-card-val">{t.saleValue}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* CONFIRM INCOMING MODAL */}
      {showConfirm && activeIncomingDetail && (
        <ConfirmModal
          transfer={activeIncomingDetail}
          onClose={() => { setShowConfirm(false); setActiveIncomingDetail(null); }}
          onConfirm={refreshData}
          onDecline={refreshData}
        />
      )}

      {/* OUTGOING DETAIL MODAL */}
      {activeOutgoingDetail && (
        <OutgoingDetailModal
          transfer={activeOutgoingDetail}
          onClose={() => setActiveOutgoingDetail(null)}
        />
      )}
    </>
  );
}