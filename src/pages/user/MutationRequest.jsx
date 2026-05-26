import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

const MUTATION_TYPES = [
  { id: "inheritance", label: "Inheritance / Succession", icon: "family_restroom", desc: "Transfer ownership to legal heirs after owner's death" },
  { id: "correction",  label: "Survey Correction",        icon: "straighten",      desc: "Correct survey number, area or boundary records"      },
  { id: "partition",   label: "Property Partition",       icon: "call_split",      desc: "Divide a single property into multiple sub-plots"     },
  { id: "name_change", label: "Name Change",              icon: "edit",            desc: "Update owner name due to legal name change"           },
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
  .mr-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .mr-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    max-width: 860px;
    margin: 0 auto;
  }

  /* ══ TOP BAR ══ */
  .mr-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .mr-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .mr-heading span { color: #5B4FD4; }
  .mr-topbar-right { display: flex; align-items: center; gap: 8px; }
  .mr-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .mr-meta-chip .mi { font-size: 13px; color: #aaa; }
  .mr-back-btn {
    background: #f0f0f0; color: #555; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .mr-back-btn:hover { background: #e8e8e8; color: #111; }
  .mr-back-btn .mi { font-size: 14px; }

  /* ══ STEP PROGRESS STRIP ══ */
  .mr-steps {
    display: flex; gap: 8px;
  }
  .mr-step {
    flex: 1; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 9px;
    background: #f0f0f0;
    transition: background 0.2s;
    position: relative; overflow: hidden;
  }
  .mr-step.active  { background: #1a1a1a; }
  .mr-step.done    { background: #1e1a38; }
  .mr-step-num {
    width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    background: rgba(0,0,0,0.06); color: #aaa;
  }
  .mr-step.active .mr-step-num { background: rgba(255,255,255,0.1); color: #fff; }
  .mr-step.done   .mr-step-num { background: rgba(91,79,212,0.3); color: #c8c2ff; }
  .mr-step-label {
    font-size: 10.5px; font-weight: 600; color: #bbb;
    display: none;
  }
  .mr-step.active .mr-step-label { color: #fff; display: block; }
  .mr-step.done   .mr-step-label { color: #7c6ef5; display: block; }

  /* ══ ZONE (section card — matches ud-zone) ══ */
  .mr-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 14px;
    animation: fadeUp 0.3s ease both;
  }
  .mr-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .mr-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .mr-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .mr-zone-title span { color: #5B4FD4; }
  .mr-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .mr-zone-pill.purple { background: rgba(91,79,212,0.12); color: #5B4FD4; }

  /* ══ MUTATION TYPE GRID ══ */
  .mr-type-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  }
  .mr-type-card {
    background: #f0f0f0; border-radius: 18px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; position: relative; overflow: hidden;
    border: 2px solid transparent;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s, background 0.15s;
  }
  .mr-type-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .mr-type-card.selected {
    background: #1a1a1a; border-color: #5B4FD4;
    box-shadow: 0 8px 24px rgba(91,79,212,0.15);
  }
  .mr-type-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(91,79,212,0.1);
  }
  .mr-type-icon-wrap .mi { font-size: 16px; color: #5B4FD4; }
  .mr-type-card.selected .mr-type-icon-wrap { background: rgba(91,79,212,0.2); }
  .mr-type-card.selected .mr-type-icon-wrap .mi { color: #c8c2ff; }
  .mr-type-check {
    position: absolute; top: 10px; right: 10px;
    width: 18px; height: 18px; border-radius: 5px;
    background: rgba(91,79,212,0.25); color: #c8c2ff;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.15s;
  }
  .mr-type-card.selected .mr-type-check { opacity: 1; }
  .mr-type-check .mi { font-size: 12px; }
  .mr-type-label {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3;
  }
  .mr-type-card.selected .mr-type-label { color: #fff; }
  .mr-type-desc { font-size: 10px; font-weight: 500; color: #aaa; line-height: 1.5; }
  .mr-type-card.selected .mr-type-desc { color: #555; }

  /* ══ PROPERTY LIST ══ */
  .mr-prop-list { display: flex; flex-direction: column; gap: 8px; }
  .mr-prop-row {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    border: 2px solid transparent;
    cursor: pointer; transition: transform 0.15s, border-color 0.15s, background 0.15s;
  }
  .mr-prop-row:hover { transform: translateY(-1px); border-color: #ddd; }
  .mr-prop-row.selected {
    background: #1a1a1a; border-color: #5B4FD4;
  }
  .mr-prop-icon-wrap {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(91,79,212,0.1);
  }
  .mr-prop-icon-wrap .mi { font-size: 15px; color: #5B4FD4; }
  .mr-prop-row.selected .mr-prop-icon-wrap { background: rgba(91,79,212,0.2); }
  .mr-prop-row.selected .mr-prop-icon-wrap .mi { color: #c8c2ff; }
  .mr-prop-body { flex: 1; min-width: 0; }
  .mr-prop-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 1px;
  }
  .mr-prop-row.selected .mr-prop-id { color: #444; }
  .mr-prop-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .mr-prop-row.selected .mr-prop-title { color: #fff; }
  .mr-prop-meta { font-size: 9.5px; font-weight: 500; color: #aaa; margin-top: 1px; }
  .mr-prop-row.selected .mr-prop-meta { color: #555; }
  .mr-prop-check-box {
    width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0;
    border: 2px solid #ddd;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .mr-prop-row.selected .mr-prop-check-box {
    background: rgba(91,79,212,0.3); border-color: #5B4FD4; color: #c8c2ff;
  }
  .mr-prop-check-box .mi { font-size: 12px; }

  /* ══ FORM FIELDS ══ */
  .mr-fields { display: flex; flex-direction: column; gap: 14px; }
  .mr-field  { display: flex; flex-direction: column; gap: 6px; }
  .mr-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: #888;
  }
  .mr-input {
    padding: 10px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 12px;
    background: #f0f0f0;
    font-size: 13px; font-family: 'Poppins', sans-serif; font-weight: 500;
    color: #1a1a1a; outline: none;
    transition: all 0.15s;
  }
  .mr-input:focus { border-color: #5B4FD4; background: #fff; }
  .mr-input::placeholder { color: #bbb; }
  .mr-input.error { border-color: #e05548; }
  .mr-textarea { resize: vertical; min-height: 96px; }
  .mr-error-msg {
    font-size: 10px; font-weight: 700; color: #e05548;
    display: flex; align-items: center; gap: 4px;
  }
  .mr-error-msg .mi { font-size: 12px; }

  /* ══ DOC UPLOAD ══ */
  .mr-doc-list { display: flex; flex-direction: column; gap: 8px; }
  .mr-doc-item {
    background: #f0f0f0; border-radius: 14px; padding: 11px 14px;
    display: flex; align-items: center; gap: 10px;
    border: 1.5px solid transparent;
    transition: border-color 0.15s;
  }
  .mr-doc-item.uploaded { border-color: #2EC4A0; background: rgba(46,196,160,0.06); }
  .mr-doc-icon-wrap {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.05);
  }
  .mr-doc-icon-wrap .mi { font-size: 15px; color: #aaa; }
  .mr-doc-item.uploaded .mr-doc-icon-wrap { background: rgba(46,196,160,0.12); }
  .mr-doc-item.uploaded .mr-doc-icon-wrap .mi { color: #2EC4A0; }
  .mr-doc-label { flex: 1; font-size: 11.5px; font-weight: 600; color: #1a1a1a; }
  .mr-doc-btn {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 9px; padding: 5px 12px;
    font-family: 'Poppins', sans-serif; font-size: 10.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 4px;
    transition: background 0.15s; flex-shrink: 0;
  }
  .mr-doc-btn:hover { background: #2a2a2a; }
  .mr-doc-btn .mi { font-size: 13px; }
  .mr-doc-done {
    font-size: 10.5px; font-weight: 700; color: #2EC4A0;
    display: flex; align-items: center; gap: 4px;
  }
  .mr-doc-done .mi { font-size: 13px; }

  /* ══ REVIEW TABLE ══ */
  .mr-review-rows { display: flex; flex-direction: column; gap: 0; }
  .mr-review-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #eee;
  }
  .mr-review-row:last-child { border-bottom: none; }
  .mr-review-key {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.05em; color: #aaa;
  }
  .mr-review-val { font-size: 12px; font-weight: 700; color: #1a1a1a; }
  .mr-review-val.mono { font-family: 'DM Mono', monospace; font-size: 11px; color: #5B4FD4; }

  /* ══ NAV BUTTONS ══ */
  .mr-nav {
    display: flex; gap: 8px; align-items: center;
  }
  .mr-btn-back {
    background: #f0f0f0; color: #555; border: none;
    border-radius: 13px; padding: 11px 18px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s; white-space: nowrap;
  }
  .mr-btn-back:hover { background: #e8e8e8; color: #111; }
  .mr-btn-back .mi { font-size: 15px; }
  .mr-btn-next {
    flex: 1; background: #1a1a1a; color: #fff; border: none;
    border-radius: 13px; padding: 12px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .mr-btn-next:hover { background: #2a2a2a; }
  .mr-btn-next:disabled { opacity: 0.45; cursor: not-allowed; }
  .mr-btn-next .mi { font-size: 16px; }
  .mr-btn-submit {
    flex: 1; background: #5B4FD4; color: #fff; border: none;
    border-radius: 13px; padding: 12px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .mr-btn-submit:hover { background: #4a40c0; }
  .mr-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .mr-btn-submit .mi { font-size: 16px; }
  .spinner {
    width: 15px; height: 15px;
    border: 2.5px solid currentColor; border-top-color: transparent;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ══ SUCCESS STATE ══ */
  .mr-success-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px; padding: 48px 32px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    text-align: center; animation: fadeUp 0.4s ease both;
  }
  .mr-success-icon-wrap {
    width: 64px; height: 64px; border-radius: 18px;
    background: #1a1a1a; display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .mr-success-icon-wrap .mi { font-size: 30px; color: #2EC4A0; }
  .mr-success-title {
    font-size: 20px; font-weight: 800; letter-spacing: -0.4px; color: #1a1a1a;
  }
  .mr-success-sub {
    font-size: 12px; color: #999; line-height: 1.7; max-width: 380px;
  }
  .mr-success-ref {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #5B4FD4;
    background: rgba(91,79,212,0.08); border-radius: 9px; padding: 6px 14px;
    margin: 4px 0;
  }
  .mr-success-actions {
    display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px;
  }
  .mr-success-btn-primary {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 13px; padding: 11px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .mr-success-btn-primary:hover { background: #2a2a2a; }
  .mr-success-btn-ghost {
    background: #f0f0f0; color: #555; border: none;
    border-radius: 13px; padding: 11px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .mr-success-btn-ghost:hover { background: #e8e8e8; color: #111; }
  .mr-success-btn-primary .mi,
  .mr-success-btn-ghost .mi { font-size: 15px; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 600px) {
    .mr-main { padding: 10px 10px 48px; }
    .mr-type-grid { grid-template-columns: 1fr; }
    .mr-step-label { display: none !important; }
    .mr-nav { flex-direction: column-reverse; }
    .mr-btn-back { width: 100%; justify-content: center; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

const DOC_LABELS = {
  inheritance: [{ id: "death_cert",   label: "Death Certificate" }, { id: "succession", label: "Legal Heir Certificate" }, { id: "will", label: "Will / Probate (if available)" }],
  correction:  [{ id: "survey_report",label: "Survey Report"     }, { id: "fmb",        label: "FMB Sketch"            }],
  partition:   [{ id: "partition_deed",label:"Partition Deed"    }, { id: "survey_report",label:"Survey Report"        }],
  name_change: [{ id: "gazette",      label: "Gazette Notification"},{ id: "affidavit", label: "Affidavit"             }],
};

const STEPS = ["Type", "Property", "Details", "Review"];

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function MutationRequest() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [step,         setStep]      = useState(1);
  const [loading,      setLoading]   = useState(false);
  const [submitted,    setSubmitted] = useState(false);
  const [errors,       setErrors]    = useState({});
  const [mutationType, setMType]     = useState(null);
  const [selectedProp, setSProp]     = useState(null);
  const [reason,       setReason]    = useState("");
  const [description,  setDesc]      = useState("");
  const [uploadedDocs, setDocs]      = useState({});

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/properties/my-properties')
        .then(res => setProperties(res.data))
        .catch(console.error);
    }
  }, [user]);

  const docs       = mutationType ? (DOC_LABELS[mutationType] || []) : [];

  const validate = (s) => {
    const e = {};
    if (s === 1 && !mutationType)  e.type = "Please select a mutation type.";
    if (s === 2 && !selectedProp)  e.prop = "Please select a property.";
    if (s === 3 && !reason.trim()) e.reason = "Please provide the reason.";
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/mutations', {
        propertyId: selectedProp,
        reason: `${mutationType}: ${reason}`,
        newOwnerName: user.name,
        supportingDoc: "Document Attached"
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ type: "Failed to submit mutation request." });
    } finally {
      setLoading(false);
    }
  };

  const prop  = properties.find(p => p.id === selectedProp);
  const mtype = MUTATION_TYPES.find(m => m.id === mutationType);

  return (
    <>
      <style>{styles}</style>
      <div className="mr-page">

        <div className="mr-main">

          {/* ══ TOP BAR ══ */}
          <div className="mr-topbar">
            <div className="mr-heading">
              Mutation <span>Request</span>
            </div>
            <div className="mr-topbar-right">
              <div className="mr-meta-chip">
                <MI name="edit_document" /> Revenue Record Update
              </div>
              <button className="mr-back-btn" onClick={() => navigate("/user/dashboard")}>
                <MI name="arrow_back" /> Dashboard
              </button>
            </div>
          </div>

          {/* ══ STEP PROGRESS ══ */}
          {!submitted && (
            <div className="mr-steps">
              {STEPS.map((label, i) => {
                const num = i + 1;
                const isActive = num === step;
                const isDone   = num < step;
                return (
                  <div key={num} className={`mr-step${isActive ? " active" : isDone ? " done" : ""}`}>
                    <div className="mr-step-num">
                      {isDone ? <MI name="check" style={{ fontSize: 11 }} /> : num}
                    </div>
                    <div className="mr-step-label">{label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {submitted ? (
            /* ══ SUCCESS ══ */
            <div className="mr-success-zone">
              <div className="mr-success-icon-wrap">
                <MI name="task_alt" />
              </div>
              <div className="mr-success-title">Request Submitted!</div>
              <div className="mr-success-sub">
                Your mutation request has been filed for review.<br />
                You'll be notified once the Sub-Registrar processes it.
              </div>
              <div className="mr-success-ref">
                REF: MUT-{Date.now().toString().slice(-8)}
              </div>
              <div className="mr-success-actions">
                <button className="mr-success-btn-primary" onClick={() => navigate("/user/dashboard")}>
                  <MI name="dashboard" /> Back to Dashboard
                </button>
                <button className="mr-success-btn-ghost" onClick={() => navigate("/user/properties")}>
                  <MI name="home_work" /> My Properties
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ══ STEP 1 — Mutation Type ══ */}
              {step === 1 && (
                <div className="mr-zone">
                  <div className="mr-zone-header">
                    <div className="mr-zone-title-row">
                      <div className="mr-zone-title">Select <span>Mutation Type</span></div>
                      <div className="mr-zone-pill purple">Step 1 of 4</div>
                    </div>
                  </div>
                  <div className="mr-type-grid">
                    {MUTATION_TYPES.map((m, i) => (
                      <div
                        key={m.id}
                        className={`mr-type-card${mutationType === m.id ? " selected" : ""}`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                        onClick={() => { setMType(m.id); setErrors({}); }}
                      >
                        <div className="mr-type-check"><MI name="check" /></div>
                        <div className="mr-type-icon-wrap">
                          <MI name={m.icon} />
                        </div>
                        <div className="mr-type-label">{m.label}</div>
                        <div className="mr-type-desc">{m.desc}</div>
                      </div>
                    ))}
                  </div>
                  {errors.type && (
                    <div className="mr-error-msg"><MI name="error_outline" />{errors.type}</div>
                  )}
                </div>
              )}

              {/* ══ STEP 2 — Select Property ══ */}
              {step === 2 && (
                <div className="mr-zone">
                  <div className="mr-zone-header">
                    <div className="mr-zone-title-row">
                      <div className="mr-zone-title">Select <span>Property</span></div>
                      <div className="mr-zone-pill">{properties.length} total</div>
                    </div>
                    <div className="mr-zone-pill purple">Step 2 of 4</div>
                  </div>
                  <div className="mr-prop-list">
                    {properties.map((p) => (
                      <div
                        key={p.id}
                        className={`mr-prop-row${selectedProp === p.id ? " selected" : ""}`}
                        onClick={() => { setSProp(p.id); setErrors({}); }}
                      >
                        <div className="mr-prop-icon-wrap"><MI name="home" /></div>
                        <div className="mr-prop-body">
                          <div className="mr-prop-id">{p.id}</div>
                          <div className="mr-prop-title">{p.title}</div>
                          <div className="mr-prop-meta">{p.area} · {p.district}</div>
                        </div>
                        <div className="mr-prop-check-box">
                          {selectedProp === p.id && <MI name="check" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.prop && (
                    <div className="mr-error-msg"><MI name="error_outline" />{errors.prop}</div>
                  )}
                </div>
              )}

              {/* ══ STEP 3 — Details & Documents ══ */}
              {step === 3 && (
                <div className="mr-zone">
                  <div className="mr-zone-header">
                    <div className="mr-zone-title-row">
                      <div className="mr-zone-title">Details & <span>Documents</span></div>
                    </div>
                    <div className="mr-zone-pill purple">Step 3 of 4</div>
                  </div>
                  <div className="mr-fields">
                    <div className="mr-field">
                      <label className="mr-label">Reason for Mutation</label>
                      <input
                        className={`mr-input${errors.reason ? " error" : ""}`}
                        value={reason}
                        onChange={e => { setReason(e.target.value); setErrors({}); }}
                        placeholder={mutationType === "inheritance" ? "e.g. Owner deceased, transferring to legal heir" : "e.g. Incorrect survey number in records"}
                      />
                      {errors.reason && <div className="mr-error-msg"><MI name="error_outline" />{errors.reason}</div>}
                    </div>
                    <div className="mr-field">
                      <label className="mr-label">Additional Details <span style={{ fontWeight: 500, opacity: 0.5 }}>(optional)</span></label>
                      <textarea
                        className="mr-input mr-textarea"
                        value={description}
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Provide any additional context or information..."
                      />
                    </div>
                    {docs.length > 0 && (
                      <div className="mr-field">
                        <label className="mr-label">Required Documents</label>
                        <div className="mr-doc-list">
                          {docs.map(d => (
                            <div key={d.id} className={`mr-doc-item${uploadedDocs[d.id] ? " uploaded" : ""}`}>
                              <div className="mr-doc-icon-wrap">
                                <MI name={uploadedDocs[d.id] ? "check_circle" : "insert_drive_file"} />
                              </div>
                              <span className="mr-doc-label">{d.label}</span>
                              {uploadedDocs[d.id]
                                ? <div className="mr-doc-done"><MI name="check" /> Uploaded</div>
                                : <button className="mr-doc-btn" onClick={() => setDocs(dd => ({ ...dd, [d.id]: true }))}>
                                    <MI name="upload" /> Upload
                                  </button>
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP 4 — Review & Submit ══ */}
              {step === 4 && prop && mtype && (
                <div className="mr-zone">
                  <div className="mr-zone-header">
                    <div className="mr-zone-title-row">
                      <div className="mr-zone-title">Review & <span>Submit</span></div>
                    </div>
                    <div className="mr-zone-pill purple">Step 4 of 4</div>
                  </div>
                  <div className="mr-review-rows">
                    {[
                      { key: "Mutation Type", val: mtype.label },
                      { key: "Property",      val: prop.title  },
                      { key: "Property ID",   val: prop.id, mono: true },
                      { key: "District",      val: prop.district },
                      { key: "Reason",        val: reason },
                      { key: "Documents",     val: Object.keys(uploadedDocs).filter(k => uploadedDocs[k]).length + " uploaded" },
                    ].map((r, i) => (
                      <div className="mr-review-row" key={i}>
                        <span className="mr-review-key">{r.key}</span>
                        <span className={`mr-review-val${r.mono ? " mono" : ""}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ NAV ══ */}
              <div className="mr-nav">
                {step > 1 && (
                  <button className="mr-btn-back" onClick={() => setStep(s => s - 1)}>
                    <MI name="arrow_back" /> Back
                  </button>
                )}
                {step < 4
                  ? (
                    <button className="mr-btn-next" onClick={next}>
                      Continue <MI name="arrow_forward" />
                    </button>
                  ) : (
                    <button className="mr-btn-submit" onClick={handleSubmit} disabled={loading}>
                      {loading ? <><span className="spinner" /> Submitting…</> : <>Submit Request <MI name="send" /></>}
                    </button>
                  )
                }
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}