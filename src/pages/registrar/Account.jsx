import { useAuth } from "../../context/AuthContext";
import React from "react";

const CSS = `
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

  /* ── Page ── */
  .ac-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
    user-select: none;
    overflow-x: hidden;
  }

  .ac-main {
    display: flex; flex-direction: column; gap: 16px;
    padding: 16px 14px 56px;
    overflow-x: hidden; min-width: 0;
  }

  /* ── Top bar ── */
  .ac-topbar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px;
    animation: fadeUp 0.3s ease both;
  }
  .ac-heading {
    font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px;
  }
  .ac-heading span { color: #7C6EF5; }

  .ac-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 6px 13px; font-size: 10.5px; font-weight: 600; color: #888;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .ac-meta-chip .mi { font-size: 13px; color: #7C6EF5; }

  /* ── Profile card ── */
  .ac-profile-card {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    animation: fadeUp 0.3s ease both;
  }

  .ac-profile-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .ac-profile-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .ac-profile-title .mi { font-size: 17px; color: #7C6EF5; }
  .ac-profile-title span { color: #7C6EF5; }
  .ac-profile-pill {
    background: rgba(124,110,245,0.15); color: #7C6EF5;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(124,110,245,0.25);
  }

  .ac-profile-body {
    padding: 20px;
    display: flex; align-items: center; gap: 24px;
  }

  /* Avatar */
  .ac-avatar-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    flex-shrink: 0;
  }
  .ac-avatar-wrap img,
  .ac-avatar-initials {
    width: 86px; height: 104px;
    border-radius: 14px;
    object-fit: cover;
  }
  .ac-avatar-initials {
    background: linear-gradient(135deg, #1a1a1a, #333);
    border: 2px solid #7C6EF5;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem; font-weight: 800; color: #7C6EF5; letter-spacing: -1px;
  }
  .ac-avatar-wrap img { border: 2px solid #7C6EF5; }
  .ac-avatar-name {
    font-size: 11px; font-weight: 700; color: #1a1a1a;
    text-transform: uppercase; text-align: center;
  }

  /* Quick facts grid */
  .ac-quick-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; flex: 1;
  }
  .ac-quick-item {
    background: #fafaf8; border: 1.5px solid #ebebeb; border-radius: 12px;
    padding: 10px 14px; display: flex; flex-direction: column; gap: 3px;
  }
  .ac-quick-label {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    color: #7C6EF5; letter-spacing: 0.06em;
  }
  .ac-quick-value {
    font-size: 12px; font-weight: 600; color: #1a1a1a;
  }

  /* ── Section zone (accordion replacement) ── */
  .ac-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    animation: fadeUp 0.3s ease both;
  }

  .ac-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a; cursor: pointer;
    user-select: none;
  }
  .ac-zone-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .ac-zone-title .mi { font-size: 17px; color: #7C6EF5; }
  .ac-zone-title span { color: #7C6EF5; }

  .ac-zone-arrow {
    font-family: 'Material Icons Sharp'; font-style: normal; font-weight: normal;
    font-size: 18px; color: #888;
    transition: transform 0.25s ease;
    line-height: 1;
  }
  .ac-zone-arrow.open { transform: rotate(180deg); color: #7C6EF5; }

  .ac-zone-body {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.25s ease-out;
  }
  .ac-zone-body.open { max-height: 600px; }

  /* ── Row list inside zone ── */
  .ac-rows { display: flex; flex-direction: column; }

  .ac-row {
    display: flex; align-items: stretch;
    border-bottom: 1.5px solid #f0f0f0;
  }
  .ac-row:last-child { border-bottom: none; }

  .ac-row-label {
    background: #f5f5f5; color: #555;
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    width: 32%; min-width: 110px;
    padding: 11px 16px; display: flex; align-items: center;
    letter-spacing: 0.04em; border-right: 1.5px solid #ebebeb;
  }

  .ac-row-value {
    background: #fff; color: #1a1a1a;
    font-size: 12px; font-weight: 500;
    padding: 11px 16px; display: flex; align-items: center; gap: 6px;
    flex: 1;
  }

  .ac-row-value.verified {
    color: #2d9e6b; font-weight: 700;
  }
  .ac-row-value.verified .mi { font-size: 14px; color: #2d9e6b; }

  /* ── Mobile ── */
  @media (max-width: 680px) {
    .ac-main { padding: 12px 14px 40px; }
    .ac-profile-body { flex-direction: column; align-items: center; }
    .ac-quick-grid { grid-template-columns: 1fr 1fr; width: 100%; }
    .ac-row { flex-direction: column; }
    .ac-row-label, .ac-row-value { width: 100%; border-right: none; }
    .ac-row-label { border-bottom: 1px solid #ebebeb; }
  }
`;

function MI({ name, size = 15 }) {
  return (
    <span
      className="mi"
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}

function ZoneSection({ icon, title, accent, items, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="ac-zone">
      <div className="ac-zone-header" onClick={() => setOpen((o) => !o)}>
        <div className="ac-zone-title">
          <MI name={icon} size={17} />
          {title} <span>{accent}</span>
        </div>
        <span className={`ac-zone-arrow${open ? " open" : ""}`}>expand_more</span>
      </div>
      <div className={`ac-zone-body${open ? " open" : ""}`}>
        <div className="ac-rows">
          {items.map((item, i) => (
            <div className="ac-row" key={i}>
              <span className="ac-row-label">{item.label}</span>
              <span className={`ac-row-value${item.verified ? " verified" : ""}`}>
                {item.verified && <MI name="verified" size={14} />}
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "R";

  const quickFacts = [
    { label: "Role",       value: "Registrar Official" },
    { label: "District",   value: user?.district || "—" },
    { label: "Email",      value: user?.email || "—" },
    { label: "Office",     value: user?.office || "—" },
  ];

  const sections = [
    {
      icon: "person",
      title: "Officer",
      accent: "credentials",
      items: [
        { label: "Full Name",   value: user?.name  || "—" },
        { label: "Email",       value: user?.email || "—" },
        { label: "District",    value: user?.district || "—" },
        { label: "Office",      value: user?.office || "—" },
        { label: "Employee ID", value: user?.employeeId || "REG-1001" },
        { label: "Role",        value: "REGISTRAR" },
        { label: "Department",  value: user?.department || "Revenue Department" },
        { label: "Since",       value: user?.since || "2019" },
        { label: "Status",      value: "Official Verified", verified: true },
      ],
    },
    {
      icon: "verified_user",
      title: "Verification &",
      accent: "security",
      items: [
        { label: "Account Status", value: "Active & Verified", verified: true },
        { label: "KYC Status",     value: "Completed" },
        { label: "Linked Database", value: "Yes" },
        { label: "2FA Enabled",    value: "Yes" },
        { label: "Last Login",     value: "Today" },
      ],
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="ac-page">
        <div className="ac-main">

          {/* ── Top bar ── */}
          <div className="ac-topbar">
            <h1 className="ac-heading">Officer <span>Account</span></h1>
            <div className="ac-meta-chip">
              <MI name="shield" size={13} />
              Registrar Official
            </div>
          </div>

          {/* ── Profile card ── */}
          <div className="ac-profile-card">
            <div className="ac-profile-header">
              <div className="ac-profile-title">
                <MI name="account_circle" size={17} />
                Officer <span>overview</span>
              </div>
              <div className="ac-profile-pill">ACTIVE</div>
            </div>
            <div className="ac-profile-body">
              <div className="ac-avatar-wrap">
                <div className="ac-avatar-initials">{initials}</div>
                <span className="ac-avatar-name">{user?.name || "Officer"}</span>
              </div>
              <div className="ac-quick-grid">
                {quickFacts.map((f) => (
                  <div className="ac-quick-item" key={f.label}>
                    <span className="ac-quick-label">{f.label}</span>
                    <span className="ac-quick-value">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Accordion zones ── */}
          {sections.map((s, i) => (
            <ZoneSection
              key={s.title}
              icon={s.icon}
              title={s.title}
              accent={s.accent}
              items={s.items}
              defaultOpen={i === 0}
            />
          ))}

        </div>
      </div>
    </>
  );
}