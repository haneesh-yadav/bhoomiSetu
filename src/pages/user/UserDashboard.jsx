import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════ */
const ACTIVITY = [
  { icon: "check_circle",  label: "Transfer Approved",      sub: "TN-4521-CHN-2019 · Ownership updated",          date: "12 Jan 2024", color: "#e07a5f" },
  { icon: "sync",          label: "Transfer Initiated",     sub: "TN-4521-CHN-2019 · Awaiting buyer confirmation", date: "10 Jan 2024", color: "#e07a5f" },
  { icon: "call_split",    label: "Mutation Request Filed", sub: "TN-7734-MDU-2021 · Inheritance claim submitted", date: "05 Dec 2023", color: "#e07a5f" },
  { icon: "download",      label: "Certificate Downloaded", sub: "Encumbrance Certificate — TN-1182-CBE-2018",     date: "18 Nov 2023", color: "#f5b8a0" },
  { icon: "verified",      label: "Property Verified",      sub: "TN-4521-CHN-2019 · Public record accessed",      date: "01 Nov 2023", color: "#e07a5f" },
];

const TYPE_META = {
  Residential:  { icon: "home",      color: "#e07a5f" },
  Agricultural: { icon: "grass",     color: "#e07a5f" },
  Commercial:   { icon: "business",  color: "#e07a5f" },
  Land:         { icon: "landscape", color: "#e07a5f" },
};

const NOTICES = [
  { title: "Application window open: Mutation requests for Q2 2024", date: "15 Jan 2024" },
  { title: "System maintenance scheduled: 02:00–04:00 IST on 20 Jan 2024", date: "10 Jan 2024" },
  { title: "New: Download Encumbrance Certificates in PDF format", date: "01 Jan 2024" },
];

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
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Root ── */
  .ud-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }

  /* ══ WELCOME HERO CARD ══ */
  .ud-hero {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: relative;
  }
  .ud-hero-inner {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 20px;
    padding: 20px 24px 20px;
    border-bottom: 1.5px solid #f0f0f0;
  }
  .ud-hero-left { display: flex; align-items: center; gap: 16px; }
  .ud-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #e07a5f, #e07a5f);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 800; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(224,122,95,0.15);
  }
  .ud-hero-info { display: flex; flex-direction: column; gap: 3px; }
  .ud-hero-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(224,122,95,0.08);
    border: 1.5px solid rgba(224,122,95,0.25);
    border-radius: 20px; padding: 2px 10px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; color: #e07a5f;
    width: fit-content; margin-bottom: 1px;
  }
  .ud-hero-chip-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #e07a5f; animation: pulse 1.8s ease-in-out infinite;
  }
  .ud-hero-name {
    font-size: 20px; font-weight: 800; color: #1a1a1a;
    letter-spacing: -0.4px; line-height: 1.15;
  }
  .ud-hero-name span { color: #e07a5f; }
  .ud-hero-meta {
    font-size: 11px; color: #aaa; margin-top: 1px;
  }
  .ud-hero-meta strong { color: #555; font-weight: 600; }
  .ud-hero-right { display: flex; align-items: center; gap: 10px; }
  .ud-hero-date {
    display: flex; align-items: center; gap: 6px;
    background: #f7f7f5;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px; padding: 7px 14px;
    font-size: 11.5px; font-weight: 500; color: #666;
  }
  .ud-hero-date .mi { font-size: 14px; color: #e07a5f; }
  .ud-hero-cta {
    background: #e07a5f; color: #fff; border: none;
    border-radius: 10px; padding: 9px 20px;
    font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    transition: all 0.18s;
    box-shadow: 0 3px 12px rgba(224,122,95,0.3);
  }
  .ud-hero-cta:hover { background: #c05030; transform: translateY(-1px); }
  .ud-hero-cta .mi { font-size: 16px; }
  .ud-hero-cta.secondary {
    background: #fff; color: #1a1a1a;
    border: 1.5px solid #e0e0e0;
    box-shadow: none;
  }
  .ud-hero-cta.secondary:hover { background: #f5f5f3; border-color: #ccc; transform: translateY(-1px); }

  /* ══ STAT STRIP — inside the hero card ══ */
  .ud-stats-strip {
    display: grid; grid-template-columns: repeat(4, 1fr);
    background: #f9f9f7;
  }
  .ud-stat-cell {
    padding: 16px 20px;
    cursor: default;
    transition: background 0.15s;
    position: relative;
    display: flex; flex-direction: column; gap: 5px;
  }
  .ud-stat-cell:not(:last-child) { border-right: 1.5px solid #eeeeec; }
  .ud-stat-cell:hover { background: #f3f3f0; }
  .ud-stat-cell-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #aaa;
  }
  .ud-stat-cell-value {
    font-size: 1.9rem; font-weight: 800; letter-spacing: -0.04em;
    line-height: 1;
  }
  .ud-stat-cell-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 9px; font-weight: 700; padding: 3px 9px;
    border-radius: 20px; width: fit-content;
  }

  /* ══ MAIN WRAPPER ══ */
  .ud-main {
    max-width: 1280px; margin: 0 auto;
    padding: 16px 28px 56px;
    display: flex; flex-direction: column; gap: 16px;
  }

  /* ══ QUICK ACTIONS BAR ══ */
  .ud-actions-bar {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 16px;
    padding: 12px 18px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .ud-actions-label {
    font-size: 10px; font-weight: 700; color: #aaa;
    text-transform: uppercase; letter-spacing: 0.09em;
    padding-right: 12px; border-right: 1.5px solid #ebebeb;
    margin-right: 2px; white-space: nowrap;
  }
  .ud-act-btn {
    background: none; border: 1.5px solid #e0e0e0; border-radius: 10px;
    padding: 7px 15px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 6px; color: #444;
    transition: all 0.15s; white-space: nowrap;
  }
  .ud-act-btn .mi { font-size: 15px; }
  .ud-act-btn:hover { border-color: #e07a5f; color: #e07a5f; background: rgba(224,122,95,0.04); }
  .ud-act-btn.primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .ud-act-btn.primary:hover { background: #2c2c2c; border-color: #2c2c2c; }
  .ud-act-btn.green { background: #e07a5f; color: #fff; border-color: #e07a5f; box-shadow: 0 3px 10px rgba(224,122,95,0.3); }
  .ud-act-btn.green:hover { background: #c05030; }

  /* ══ CONTENT COLUMNS ══ */
  .ud-content-row {
    display: flex; gap: 20px; align-items: flex-start;
  }
  .ud-col-left  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .ud-col-right { width: 310px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }

  /* ══ SECTION CARD ══ */
  .ud-card {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .ud-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .ud-card-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .ud-card-title .mi { font-size: 17px; color: #e07a5f; }
  .ud-card-badge {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .ud-card-link {
    background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px;
    color: rgba(255,255,255,0.75); font-family: 'Poppins', sans-serif;
    font-size: 11.5px; font-weight: 600; cursor: pointer;
    padding: 5px 13px; display: flex; align-items: center; gap: 5px;
    transition: all 0.15s;
  }
  .ud-card-link:hover { background: rgba(255,255,255,0.14); color: #fff; border-color: rgba(255,255,255,0.3); }
  .ud-card-link .mi { font-size: 13px; }

  /* ══ TABLE ══ */
  .ud-table { width: 100%; border-collapse: collapse; }
  .ud-table thead tr { background: #f7f7f5; }
  .ud-table th {
    padding: 9px 16px; font-size: 10px; font-weight: 700;
    color: #888; text-transform: uppercase; letter-spacing: 0.09em;
    text-align: left; border-bottom: 1.5px solid #eeeeec; white-space: nowrap;
  }
  .ud-table td {
    padding: 12px 16px; font-size: 12.5px; border-bottom: 1px solid #f3f3f1;
    vertical-align: middle; color: #1a1a1a;
  }
  .ud-table tr:last-child td { border-bottom: none; }
  .ud-table tbody tr { transition: background 0.12s; }
  .ud-table tbody tr:hover td { background: #fafaf8; }

  /* ID cell */
  .id-cell {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #e07a5f; font-weight: 500; letter-spacing: 0.03em;
  }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    border-radius: 8px; padding: 3px 9px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; white-space: nowrap;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .b-green  { background: rgba(224,122,95,0.1);   color: #e07a5f; }
  .b-green .badge-dot  { background: #e07a5f; }
  .b-teal   { background: rgba(224,122,95,0.12); color: #e07a5f; }
  .b-teal .badge-dot   { background: #e07a5f; }
  .b-amber  { background: rgba(224,122,95,0.12); color: #e07a5f; }
  .b-amber .badge-dot  { background: #e07a5f; }
  .b-red    { background: rgba(220,38,38,0.1);   color: #991b1b; }
  .b-red .badge-dot    { background: #dc2626; }
  .b-blue   { background: rgba(99,102,241,0.1);  color: #4338ca; }
  .b-gray   { background: #f3f4f6; color: #555; }

  /* View btn */
  .view-btn {
    background: none; border: 1.5px solid #e0e0e0; border-radius: 9px;
    padding: 4px 12px; font-family: 'Poppins', sans-serif;
    font-size: 10.5px; font-weight: 600; cursor: pointer; color: #444;
    display: flex; align-items: center; gap: 4px; transition: all 0.14s;
  }
  .view-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .view-btn .mi { font-size: 12px; }

  /* ══ BLOCKCHAIN PANEL ══ */
  .ud-chain {
    background: linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 60%, #1a1a1a 100%);
    border-radius: 20px; overflow: hidden;
    border: 1.5px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    position: relative;
    animation: fadeUp 0.3s ease both;
  }
  .ud-chain::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(224,122,95,0.08) 1px, transparent 1px);
    background-size: 24px 24px; pointer-events: none;
  }
  .ud-chain-head {
    padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .ud-chain-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; font-weight: 700; color: rgba(255,255,255,0.85);
  }
  .ud-chain-title .mi { font-size: 16px; color: #e07a5f; }
  .ud-chain-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 9.5px; font-weight: 700; color: #e07a5f; letter-spacing: 0.09em;
  }
  .ud-chain-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e07a5f;
    box-shadow: 0 0 0 3px rgba(224,122,95,0.2);
    animation: pulse 2s infinite;
  }
  .ud-chain-rows { padding: 4px 0 8px; position: relative; z-index: 1; }
  .ud-chain-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 18px; transition: background 0.12s;
  }
  .ud-chain-row:hover { background: rgba(255,255,255,0.03); }
  .ud-chain-key { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.28); text-transform: uppercase; letter-spacing: 0.08em; }
  .ud-chain-val { font-family: 'DM Mono', monospace; font-size: 11.5px; color: rgba(255,255,255,0.5); }
  .ud-chain-val.ok { color: #e07a5f; font-weight: 700; }

  /* ══ NOTICES PANEL ══ */
  .ud-notices {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .ud-notices-head {
    background: #1a1a1a; padding: 12px 18px;
    display: flex; align-items: center; gap: 9px;
  }
  .ud-notices-head .mi { font-size: 16px; color: #e07a5f; }
  .ud-notices-head span { font-size: 12.5px; font-weight: 700; color: #fff; }
  .ud-notice-item {
    padding: 11px 18px; border-bottom: 1px solid #f5f5f5;
    cursor: pointer; transition: background 0.12s;
    display: flex; flex-direction: column; gap: 3px;
  }
  .ud-notice-item:last-child { border-bottom: none; }
  .ud-notice-item:hover { background: #f9f9f7; }
  .ud-notice-dot-row { display: flex; align-items: flex-start; gap: 8px; }
  .ud-notice-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e07a5f; margin-top: 5px; flex-shrink: 0;
  }
  .ud-notice-title { font-size: 12.5px; font-weight: 600; color: #1a1a1a; line-height: 1.45; }
  .ud-notice-date  { font-size: 10.5px; color: #888; font-weight: 500; padding-left: 14px; }

  /* ══ ACTIVITY LOG ══ */
  .ud-act-icon-wrap {
    width: 30px; height: 30px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ud-act-icon-wrap .mi { font-size: 14px; }

  /* ══ HELP CARD ══ */
  .ud-help {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .ud-help-head {
    background: #1a1a1a; padding: 12px 18px;
    border-bottom: 1.5px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; font-weight: 700; color: #fff;
  }
  .ud-help-head .mi { font-size: 16px; color: #e07a5f; }
  .ud-help-row {
    display: flex; align-items: flex-start; gap: 13px;
    padding: 13px 18px; border-bottom: 1px solid #f3f3f1;
    transition: background 0.12s; cursor: default;
  }
  .ud-help-row:last-child { border-bottom: none; }
  .ud-help-row:hover { background: #f9f9f7; }
  .ud-help-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(224,122,95,0.1);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ud-help-icon .mi { font-size: 16px; color: #e07a5f; }
  .ud-help-label { font-size: 12.5px; font-weight: 600; color: #1a1a1a; }
  .ud-help-sub   { font-size: 10.5px; color: #888; margin-top: 2px; }

  /* ══ EMPTY STATE ══ */
  .ud-empty { text-align: center; padding: 32px 20px; color: #aaa; font-size: 13px; }
  .ud-empty .mi { font-size: 36px; color: #ddd; display: block; margin-bottom: 8px; }

  @media (max-width: 1100px) {
    .ud-stats-strip { grid-template-columns: repeat(2, 1fr); }
    .ud-stat-cell:nth-child(2) { border-right: none; }
    .ud-stat-cell:nth-child(1), .ud-stat-cell:nth-child(2) { border-bottom: 1.5px solid #eeeeec; }
    .ud-content-row { flex-direction: column; }
    .ud-col-right { width: 100%; }
  }
  @media (max-width: 680px) {
    .ud-stats-strip { grid-template-columns: 1fr 1fr; }
    .ud-main  { padding: 16px 14px 60px; }
    .ud-hero-right { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style, size }) => (
  <span className="mi" style={{ fontSize: size, ...style }}>{name}</span>
);

function propStatusBadge(p) {
  if (p.disputeActive) return { cls: "b-red",   label: "Disputed" };
  if (p.encumbrance)   return { cls: "b-amber",  label: "Encumbered" };
  return                      { cls: "b-green",  label: "Clear Title" };
}
function propTypeBadge(t) {
  const m = { Residential: "b-blue", Agricultural: "b-teal", Commercial: "b-amber", Land: "b-green" };
  return m[t] || "b-gray";
}
function transferBadge(status) {
  if (status === "Completed" || status === "APPROVED") return { cls: "b-green", label: "Completed" };
  if (status === "Reviewing") return { cls: "b-blue",  label: "Reviewing" };
  return { cls: "b-amber", label: "Pending" };
}

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [properties, setProperties] = useState([]);
  const [transfers, setTransfers]   = useState([]);
  const [disputes, setDisputes]     = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, transRes, dispRes] = await Promise.all([
          api.get('/properties/my-properties'),
          api.get('/transfers/my-transfers'),
          api.get('/disputes/my-disputes')
        ]);
        setProperties(propRes.data);
        setTransfers(transRes.data);
        setDisputes(dispRes.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const pendingTransfers = transfers.filter(t => t.status !== "Completed" && t.status !== "APPROVED").length;
  const activeDisputes   = disputes.filter(d => d.status === "ACTIVE").length;
  const clearTitle       = properties.filter(p => p.status === "Clear Title").length;

  const dynamicEvents = properties
    .flatMap(p => (p.timeline || []).map(evt => ({ ...evt, propertyTitle: p.title })))
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5)
    .map(e => {
      let icon = "check_circle";
      let color = "#e07a5f";
      const eventLower = e.event.toLowerCase();
      if (eventLower.includes("dispute")) {
        icon = "gavel";
        color = "#b91c1c";
      } else if (eventLower.includes("mutation")) {
        icon = "edit_document";
        color = "#e07a5f";
      } else if (eventLower.includes("reject") || eventLower.includes("dismiss")) {
        icon = "cancel";
        color = "#b91c1c";
      } else if (eventLower.includes("initiated") || eventLower.includes("pending")) {
        icon = "sync";
        color = "#e07a5f";
      }
      return {
        icon,
        label: e.event,
        sub: `${e.propertyTitle || `PROP-${e.propertyId}`} · ${e.from && e.from !== "N/A" ? `${e.from} → ${e.to}` : e.to}`,
        date: e.date,
        color
      };
    });

  const today    = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "CT";

  const STATS = [
    { label: "Properties Owned",  value: properties.length, textColor: "#e07a5f", badgeColor: "#e07a5f", badgeBg: "rgba(224,122,95,0.1)",   badgeText: "registered",  bg: "transparent" },
    { label: "Pending Transfers", value: pendingTransfers,   textColor: "#e07a5f", badgeColor: "#e07a5f", badgeBg: "rgba(224,122,95,0.12)", badgeText: "in progress", bg: "transparent" },
    { label: "Active Disputes",   value: activeDisputes,     textColor: "#b91c1c", badgeColor: "#b91c1c", badgeBg: "rgba(220,38,38,0.1)",   badgeText: "attention",   bg: "transparent" },
    { label: "Clear Title",       value: clearTitle,         textColor: "#e07a5f", badgeColor: "#e07a5f", badgeBg: "rgba(224,122,95,0.12)", badgeText: "verified",    bg: "transparent" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="ud-page">

        {/* ══ MAIN CONTENT ══ */}
        <div className="ud-main">

          {/* ══ HERO WELCOME CARD ══ */}
          <div className="ud-hero">
            <div className="ud-hero-inner">
              <div className="ud-hero-left">
                <div className="ud-avatar">{initials}</div>
                <div className="ud-hero-info">
                  <div className="ud-hero-chip">
                    <span className="ud-hero-chip-dot" />
                    CITIZEN PORTAL
                  </div>
                  <div className="ud-hero-name">
                    Welcome back, <span>{user?.name ?? "Citizen"}</span>
                  </div>
                  <div className="ud-hero-meta">
                    Citizen ID:&nbsp;<strong>{user?.citizenId ?? "TN-XXXXXXXX"}</strong>
                    &nbsp;·&nbsp;State:&nbsp;<strong>{user?.state ?? "Tamil Nadu"}</strong>
                    {user?.aadhaar && <>&nbsp;·&nbsp;Aadhaar:&nbsp;<strong>••••{user.aadhaar.slice(-4)}</strong></>}
                  </div>
                </div>
              </div>
              <div className="ud-hero-right">
                <div className="ud-hero-date"><MI name="today" /> {today}</div>
                <button className="ud-hero-cta secondary" onClick={() => navigate("/user/properties")}>
                  <MI name="home_work" /> My Properties
                </button>
                <button className="ud-hero-cta" onClick={() => navigate("/user/transfers")}>
                  <MI name="swap_horiz" /> Initiate Transfer
                </button>
              </div>
            </div>

            {/* ══ STAT STRIP ══ */}
            <div className="ud-stats-strip">
              {STATS.map((s, i) => (
                <div key={i} className="ud-stat-cell">
                  <div className="ud-stat-cell-label">{s.label}</div>
                  <div className="ud-stat-cell-value" style={{ color: s.textColor }}>{s.value}</div>
                  <div className="ud-stat-cell-badge" style={{ background: s.badgeBg, color: s.badgeColor }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.badgeColor, display: "inline-block" }} />
                    {s.badgeText}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Two-column layout */}
          <div className="ud-content-row">

            {/* ── LEFT ── */}
            <div className="ud-col-left">

              {/* Properties */}
              <div className="ud-card" style={{ animationDelay: "0s" }}>
                <div className="ud-card-head">
                  <div className="ud-card-title">
                    <MI name="home_work" /> My Properties
                    <span className="ud-card-badge">{properties.length} Records</span>
                  </div>
                  <button className="ud-card-link" onClick={() => navigate("/user/properties")}>
                    View All <MI name="arrow_forward" />
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="ud-table">
                    <thead>
                      <tr>
                        <th>Property ID</th>
                        <th>Name / Address</th>
                        <th>Type</th>
                        <th>Area</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.slice(0, 5).map(p => {
                        const sb = propStatusBadge(p);
                        const tb = propTypeBadge(p.type);
                        const meta = TYPE_META[p.type] || TYPE_META.Residential;
                        return (
                          <tr key={p.id}>
                            <td><span className="id-cell">{p.id}</span></td>
                            <td>
                              <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "12.5px" }}>{p.title}</div>
                              <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{p.district}</div>
                            </td>
                            <td>
                              <span className={`badge ${tb}`}>
                                <MI name={meta.icon} size="11px" /> {p.type}
                              </span>
                            </td>
                            <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#444" }}>{p.area}</td>
                            <td>
                              <span className={`badge ${sb.cls}`}>
                                <span className="badge-dot" />{sb.label}
                              </span>
                            </td>
                            <td>
                              <button className="view-btn" onClick={() => navigate("/user/properties", { state: { openPropertyId: p.id } })}>
                                <MI name="open_in_new" /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {properties.length === 0 && (
                        <tr><td colSpan={6}>
                          <div className="ud-empty">
                            <MI name="home_work" />
                            No properties registered yet.
                          </div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transfers */}
              <div className="ud-card" style={{ animationDelay: "0.05s" }}>
                <div className="ud-card-head">
                  <div className="ud-card-title">
                    <MI name="swap_horiz" /> Transfer Requests
                    <span className="ud-card-badge">{transfers.length} Records</span>
                  </div>
                  <button className="ud-card-link" onClick={() => navigate("/user/transfers")}>
                    View All <MI name="arrow_forward" />
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="ud-table">
                    <thead>
                      <tr>
                        <th>Ref. No.</th>
                        <th>Property</th>
                        <th>Counterparty</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transfers.slice(0, 5).map((t, i) => {
                        const tb = transferBadge(t.status);
                        return (
                          <tr key={t.id || i}>
                            <td><span className="id-cell">{t.referenceNo || `TN-TRF-${String(i+1).padStart(4,"0")}`}</span></td>
                            <td style={{ fontWeight: 700, color: "#1a1a1a" }}>{t.propertyId || "—"}</td>
                            <td style={{ color: "#555" }}>{t.counterparty || t.buyerName || "—"}</td>
                            <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "11.5px", color: "#666" }}>
                              {t.date || t.createdAt?.slice(0, 10) || "—"}
                            </td>
                            <td>
                              <span className={`badge ${tb.cls}`}>
                                <span className="badge-dot" />{tb.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {transfers.length === 0 && (
                        <tr><td colSpan={5}>
                          <div className="ud-empty">
                            <MI name="swap_horiz" />
                            No transfer requests found.
                          </div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Log */}
              <div className="ud-card" style={{ animationDelay: "0.1s" }}>
                <div className="ud-card-head">
                  <div className="ud-card-title"><MI name="history" /> Recent Activity</div>
                </div>
                <table className="ud-table">
                  <thead>
                    <tr>
                      <th style={{ width: 46 }}></th>
                      <th>Event</th>
                      <th>Details</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dynamicEvents.length > 0 ? dynamicEvents : ACTIVITY).map((a, i) => (
                      <tr key={i}>
                        <td>
                          <div className="ud-act-icon-wrap" style={{ background: a.color + "18" }}>
                            <MI name={a.icon} style={{ color: a.color }} />
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: "#1a1a1a" }}>{a.label}</td>
                        <td style={{ color: "#555", fontSize: "11.5px" }}>{a.sub}</td>
                        <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#888", whiteSpace: "nowrap" }}>{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* ── RIGHT ── */}
            <div className="ud-col-right">

              {/* Blockchain */}
              <div className="ud-chain">
                <div className="ud-chain-head">
                  <div className="ud-chain-title"><MI name="hub" /> Blockchain Status</div>
                  <span className="ud-chain-live"><span className="ud-chain-dot" /> LIVE</span>
                </div>
                <div className="ud-chain-rows">
                  {[
                    { key: "Latest Block", val: "#1,847,392",                    ok: false },
                    { key: "Your Records", val: `${properties.length} on-chain`, ok: false },
                    { key: "Last Hash",    val: "0x3f9a…c4e5",                   ok: false },
                    { key: "Network",      val: "TN State Registry",             ok: false },
                    { key: "Integrity",    val: "✓ Verified",                    ok: true  },
                  ].map((r, i) => (
                    <div className="ud-chain-row" key={i}>
                      <span className="ud-chain-key">{r.key}</span>
                      <span className={`ud-chain-val${r.ok ? " ok" : ""}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notices */}
              <div className="ud-notices">
                <div className="ud-notices-head">
                  <MI name="campaign" />
                  <span>Official Notices</span>
                </div>
                {NOTICES.map((n, i) => (
                  <div className="ud-notice-item" key={i}>
                    <div className="ud-notice-dot-row">
                      <span className="ud-notice-dot" />
                      <div className="ud-notice-title">{n.title}</div>
                    </div>
                    <div className="ud-notice-date">{n.date}</div>
                  </div>
                ))}
              </div>

              {/* Help Desk */}
              <div className="ud-help">
                <div className="ud-help-head">
                  <MI name="support_agent" /> Citizen Help Desk
                </div>
                {[
                  { icon: "phone",         label: "Toll Free: 1800-XXX-XXXX",  sub: "Mon–Sat, 9 AM – 6 PM" },
                  { icon: "mail_outline",  label: "support@tn-lands.gov.in",   sub: "Response within 48 hrs" },
                  { icon: "location_city", label: "District Office Visit",     sub: "Bring original documents" },
                ].map((h, i) => (
                  <div className="ud-help-row" key={i}>
                    <div className="ud-help-icon"><MI name={h.icon} /></div>
                    <div>
                      <div className="ud-help-label">{h.label}</div>
                      <div className="ud-help-sub">{h.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}