import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner } from "../../database/Properties";
import Navbar1 from "../../components/Navbar1";

const MUTATION_TYPES = [
  { id:"inheritance", label:"Inheritance / Succession", icon:"family_restroom", desc:"Transfer ownership to legal heirs after owner's death" },
  { id:"correction",  label:"Survey Correction",        icon:"straighten",      desc:"Correct survey number, area or boundary records"         },
  { id:"partition",   label:"Property Partition",       icon:"call_split",      desc:"Divide a single property into multiple sub-plots"        },
  { id:"name_change", label:"Name Change",              icon:"edit",            desc:"Update owner name due to legal name change"              },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
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
    }to{opacity: 1;
    transform: translateY(0);
    };
  }
  @keyframes spin {
    from{transform: rotate(0deg);
    }to{transform: rotate(360deg);
    };
  }

  .mr-page {
    font-family: 'Poppins',sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }
  /* grid-bg removed */

  /* Hero — mint green */
/* ── Slim page header ── */
  .mr-header {
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .mr-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .mr-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .mr-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
  }
  .mr-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .mr-page-sub {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* Content */
  .mr-content {
    position: relative;
    z-index: 2;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 2.5rem 4rem;
  }

  /* Card */
  .mr-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease both;
  }
  .mr-card-head {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding: 0.9rem 1.5rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }
  .mr-card-head-mint {
    background: #2EC4A0;
    color: #0D3D2B;
  }
  .mr-card-head-lime {
    background: #C8F135;
    color: #0D3D2B;
  }
  .mr-card-body { padding: 1.5rem; }

  /* Mutation type selector */
  .mr-type-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }
  .mr-type-option {
    border: 2.5px solid rgba(13,61,43,0.18);
    border-radius: 12px;
    padding: 1.1rem;
    cursor: pointer;
    transition: all 0.18s;
    background: #fff;
  }
  .mr-type-option:hover {
    border-color: #0D3D2B;
    background: rgba(13,61,43,0.02);
  }
  .mr-type-option-active {
    border-color: #0D3D2B;
    background: #C8F135;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }
  .mr-type-icon {
    width: 38px;
    height: 38px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.6rem;
  }
  .mr-type-label {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.25rem;
  }
  .mr-type-desc {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.55);
    line-height: 1.4;
  }

  /* Property selector */
  .mr-prop-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .mr-prop-item {
    border: 2px solid rgba(13,61,43,0.15);
    border-radius: 10px;
    padding: 0.85rem 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    transition: all 0.18s;
  }
  .mr-prop-item:hover { border-color: #0D3D2B; }
  .mr-prop-item-active {
    border-color: #0D3D2B;
    background: #C8F135;
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .mr-prop-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .mr-prop-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.58rem;
    color: rgba(13,61,43,0.4);
    margin-bottom: 0.1rem;
  }
  .mr-prop-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .mr-prop-meta {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
  }
  .mr-prop-check {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(13,61,43,0.25);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    margin-left: auto;
    flex-shrink: 0;
  }
  .mr-prop-check-active {
    background: #0D3D2B;
    color: #C8F135;
    border-color: #0D3D2B;
  }

  /* Fields */
  .mr-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .mr-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .mr-label {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #0D3D2B;
  }
  .mr-input {
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
  .mr-input:focus {
    border-color: #0D3D2B;
    background: #fff;
  }
  .mr-input::placeholder { color: rgba(13,61,43,0.32); }
  .mr-textarea {
    resize: vertical;
    min-height: 100px;
  }
  .mr-input-error { border-color: #F07060; }
  .mr-error {
    font-size: 0.7rem;
    font-weight: 700;
    color: #C0392B;
  }
  .mr-hint {
    font-size: 0.68rem;
    color: rgba(13,61,43,0.4);
    font-weight: 500;
  }

  /* Doc upload */
  .mr-doc-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }
  .mr-doc-item {
    border: 2px solid rgba(13,61,43,0.12);
    border-radius: 9px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.18s;
  }
  .mr-doc-item-uploaded {
    border-color: #2EC4A0;
    background: rgba(46,196,160,0.05);
  }
  .mr-doc-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .mr-doc-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
    flex: 1;
  }
  .mr-doc-btn {
    padding: 0.3rem 0.85rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 6px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.7rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
  }
  .mr-doc-done {
    font-size: 0.72rem;
    font-weight: 800;
    color: #2EC4A0;
  }

  /* Nav buttons */
  .mr-nav {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  .mr-btn-back {
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
  .mr-btn-back:hover { background: #F0F0EC; }
  .mr-btn-next {
    flex: 1;
    padding: 0.88rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #2EC4A0;
    color: #0D3D2B;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: opacity 0.18s;
  }
  .mr-btn-next:hover { opacity: 0.88; }
  .mr-btn-next:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  /* Success */
  .mr-success {
    text-align: center;
    padding: 3rem 2rem;
  }
  .mr-success-icon {
    width: 72px;
    height: 72px;
    background: #2EC4A0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }
  .mr-success-title {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }
  .mr-success-sub {
    font-size: 0.88rem;
    color: rgba(13,61,43,0.55);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  .mr-success-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .mr-success-btn1 {
    padding: 0.75rem 1.75rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #2EC4A0;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }
  .mr-success-btn2 {
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

  @media(max-width:768px) {
    .mr-hero {
      padding: 1.5rem 1rem 1.5rem;
      } .mr-content{padding: 1.25rem 1rem 3rem;
    }
    .mr-type-grid {
      grid-template-columns: 1fr;
      } .mr-nav{flex-direction: column-reverse;
    }
    .mr-btn-back {
      width: 100%;
      text-align: center;
    }
  }
  /* ══ PAGE CONTAINER — 2rem margin all sides, rounded, shadow ══ */
  .page-container {
    margin: 1.5rem 2rem 2rem;
    border-radius: 16px;
    overflow: hidden;
    border: 1.5px solid rgba(13,61,43,0.12);
    box-shadow: 0 4px 6px rgba(13,61,43,0.04), 0 20px 40px rgba(13,61,43,0.08);
    background: #f7f7f3;
    position: relative;
    z-index: 2;
  }
  @media(max-width: 768px) {
    .page-container {
      margin: 1rem;
      border-radius: 12px;
    }
  }
  @media(max-width: 480px) {
    .page-container {
      margin: 0.65rem;
      border-radius: 10px;
    }
  }
`;

export default function MutationRequest() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [step,       setStep]      = useState(1);
  const [loading,    setLoading]   = useState(false);
  const [submitted,  setSubmitted] = useState(false);
  const [errors,     setErrors]    = useState({});
  const [mutationType, setMType]   = useState(null);
  const [selectedProp, setSProp]   = useState(null);
  const [reason,     setReason]    = useState("");
  const [description, setDesc]     = useState("");
  const [uploadedDocs, setDocs]    = useState({});

  const properties = user ? getPropertiesByOwner(user.id) : [];

  const DOC_LABELS = {
    inheritance: [{ id:"death_cert", label:"Death Certificate" }, { id:"succession", label:"Legal Heir Certificate" }, { id:"will", label:"Will / Probate (if available)" }],
    correction:  [{ id:"survey_report", label:"Survey Report" }, { id:"fmb", label:"FMB Sketch" }],
    partition:   [{ id:"partition_deed", label:"Partition Deed" }, { id:"survey_report", label:"Survey Report" }],
    name_change: [{ id:"gazette", label:"Gazette Notification" }, { id:"affidavit", label:"Affidavit" }],
  };

  const docs = mutationType ? (DOC_LABELS[mutationType] || []) : [];

  const validate = (s) => {
    const e = {};
    if (s===1 && !mutationType)    e.type = "Please select a mutation type.";
    if (s===2 && !selectedProp)    e.prop = "Please select a property.";
    if (s===3 && !reason.trim())   e.reason = "Please provide the reason.";
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s+1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const prop = properties.find(p => p.id === selectedProp);
  const mtype = MUTATION_TYPES.find(m => m.id === mutationType);

  return (
    <>
      <style>{styles}</style>
      <div className="mr-page">
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

        <div className="mr-header">
          <div className="mr-header-left">
            <span className="mr-page-title">Mutation Request</span>
            <span className="mr-page-sub">Apply for revenue record updates after property transactions</span>
          </div>
        </div>

        <div className="mr-content">
          {submitted ? (
            <div className="mr-card">
              <div className="mr-success">
                <div className="mr-success-icon"><span className="material-icons-sharp" style={{ fontSize:36 }}>task_alt</span></div>
                <div className="mr-success-title">Request Submitted!</div>
                <div className="mr-success-sub">
                  Your mutation request has been submitted for review.<br />
                  You'll be notified once the Sub-Registrar processes it.
                </div>
                <div className="mr-success-actions">
                  <button className="mr-success-btn1" onClick={() => navigate("/user/dashboard")}>Back to Dashboard</button>
                  <button className="mr-success-btn2" onClick={() => navigate("/user/properties")}>My Properties</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Type */}
              {step === 1 && (
                <div className="mr-card">
                  <div className="mr-card-head mr-card-head-mint" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>tune</span> SELECT MUTATION TYPE</div>
                  <div className="mr-card-body">
                    <div className="mr-type-grid">
                      {MUTATION_TYPES.map(m => (
                        <div
                          key={m.id}
                          className={`mr-type-option ${mutationType===m.id?"mr-type-option-active":""}`}
                          onClick={() => { setMType(m.id); setErrors({}); }}
                        >
                          <div className="mr-type-icon"><span className="material-icons-sharp" style={{ fontSize:20 }}>{m.icon}</span></div>
                          <div className="mr-type-label">{m.label}</div>
                          <div className="mr-type-desc">{m.desc}</div>
                        </div>
                      ))}
                    </div>
                    {errors.type && <p className="mr-error" style={{ marginTop:"0.75rem" }}>{errors.type}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Property */}
              {step === 2 && (
                <div className="mr-card">
                  <div className="mr-card-head mr-card-head-mint" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>home</span> SELECT PROPERTY</div>
                  <div className="mr-card-body">
                    <div className="mr-prop-list">
                      {properties.map(p => (
                        <div
                          key={p.id}
                          className={`mr-prop-item ${selectedProp===p.id?"mr-prop-item-active":""}`}
                          onClick={() => { setSProp(p.id); setErrors({}); }}
                        >
                          <span className="mr-prop-icon"><span className="material-icons-sharp" style={{ fontSize:22 }}>home</span></span>
                          <div style={{ flex:1 }}>
                            <div className="mr-prop-id">{p.id}</div>
                            <div className="mr-prop-title">{p.title}</div>
                            <div className="mr-prop-meta">{p.area} · {p.district}</div>
                          </div>
                          <div className={`mr-prop-check ${selectedProp===p.id?"mr-prop-check-active":""}`}>
                            {selectedProp===p.id ? <span className="material-icons-sharp" style={{ fontSize:14 }}>check</span> : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.prop && <p className="mr-error" style={{ marginTop:"0.75rem" }}>{errors.prop}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Details + Docs */}
              {step === 3 && (
                <div className="mr-card">
                  <div className="mr-card-head mr-card-head-mint" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>description</span> DETAILS & DOCUMENTS</div>
                  <div className="mr-card-body">
                    <div className="mr-fields">
                      <div className="mr-field">
                        <label className="mr-label">REASON FOR MUTATION</label>
                        <input
                          className={`mr-input ${errors.reason?"mr-input-error":""}`}
                          value={reason}
                          onChange={e => { setReason(e.target.value); setErrors({}); }}
                          placeholder={`e.g. ${mutationType==="inheritance"?"Owner deceased, transferring to legal heir":"Incorrect survey number in records"}`}
                        />
                        {errors.reason && <span className="mr-error">{errors.reason}</span>}
                      </div>
                      <div className="mr-field">
                        <label className="mr-label">ADDITIONAL DETAILS <span style={{ fontWeight:500, opacity:0.5 }}>(optional)</span></label>
                        <textarea
                          className="mr-input mr-textarea"
                          value={description}
                          onChange={e => setDesc(e.target.value)}
                          placeholder="Provide any additional context or information..."
                        />
                      </div>
                      {docs.length > 0 && (
                        <div className="mr-field">
                          <label className="mr-label">REQUIRED DOCUMENTS</label>
                          <div className="mr-doc-list">
                            {docs.map(d => (
                              <div key={d.id} className={`mr-doc-item ${uploadedDocs[d.id]?"mr-doc-item-uploaded":""}`}>
                                <span className="mr-doc-icon"><span className="material-icons-sharp" style={{ fontSize:20, color: uploadedDocs[d.id] ? "#2EC4A0" : "rgba(13,61,43,0.4)" }}>{uploadedDocs[d.id] ? "check_circle" : "insert_drive_file"}</span></span>
                                <span className="mr-doc-label">{d.label}</span>
                                {uploadedDocs[d.id]
                                  ? <span className="mr-doc-done" style={{ display:"flex", alignItems:"center", gap:"3px" }}><span className="material-icons-sharp" style={{ fontSize:14 }}>check</span> Uploaded</span>
                                  : <button className="mr-doc-btn" style={{ display:"flex", alignItems:"center", gap:"3px" }} onClick={() => setDocs(dd => ({...dd,[d.id]:true}))}><span className="material-icons-sharp" style={{ fontSize:13 }}>upload</span> Upload</button>
                                }
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && prop && mtype && (
                <div className="mr-card">
                  <div className="mr-card-head mr-card-head-lime" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>fact_check</span> REVIEW & SUBMIT</div>
                  <div className="mr-card-body">
                    {[
                      { label:"MUTATION TYPE",  value: mtype.label },
                      { label:"PROPERTY",       value: prop.title  },
                      { label:"PROPERTY ID",    value: prop.id     },
                      { label:"REASON",         value: reason      },
                      { label:"DOCUMENTS",      value: Object.keys(uploadedDocs).filter(k => uploadedDocs[k]).length + " uploaded" },
                    ].map((r,i) => (
                      <div key={i} style={{ display:"flex",justifyContent:"space-between",padding:"0.6rem 0",borderBottom:i<4?"1px solid rgba(13,61,43,0.07)":"none" }}>
                        <span style={{ fontSize:"0.72rem",fontWeight:600,color:"rgba(13,61,43,0.45)" }}>{r.label}</span>
                        <span style={{ fontSize:"0.82rem",fontWeight:700,color:"#0D3D2B" }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mr-nav">
                {step > 1 && <button className="mr-btn-back" style={{ display:"flex", alignItems:"center", gap:"0.4rem" }} onClick={() => setStep(s=>s-1)}><span className="material-icons-sharp" style={{ fontSize:18 }}>arrow_back</span> Back</button>}
                {step < 4
                  ? <button className="mr-btn-next" onClick={next}>Continue <span className="material-icons-sharp" style={{ fontSize:18 }}>arrow_forward</span></button>
                  : <button className="mr-btn-next" onClick={handleSubmit} disabled={loading}>
                      {loading ? <><span className="spinner"/>Submitting...</> : <>Submit Request <span className="material-icons-sharp" style={{ fontSize:18 }}>send</span></>}
                    </button>
                }
              </div>
            </>
          )}
        </div>
        </div>

      </div>
    </>
  );
}
