import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPropertiesByOwner } from "../../database/Properties";
import Navbar1 from "../../components/Navbar1";

const CERT_TYPES = [
  {
    id:    "ec",
    label: "Encumbrance Certificate",
    short: "EC",
    icon:  "verified",
    color: "#C8F135",
    desc:  "Confirms no pending loans, mortgages or liabilities on the property.",
  },
  {
    id:    "ownership",
    label: "Ownership Certificate",
    short: "OC",
    icon:  "account_balance",
    color: "#5B4FD4",
    desc:  "Official document certifying current legal ownership of the property.",
  },
  {
    id:    "valuation",
    label: "Property Valuation Report",
    short: "PVR",
    icon:  "bar_chart",
    color: "#2EC4A0",
    desc:  "Government assessed market value for banking and legal purposes.",
  },
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
  @keyframes shimmer {
    0%{background-position: -200px 0;
    }100%{background-position: 200px 0;
    };
  }

  .cer-page {
    font-family: 'Poppins',sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }
  /* grid-bg removed */

  /* Hero — dark + lime accent */
/* ── Slim page header ── */
  .cer-header {
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .cer-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .cer-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .cer-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
  }
  .cer-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .cer-page-sub {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* Content */
  .cer-content {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 2.5rem 4rem;
  }
  .cer-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.5rem;
    align-items: start;
  }

  /* Cert type cards */
  .cer-section-label {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
    margin-bottom: 0.85rem;
  }
  .cer-type-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  .cer-type-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    cursor: pointer;
    transition: transform 0.18s,box-shadow 0.18s;
    animation: fadeUp 0.4s ease both;
  }
  .cer-type-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(13,61,43,0.1);
    border-color: rgba(13,61,43,0.18);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }
  .cer-type-card-selected {
    box-shadow: 0 8px 20px rgba(13,61,43,0.1);
    border-color: var(--cert-color);
  }
  .cer-type-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 5px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }
  .cer-type-tab {
    height: 22px;
    border-radius: 5px 5px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 0.6rem;
    font-weight: 800;
    min-width: 80px;
  }
  .cer-type-body {
    padding: 1.1rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .cer-type-icon {
    width: 44px;
    height: 44px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .cer-type-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }
  .cer-type-desc {
    font-size: 0.75rem;
    color: rgba(13,61,43,0.55);
    line-height: 1.4;
  }
  .cer-type-select {
    margin-left: auto;
    padding: 0.4rem 1rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
    transition: all 0.18s;
  }
  .cer-type-select-active { color: #fff; }
  .cer-type-select:hover { opacity: 0.82; }

  /* Property selector */
  .cer-prop-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .cer-prop-item {
    border: 2px solid rgba(13,61,43,0.15);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.18s;
    background: #fff;
  }
  .cer-prop-item:hover { border-color: #0D3D2B; }
  .cer-prop-item-active {
    border-color: #0D3D2B;
    background: #C8F135;
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .cer-prop-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.58rem;
    color: rgba(13,61,43,0.38);
    margin-bottom: 0.1rem;
  }
  .cer-prop-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .cer-prop-meta {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
    margin-top: 0.1rem;
  }
  .cer-prop-check {
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
  .cer-prop-check-active {
    background: #0D3D2B;
    color: #C8F135;
    border-color: #0D3D2B;
  }

  /* Right sidebar */
  .cer-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Certificate preview card */
  .cer-preview-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }
  .cer-preview-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 6px 10px 0;
    gap: 4px;
    background: #F0F0EC;
  }
  .cer-preview-tab {
    height: 24px;
    border-radius: 6px 6px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 0.6rem;
    font-weight: 800;
  }
  .cer-preview-body {
    padding: 1.25rem;
    background: #fff;
  }
  .cer-preview-header {
    text-align: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1.5px dashed rgba(13,61,43,0.15);
  }
  .cer-preview-seal {
    width: 50px;
    height: 50px;
    border: 3px solid #0D3D2B;
    border-radius: 50%;
    background: #C8F135;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.6rem;
    box-shadow: 2px 2px 0 #0D3D2B;
  }
  .cer-preview-gov {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.5);
    margin-bottom: 0.15rem;
  }
  .cer-preview-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .cer-preview-rows {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .cer-preview-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.45rem 0;
    border-bottom: 1px dashed rgba(13,61,43,0.08);
  }
  .cer-preview-row:last-child { border-bottom: none; }
  .cer-preview-lbl {
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(13,61,43,0.4);
    letter-spacing: 0.04em;
  }
  .cer-preview-val {
    font-size: 0.75rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .cer-preview-hash {
    margin-top: 0.85rem;
    padding: 0.5rem;
    background: #0D3D2B;
    border-radius: 7px;
    text-align: center;
  }
  .cer-preview-hash-val {
    font-family: 'DM Mono',monospace;
    font-size: 0.58rem;
    color: #C8F135;
  }

  /* Placeholder preview */
  .cer-placeholder {
    padding: 2rem;
    text-align: center;
    background: #fff;
  }
  .cer-placeholder-icon {
    margin-bottom: 0.75rem;
    opacity: 0.3;
    display: flex;
    justify-content: center;
  }
  .cer-placeholder-text {
    font-size: 0.82rem;
    color: rgba(13,61,43,0.4);
    line-height: 1.5;
  }

  /* Download button */
  .cer-download-btn {
    width: 100%;
    padding: 0.88rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: opacity 0.18s;
  }
  .cer-download-btn:hover { opacity: 0.88; }
  .cer-download-btn:disabled {
    opacity: 0.4;
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

  /* Past certificates */
  .cer-past-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .cer-past-item {
    border: 2px solid rgba(13,61,43,0.12);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    background: #fff;
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }
  .cer-past-icon {
    width: 34px;
    height: 34px;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .cer-past-name {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
  }
  .cer-past-date {
    font-size: 0.68rem;
    color: rgba(13,61,43,0.4);
    margin-top: 0.1rem;
  }
  .cer-past-dl {
    margin-left: auto;
    padding: 0.3rem 0.85rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 6px;
    background: transparent;
    font-size: 0.68rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .cer-past-dl:hover {
    background: #0D3D2B;
    color: #C8F135;
  }

  @media(max-width:900px) {
    .cer-layout{grid-template-columns: 1fr;
    } .cer-sidebar{display: grid;
    grid-template-columns: 1fr 1fr;
    };
  }
  @media(max-width:768px) {
    .cer-hero{padding: 1.5rem 1rem 1.5rem;
    } .cer-content{padding: 1.25rem 1rem 3rem;
    } .cer-sidebar{grid-template-columns: 1fr;
    };
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

const PAST_CERTS = [
  { name:"Encumbrance Certificate — TN-1182", date:"18 Nov 2023", icon:"verified"        },
  { name:"Ownership Certificate — TN-4521",   date:"05 Mar 2023", icon:"account_balance" },
  { name:"Property Valuation — TN-7734",      date:"12 Jan 2023", icon:"bar_chart"       },
];

export default function Certificates() {
  const { user, logout } = useAuth();

  const [selectedCert, setCert]   = useState(null);
  const [selectedProp, setProp]   = useState(null);
  const [generating,   setGen]    = useState(false);
  const [generated,    setGenerated] = useState(false);

  const properties = user ? getPropertiesByOwner(user.id) : [];
  const prop  = properties.find(p => p.id === selectedProp);
  const cert  = CERT_TYPES.find(c => c.id === selectedCert);
  const ready = selectedCert && selectedProp;

  const handleGenerate = async () => {
    setGen(true);
    await new Promise(r => setTimeout(r, 1500));
    setGen(false);
    setGenerated(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="cer-page">
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

        <div className="cer-header">
          <div className="cer-header-left">
            <span className="cer-page-title">Certificates</span>
            <span className="cer-page-sub">Request and download official property documents</span>
          </div>
        </div>

        <div className="cer-content">
          <div className="cer-layout">

            {/* LEFT */}
            <div>
              {/* Cert type selection */}
              <div className="cer-section-label">SELECT CERTIFICATE TYPE</div>
              <div className="cer-type-list">
                {CERT_TYPES.map((c, i) => (
                  <div
                    key={c.id}
                    className={`cer-type-card ${selectedCert===c.id?"cer-type-card-selected":""}`}
                    style={{ "--cert-color": c.color, animationDelay:`${i*0.08}s` }}
                    onClick={() => { setCert(c.id); setGenerated(false); }}
                  >
                    <div className="cer-type-chrome">
                      <div className="cer-type-tab" style={{ background:c.color }}>
                        {c.short}
                      </div>
                    </div>
                    <div className="cer-type-body">
                      <div className="cer-type-icon" style={{ background:`${c.color}30` }}><span className="material-icons-sharp" style={{ fontSize:22 }}>{c.icon}</span></div>
                      <div style={{ flex:1 }}>
                        <div className="cer-type-name">{c.label}</div>
                        <div className="cer-type-desc">{c.desc}</div>
                      </div>
                      <button
                        className={`cer-type-select ${selectedCert===c.id?"cer-type-select-active":""}`}
                        style={{ background: selectedCert===c.id ? c.color : "transparent", borderColor: c.color, color: selectedCert===c.id ? "#0D3D2B" : c.color }}
                      >
                        {selectedCert===c.id ? <><span className="material-icons-sharp" style={{ fontSize:14, verticalAlign:"middle" }}>check</span> Selected</> : "Select"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Property selection */}
              {selectedCert && (
                <>
                  <div className="cer-section-label">SELECT PROPERTY</div>
                  <div className="cer-prop-list">
                    {properties.map(p => (
                      <div
                        key={p.id}
                        className={`cer-prop-item ${selectedProp===p.id?"cer-prop-item-active":""}`}
                        onClick={() => { setProp(p.id); setGenerated(false); }}
                      >
                        <div style={{ flex:1 }}>
                          <div className="cer-prop-id">{p.id}</div>
                          <div className="cer-prop-title">{p.title}</div>
                          <div className="cer-prop-meta">{p.area} · {p.district}</div>
                        </div>
                        <div className={`cer-prop-check ${selectedProp===p.id?"cer-prop-check-active":""}`}>
                          {selectedProp===p.id ? <span className="material-icons-sharp" style={{ fontSize:14 }}>check</span> : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Past certificates */}
              <div style={{ marginTop:"2rem" }}>
                <div className="cer-section-label">PREVIOUSLY GENERATED</div>
                <div className="cer-past-list">
                  {PAST_CERTS.map((c, i) => (
                    <div key={i} className="cer-past-item">
                      <div className="cer-past-icon"><span className="material-icons-sharp" style={{ fontSize:18 }}>{c.icon}</span></div>
                      <div>
                        <div className="cer-past-name">{c.name}</div>
                        <div className="cer-past-date">{c.date}</div>
                      </div>
                      <button className="cer-past-dl" style={{ display:"flex", alignItems:"center", gap:"3px" }}><span className="material-icons-sharp" style={{ fontSize:13 }}>download</span> PDF</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="cer-sidebar">

              {/* Certificate preview */}
              <div className="cer-preview-card">
                <div className="cer-preview-chrome">
                  <div className="cer-preview-tab" style={{ background: cert?.color || "#C8F135", minWidth:90 }}>
                    {cert?.short || "CERT"} PREVIEW
                  </div>
                </div>
                {ready && prop && cert ? (
                  <div className="cer-preview-body">
                    <div className="cer-preview-header">
                      <div className="cer-preview-seal"><span className="material-icons-sharp" style={{ fontSize:24 }}>account_balance</span></div>
                      <div className="cer-preview-gov">GOVERNMENT OF TAMIL NADU</div>
                      <div className="cer-preview-name">{cert.label}</div>
                    </div>
                    <div className="cer-preview-rows">
                      {[
                        { label:"PROPERTY ID",    value: prop.id            },
                        { label:"OWNER",          value: user?.name || "—"  },
                        { label:"SURVEY NO.",     value: prop.surveyNo      },
                        { label:"AREA",           value: prop.area          },
                        { label:"DISTRICT",       value: prop.district      },
                        { label:"ISSUED ON",      value: new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) },
                        { label:"STATUS",         value: generated ? "VALID" : "PENDING" },
                      ].map((r, i) => (
                        <div key={i} className="cer-preview-row">
                          <span className="cer-preview-lbl">{r.label}</span>
                          <span className="cer-preview-val" style={ r.label==="STATUS" ? { color: generated?"#2EC4A0":"#F0A030" } : {} }>{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="cer-preview-hash">
                      <div className="cer-preview-hash-val">{prop.hash.slice(0, 28)}...</div>
                    </div>
                  </div>
                ) : (
                  <div className="cer-placeholder">
                    <div className="cer-placeholder-icon"><span className="material-icons-sharp" style={{ fontSize:40 }}>insert_drive_file</span></div>
                    <div className="cer-placeholder-text">
                      Select a certificate type<br />and property to preview
                    </div>
                  </div>
                )}
              </div>

              {/* Download button */}
              <button
                className="cer-download-btn"
                style={{ background: generated ? "#2EC4A0" : cert?.color || "#C8F135", color:"#0D3D2B" }}
                disabled={!ready || generating}
                onClick={generated ? () => {} : handleGenerate}
              >
                {generating
                  ? <><span className="spinner"/>Generating...</>
                  : generated
                    ? <><span className="material-icons-sharp" style={{ fontSize:20 }}>download</span> Download PDF</>
                    : <>Generate Certificate <span className="material-icons-sharp" style={{ fontSize:20 }}>arrow_forward</span></>
                }
              </button>

            </div>

          </div>
        </div>
        </div>

      </div>
    </>
  );
}
