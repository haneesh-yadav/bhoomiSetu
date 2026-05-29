import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

// ─── Dispute type definitions ─────────────────────────────────────────────────

const DISPUTE_TYPES = [
  {
    id: "ownership",
    label: "Ownership Dispute",
    shortLabel: "Ownership",
    icon: "gavel",
    desc: "Challenge who is recorded as the lawful owner of the property.",
    placeholder:
      "Describe who the rightful owner is, why the current record is incorrect, and any relevant dates or transactions…",
  },
  {
    id: "boundary",
    label: "Boundary Dispute",
    shortLabel: "Boundary",
    icon: "straighten",
    desc: "Dispute survey lines, extent, or encroachment on the parcel boundary.",
    placeholder:
      "Describe the boundary issue, neighbouring survey numbers, and how the record should be corrected…",
  },
  {
    id: "fraud",
    label: "Fraudulent Record",
    shortLabel: "Fraud",
    icon: "report",
    desc: "Report suspected forgery, tampering, or fraudulent entries in the registry.",
    placeholder:
      "Describe what appears fraudulent, when you discovered it, and any supporting facts…",
  },
];

function getDisputeType(id) {
  return DISPUTE_TYPES.find((t) => t.id === id) || null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  .fd-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }
  .fd-main {
    display: flex; flex-direction: column; gap: 16px;
    padding: 16px 28px 56px;
    max-width: 860px; margin: 0 auto;
    overflow-x: hidden; min-width: 0;
  }

  /* ── Top bar ── */
  .fd-topbar {
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    flex-wrap: wrap; gap: 10px;
  }
  .fd-heading { font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .fd-heading span { color: #e07a5f; }
  .fd-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .fd-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 6px 13px; font-size: 10.5px; font-weight: 600; color: #888;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .fd-meta-chip .mi { font-size: 13px; color: #e07a5f; }

  .fd-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 7px 16px; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .fd-back-btn:hover { background: #e07a5f; }
  .fd-back-btn .mi { font-size: 15px; }

  /* ── Notice banner ── */
  .fd-notice {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 14px;
    padding: 12px 16px; font-size: 11px; color: #666; line-height: 1.6;
    display: flex; gap: 10px; align-items: flex-start;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    animation: fadeUp 0.3s ease both;
  }
  .fd-notice .mi { font-size: 17px; color: #e07a5f; flex-shrink: 0; margin-top: 1px; }

  /* ── Step indicators ── */
  .fd-steps { display: flex; gap: 8px; }
  .fd-step {
    flex: 1; border-radius: 14px; padding: 10px 13px;
    display: flex; align-items: center; gap: 9px;
    background: #fff; border: 1.5px solid #e0e0e0;
    transition: background 0.2s, border-color 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .fd-step.active { background: #1a1a1a; border-color: #1a1a1a; }
  .fd-step.done   { background: #1a1a1a; border-color: #1a1a1a; }
  .fd-step-num {
    width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    background: #f0f0f0; color: #aaa;
  }
  .fd-step.active .fd-step-num { background: rgba(255,255,255,0.12); color: #fff; }
  .fd-step.done   .fd-step-num { background: rgba(224,122,95,0.25); color: #e07a5f; }
  .fd-step-label { font-size: 10.5px; font-weight: 600; color: #ccc; display: none; }
  .fd-step.active .fd-step-label { display: block; color: #fff; }
  .fd-step.done   .fd-step-label { display: block; color: #e07a5f; }

  /* ── Zone / section card ── */
  .fd-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .fd-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .fd-zone-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .fd-zone-title .mi { font-size: 17px; color: #e07a5f; }
  .fd-zone-title span { color: #e07a5f; }
  .fd-zone-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .fd-zone-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }

  /* ── Dispute type grid ── */
  .fd-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .fd-type-card {
    background: #fafaf8; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px; text-align: left;
    font-family: inherit; cursor: pointer;
    border: 2px solid #ebebeb;
    transition: transform 0.15s, border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .fd-type-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); border-color: #d8d8d8; }
  .fd-type-card.selected { background: #1a1a1a; border-color: #e07a5f; }
  .fd-type-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(224,122,95,0.1);
  }
  .fd-type-icon-wrap .mi { font-size: 16px; color: #e07a5f; }
  .fd-type-card.selected .fd-type-icon-wrap { background: rgba(224,122,95,0.2); }
  .fd-type-card.selected .fd-type-icon-wrap .mi { color: #e07a5f; }
  .fd-type-label { font-size: 12.5px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .fd-type-card.selected .fd-type-label { color: #fff; }
  .fd-type-desc { font-size: 10px; color: #aaa; line-height: 1.5; }
  .fd-type-card.selected .fd-type-desc { color: #666; }

  /* ── Property list ── */
  .fd-prop-list { display: flex; flex-direction: column; gap: 8px; }
  .fd-prop-row {
    background: #fafaf8; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    border: 2px solid #ebebeb; cursor: pointer;
    transition: transform 0.15s, border-color 0.15s, background 0.15s;
  }
  .fd-prop-row:hover { transform: translateY(-1px); border-color: #d8d8d8; }
  .fd-prop-row.selected { background: #1a1a1a; border-color: #e07a5f; }
  .fd-prop-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(224,122,95,0.1);
  }
  .fd-prop-icon-wrap .mi { font-size: 16px; color: #e07a5f; }
  .fd-prop-row.selected .fd-prop-icon-wrap { background: rgba(224,122,95,0.2); }
  .fd-prop-body { flex: 1; min-width: 0; }
  .fd-prop-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #e07a5f; margin-bottom: 1px; letter-spacing: 0.04em;
  }
  .fd-prop-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .fd-prop-row.selected .fd-prop-title { color: #fff; }
  .fd-prop-meta { font-size: 9.5px; color: #aaa; margin-top: 1px; }
  .fd-prop-row.selected .fd-prop-meta { color: #666; }
  .fd-prop-check {
    width: 20px; height: 20px; border-radius: 6px; flex-shrink: 0;
    border: 2px solid #e0e0e0; display: flex; align-items: center; justify-content: center;
    color: transparent;
  }
  .fd-prop-row.selected .fd-prop-check { background: rgba(224,122,95,0.2); border-color: #e07a5f; color: #e07a5f; }
  .fd-prop-check .mi { font-size: 12px; }

  /* ── Form fields ── */
  .fd-fields { display: flex; flex-direction: column; gap: 14px; }
  .fd-field { display: flex; flex-direction: column; gap: 6px; }
  .fd-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: #888;
  }
  .fd-input {
    padding: 10px 14px; border: 1.5px solid #e0e0e0; border-radius: 12px;
    background: #fafaf8; font-size: 13px; font-family: 'Poppins', sans-serif;
    font-weight: 500; color: #1a1a1a; outline: none; transition: all 0.15s; width: 100%;
  }
  .fd-input:focus { border-color: #e07a5f; background: #fff; box-shadow: 0 0 0 3px rgba(224,122,95,0.1); }
  .fd-input.error { border-color: #dc2626; }
  .fd-textarea { resize: vertical; min-height: 96px; }

  .fd-error-msg {
    font-size: 10px; font-weight: 700; color: #dc2626;
    display: flex; align-items: center; gap: 4px;
  }
  .fd-error-msg .mi { font-size: 12px; }

  /* ── Evidence upload ── */
  .fd-doc-item {
    background: #fafaf8; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 10px;
    border: 1.5px dashed #e0e0e0; cursor: pointer; transition: all 0.15s;
  }
  .fd-doc-item:hover { border-color: #e07a5f; background: #fff; }
  .fd-doc-item.uploaded { border-style: solid; border-color: #e07a5f; background: rgba(224,122,95,0.04); }
  .fd-doc-item .mi { font-size: 18px; color: #e07a5f; }

  /* ── Review rows ── */
  .fd-review-rows { display: flex; flex-direction: column; }
  .fd-review-row {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
    padding: 11px 0; border-bottom: 1.5px solid #f0f0ee;
  }
  .fd-review-row:last-child { border-bottom: none; }
  .fd-review-key { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #aaa; flex-shrink: 0; letter-spacing: 0.05em; }
  .fd-review-val { font-size: 12px; font-weight: 600; color: #1a1a1a; text-align: right; max-width: 65%; }

  /* ── Nav buttons ── */
  .fd-nav { display: flex; gap: 8px; align-items: center; }
  .fd-btn-back {
    background: #fff; color: #555; border: 1.5px solid #e0e0e0;
    border-radius: 100px; padding: 10px 18px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s, border-color 0.15s;
  }
  .fd-btn-back:hover { background: #f5f5f5; border-color: #ccc; }
  .fd-btn-back .mi { font-size: 15px; }
  .fd-btn-next {
    flex: 1; background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 12px 20px; font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .fd-btn-next:hover { background: #e07a5f; }
  .fd-btn-submit {
    flex: 1; background: #e07a5f; color: #fff; border: none; border-radius: 100px;
    padding: 12px 20px; font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .fd-btn-submit:hover:not(:disabled) { background: #c96748; }
  .fd-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .fd-btn-next .mi, .fd-btn-submit .mi { font-size: 16px; }

  .fd-spinner {
    width: 15px; height: 15px; border: 2.5px solid currentColor;
    border-top-color: transparent; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }

  /* ── Success state ── */
  .fd-success-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.4s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .fd-success-header {
    padding: 13px 20px; background: #1a1a1a;
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff;
  }
  .fd-success-header .mi { font-size: 17px; color: #e07a5f; }
  .fd-success-body {
    padding: 48px 32px; display: flex; flex-direction: column; align-items: center;
    gap: 12px; text-align: center;
  }
  .fd-success-icon-wrap {
    width: 60px; height: 60px; border-radius: 18px;
    background: rgba(224,122,95,0.1); border: 1.5px solid rgba(224,122,95,0.2);
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
  .fd-success-icon-wrap .mi { font-size: 28px; color: #e07a5f; }
  .fd-success-title { font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px; }
  .fd-success-sub { font-size: 12px; color: #aaa; line-height: 1.7; max-width: 380px; }
  .fd-success-ref {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #e07a5f;
    background: rgba(224,122,95,0.08); border: 1px solid rgba(224,122,95,0.18);
    border-radius: 9px; padding: 6px 16px;
  }
  .fd-success-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .fd-suc-primary {
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 10px 22px; font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .fd-suc-primary:hover { background: #e07a5f; }
  .fd-suc-primary .mi { font-size: 15px; }

  @media (max-width: 768px) {
    .fd-main { padding: 12px 14px 48px; }
    .fd-type-grid { grid-template-columns: 1fr; }
    .fd-nav { flex-direction: column-reverse; }
    .fd-btn-back { width: 100%; justify-content: center; }
  }
`;

// ─── Helper components ─────────────────────────────────────────────────────────

const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

const STEPS_WITH_TYPE = ["Type", "Property", "Details", "Review"];
const STEPS_FIXED     = ["Property", "Details", "Review"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FileDispute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetType    = searchParams.get("type");
  const initialConfig = presetType ? getDisputeType(presetType) : null;

  const { user } = useAuth();
  const [config, setConfig]               = useState(initialConfig);
  const needsTypeStep                      = !initialConfig;

  const [step, setStep]                   = useState(1);
  const [loading, setLoading]             = useState(false);
  const [submitted, setSubmitted]         = useState(false);
  const [errors, setErrors]               = useState({});
  const [selectedProp, setSelectedProp]   = useState(null);
  const [description, setDescription]     = useState("");
  const [uploadedEvidence, setUploadedEvidence] = useState(false);
  const [properties, setProperties]       = useState([]);

  const steps      = needsTypeStep ? STEPS_WITH_TYPE : STEPS_FIXED;
  const totalSteps = steps.length;

  const stepKind = () => {
    if (!needsTypeStep) {
      if (step === 1) return "property";
      if (step === 2) return "details";
      return "review";
    }
    if (step === 1) return "type";
    if (step === 2) return "property";
    if (step === 3) return "details";
    return "review";
  };

  useEffect(() => {
    if (user) {
      api.get("/properties/my-properties")
        .then((res) => setProperties(res.data))
        .catch(console.error);
    }
  }, [user]);

  const validate = () => {
    const e = {};
    const kind = stepKind();
    if (kind === "type"     && !config)              e.type = "Please select a dispute type.";
    if (kind === "property" && !selectedProp)        e.prop = "Please select a property.";
    if (kind === "details"  && !description.trim())  e.desc = "Please describe the dispute.";
    return e;
  };

  const next = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (step < totalSteps) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!config) return;
    setLoading(true);
    try {
      await api.post("/disputes", {
        propertyId:  selectedProp,
        caseNumber:  config.id,
        description,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to submit dispute. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const prop = properties.find((p) => p.id === selectedProp);

  return (
    <>
      <style>{styles}</style>
      <div className="fd-page">
        <div className="fd-main">

          {/* ══ TOP BAR ══ */}
          <div className="fd-topbar">
            <div className="fd-heading">
              File <span>Dispute</span>
            </div>
            <div className="fd-topbar-right">
              <div className="fd-meta-chip">
                <MI name="gavel" /> Official registry dispute
              </div>
              <button type="button" className="fd-back-btn" onClick={() => navigate("/user/my-disputes")}>
                <MI name="arrow_back" /> My disputes
              </button>
            </div>
          </div>

          {/* ══ NOTICE ══ */}
          {!submitted && (
            <div className="fd-notice">
              <MI name="info" />
              <span>
                Disputes are reviewed by the registry. Provide accurate facts and upload
                supporting documents where available.
              </span>
            </div>
          )}

          {/* ══ STEP INDICATORS ══ */}
          {!submitted && (
            <div className="fd-steps">
              {steps.map((label, i) => {
                const num = i + 1;
                return (
                  <div
                    key={label}
                    className={`fd-step${num === step ? " active" : ""}${num < step ? " done" : ""}`}
                  >
                    <div className="fd-step-num">
                      {num < step
                        ? <MI name="check" style={{ fontSize: 11 }} />
                        : num}
                    </div>
                    <div className="fd-step-label">{label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ SUCCESS ══ */}
          {submitted ? (
            <div className="fd-success-zone">
              <div className="fd-success-header">
                <MI name="check_circle" /> Dispute Submitted
              </div>
              <div className="fd-success-body">
                <div className="fd-success-icon-wrap">
                  <MI name="gavel" />
                </div>
                <div className="fd-success-title">Dispute submitted</div>
                <div className="fd-success-sub">
                  Your {config?.shortLabel.toLowerCase()} dispute has been filed and is
                  now under registry review. You will be notified of any updates.
                </div>
                <div className="fd-success-ref">
                  REF: DSP-{Date.now().toString().slice(-8)}
                </div>
                <div className="fd-success-actions">
                  <button
                    type="button"
                    className="fd-suc-primary"
                    onClick={() => navigate("/user/my-disputes")}
                  >
                    <MI name="folder_open" /> My Disputes
                  </button>
                </div>
              </div>
            </div>

          ) : (
            <>
              {/* ══ STEP: TYPE ══ */}
              {stepKind() === "type" && (
                <div className="fd-zone" style={{ animationDelay: "0s" }}>
                  <div className="fd-zone-header">
                    <div className="fd-zone-title">
                      <MI name="category" />
                      Select <span>dispute type</span>
                    </div>
                    <div className="fd-zone-pill">Step {step} of {totalSteps}</div>
                  </div>
                  <div className="fd-zone-body">
                    <div className="fd-type-grid">
                      {DISPUTE_TYPES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`fd-type-card${config?.id === t.id ? " selected" : ""}`}
                          onClick={() => { setConfig(t); setErrors({}); }}
                        >
                          <div className="fd-type-icon-wrap">
                            <MI name={t.icon} />
                          </div>
                          <div className="fd-type-label">{t.label}</div>
                          <div className="fd-type-desc">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                    {errors.type && (
                      <div className="fd-error-msg">
                        <MI name="error_outline" /> {errors.type}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP: PROPERTY ══ */}
              {stepKind() === "property" && (
                <div className="fd-zone" style={{ animationDelay: "0s" }}>
                  <div className="fd-zone-header">
                    <div className="fd-zone-title">
                      <MI name="home" />
                      Select <span>property</span>
                    </div>
                    <div className="fd-zone-pill">Step {step} of {totalSteps}</div>
                  </div>
                  <div className="fd-zone-body">
                    <div className="fd-prop-list">
                      {properties.map((p) => (
                        <div
                          key={p.id}
                          className={`fd-prop-row${selectedProp === p.id ? " selected" : ""}`}
                          onClick={() => { setSelectedProp(p.id); setErrors({}); }}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="fd-prop-icon-wrap">
                            <MI name="home" />
                          </div>
                          <div className="fd-prop-body">
                            <div className="fd-prop-id">PROP-{p.id}</div>
                            <div className="fd-prop-title">{p.title}</div>
                            <div className="fd-prop-meta">{p.area} · {p.district}</div>
                          </div>
                          <div className="fd-prop-check">
                            {selectedProp === p.id && <MI name="check" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.prop && (
                      <div className="fd-error-msg">
                        <MI name="error_outline" /> {errors.prop}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ STEP: DETAILS ══ */}
              {stepKind() === "details" && config && (
                <div className="fd-zone" style={{ animationDelay: "0s" }}>
                  <div className="fd-zone-header">
                    <div className="fd-zone-title">
                      <MI name="edit_note" />
                      {config.shortLabel} <span>details</span>
                    </div>
                    <div className="fd-zone-pill">Step {step} of {totalSteps}</div>
                  </div>
                  <div className="fd-zone-body">
                    <div className="fd-fields">
                      <div className="fd-field">
                        <label className="fd-label">Description</label>
                        <textarea
                          className={`fd-input fd-textarea${errors.desc ? " error" : ""}`}
                          value={description}
                          onChange={(e) => { setDescription(e.target.value); setErrors({}); }}
                          placeholder={config.placeholder}
                        />
                        {errors.desc && (
                          <div className="fd-error-msg">
                            <MI name="error_outline" /> {errors.desc}
                          </div>
                        )}
                      </div>
                      <div className="fd-field">
                        <label className="fd-label">Supporting evidence (optional)</label>
                        <div
                          className={`fd-doc-item${uploadedEvidence ? " uploaded" : ""}`}
                          onClick={() => setUploadedEvidence(true)}
                        >
                          <MI name={uploadedEvidence ? "check_circle" : "upload_file"} />
                          <span style={{ fontSize: 11.5, fontWeight: 600, flex: 1 }}>
                            {uploadedEvidence
                              ? "Evidence marked for upload"
                              : "Click to attach documents"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STEP: REVIEW ══ */}
              {stepKind() === "review" && config && prop && (
                <div className="fd-zone" style={{ animationDelay: "0s" }}>
                  <div className="fd-zone-header">
                    <div className="fd-zone-title">
                      <MI name="fact_check" />
                      Review & <span>submit</span>
                    </div>
                    <div className="fd-zone-pill">Step {step} of {totalSteps}</div>
                  </div>
                  <div className="fd-zone-body">
                    <div className="fd-review-rows">
                      {[
                        { key: "Type",        val: config.label },
                        { key: "Property",    val: prop.title },
                        { key: "Property ID", val: `PROP-${prop.id}` },
                        { key: "Description", val: description },
                      ].map((r) => (
                        <div className="fd-review-row" key={r.key}>
                          <span className="fd-review-key">{r.key}</span>
                          <span className="fd-review-val">{r.val}</span>
                        </div>
                      ))}
                    </div>
                    {errors.submit && (
                      <div className="fd-error-msg">
                        <MI name="error_outline" /> {errors.submit}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══ NAV BUTTONS ══ */}
              <div className="fd-nav">
                {step > 1 && (
                  <button type="button" className="fd-btn-back" onClick={() => setStep((s) => s - 1)}>
                    <MI name="arrow_back" /> Back
                  </button>
                )}
                <button
                  type="button"
                  className={step < totalSteps ? "fd-btn-next" : "fd-btn-submit"}
                  onClick={next}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="fd-spinner" /> Submitting…</>
                  ) : step < totalSteps ? (
                    <>Continue <MI name="arrow_forward" /></>
                  ) : (
                    <>Submit dispute <MI name="send" /></>
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}