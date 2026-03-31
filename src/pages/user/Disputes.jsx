import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner } from "../../database/Properties";
import Navbar1 from "../../components/Navbar1";

const DISPUTE_TYPES = [
  { id:"ownership",    label:"Ownership Dispute",    icon:"gavel",          desc:"Challenge the legitimacy of a current owner"    },
  { id:"boundary",     label:"Boundary Dispute",     icon:"straighten",     desc:"Dispute over property boundary or survey"       },
  { id:"encumbrance",  label:"Encumbrance Dispute",  icon:"lock",           desc:"Challenge an incorrect encumbrance record"      },
  { id:"fraud",        label:"Fraudulent Record",    icon:"report",         desc:"Report a suspected forged or tampered record"   },
];

const MOCK_DISPUTES = [
  { id:"DSP-2023-001", propertyId:"TN-7734-MDU-2021", type:"Encumbrance Dispute", status:"Under Investigation", statusColor:"#F0A030", filedOn:"02 Sep 2023", description:"Incorrect encumbrance recorded against property.", resolution:null },
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

  .dp-page {
    font-family: 'Poppins',sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }
  /* grid-bg removed */

  /* Hero — coral */
/* ── Slim page header ── */
  .dp-header {
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .dp-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .dp-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .dp-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
  }
  .dp-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .dp-page-sub {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* Tabs */
  .dp-tabs {
    background: #fff;
    border-bottom: 1px solid rgba(13,61,43,0.08);
    position: relative;
    z-index: 2;
  }
  .dp-tabs-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
  }
  .dp-tab {
    padding: 0.9rem 1.5rem;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.18s;
    color: rgba(13,61,43,0.5);
  }
  .dp-tab:hover { color: #0D3D2B; }
  .dp-tab-active {
    color: #0D3D2B;
    font-weight: 800;
    border-bottom-color: #C8F135;
  }

  /* Content */
  .dp-content {
    position: relative;
    z-index: 2;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 2.5rem 4rem;
  }

  /* My disputes list */
  .dp-disputes-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .dp-dispute-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    animation: fadeUp 0.4s ease both;
  }
  .dp-dispute-top {
    padding: 1.1rem 1.25rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .dp-dispute-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.6rem;
    color: rgba(13,61,43,0.35);
    margin-bottom: 0.2rem;
  }
  .dp-dispute-type {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.25rem;
  }
  .dp-dispute-desc {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.55);
    line-height: 1.45;
  }
  .dp-dispute-badge {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 5px;
    padding: 3px 10px;
    font-size: 0.65rem;
    font-weight: 800;
    flex-shrink: 0;
  }
  .dp-dispute-footer {
    border-top: 1.5px solid rgba(13,61,43,0.08);
    padding: 0.55rem 1.25rem;
    background: rgba(13,61,43,0.02);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dp-dispute-date {
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(13,61,43,0.4);
  }
  .dp-dispute-prop {
    font-size: 0.68rem;
    font-weight: 800;
    color: rgba(13,61,43,0.5);
    font-family: 'DM Mono',monospace;
  }

  /* Empty disputes */
  .dp-empty {
    text-align: center;
    padding: 3.5rem 2rem;
    border: 2.5px dashed rgba(13,61,43,0.15);
    border-radius: 14px;
    background: #fff;
  }
  .dp-empty-icon {
    margin-bottom: 0.75rem;
    opacity: 0.4;
    display: flex;
    justify-content: center;
  }
  .dp-empty-title {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
  }
  .dp-empty-sub {
    font-size: 0.82rem;
    color: rgba(13,61,43,0.45);
    margin-bottom: 1rem;
  }
  .dp-file-btn {
    padding: 0.65rem 1.5rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #F07060;
    color: #fff;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  /* File form */
  .dp-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s ease both;
  }
  .dp-card-head {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    padding: 0.9rem 1.5rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }
  .dp-card-head-coral {
    background: #F07060;
    color: #fff;
  }
  .dp-card-head-lime {
    background: #C8F135;
    color: #0D3D2B;
  }
  .dp-card-body { padding: 1.5rem; }

  .dp-type-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }
  .dp-type-opt {
    border: 2.5px solid rgba(13,61,43,0.18);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.18s;
    background: #fff;
  }
  .dp-type-opt:hover {
    border-color: #0D3D2B;
    background: rgba(13,61,43,0.02);
  }
  .dp-type-opt-active {
    border-color: #F07060;
    background: rgba(240,112,96,0.08);
    box-shadow: 0 8px 24px rgba(13,61,43,0.15);
  }
  .dp-type-icon {
    margin-bottom: 0.5rem;
    display: flex;
  }
  .dp-type-label {
    font-size: 0.85rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }
  .dp-type-desc {
    font-size: 0.7rem;
    color: rgba(13,61,43,0.5);
    line-height: 1.4;
  }

  .dp-prop-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .dp-prop-item {
    border: 2px solid rgba(13,61,43,0.15);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.18s;
  }
  .dp-prop-item:hover { border-color: #0D3D2B; }
  .dp-prop-item-active {
    border-color: #F07060;
    background: rgba(240,112,96,0.06);
    box-shadow: 2px 2px 0 #F07060;
  }
  .dp-prop-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .dp-prop-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.58rem;
    color: rgba(13,61,43,0.38);
    margin-bottom: 0.1rem;
  }
  .dp-prop-check {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(13,61,43,0.2);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    margin-left: auto;
    flex-shrink: 0;
  }
  .dp-prop-check-active {
    background: #F07060;
    color: #fff;
    border-color: #F07060;
  }

  .dp-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .dp-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .dp-label {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: #0D3D2B;
  }
  .dp-input {
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
  .dp-input:focus {
    border-color: #0D3D2B;
    background: #fff;
  }
  .dp-input::placeholder { color: rgba(13,61,43,0.32); }
  .dp-textarea {
    resize: vertical;
    min-height: 100px;
  }
  .dp-error {
    font-size: 0.7rem;
    font-weight: 700;
    color: #C0392B;
  }

  .dp-nav {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  .dp-btn-back {
    padding: 0.8rem 1.5rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: transparent;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
  }
  .dp-btn-next {
    flex: 1;
    padding: 0.88rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #F07060;
    color: #fff;
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
  .dp-btn-next:hover { opacity: 0.88; }
  .dp-btn-next:disabled {
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

  .dp-success {
    text-align: center;
    padding: 3rem 2rem;
  }
  .dp-success-icon {
    width: 72px;
    height: 72px;
    background: #F07060;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }
  .dp-success-title {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }
  .dp-success-sub {
    font-size: 0.88rem;
    color: rgba(13,61,43,0.55);
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  .dp-success-btn {
    padding: 0.75rem 1.75rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #F07060;
    color: #fff;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  @media(max-width:768px) {
    .dp-hero {
      padding: 1.5rem 1rem 1.5rem;
      } .dp-content{padding: 1.25rem 1rem 3rem;
    }
    .dp-type-grid {
      grid-template-columns: 1fr;
      } .dp-nav{flex-direction: column-reverse;
    }
    .dp-btn-back {
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

export default function Disputes() {
  const { user, logout } = useAuth();

  const [activeTab,  setTab]       = useState("my");
  const [step,       setStep]      = useState(1);
  const [loading,    setLoading]   = useState(false);
  const [submitted,  setSubmitted] = useState(false);
  const [errors,     setErrors]    = useState({});
  const [dType,      setDType]     = useState(null);
  const [selectedProp, setSProp]   = useState(null);
  const [description, setDesc]     = useState("");
  const [uploadedEvidence, setEvidence] = useState(false);

  const properties = user ? getPropertiesByOwner(user.id) : [];
  const myDisputes = MOCK_DISPUTES;

  const validate = (s) => {
    const e = {};
    if (s===1 && !dType)          e.type = "Please select a dispute type.";
    if (s===2 && !selectedProp)   e.prop = "Please select a property.";
    if (s===3 && !description.trim()) e.desc = "Please describe the dispute.";
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (step < 3) setStep(s=>s+1); else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };


  return (
    <>
      <style>{styles}</style>
      <div className="dp-page">
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

        <div className="dp-header">
          <div className="dp-header-left">
            <span className="dp-page-title">Disputes</span>
            <span className="dp-page-sub">File and track property ownership disputes</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="dp-tabs">
          <div className="dp-tabs-inner">
            <div className={`dp-tab ${activeTab==="my"?"dp-tab-active":""}`} onClick={() => setTab("my")}>
              My Disputes ({myDisputes.length})
            </div>
            <div className={`dp-tab ${activeTab==="file"?"dp-tab-active":""}`} onClick={() => { setTab("file"); setStep(1); setSubmitted(false); }}>
              File New Dispute
            </div>
          </div>
        </div>

        <div className="dp-content">

          {/* My Disputes tab */}
          {activeTab === "my" && (
            myDisputes.length === 0 ? (
              <div className="dp-empty">
                <div className="dp-empty-icon"><span className="material-icons-sharp" style={{ fontSize:40 }}>gavel</span></div>
                <div className="dp-empty-title">No disputes filed</div>
                <div className="dp-empty-sub">You haven't filed any disputes yet.</div>
                <button className="dp-file-btn" style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem" }} onClick={() => setTab("file")}><span className="material-icons-sharp" style={{ fontSize:16 }}>add</span> File a Dispute</button>
              </div>
            ) : (
              <div className="dp-disputes-list">
                {myDisputes.map((d, i) => (
                  <div key={i} className="dp-dispute-card">
                    <div className="dp-dispute-top">
                      <div>
                        <div className="dp-dispute-id">{d.id}</div>
                        <div className="dp-dispute-type">{d.type}</div>
                        <div className="dp-dispute-desc">{d.description}</div>
                      </div>
                      <div className="dp-dispute-badge" style={{ background:d.statusColor, color:"#0D3D2B" }}>
                        {d.status}
                      </div>
                    </div>
                    <div className="dp-dispute-footer">
                      <span className="dp-dispute-date">Filed {d.filedOn}</span>
                      <span className="dp-dispute-prop">{d.propertyId}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* File New Dispute tab */}
          {activeTab === "file" && (
            submitted ? (
              <div className="dp-card">
                <div className="dp-success">
                  <div className="dp-success-icon"><span className="material-icons-sharp" style={{ fontSize:36 }}>gavel</span></div>
                  <div className="dp-success-title">Dispute Filed!</div>
                  <div className="dp-success-sub">Your dispute has been submitted. The Sub-Registrar will investigate and update the status.</div>
                  <button className="dp-success-btn" onClick={() => { setTab("my"); setSubmitted(false); }}>View My Disputes</button>
                </div>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <div className="dp-card">
                    <div className="dp-card-head dp-card-head-coral" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>gavel</span> SELECT DISPUTE TYPE</div>
                    <div className="dp-card-body">
                      <div className="dp-type-grid">
                        {DISPUTE_TYPES.map(d => (
                          <div key={d.id} className={`dp-type-opt ${dType===d.id?"dp-type-opt-active":""}`} onClick={() => { setDType(d.id); setErrors({}); }}>
                            <div className="dp-type-icon"><span className="material-icons-sharp" style={{ fontSize:22 }}>{d.icon}</span></div>
                            <div className="dp-type-label">{d.label}</div>
                            <div className="dp-type-desc">{d.desc}</div>
                          </div>
                        ))}
                      </div>
                      {errors.type && <p className="dp-error" style={{ marginTop:"0.75rem" }}>{errors.type}</p>}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="dp-card">
                    <div className="dp-card-head dp-card-head-coral" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>home</span> SELECT PROPERTY</div>
                    <div className="dp-card-body">
                      <div className="dp-prop-list">
                        {properties.map(p => (
                          <div key={p.id} className={`dp-prop-item ${selectedProp===p.id?"dp-prop-item-active":""}`} onClick={() => { setSProp(p.id); setErrors({}); }}>
                            <div>
                              <div className="dp-prop-id">{p.id}</div>
                              <div className="dp-prop-title">{p.title}</div>
                            </div>
                            <div className={`dp-prop-check ${selectedProp===p.id?"dp-prop-check-active":""}`}>{selectedProp===p.id ? <span className="material-icons-sharp" style={{ fontSize:14 }}>check</span> : ""}</div>
                          </div>
                        ))}
                      </div>
                      {errors.prop && <p className="dp-error" style={{ marginTop:"0.75rem" }}>{errors.prop}</p>}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="dp-card">
                    <div className="dp-card-head dp-card-head-coral" style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>description</span> DESCRIBE THE DISPUTE</div>
                    <div className="dp-card-body">
                      <div className="dp-fields">
                        <div className="dp-field">
                          <label className="dp-label">DESCRIPTION OF DISPUTE</label>
                          <textarea
                            className="dp-input dp-textarea"
                            value={description}
                            onChange={e => { setDesc(e.target.value); setErrors({}); }}
                            placeholder="Describe the issue in detail — what is incorrect, why you believe it's wrong, and any relevant dates..."
                          />
                          {errors.desc && <span className="dp-error">{errors.desc}</span>}
                        </div>
                        <div className="dp-field">
                          <label className="dp-label">SUPPORTING EVIDENCE</label>
                          <div style={{ border:"2px dashed rgba(13,61,43,0.2)", borderRadius:"10px", padding:"1.25rem", textAlign:"center", cursor:"pointer", background: uploadedEvidence?"rgba(46,196,160,0.06)":"#F8F8F4", transition:"all 0.18s" }} onClick={() => setEvidence(true)}>
                            {uploadedEvidence
                              ? <p style={{ fontSize:"0.82rem", fontWeight:700, color:"#2EC4A0", display:"flex", alignItems:"center", justifyContent:"center", gap:"4px" }}><span className="material-icons-sharp" style={{ fontSize:16 }}>check_circle</span> Evidence uploaded</p>
                              : <p style={{ fontSize:"0.82rem", color:"rgba(13,61,43,0.45)" }}>Click to upload documents, photos, or other evidence</p>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="dp-nav">
                  {step > 1 && <button className="dp-btn-back" style={{ display:"flex", alignItems:"center", gap:"0.4rem" }} onClick={() => setStep(s=>s-1)}><span className="material-icons-sharp" style={{ fontSize:18 }}>arrow_back</span> Back</button>}
                  <button className="dp-btn-next" onClick={next} disabled={loading}>
                    {loading ? <><span className="spinner"/>Submitting...</> : step<3 ? <>Continue <span className="material-icons-sharp" style={{ fontSize:18 }}>arrow_forward</span></> : <>Submit Dispute <span className="material-icons-sharp" style={{ fontSize:18 }}>send</span></>}
                  </button>
                </div>
              </>
            )
          )}
        </div>
        </div>

      </div>
    </>
  );
}
