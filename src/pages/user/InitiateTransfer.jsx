import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner } from "../../database/Properties";
import Navbar1 from "../../components/Navbar1";

/* ══════════════════════════════════════════════════
   DATA
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

const TYPE_ICONS = { Residential: "home", Agricultural: "grass", Commercial: "business" };

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #EFEFEB; }
  ::-webkit-scrollbar-thumb {
    background: #0D3D2B;
    border-radius: 4px;
  }
  @keyframes fadeUp {
    from{opacity: 0;
    transform: translateY(14px);
    } to{opacity: 1;
    transform: translateY(0);
    };
  }
  @keyframes spin {
    from{transform: rotate(0deg);
    } to{transform: rotate(360deg);
    };
  }

  /* ── Material Icon helper ── */
  .mi {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  /* ── Page ── */
  .it-page {
    font-family: 'Poppins',sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  /* ── Slim page header ── */
  .it-header {
    background:#fff;
    border-bottom:2px solid rgba(13,61,43,0.1);
    padding:1rem 2rem;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:1rem;
    flex-wrap:wrap;
  }
  .it-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .it-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
  }
  .it-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .it-page-sub {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Step tabs ── */
  .it-steps {
    display: flex;
    gap: 0;
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.1);
    padding: 0 1.5rem;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .it-steps::-webkit-scrollbar { display: none; }
  .it-step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.1rem 0.75rem;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: default;
    transition: all 0.18s;
    margin-right: 2px;
    white-space: nowrap;
  }
  .it-step-active {
    border-bottom-color: #0D3D2B;
    background: rgba(13,61,43,0.03);
  }
  .it-step-done { border-bottom-color: #2EC4A0; }
  .it-step-inactive { opacity: 0.5; }
  .it-step-num {
    width: 22px;
    height: 22px;
    border-radius: 5px;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: 800;
    font-family: 'DM Mono',monospace;
    flex-shrink: 0;
  }
  .it-step-num .mi { font-size: 0.85rem; }
  .it-step-num-active {
    background: #C8F135;
    border-color: #0D3D2B;
    color: #0D3D2B;
  }
  .it-step-num-done {
    background: #2EC4A0;
    border-color: #2EC4A0;
    color: #fff;
  }
  .it-step-num-inactive {
    background: transparent;
    border-color: rgba(13,61,43,0.2);
    color: rgba(13,61,43,0.35);
  }
  .it-step-label {
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    font-family: 'Poppins',sans-serif;
  }
  .it-step-label-active {
    color: #0D3D2B;
    font-weight: 700;
  }
  .it-step-label-done { color: #2EC4A0; }
  .it-step-label-inactive { color: rgba(13,61,43,0.4); }

  /* ── Form area ── */
  .it-form-wrap {
    background: #EFEFEB;
    position: relative;
    z-index: 2;
    padding: 2rem 2.5rem 4rem;
  }
  .it-form-inner {
    max-width: 900px;
    margin: 0 auto;
    animation: fadeUp 0.4s ease both;
  }

  /* ── Cards ── */
  .it-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
    margin-bottom: 1.5rem;
  }
  .it-card-head {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding: 0.9rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }
  .it-card-head .mi { font-size: 1rem; }
  .it-card-head-lime {
    background: #C8F135;
    color: #0D3D2B;
  }
  .it-card-head-dark {
    background: #0D3D2B;
    color: rgba(255,255,255,0.7);
  }
  .it-card-body { padding: 1.5rem; }

  /* ── Property selector ── */
  .it-prop-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .it-prop-option {
    border: 2.5px solid rgba(13,61,43,0.2);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.18s;
    background: #fff;
  }
  .it-prop-option:hover {
    border-color: #0D3D2B;
    background: rgba(13,61,43,0.02);
  }
  .it-prop-option-active {
    border-color: #0D3D2B;
    background: #C8F135;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }
  .it-prop-icon {
    width: 42px;
    height: 42px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .it-prop-icon .mi {
    font-size: 1.3rem;
    color: #0D3D2B;
  }
  .it-prop-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.6rem;
    color: rgba(13,61,43,0.4);
    margin-bottom: 0.15rem;
  }
  .it-prop-title {
    font-size: 0.9rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .it-prop-meta {
    font-size: 0.75rem;
    color: rgba(13,61,43,0.55);
    margin-top: 0.15rem;
  }
  .it-prop-badge {
    margin-left: auto;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 5px;
    padding: 2px 9px;
    font-size: 0.62rem;
    font-weight: 800;
    flex-shrink: 0;
  }
  .it-prop-check {
    width: 22px;
    height: 22px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #fff;
  }
  .it-prop-check .mi {
    font-size: 0.95rem;
    color: rgba(13,61,43,0.25);
  }
  .it-prop-check-active { background: #0D3D2B; }
  .it-prop-check-active .mi { color: #C8F135; }

  /* ── Fields ── */
  .it-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .it-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .it-field-full { grid-column: 1/-1; }
  .it-label {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #0D3D2B;
  }
  .it-input {
    padding: 0.7rem 1rem;
    border: 2px solid rgba(13,61,43,0.22);
    border-radius: 10px;
    background: rgba(13,61,43,0.02);
    font-size: 0.88rem;
    font-family: inherit;
    font-weight: 500;
    color: #0D3D2B;
    outline: none;
    transition: all 0.2s;
  }
  .it-input:focus {
    border-color: #0D3D2B;
    background: #fff;
  }
  .it-input::placeholder { color: rgba(13,61,43,0.32); }
  .it-input-error { border-color: #F07060; }
  .it-hint {
    font-size: 0.68rem;
    color: rgba(13,61,43,0.4);
    font-weight: 500;
  }
  .it-error {
    font-size: 0.7rem;
    font-weight: 700;
    color: #C0392B;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .it-error .mi { font-size: 0.9rem; }

  /* ── Document upload ── */
  .it-doc-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .it-doc-item {
    border: 2px solid rgba(13,61,43,0.15);
    border-radius: 10px;
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    transition: all 0.18s;
  }
  .it-doc-item:hover {
    border-color: #0D3D2B;
    background: rgba(13,61,43,0.02);
  }
  .it-doc-item-uploaded {
    border-color: #2EC4A0;
    background: rgba(46,196,160,0.06);
  }
  .it-doc-icon {
    width: 36px;
    height: 36px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .it-doc-icon .mi {
    font-size: 1.1rem;
    color: #0D3D2B;
  }
  .it-doc-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0D3D2B;
    flex: 1;
  }
  .it-doc-req {
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(13,61,43,0.4);
  }
  .it-doc-upload-btn {
    padding: 0.35rem 0.9rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 7px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.72rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
    transition: opacity 0.18s;
  }
  .it-doc-upload-btn:hover { opacity: 0.82; }
  .it-doc-uploaded-badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    font-weight: 800;
    color: #2EC4A0;
  }
  .it-doc-uploaded-badge .mi { font-size: 1rem; }

  /* ── Review ── */
  .it-review-section { margin-bottom: 1rem; }
  .it-review-head {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
    margin-bottom: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .it-review-edit {
    font-size: 0.65rem;
    font-weight: 800;
    color: #0D3D2B;
    cursor: pointer;
    padding: 2px 8px;
    border: 1.5px solid rgba(13,61,43,0.2);
    border-radius: 4px;
    transition: all 0.15s;
  }
  .it-review-edit:hover {
    background: #5B4FD4;
    color: #fff;
  }
  .it-review-rows {
    border: 2px solid rgba(13,61,43,0.12);
    border-radius: 10px;
    overflow: hidden;
  }
  .it-review-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
  }
  .it-review-row:not(:last-child) { border-bottom: 1px solid rgba(13,61,43,0.07); }
  .it-review-label {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.45);
    font-weight: 600;
  }
  .it-review-value {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
  }
  .it-review-value-uploaded {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: #2EC4A0;
  }
  .it-review-value-uploaded .mi { font-size: 0.95rem; }

  /* ── Declaration checkbox ── */
  .it-declaration {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    cursor: pointer;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(13,61,43,0.02);
    border: 2px solid rgba(13,61,43,0.12);
    border-radius: 10px;
  }
  .it-checkbox {
    width: 22px;
    height: 22px;
    min-width: 22px;
    border: 2px solid rgba(13,61,43,0.3);
    border-radius: 5px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    margin-top: 1px;
  }
  .it-checkbox .mi {
    font-size: 0.95rem;
    color: rgba(13,61,43,0.2);
  }
  .it-checkbox-checked {
    background: #C8F135;
    border-color: #0D3D2B;
  }
  .it-checkbox-checked .mi { color: #0D3D2B; }
  .it-declaration-text {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(13,61,43,0.7);
    line-height: 1.55;
  }

  /* ── Nav buttons ── */
  .it-nav {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  .it-btn-back {
    padding: 0.8rem 1.5rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: transparent;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.18s;
    white-space: nowrap;
  }
  .it-btn-back:hover { background: #F0F0EC; }
  .it-btn-next {
    flex: 1;
    padding: 0.88rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: opacity 0.18s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .it-btn-next:hover { opacity: 0.88; }
  .it-btn-next:active { transform: translateY(1px); }
  .it-btn-next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .it-btn-submit {
    background: #0D3D2B;
    color: #C8F135;
    box-shadow: 0 4px 12px rgba(13,61,43,0.12);
  }
  .spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ── Success screen ── */
  .it-success {
    text-align: center;
    padding: 3rem 2rem;
    animation: fadeUp 0.5s ease both;
  }
  .it-success-icon {
    width: 72px;
    height: 72px;
    background: #C8F135;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }
  .it-success-icon .mi {
    font-size: 2.2rem;
    color: #0D3D2B;
  }
  .it-success-title {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }
  .it-success-sub {
    font-size: 0.88rem;
    color: rgba(13,61,43,0.55);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  .it-success-txn {
    display: inline-block;
    background: #0D3D2B;
    color: #C8F135;
    border-radius: 8px;
    padding: 0.5rem 1.25rem;
    font-family: 'DM Mono',monospace;
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }
  .it-success-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .it-success-btn-primary {
    padding: 0.75rem 1.75rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }
  .it-success-btn-outline {
    padding: 0.75rem 1.75rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: transparent;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
  }

  /* ══ PAGE CONTAINER ══ */
  .page-container {
    margin:2rem;
    border-radius:16px;
    overflow:hidden;
    border: 1.5px solid rgba(13,61,43,0.1);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
    background:#fff;
    position:relative;
    z-index:2;
  }

  /* ── RESPONSIVE ── */
  @media(max-width:768px) {
    .it-form-wrap { padding: 1.25rem 1rem 3rem; }
    .it-step-label { display: none; }
    .it-fields-grid { grid-template-columns: 1fr; }
    .it-field-full { grid-column: 1; }
    .it-nav { flex-direction: column-reverse; }
    .it-btn-back {
      width: 100%;
      text-align: center;
    }
    .page-container {
      margin: 1rem;
      border-radius: 12px;
    }
  }
  @media(max-width:480px) {
    .page-container {
      margin: 0.65rem;
      border-radius: 10px;
    }
  }
`;

/* ══════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════ */
const MIcon = ({ name, className = "" }) => (
  <span className={`mi ${className}`}>{name}</span>
);

/* ══════════════════════════════════════════════════
   INITIATE TRANSFER COMPONENT
══════════════════════════════════════════════════ */
export default function InitiateTransfer() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [step,         setStep]        = useState(1);
  const [loading,      setLoading]     = useState(false);
  const [submitted,    setSubmitted]   = useState(false);
  const [errors,       setErrors]      = useState({});
  const [declared,     setDeclared]    = useState(false);
  const [uploadedDocs, setUploadedDocs]= useState({});
  const [selectedProp, setSelectedProp]= useState(null);
  const [buyer,        setBuyer]       = useState({ name:"", email:"", phone:"", aadhaar:"", saleValue:"" });

  const properties = user ? getPropertiesByOwner(user.id) : [];

  const setB = (k, v) => { setBuyer(b => ({...b, [k]:v})); setErrors(e => ({...e, [k]:""})); };

  const validate = (s) => {
    const e = {};
    if (s === 1 && !selectedProp) e.prop = "Please select a property.";
    if (s === 2) {
      if (!buyer.name.trim())                              e.name     = "Buyer name is required.";
      if (!buyer.aadhaar.match(/^\d{12}$/))               e.aadhaar  = "Enter 12-digit Aadhaar.";
      if (!buyer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email  = "Enter a valid email.";
      if (!buyer.phone.match(/^[6-9]\d{9}$/))             e.phone    = "Enter a valid 10-digit mobile number.";
      if (!buyer.saleValue.trim())                         e.saleValue= "Sale value is required.";
    }
    if (s === 3) {
      const missing = REQUIRED_DOCS.filter(d => d.required && !uploadedDocs[d.id]);
      if (missing.length > 0) e.docs = `Please upload: ${missing.map(d => d.label).join(", ")}`;
    }
    if (s === 4 && !declared) e.declared = "Please accept the declaration.";
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
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  const stepState = (n) => step === n ? "active" : step > n ? "done" : "inactive";
  const prop = properties.find(p => p.id === selectedProp);

  return (
    <>
      <style>{styles}</style>
      <div className="it-page">
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

          {/* ── Page header ── */}
          <div className="it-header">
            <div className="it-header-left">
              <span className="it-page-title">Initiate Transfer</span>
              <span className="it-page-sub">4-step process — seller initiates, buyer confirms, registrar approves</span>
            </div>
          </div>

          {/* ── Step tabs ── */}
          <div className="it-steps">
            {STEPS.map((s, i) => {
              const st = stepState(i + 1);
              return (
                <div key={i} className={`it-step it-step-${st}`}>
                  <div className={`it-step-num it-step-num-${st}`}>
                    {st === "done"
                      ? <MIcon name="check" />
                      : s.num
                    }
                  </div>
                  <span className={`it-step-label it-step-label-${st}`}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* ── Form ── */}
          <div className="it-form-wrap">
            <div className="it-form-inner">

              {submitted ? (

                /* ── Success screen ── */
                <div className="it-card">
                  <div className="it-success">
                    <div className="it-success-icon">
                      <MIcon name="check_circle" />
                    </div>
                    <div className="it-success-title">Transfer Submitted!</div>
                    <div className="it-success-sub">
                      Your transfer request has been submitted to the registrar queue.<br />
                      The buyer will receive a confirmation request at <strong>{buyer.email}</strong>.
                    </div>
                    <div className="it-success-txn">TXN-2024-00{Math.floor(Math.random() * 9) + 3}</div>
                    <div className="it-success-actions">
                      <button className="it-success-btn-primary" onClick={() => navigate("/user/transfer-status")}>
                        Track Transfer →
                      </button>
                      <button className="it-success-btn-outline" onClick={() => navigate("/user/dashboard")}>
                        Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>

              ) : (
                <>
                  {/* ── STEP 1: Select Property ── */}
                  {step === 1 && (
                    <div className="it-card">
                      <div className="it-card-head it-card-head-lime">
                        <MIcon name="home" /> SELECT PROPERTY TO TRANSFER
                      </div>
                      <div className="it-card-body">
                        {properties.length === 0 ? (
                          <p style={{ color:"rgba(13,61,43,0.5)", fontSize:"0.88rem" }}>You have no registered properties.</p>
                        ) : (
                          <div className="it-prop-list">
                            {properties.map(p => (
                              <div
                                key={p.id}
                                className={`it-prop-option ${selectedProp === p.id ? "it-prop-option-active" : ""}`}
                                onClick={() => { setSelectedProp(p.id); setErrors({}); }}
                              >
                                <div className="it-prop-icon" style={{ background: selectedProp === p.id ? "rgba(255,255,255,0.4)" : "#F8F8F4" }}>
                                  <MIcon name={TYPE_ICONS[p.type] || "home"} />
                                </div>
                                <div style={{ flex:1 }}>
                                  <div className="it-prop-id">{p.id}</div>
                                  <div className="it-prop-title">{p.title}</div>
                                  <div className="it-prop-meta">{p.area} · {p.district}</div>
                                </div>
                                <div className="it-prop-badge" style={{ background: p.statusColor, color:"#0D3D2B" }}>{p.status}</div>
                                <div className={`it-prop-check ${selectedProp === p.id ? "it-prop-check-active" : ""}`}>
                                  <MIcon name="check" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {errors.prop && (
                          <p className="it-error" style={{ marginTop:"0.75rem" }}>
                            <MIcon name="warning" /> {errors.prop}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2: Buyer Details ── */}
                  {step === 2 && (
                    <div className="it-card">
                      <div className="it-card-head it-card-head-lime">
                        <MIcon name="person" /> BUYER DETAILS
                      </div>
                      <div className="it-card-body">
                        <div className="it-fields-grid">
                          <div className="it-field">
                            <label className="it-label">BUYER FULL NAME</label>
                            <input className={`it-input ${errors.name ? "it-input-error" : ""}`} value={buyer.name} onChange={e => setB("name", e.target.value)} placeholder="As on Aadhaar" />
                            {errors.name && <span className="it-error"><MIcon name="warning" /> {errors.name}</span>}
                          </div>
                          <div className="it-field">
                            <label className="it-label">AADHAAR NUMBER</label>
                            <input className={`it-input ${errors.aadhaar ? "it-input-error" : ""}`} value={buyer.aadhaar} onChange={e => setB("aadhaar", e.target.value.replace(/\D/g,"").slice(0,12))} placeholder="12-digit Aadhaar" />
                            {errors.aadhaar && <span className="it-error"><MIcon name="warning" /> {errors.aadhaar}</span>}
                          </div>
                          <div className="it-field">
                            <label className="it-label">BUYER EMAIL</label>
                            <input className={`it-input ${errors.email ? "it-input-error" : ""}`} type="email" value={buyer.email} onChange={e => setB("email", e.target.value)} placeholder="buyer@example.com" />
                            {errors.email && <span className="it-error"><MIcon name="warning" /> {errors.email}</span>}
                          </div>
                          <div className="it-field">
                            <label className="it-label">BUYER MOBILE</label>
                            <input className={`it-input ${errors.phone ? "it-input-error" : ""}`} value={buyer.phone} onChange={e => setB("phone", e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit number" />
                            {errors.phone && <span className="it-error"><MIcon name="warning" /> {errors.phone}</span>}
                          </div>
                          <div className="it-field it-field-full">
                            <label className="it-label">AGREED SALE VALUE</label>
                            <input className={`it-input ${errors.saleValue ? "it-input-error" : ""}`} value={buyer.saleValue} onChange={e => setB("saleValue", e.target.value)} placeholder="₹ e.g. ₹45,00,000" />
                            <span className="it-hint">This will be recorded on the blockchain ledger</span>
                            {errors.saleValue && <span className="it-error"><MIcon name="warning" /> {errors.saleValue}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 3: Documents ── */}
                  {step === 3 && (
                    <div className="it-card">
                      <div className="it-card-head it-card-head-lime">
                        <MIcon name="attach_file" /> UPLOAD DOCUMENTS
                      </div>
                      <div className="it-card-body">
                        <p style={{ fontSize:"0.82rem", color:"rgba(13,61,43,0.55)", marginBottom:"1.25rem", lineHeight:1.6 }}>
                          Upload the required documents. These will be reviewed by the Sub-Registrar before approval.
                        </p>
                        <div className="it-doc-list">
                          {REQUIRED_DOCS.map(doc => (
                            <div key={doc.id} className={`it-doc-item ${uploadedDocs[doc.id] ? "it-doc-item-uploaded" : ""}`}>
                              <div className="it-doc-icon">
                                <MIcon name={uploadedDocs[doc.id] ? "task" : "description"} />
                              </div>
                              <div style={{ flex:1 }}>
                                <div className="it-doc-label">{doc.label}</div>
                                <div className="it-doc-req">{doc.required ? "REQUIRED" : "OPTIONAL"}</div>
                              </div>
                              {uploadedDocs[doc.id]
                                ? <div className="it-doc-uploaded-badge"><MIcon name="check_circle" /> Uploaded</div>
                                : <button className="it-doc-upload-btn" onClick={() => setUploadedDocs(d => ({...d, [doc.id]:true}))}>
                                    + Upload
                                  </button>
                              }
                            </div>
                          ))}
                        </div>
                        {errors.docs && (
                          <p className="it-error" style={{ marginTop:"0.75rem" }}>
                            <MIcon name="warning" /> {errors.docs}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── STEP 4: Review & Submit ── */}
                  {step === 4 && prop && (
                    <div className="it-card">
                      <div className="it-card-head it-card-head-lime">
                        <MIcon name="fact_check" /> REVIEW & SUBMIT
                      </div>
                      <div className="it-card-body">

                        <div className="it-review-section">
                          <div className="it-review-head">
                            PROPERTY <span className="it-review-edit" onClick={() => setStep(1)}>EDIT</span>
                          </div>
                          <div className="it-review-rows">
                            {[
                              { label:"Property ID",  value: prop.id },
                              { label:"Title",        value: prop.title },
                              { label:"Area",         value: prop.area },
                              { label:"Market Value", value: prop.marketValue },
                            ].map((r, i) => (
                              <div key={i} className="it-review-row">
                                <span className="it-review-label">{r.label}</span>
                                <span className="it-review-value">{r.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="it-review-section">
                          <div className="it-review-head">
                            BUYER DETAILS <span className="it-review-edit" onClick={() => setStep(2)}>EDIT</span>
                          </div>
                          <div className="it-review-rows">
                            {[
                              { label:"Buyer Name", value: buyer.name },
                              { label:"Aadhaar",    value: `XXXX XXXX ${buyer.aadhaar.slice(-4)}` },
                              { label:"Email",      value: buyer.email },
                              { label:"Mobile",     value: buyer.phone },
                              { label:"Sale Value", value: buyer.saleValue },
                            ].map((r, i) => (
                              <div key={i} className="it-review-row">
                                <span className="it-review-label">{r.label}</span>
                                <span className="it-review-value">{r.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="it-review-section">
                          <div className="it-review-head">
                            DOCUMENTS <span className="it-review-edit" onClick={() => setStep(3)}>EDIT</span>
                          </div>
                          <div className="it-review-rows">
                            {REQUIRED_DOCS.filter(d => uploadedDocs[d.id]).map((d, i) => (
                              <div key={i} className="it-review-row">
                                <span className="it-review-label">{d.label}</span>
                                <span className="it-review-value it-review-value-uploaded">
                                  <MIcon name="check_circle" /> Uploaded
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="it-declaration" onClick={() => setDeclared(d => !d)}>
                          <div className={`it-checkbox ${declared ? "it-checkbox-checked" : ""}`}>
                            <MIcon name="check" />
                          </div>
                          <span className="it-declaration-text">
                            I, <strong>{user?.name}</strong>, hereby declare that the above information is accurate and I am the rightful owner of the property being transferred. I understand that this transfer will be permanently recorded on the blockchain ledger.
                          </span>
                        </div>
                        {errors.declared && (
                          <p className="it-error" style={{ marginTop:"0.5rem" }}>
                            <MIcon name="warning" /> {errors.declared}
                          </p>
                        )}

                      </div>
                    </div>
                  )}

                  {/* ── Nav buttons ── */}
                  <div className="it-nav">
                    {step > 1 && (
                      <button className="it-btn-back" onClick={() => setStep(s => s - 1)}>← Back</button>
                    )}
                    {step < 4
                      ? <button className="it-btn-next" onClick={next}>
                          {STEPS[step].label} →
                        </button>
                      : <button className="it-btn-next it-btn-submit" onClick={handleSubmit} disabled={loading}>
                          {loading ? <><span className="spinner" /> Submitting...</> : "Submit Transfer →"}
                        </button>
                    }
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
