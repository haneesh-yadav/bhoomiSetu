import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const DISPUTE_TYPES = [
  { id: "ownership",   label: "Ownership Dispute",   icon: "gavel",      desc: "Challenge the legitimacy of a current owner"   },
  { id: "boundary",    label: "Boundary Dispute",    icon: "straighten", desc: "Dispute over property boundary or survey"      },
  { id: "encumbrance", label: "Encumbrance Dispute", icon: "lock",       desc: "Challenge an incorrect encumbrance record"     },
  { id: "fraud",       label: "Fraudulent Record",   icon: "report",     desc: "Report a suspected forged or tampered record"  },
];


/* ══════════════════════════════════════════════════
   CSS — UserDashboard design language
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
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Root ── */
  .dp-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .dp-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    max-width: 900px;
    margin: 0 auto;
  }

  /* ══ TOP BAR ══ */
  .dp-topbar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
  }
  .dp-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .dp-heading span { color: #e8533a; }
  .dp-topbar-right { display: flex; align-items: center; gap: 8px; }
  .dp-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .dp-meta-chip .mi { font-size: 13px; color: #aaa; }
  .dp-back-btn {
    background: #f0f0f0; color: #555; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .dp-back-btn:hover { background: #e8e8e8; color: #111; }
  .dp-back-btn .mi { font-size: 14px; }

  /* ══ TAB STRIP ══ */
  .dp-tab-strip {
    display: flex; gap: 6px;
  }
  .dp-tab-btn {
    display: flex; align-items: center; gap: 6px;
    border: none; border-radius: 11px;
    padding: 8px 16px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
    background: #f0f0f0; color: #888;
  }
  .dp-tab-btn .mi { font-size: 14px; }
  .dp-tab-btn:hover { background: #e8e8e8; color: #444; }
  .dp-tab-btn.active { background: #1a1a1a; color: #fff; }
  .dp-tab-count {
    background: rgba(255,255,255,0.15); color: inherit;
    border-radius: 20px; padding: 1px 7px;
    font-size: 9.5px; font-weight: 700;
  }
  .dp-tab-btn:not(.active) .dp-tab-count { background: rgba(0,0,0,0.07); }

  /* ══ ZONE (section card — matches ud-zone) ══ */
  .dp-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 14px;
    animation: fadeUp 0.3s ease both;
  }
  .dp-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .dp-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .dp-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .dp-zone-title span { color: #e8533a; }
  .dp-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .dp-zone-pill.accent { background: rgba(232,83,58,0.12); color: #e8533a; }
  .dp-zone-action {
    font-size: 10.5px; font-weight: 600; color: #888;
    background: none; border: none; font-family: inherit;
    cursor: pointer; display: flex; align-items: center; gap: 3px;
    transition: color 0.15s;
  }
  .dp-zone-action:hover { color: #1a1a1a; }
  .dp-zone-action .mi { font-size: 13px; }

  /* ══ DISPUTE CARDS (My Disputes list) ══ */
  .dp-disputes-list { display: flex; flex-direction: column; gap: 8px; }
  .dp-dispute-row {
    background: #f0f0f0; border-radius: 18px; padding: 14px 16px;
    display: flex; align-items: flex-start; gap: 12px;
    animation: fadeUp 0.3s ease both;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .dp-dispute-row:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }

  .dp-dispute-icon-wrap {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(232,83,58,0.12);
  }
  .dp-dispute-icon-wrap .mi { font-size: 17px; color: #e8533a; }

  .dp-dispute-body { flex: 1; min-width: 0; }
  .dp-dispute-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 2px;
  }
  .dp-dispute-type {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; margin-bottom: 2px;
  }
  .dp-dispute-desc { font-size: 10px; font-weight: 500; color: #aaa; line-height: 1.5; }

  .dp-dispute-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0;
  }
  .dp-status-pill {
    font-size: 9px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
    display: flex; align-items: center; gap: 4px;
  }
  .dp-status-pill .pdot { width: 5px; height: 5px; border-radius: 50%; }
  .s-orange { color: #b07a00; background: rgba(255,185,0,0.14); }
  .d-orange  { background: #e0a020; }
  .s-green   { color: #2a7a55; background: #e6f8ef; }
  .d-green   { background: #2a7a55; }
  .s-red     { color: #c0392b; background: rgba(240,80,80,0.12); }
  .d-red     { background: #c0392b; }
  .s-purple  { color: #5B4FD4; background: rgba(91,79,212,0.12); }
  .d-purple  { background: #5B4FD4; }
  .dp-dispute-meta {
    font-family: 'DM Mono', monospace; font-size: 8.5px; color: #bbb;
    white-space: nowrap;
  }
  .dp-dispute-prop {
    font-family: 'DM Mono', monospace; font-size: 8.5px; color: #5B4FD4;
  }

  /* ══ EMPTY STATE ══ */
  .dp-empty {
    background: rgba(240,240,240,0.4); border: 1.5px dashed #d0d0d0;
    border-radius: 24px; padding: 48px 32px;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    text-align: center;
  }
  .dp-empty-icon-wrap {
    width: 56px; height: 56px; border-radius: 16px;
    background: #f0f0f0; display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .dp-empty-icon-wrap .mi { font-size: 26px; color: #ccc; }
  .dp-empty-title { font-size: 15px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .dp-empty-sub   { font-size: 11.5px; color: #aaa; }
  .dp-empty-btn {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 13px; padding: 10px 20px; margin-top: 6px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: background 0.15s;
  }
  .dp-empty-btn:hover { background: #2a2a2a; }
  .dp-empty-btn .mi { font-size: 15px; }

  /* ══ STEP PROGRESS ══ */
  .dp-steps { display: flex; gap: 8px; }
  .dp-step {
    flex: 1; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 9px;
    background: #f0f0f0; transition: background 0.2s;
  }
  .dp-step.active { background: #1a1a1a; }
  .dp-step.done   { background: #2a1a10; }
  .dp-step-num {
    width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    background: rgba(0,0,0,0.06); color: #aaa;
  }
  .dp-step.active .dp-step-num { background: rgba(255,255,255,0.1); color: #fff; }
  .dp-step.done   .dp-step-num { background: rgba(232,83,58,0.3); color: #ffb380; }
  .dp-step-label { font-size: 10.5px; font-weight: 600; color: #bbb; }
  .dp-step.active .dp-step-label { color: #fff; }
  .dp-step.done   .dp-step-label { color: #e8533a; }

  /* ══ DISPUTE TYPE GRID ══ */
  .dp-type-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .dp-type-card {
    background: #f0f0f0; border-radius: 18px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; position: relative; overflow: hidden;
    border: 2px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s, background 0.15s;
  }
  .dp-type-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .dp-type-card.selected {
    background: #2a1a10; border-color: #e8533a;
    box-shadow: 0 8px 24px rgba(232,83,58,0.15);
  }
  .dp-type-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(232,83,58,0.1);
  }
  .dp-type-icon-wrap .mi { font-size: 16px; color: #e8533a; }
  .dp-type-card.selected .dp-type-icon-wrap { background: rgba(232,83,58,0.2); }
  .dp-type-card.selected .dp-type-icon-wrap .mi { color: #ffb380; }
  .dp-type-check {
    position: absolute; top: 10px; right: 10px;
    width: 18px; height: 18px; border-radius: 5px;
    background: rgba(232,83,58,0.25); color: #ffb380;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.15s;
  }
  .dp-type-card.selected .dp-type-check { opacity: 1; }
  .dp-type-check .mi { font-size: 12px; }
  .dp-type-label {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3;
  }
  .dp-type-card.selected .dp-type-label { color: #fff; }
  .dp-type-desc { font-size: 10px; font-weight: 500; color: #aaa; line-height: 1.5; }
  .dp-type-card.selected .dp-type-desc { color: #555; }

  /* ══ PROPERTY LIST ══ */
  .dp-prop-list { display: flex; flex-direction: column; gap: 8px; }
  .dp-prop-row {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    border: 2px solid transparent;
    cursor: pointer; transition: transform 0.15s, border-color 0.15s, background 0.15s;
  }
  .dp-prop-row:hover { transform: translateY(-1px); border-color: #ddd; }
  .dp-prop-row.selected { background: #2a1a10; border-color: #e8533a; }
  .dp-prop-icon-wrap {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(232,83,58,0.1);
  }
  .dp-prop-icon-wrap .mi { font-size: 15px; color: #e8533a; }
  .dp-prop-row.selected .dp-prop-icon-wrap { background: rgba(232,83,58,0.2); }
  .dp-prop-row.selected .dp-prop-icon-wrap .mi { color: #ffb380; }
  .dp-prop-body { flex: 1; min-width: 0; }
  .dp-prop-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 1px;
  }
  .dp-prop-row.selected .dp-prop-id { color: #555; }
  .dp-prop-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .dp-prop-row.selected .dp-prop-title { color: #fff; }
  .dp-prop-meta { font-size: 9.5px; font-weight: 500; color: #aaa; margin-top: 1px; }
  .dp-prop-row.selected .dp-prop-meta { color: #555; }
  .dp-prop-check-box {
    width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0;
    border: 2px solid #ddd;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .dp-prop-row.selected .dp-prop-check-box {
    background: rgba(232,83,58,0.3); border-color: #e8533a; color: #ffb380;
  }
  .dp-prop-check-box .mi { font-size: 12px; }

  /* ══ FORM FIELDS ══ */
  .dp-fields { display: flex; flex-direction: column; gap: 14px; }
  .dp-field  { display: flex; flex-direction: column; gap: 6px; }
  .dp-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: #888;
  }
  .dp-input {
    padding: 10px 14px;
    border: 1.5px solid #e0e0e0; border-radius: 12px;
    background: #f0f0f0;
    font-size: 13px; font-family: 'Poppins', sans-serif; font-weight: 500;
    color: #1a1a1a; outline: none; transition: all 0.15s;
  }
  .dp-input:focus { border-color: #e8533a; background: #fff; }
  .dp-input::placeholder { color: #bbb; }
  .dp-input.error { border-color: #e05548; }
  .dp-textarea { resize: vertical; min-height: 110px; }
  .dp-error-msg {
    font-size: 10px; font-weight: 700; color: #e05548;
    display: flex; align-items: center; gap: 4px;
  }
  .dp-error-msg .mi { font-size: 12px; }

  /* Evidence drop zone */
  .dp-evidence-zone {
    border: 1.5px dashed #d0d0d0; border-radius: 14px;
    padding: 20px; text-align: center; cursor: pointer;
    background: #f0f0f0; transition: all 0.18s;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .dp-evidence-zone:hover { border-color: #bbb; background: #ebebeb; }
  .dp-evidence-zone.uploaded { border-color: #2EC4A0; background: rgba(46,196,160,0.06); }
  .dp-evidence-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center;
  }
  .dp-evidence-icon .mi { font-size: 18px; color: #bbb; }
  .dp-evidence-zone.uploaded .dp-evidence-icon { background: rgba(46,196,160,0.12); }
  .dp-evidence-zone.uploaded .dp-evidence-icon .mi { color: #2EC4A0; }
  .dp-evidence-label { font-size: 11.5px; font-weight: 600; color: #aaa; }
  .dp-evidence-zone.uploaded .dp-evidence-label { color: #2EC4A0; font-weight: 700; }
  .dp-evidence-sub { font-size: 9.5px; color: #ccc; }

  /* ══ NAV BUTTONS ══ */
  .dp-nav { display: flex; gap: 8px; align-items: center; }
  .dp-btn-back {
    background: #f0f0f0; color: #555; border: none;
    border-radius: 13px; padding: 11px 18px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s; white-space: nowrap;
  }
  .dp-btn-back:hover { background: #e8e8e8; color: #111; }
  .dp-btn-back .mi { font-size: 15px; }
  .dp-btn-next {
    flex: 1; background: #1a1a1a; color: #fff; border: none;
    border-radius: 13px; padding: 12px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .dp-btn-next:hover { background: #2a2a2a; }
  .dp-btn-next:disabled { opacity: 0.45; cursor: not-allowed; }
  .dp-btn-submit {
    flex: 1; background: #e8533a; color: #fff; border: none;
    border-radius: 13px; padding: 12px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .dp-btn-submit:hover { background: #d44830; }
  .dp-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .dp-btn-submit .mi, .dp-btn-next .mi, .dp-btn-back .mi { font-size: 15px; }
  .spinner {
    width: 15px; height: 15px;
    border: 2.5px solid currentColor; border-top-color: transparent;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ══ SUCCESS STATE ══ */
  .dp-success-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px; padding: 48px 32px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center; animation: fadeUp 0.4s ease both;
  }
  .dp-success-icon-wrap {
    width: 64px; height: 64px; border-radius: 18px;
    background: #2a1a10; display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .dp-success-icon-wrap .mi { font-size: 30px; color: #e8533a; }
  .dp-success-title {
    font-size: 20px; font-weight: 800; letter-spacing: -0.4px; color: #1a1a1a;
  }
  .dp-success-sub {
    font-size: 12px; color: #999; line-height: 1.7; max-width: 380px;
  }
  .dp-success-ref {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #e8533a;
    background: rgba(232,83,58,0.08); border-radius: 9px; padding: 6px 14px;
    margin: 4px 0;
  }
  .dp-success-actions {
    display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px;
  }
  .dp-success-btn-primary {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 13px; padding: 11px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .dp-success-btn-primary:hover { background: #2a2a2a; }
  .dp-success-btn-ghost {
    background: #f0f0f0; color: #555; border: none;
    border-radius: 13px; padding: 11px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .dp-success-btn-ghost:hover { background: #e8e8e8; color: #111; }
  .dp-success-btn-primary .mi,
  .dp-success-btn-ghost .mi { font-size: 15px; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 600px) {
    .dp-main { padding: 10px 10px 48px; }
    .dp-type-grid { grid-template-columns: 1fr; }
    .dp-step-label { display: none; }
    .dp-nav { flex-direction: column-reverse; }
    .dp-btn-back { width: 100%; justify-content: center; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

const STEPS = ["Type", "Property", "Details"];

function statusMeta(cls) {
  if (cls === "orange") return { pillCls: "s-orange", dotCls: "d-orange" };
  if (cls === "green")  return { pillCls: "s-green",  dotCls: "d-green"  };
  if (cls === "red")    return { pillCls: "s-red",    dotCls: "d-red"    };
  return { pillCls: "s-purple", dotCls: "d-purple" };
}

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Disputes() {
  const { user, logout } = useAuth();

  const [activeTab,        setTab]      = useState("my");
  const [step,             setStep]     = useState(1);
  const [loading,          setLoading]  = useState(false);
  const [submitted,        setSubmitted]= useState(false);
  const [errors,           setErrors]   = useState({});
  const [dType,            setDType]    = useState(null);
  const [selectedProp,     setSProp]    = useState(null);
  const [description,      setDesc]     = useState("");
  const [uploadedEvidence, setEvidence] = useState(false);

  const [properties, setProperties] = useState([]);
  const [myDisputes, setMyDisputes] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/properties/my-properties')
        .then(res => setProperties(res.data))
        .catch(console.error);
      api.get('/disputes/my-disputes')
        .then(res => setMyDisputes(res.data))
        .catch(console.error);
    }
  }, [user]);

  const validate = (s) => {
    const e = {};
    if (s === 1 && !dType)               e.type = "Please select a dispute type.";
    if (s === 2 && !selectedProp)        e.prop = "Please select a property.";
    if (s === 3 && !description.trim())  e.desc = "Please describe the dispute.";
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (step < 3) setStep(s => s + 1); else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/disputes', {
        propertyId: selectedProp,
        caseNumber: dType, // storing type in caseNumber
        description: description
      });
      const res = await api.get('/disputes/my-disputes');
      setMyDisputes(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ type: "Failed to submit dispute." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dp-page">

        <div className="dp-main">

          {/* ══ TOP BAR ══ */}
          <div className="dp-topbar">
            <div className="dp-heading">
              Property <span>Disputes</span>
            </div>
            <div className="dp-topbar-right">
              <div className="dp-meta-chip">
                <MI name="gavel" /> Dispute Management
              </div>
            </div>
          </div>

          {/* ══ TAB STRIP ══ */}
          <div className="dp-tab-strip">
            <button
              className={`dp-tab-btn${activeTab === "my" ? " active" : ""}`}
              onClick={() => setTab("my")}
            >
              <MI name="folder_open" /> My Disputes
              <span className="dp-tab-count">{myDisputes.length}</span>
            </button>
            <button
              className={`dp-tab-btn${activeTab === "file" ? " active" : ""}`}
              onClick={() => { setTab("file"); setStep(1); setSubmitted(false); }}
            >
              <MI name="add_circle" /> File New Dispute
            </button>
          </div>

          {/* ══ MY DISPUTES TAB ══ */}
          {activeTab === "my" && (
            myDisputes.length === 0 ? (
              <div className="dp-empty">
                <div className="dp-empty-icon-wrap"><MI name="gavel" /></div>
                <div className="dp-empty-title">No disputes filed</div>
                <div className="dp-empty-sub">You haven't raised any property disputes yet.</div>
                <button className="dp-empty-btn" onClick={() => setTab("file")}>
                  <MI name="add" /> File a Dispute
                </button>
              </div>
            ) : (
              <div className="dp-zone">
                <div className="dp-zone-header">
                  <div className="dp-zone-title-row">
                    <div className="dp-zone-title">My <span>Disputes</span></div>
                    <div className="dp-zone-pill">{myDisputes.length} total</div>
                  </div>
                  <button className="dp-zone-action" onClick={() => { setTab("file"); setStep(1); setSubmitted(false); }}>
                    File new <MI name="add" />
                  </button>
                </div>
                <div className="dp-disputes-list">
                  {myDisputes.map((d, i) => {
                    const statusText = d.status === "ACTIVE" ? "Under Investigation" : d.status;
                    const statusCls = d.status === "ACTIVE" ? "orange" : (d.status === "RESOLVED" ? "green" : "red");
                    const { pillCls, dotCls } = statusMeta(statusCls);
                    const filedOn = d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently";
                    
                    return (
                      <div key={i} className="dp-dispute-row" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="dp-dispute-icon-wrap"><MI name="gavel" /></div>
                        <div className="dp-dispute-body">
                          <div className="dp-dispute-id">DSP-{d.id}</div>
                          <div className="dp-dispute-type">{d.caseNumber || "Dispute"}</div>
                          <div className="dp-dispute-desc">{d.description}</div>
                        </div>
                        <div className="dp-dispute-right">
                          <div className={`dp-status-pill ${pillCls}`}>
                            <div className={`pdot ${dotCls}`} />
                            {statusText}
                          </div>
                          <div className="dp-dispute-prop">PROP-{d.propertyId}</div>
                          <div className="dp-dispute-meta">Filed {filedOn}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* ══ FILE NEW DISPUTE TAB ══ */}
          {activeTab === "file" && (
            submitted ? (
              <div className="dp-success-zone">
                <div className="dp-success-icon-wrap"><MI name="gavel" /></div>
                <div className="dp-success-title">Dispute Filed!</div>
                <div className="dp-success-sub">
                  Your dispute has been submitted for investigation.<br />
                  The Sub-Registrar will review and update the status.
                </div>
                <div className="dp-success-ref">
                  REF: DSP-{Date.now().toString().slice(-8)}
                </div>
                <div className="dp-success-actions">
                  <button className="dp-success-btn-primary" onClick={() => { setTab("my"); setSubmitted(false); }}>
                    <MI name="folder_open" /> View My Disputes
                  </button>
                  <button className="dp-success-btn-ghost" onClick={() => { setStep(1); setSubmitted(false); setDType(null); setSProp(null); setDesc(""); setEvidence(false); }}>
                    <MI name="add" /> File Another
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Step progress */}
                <div className="dp-steps">
                  {STEPS.map((label, i) => {
                    const num = i + 1;
                    const isActive = num === step;
                    const isDone   = num < step;
                    return (
                      <div key={num} className={`dp-step${isActive ? " active" : isDone ? " done" : ""}`}>
                        <div className="dp-step-num">
                          {isDone ? <MI name="check" style={{ fontSize: 11 }} /> : num}
                        </div>
                        <div className="dp-step-label">{label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Step 1 — Dispute Type */}
                {step === 1 && (
                  <div className="dp-zone">
                    <div className="dp-zone-header">
                      <div className="dp-zone-title-row">
                        <div className="dp-zone-title">Select <span>Dispute Type</span></div>
                      </div>
                      <div className="dp-zone-pill accent">Step 1 of 3</div>
                    </div>
                    <div className="dp-type-grid">
                      {DISPUTE_TYPES.map((d, i) => (
                        <div
                          key={d.id}
                          className={`dp-type-card${dType === d.id ? " selected" : ""}`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                          onClick={() => { setDType(d.id); setErrors({}); }}
                        >
                          <div className="dp-type-check"><MI name="check" /></div>
                          <div className="dp-type-icon-wrap"><MI name={d.icon} /></div>
                          <div className="dp-type-label">{d.label}</div>
                          <div className="dp-type-desc">{d.desc}</div>
                        </div>
                      ))}
                    </div>
                    {errors.type && <div className="dp-error-msg"><MI name="error_outline" />{errors.type}</div>}
                  </div>
                )}

                {/* Step 2 — Select Property */}
                {step === 2 && (
                  <div className="dp-zone">
                    <div className="dp-zone-header">
                      <div className="dp-zone-title-row">
                        <div className="dp-zone-title">Select <span>Property</span></div>
                        <div className="dp-zone-pill">{properties.length} total</div>
                      </div>
                      <div className="dp-zone-pill accent">Step 2 of 3</div>
                    </div>
                    <div className="dp-prop-list">
                      {properties.map(p => (
                        <div
                          key={p.id}
                          className={`dp-prop-row${selectedProp === p.id ? " selected" : ""}`}
                          onClick={() => { setSProp(p.id); setErrors({}); }}
                        >
                          <div className="dp-prop-icon-wrap"><MI name="home" /></div>
                          <div className="dp-prop-body">
                            <div className="dp-prop-id">{p.id}</div>
                            <div className="dp-prop-title">{p.title}</div>
                            <div className="dp-prop-meta">{p.area} · {p.district}</div>
                          </div>
                          <div className="dp-prop-check-box">
                            {selectedProp === p.id && <MI name="check" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.prop && <div className="dp-error-msg"><MI name="error_outline" />{errors.prop}</div>}
                  </div>
                )}

                {/* Step 3 — Describe & Evidence */}
                {step === 3 && (
                  <div className="dp-zone">
                    <div className="dp-zone-header">
                      <div className="dp-zone-title-row">
                        <div className="dp-zone-title">Describe the <span>Dispute</span></div>
                      </div>
                      <div className="dp-zone-pill accent">Step 3 of 3</div>
                    </div>
                    <div className="dp-fields">
                      <div className="dp-field">
                        <label className="dp-label">Description of Dispute</label>
                        <textarea
                          className={`dp-input dp-textarea${errors.desc ? " error" : ""}`}
                          value={description}
                          onChange={e => { setDesc(e.target.value); setErrors({}); }}
                          placeholder="Describe the issue in detail — what is incorrect, why you believe it's wrong, and any relevant dates..."
                        />
                        {errors.desc && <div className="dp-error-msg"><MI name="error_outline" />{errors.desc}</div>}
                      </div>
                      <div className="dp-field">
                        <label className="dp-label">Supporting Evidence <span style={{ fontWeight: 500, opacity: 0.5 }}>(optional)</span></label>
                        <div
                          className={`dp-evidence-zone${uploadedEvidence ? " uploaded" : ""}`}
                          onClick={() => setEvidence(true)}
                        >
                          <div className="dp-evidence-icon">
                            <MI name={uploadedEvidence ? "check_circle" : "upload_file"} />
                          </div>
                          <div className="dp-evidence-label">
                            {uploadedEvidence ? "Evidence uploaded" : "Click to upload documents or photos"}
                          </div>
                          {!uploadedEvidence && (
                            <div className="dp-evidence-sub">PDF, JPG, PNG up to 10 MB</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav */}
                <div className="dp-nav">
                  {step > 1 && (
                    <button className="dp-btn-back" onClick={() => setStep(s => s - 1)}>
                      <MI name="arrow_back" /> Back
                    </button>
                  )}
                  {step < 3
                    ? (
                      <button className="dp-btn-next" onClick={next}>
                        Continue <MI name="arrow_forward" />
                      </button>
                    ) : (
                      <button className="dp-btn-submit" onClick={next} disabled={loading}>
                        {loading ? <><span className="spinner" /> Submitting…</> : <>Submit Dispute <MI name="send" /></>}
                      </button>
                    )
                  }
                </div>
              </>
            )
          )}

        </div>
      </div>
    </>
  );
}