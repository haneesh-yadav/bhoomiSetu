import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════ */
const ACTIVITY = [
  { icon: "check_circle",  label: "Transfer Approved",       sub: "TN-4521-CHN-2019 · Ownership updated",       date: "12 Jan 2024", color: "#7C6EF5" },
  { icon: "manage_search", label: "Review Started",          sub: "TXN-2024-004 · Under document verification", date: "17 Mar 2024", color: "#7C6EF5" },
  { icon: "gavel",         label: "Dispute Assigned",        sub: "DSP-2024-002 · Ownership dispute opened",    date: "14 Feb 2024", color: "#f07060" },
  { icon: "feedback",      label: "Clarification Requested", sub: "TXN-2024-003 · Fresh Patta copy requested",  date: "18 Mar 2024", color: "#7C6EF5" },
];

const NOTICES = [
  { title: "Registrar Circular: Directives on verification of inheritance certificates", date: "15 May 2026" },
  { title: "System Maintenance: Registry Node downtime scheduled on 02 June 2026", date: "28 May 2026" },
  { title: "Training Session: Blockchain smart contract mechanics for revenue officers", date: "20 May 2026" },
];

/* ══════════════════════════════════════════════════
   CSS — structured to match UserDashboard exactly
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
  .rd-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }

  /* ══ WELCOME HERO CARD ══ */
  .rd-hero {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: relative;
  }
  .rd-hero-inner {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 20px;
    padding: 20px 24px 20px;
    border-bottom: 1.5px solid #f0f0f0;
  }
  .rd-hero-left { display: flex; align-items: center; gap: 16px; }
  .rd-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: linear-gradient(135deg, #7C6EF5, #7C6EF5);
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 800; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(124,110,245,0.15);
  }
  .rd-hero-info { display: flex; flex-direction: column; gap: 3px; }
  .rd-hero-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(124,110,245,0.08);
    border: 1.5px solid rgba(124,110,245,0.25);
    border-radius: 20px; padding: 2px 10px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.1em; color: #7C6EF5;
    width: fit-content; margin-bottom: 1px;
  }
  .rd-hero-chip-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #7C6EF5; animation: pulse 1.8s ease-in-out infinite;
  }
  .rd-hero-name {
    font-size: 20px; font-weight: 800; color: #1a1a1a;
    letter-spacing: -0.4px; line-height: 1.15;
  }
  .rd-hero-name span { color: #7C6EF5; }
  .rd-hero-meta {
    font-size: 11px; color: #aaa; margin-top: 1px;
  }
  .rd-hero-meta strong { color: #555; font-weight: 600; }
  .rd-hero-right { display: flex; align-items: center; gap: 10px; }
  .rd-hero-date {
    display: flex; align-items: center; gap: 6px;
    background: #f7f7f5;
    border: 1.5px solid #e8e8e8;
    border-radius: 10px; padding: 7px 14px;
    font-size: 11.5px; font-weight: 500; color: #666;
  }
  .rd-hero-date .mi { font-size: 14px; color: #7C6EF5; }
  .rd-hero-cta {
    background: #7C6EF5; color: #fff; border: none;
    border-radius: 10px; padding: 9px 20px;
    font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 7px;
    transition: all 0.18s;
    box-shadow: 0 3px 12px rgba(124,110,245,0.3);
  }
  .rd-hero-cta:hover { background: #5B4FD4; transform: translateY(-1px); }
  .rd-hero-cta .mi { font-size: 16px; }
  .rd-hero-cta.secondary {
    background: #fff; color: #1a1a1a;
    border: 1.5px solid #e0e0e0;
    box-shadow: none;
  }
  .rd-hero-cta.secondary:hover { background: #f5f5f3; border-color: #ccc; transform: translateY(-1px); }

  /* ══ STAT STRIP — inside the hero card ══ */
  .rd-stats-strip {
    display: grid; grid-template-columns: repeat(4, 1fr);
    background: #f9f9f7;
  }
  .rd-stat-cell {
    padding: 16px 20px;
    cursor: default;
    transition: background 0.15s;
    position: relative;
    display: flex; flex-direction: column; gap: 5px;
  }
  .rd-stat-cell:not(:last-child) { border-right: 1.5px solid #eeeeec; }
  .rd-stat-cell:hover { background: #f3f3f0; }
  .rd-stat-cell-label {
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: #aaa;
  }
  .rd-stat-cell-value {
    font-size: 1.9rem; font-weight: 800; letter-spacing: -0.04em;
    line-height: 1;
  }
  .rd-stat-cell-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 9px; font-weight: 700; padding: 3px 9px;
    border-radius: 20px; width: fit-content;
  }

  /* ══ MAIN WRAPPER ══ */
  .rd-main {
    max-width: 1280px; margin: 0 auto;
    padding: 16px 28px 56px;
    display: flex; flex-direction: column; gap: 16px;
  }

  /* ══ QUICK ACTIONS BAR ══ */
  .rd-actions-bar {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 16px;
    padding: 12px 18px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .rd-actions-label {
    font-size: 10px; font-weight: 700; color: #aaa;
    text-transform: uppercase; letter-spacing: 0.09em;
    padding-right: 12px; border-right: 1.5px solid #ebebeb;
    margin-right: 2px; white-space: nowrap;
  }
  .rd-act-btn {
    background: none; border: 1.5px solid #e0e0e0; border-radius: 10px;
    padding: 7px 15px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; gap: 6px; color: #444;
    transition: all 0.15s; white-space: nowrap;
  }
  .rd-act-btn .mi { font-size: 15px; }
  .rd-act-btn:hover { border-color: #7C6EF5; color: #7C6EF5; background: rgba(124,110,245,0.04); }
  .rd-act-btn.primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .rd-act-btn.primary:hover { background: #2c2c2c; border-color: #2c2c2c; }
  .rd-act-btn.green { background: #7C6EF5; color: #fff; border-color: #7C6EF5; box-shadow: 0 3px 10px rgba(124,110,245,0.3); }
  .rd-act-btn.green:hover { background: #5B4FD4; }

  /* ══ CONTENT COLUMNS ══ */
  .rd-content-row {
    display: flex; gap: 20px; align-items: flex-start;
  }
  .rd-col-left  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .rd-col-right { width: 310px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }

  /* ══ SECTION CARD ══ */
  .rd-card {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .rd-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .rd-card-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .rd-card-title .mi { font-size: 17px; color: #7C6EF5; }
  .rd-card-badge {
    background: rgba(124,110,245,0.15); color: #7C6EF5;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(124,110,245,0.25);
  }
  .rd-card-link {
    background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 10px;
    color: rgba(255,255,255,0.75); font-family: 'Poppins', sans-serif;
    font-size: 11.5px; font-weight: 600; cursor: pointer;
    padding: 5px 13px; display: flex; align-items: center; gap: 5px;
    transition: all 0.15s;
  }
  .rd-card-link:hover { background: rgba(255,255,255,0.14); color: #fff; border-color: rgba(255,255,255,0.3); }
  .rd-card-link .mi { font-size: 13px; }

  /* ══ TABLE ══ */
  .rd-table { width: 100%; border-collapse: collapse; }
  .rd-table thead tr { background: #f7f7f5; }
  .rd-table th {
    padding: 9px 16px; font-size: 10px; font-weight: 700;
    color: #888; text-transform: uppercase; letter-spacing: 0.09em;
    text-align: left; border-bottom: 1.5px solid #eeeeec; white-space: nowrap;
  }
  .rd-table td {
    padding: 12px 16px; font-size: 12.5px; border-bottom: 1px solid #f3f3f1;
    vertical-align: middle; color: #1a1a1a;
  }
  .rd-table tr:last-child td { border-bottom: none; }
  .rd-table tbody tr { transition: background 0.12s; }
  .rd-table tbody tr:hover td { background: #fafaf8; }

  /* ID cell */
  .id-cell {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #7C6EF5; font-weight: 500; letter-spacing: 0.03em;
  }

  /* Badges */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    border-radius: 8px; padding: 3px 9px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.03em; white-space: nowrap;
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .b-green  { background: rgba(124,110,245,0.1);   color: #7C6EF5; }
  .b-green .badge-dot  { background: #7C6EF5; }
  .b-teal   { background: rgba(124,110,245,0.12); color: #7C6EF5; }
  .b-teal .badge-dot   { background: #7C6EF5; }
  .b-amber  { background: rgba(245,158,11,0.1); color: #b45309; }
  .b-amber .badge-dot  { background: #f59e0b; }
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
  .rd-chain {
    background: linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 60%, #1a1a1a 100%);
    border-radius: 20px; overflow: hidden;
    border: 1.5px solid rgba(255,255,255,0.08);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    position: relative;
    animation: fadeUp 0.3s ease both;
  }
  .rd-chain::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(124,110,245,0.08) 1px, transparent 1px);
    background-size: 24px 24px; pointer-events: none;
  }
  .rd-chain-head {
    padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: space-between;
    position: relative; z-index: 1;
  }
  .rd-chain-title {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; font-weight: 700; color: rgba(255,255,255,0.85);
  }
  .rd-chain-title .mi { font-size: 16px; color: #7C6EF5; }
  .rd-chain-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 9.5px; font-weight: 700; color: #7C6EF5; letter-spacing: 0.09em;
  }
  .rd-chain-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #7C6EF5;
    box-shadow: 0 0 0 3px rgba(124,110,245,0.2);
    animation: pulse 2s infinite;
  }
  .rd-chain-rows { padding: 4px 0 8px; position: relative; z-index: 1; }
  .rd-chain-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 18px; transition: background 0.12s;
  }
  .rd-chain-row:hover { background: rgba(255,255,255,0.03); }
  .rd-chain-key { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.28); text-transform: uppercase; letter-spacing: 0.08em; }
  .rd-chain-val { font-family: 'DM Mono', monospace; font-size: 11.5px; color: rgba(255,255,255,0.5); }
  .rd-chain-val.ok { color: #7C6EF5; font-weight: 700; }

  /* ══ NOTICES PANEL ══ */
  .rd-notices {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .rd-notices-head {
    background: #1a1a1a; padding: 12px 18px;
    display: flex; align-items: center; gap: 9px;
  }
  .rd-notices-head .mi { font-size: 16px; color: #7C6EF5; }
  .rd-notices-head span { font-size: 12.5px; font-weight: 700; color: #fff; }
  .rd-notice-item {
    padding: 11px 18px; border-bottom: 1px solid #f5f5f5;
    cursor: pointer; transition: background 0.12s;
    display: flex; flex-direction: column; gap: 3px;
  }
  .rd-notice-item:last-child { border-bottom: none; }
  .rd-notice-item:hover { background: #f9f9f7; }
  .rd-notice-dot-row { display: flex; align-items: flex-start; gap: 8px; }
  .rd-notice-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #7C6EF5; margin-top: 5px; flex-shrink: 0;
  }
  .rd-notice-title { font-size: 12.5px; font-weight: 600; color: #1a1a1a; line-height: 1.45; }
  .rd-notice-date  { font-size: 10.5px; color: #888; font-weight: 500; padding-left: 14px; }

  /* ══ ACTIVITY LOG ══ */
  .rd-act-icon-wrap {
    width: 30px; height: 30px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rd-act-icon-wrap .mi { font-size: 14px; }

  /* ══ HELP CARD ══ */
  .rd-help {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .rd-help-head {
    background: #1a1a1a; padding: 12px 18px;
    border-bottom: 1.5px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px; font-weight: 700; color: #fff;
  }
  .rd-help-head .mi { font-size: 16px; color: #7C6EF5; }
  .rd-help-row {
    display: flex; align-items: flex-start; gap: 13px;
    padding: 13px 18px; border-bottom: 1px solid #f3f3f1;
    transition: background 0.12s; cursor: default;
  }
  .rd-help-row:last-child { border-bottom: none; }
  .rd-help-row:hover { background: #f9f9f7; }
  .rd-help-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(124,110,245,0.1);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .rd-help-icon .mi { font-size: 16px; color: #7C6EF5; }
  .rd-help-label { font-size: 12.5px; font-weight: 600; color: #1a1a1a; }
  .rd-help-sub   { font-size: 10.5px; color: #888; margin-top: 2px; }

  /* ══ EMPTY STATE ══ */
  .rd-empty { text-align: center; padding: 32px 20px; color: #aaa; font-size: 13px; }
  .rd-empty .mi { font-size: 36px; color: #ddd; display: block; margin-bottom: 8px; }

  @media (max-width: 1100px) {
    .rd-stats-strip { grid-template-columns: repeat(2, 1fr); }
    .rd-stat-cell:nth-child(2) { border-right: none; }
    .rd-stat-cell:nth-child(1), .rd-stat-cell:nth-child(2) { border-bottom: 1.5px solid #eeeeec; }
    .rd-content-row { flex-direction: column; }
    .rd-col-right { width: 100%; }
  }
  @media (max-width: 680px) {
    .rd-stats-strip { grid-template-columns: 1fr 1fr; }
    .rd-main  { padding: 16px 14px 60px; }
    .rd-hero-right { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`;

const MI = ({ name, style, size }) => (
  <span className="mi" style={{ fontSize: size, ...style }}>{name}</span>
);

export default function RegistrarDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pending, setPending]   = useState([]);
  const [disputes, setDisputes]   = useState([]);
  const [mutations, setMutations] = useState([]);
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [propertiesCount, setPropertiesCount] = useState(248);
  const [approvedCount, setApprovedCount]     = useState(0);

  useEffect(() => {
    Promise.all([
      api.get('/transfers/all'),
      api.get('/disputes/all'),
      api.get('/mutations/all'),
      api.get('/properties/events'),
      api.get('/properties')
    ])
    .then(([transRes, dispRes, mutRes, eventRes, propRes]) => {
      const pendingTransfers = (transRes.data || []).filter(t => t.status !== "Completed" && t.status !== "APPROVED");
      const approvedCountVal = (transRes.data || []).filter(t => t.status === "Completed" || t.status === "APPROVED").length;
      
      setPending(pendingTransfers.map(t => ({
         ...t,
         priority: "Normal",
         saleValue: t.saleValue || "₹ 0",
         documents: ["Doc1", "Doc2"]
      })));
      setApprovedCount(approvedCountVal);
      setPropertiesCount(propRes.data ? propRes.data.length : 248);

      setDisputes(dispRes.data.map(d => ({
        ...d,
        statusColor: d.status === "ACTIVE" ? "#f59e0b" : (d.status === "RESOLVED" ? "#7C6EF5" : "#dc2626"),
        filer: d.filerName || "Filer",
        filedOn: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
      })));
      setMutations(mutRes.data.map(m => ({
        ...m,
        type: m.reason ? m.reason.split(':')[0] : "Mutation",
        statusColor: m.status === "PENDING" ? "#f59e0b" : (m.status === "APPROVED" ? "#7C6EF5" : "#dc2626"),
        filer: m.applicantName || "Unknown",
        submittedOn: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recently",
      })));
      setEvents((eventRes.data || []).slice(0, 5).map(e => {
        let icon = "check_circle";
        let color = "#7C6EF5";
        const eventLower = e.event.toLowerCase();
        if (eventLower.includes("dispute")) {
          icon = "gavel";
          color = "#f07060";
        } else if (eventLower.includes("mutation")) {
          icon = "edit_document";
          color = "#9B8FFF";
        } else if (eventLower.includes("reject") || eventLower.includes("dismiss")) {
          icon = "cancel";
          color = "#f07060";
        }
        return {
          icon,
          label: e.event,
          sub: `PROP-${e.propertyId} · ${e.from && e.from !== "N/A" ? `${e.from} → ${e.to}` : e.to}`,
          date: e.date,
          color
        };
      }));
    })
    .catch(err => console.error("Failed to fetch dashboard data", err))
    .finally(() => setLoading(false));
  }, []);

  const today    = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "RG";

  const STATS = [
    { label: "Pending Approvals", value: pending.length,   textColor: "#7C6EF5", badgeColor: "#7C6EF5", badgeBg: "rgba(124,110,245,0.1)",  badgeText: "queued",      bg: "transparent" },
    { label: "Approved Today",    value: approvedCount,    textColor: "#7C6EF5", badgeColor: "#7C6EF5", badgeBg: "rgba(124,110,245,0.12)", badgeText: "completed",   bg: "transparent" },
    { label: "Active Disputes",   value: disputes.filter(d => d.status === "ACTIVE").length,  textColor: "#dc2626", badgeColor: "#dc2626", badgeBg: "rgba(220,38,38,0.1)",   badgeText: "attention",   bg: "transparent" },
    { label: "Total Managed",     value: propertiesCount,  textColor: "#7C6EF5", badgeColor: "#7C6EF5", badgeBg: "rgba(124,110,245,0.12)", badgeText: "on-chain",    bg: "transparent" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="rd-page">
        <div className="rd-main">

          {/* ══ HERO WELCOME CARD ══ */}
          <div className="rd-hero">
            <div className="rd-hero-inner">
              <div className="rd-hero-left">
                <div className="rd-avatar">{initials}</div>
                <div className="rd-hero-info">
                  <div className="rd-hero-chip">
                    <span className="rd-hero-chip-dot" />
                    REGISTRAR PORTAL
                  </div>
                  <div className="rd-hero-name">
                    Welcome back, <span>{user?.name ?? "Officer"}</span>
                  </div>
                  <div className="rd-hero-meta">
                    Officer ID:&nbsp;<strong>{user?.employeeId || "REG-1001"}</strong>
                    &nbsp;·&nbsp;District:&nbsp;<strong>{user?.district ?? "Chennai"}</strong>
                    &nbsp;·&nbsp;Office:&nbsp;<strong>{user?.office ?? "Sub-Registrar Office"}</strong>
                  </div>
                </div>
              </div>
              <div className="rd-hero-right">
                <div className="rd-hero-date"><MI name="today" /> {today}</div>
                <button className="rd-hero-cta secondary" onClick={() => navigate("/registrar/approvals")}>
                  <MI name="pending_actions" /> Approvals Queue
                </button>
                <button className="rd-hero-cta" onClick={() => navigate("/registrar/review")}>
                  <MI name="manage_search" /> Transfer Review
                </button>
              </div>
            </div>

            {/* ══ STAT STRIP ══ */}
            <div className="rd-stats-strip">
              {STATS.map((s, i) => (
                <div key={i} className="rd-stat-cell">
                  <div className="rd-stat-cell-label">{s.label}</div>
                  <div className="rd-stat-cell-value" style={{ color: s.textColor }}>{s.value}</div>
                  <div className="rd-stat-cell-badge" style={{ background: s.badgeBg, color: s.badgeColor }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.badgeColor, display: "inline-block" }} />
                    {s.badgeText}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="rd-actions-bar">
            <span className="rd-actions-label">Registry Tasks</span>
            <button className="rd-act-btn primary" onClick={() => navigate("/registrar/approvals")}>
              <MI name="pending_actions" /> Approvals Queue
            </button>
            <button className="rd-act-btn" onClick={() => navigate("/registrar/disputes")}>
              <MI name="gavel" /> Dispute Management
            </button>
            <button className="rd-act-btn" onClick={() => navigate("/registrar/mutations")}>
              <MI name="edit_document" /> Mutations Review
            </button>
            <button className="rd-act-btn green" onClick={() => navigate("/registrar/review")}>
              <MI name="manage_search" /> Transfer Review
            </button>
          </div>

          {/* Two-column layout */}
          <div className="rd-content-row">

            {/* ── LEFT COLUMN ── */}
            <div className="rd-col-left">

              {/* Pending Approvals */}
              <div className="rd-card">
                <div className="rd-card-head">
                  <div className="rd-card-title">
                    <MI name="pending_actions" /> Pending Approvals
                    <span className="rd-card-badge">{pending.length} Queued</span>
                  </div>
                  <button className="rd-card-link" onClick={() => navigate("/registrar/approvals")}>
                    View All <MI name="arrow_forward" />
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="rd-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Property Details</th>
                        <th>Parties</th>
                        <th>Sale Value</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.slice(0, 5).map(t => (
                        <tr key={t.id}>
                          <td><span className="id-cell">{t.id}</span></td>
                          <td>
                            <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "12.5px" }}>{t.propertyTitle}</div>
                            <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>ID: {t.propertyId}</div>
                          </td>
                          <td style={{ fontSize: "12px", color: "#555" }}>
                            <strong>{t.sellerName}</strong> → <strong>{t.buyerName}</strong>
                          </td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#444" }}>{t.saleValue}</td>
                          <td>
                            <span className={`badge b-amber`}>
                              <span className="badge-dot" />Pending
                            </span>
                          </td>
                          <td>
                            <button className="view-btn" onClick={() => navigate("/registrar/review", { state: { openTransferId: t.id } })}>
                              <MI name="rate_review" /> Review
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pending.length === 0 && (
                        <tr><td colSpan={6}>
                          <div className="rd-empty">
                            <MI name="pending_actions" />
                            No pending transfers in queue.
                          </div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Disputes */}
              <div className="rd-card">
                <div className="rd-card-head">
                  <div className="rd-card-title">
                    <MI name="gavel" /> Active Disputes
                    <span className="rd-card-badge">{disputes.length} Open</span>
                  </div>
                  <button className="rd-card-link" onClick={() => navigate("/registrar/disputes")}>
                    View All <MI name="arrow_forward" />
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="rd-table">
                    <thead>
                      <tr>
                        <th>Case No.</th>
                        <th>Property ID</th>
                        <th>Dispute Type</th>
                        <th>Filer</th>
                        <th>Date Filed</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disputes.slice(0, 5).map(d => (
                        <tr key={d.id}>
                          <td><span className="id-cell">{d.id}</span></td>
                          <td style={{ fontWeight: 700 }}>{d.propertyId}</td>
                          <td style={{ color: "#555" }}>{d.type}</td>
                          <td style={{ fontSize: "12px", color: "#555" }}>{d.filer}</td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#888" }}>{d.filedOn}</td>
                          <td>
                            <span className="badge" style={{ background: d.statusColor + "15", color: d.statusColor }}>
                              <span className="badge-dot" style={{ background: d.statusColor }} />{d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {disputes.length === 0 && (
                        <tr><td colSpan={6}>
                          <div className="rd-empty">
                            <MI name="gavel" />
                            No active disputes registered.
                          </div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mutations Review */}
              <div className="rd-card">
                <div className="rd-card-head">
                  <div className="rd-card-title">
                    <MI name="edit_document" /> Mutations Pending Review
                    <span className="rd-card-badge">{mutations.length} Requests</span>
                  </div>
                  <button className="rd-card-link" onClick={() => navigate("/registrar/mutations")}>
                    View All <MI name="arrow_forward" />
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table className="rd-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Property ID</th>
                        <th>Reason / Type</th>
                        <th>Applicant</th>
                        <th>Submitted On</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mutations.slice(0, 5).map(m => (
                        <tr key={m.id}>
                          <td><span className="id-cell">{m.id}</span></td>
                          <td style={{ fontWeight: 700 }}>{m.propertyId}</td>
                          <td style={{ color: "#555" }}>{m.type}</td>
                          <td style={{ fontSize: "12px", color: "#555" }}>{m.filer}</td>
                          <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#888" }}>{m.submittedOn}</td>
                          <td>
                            <span className="badge" style={{ background: m.statusColor + "15", color: m.statusColor }}>
                              <span className="badge-dot" style={{ background: m.statusColor }} />{m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {mutations.length === 0 && (
                        <tr><td colSpan={6}>
                          <div className="rd-empty">
                            <MI name="edit_document" />
                            No mutation requests pending review.
                          </div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="rd-card">
                <div className="rd-card-head">
                  <div className="rd-card-title"><MI name="history" /> Recent Registry Actions</div>
                </div>
                <table className="rd-table">
                  <thead>
                    <tr>
                      <th style={{ width: 46 }}></th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(events.length > 0 ? events : ACTIVITY).map((a, i) => (
                      <tr key={i}>
                        <td>
                          <div className="rd-act-icon-wrap" style={{ background: a.color + "18" }}>
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

            {/* ── RIGHT COLUMN ── */}
            <div className="rd-col-right">

              {/* Blockchain */}
              <div className="rd-chain">
                <div className="rd-chain-head">
                  <div className="rd-chain-title"><MI name="hub" /> Network Node</div>
                  <span className="rd-chain-live"><span className="rd-chain-dot" /> LIVE</span>
                </div>
                <div className="rd-chain-rows">
                  {[
                    { key: "Registry Block", val: "#1,847,392", ok: false },
                    { key: "Local Cache",    val: `${pending.length} queued`, ok: false },
                    { key: "District Node",  val: "Node_CHN_09",       ok: false },
                    { key: "Total Records",  val: "248 on-chain",      ok: false },
                    { key: "Node Sync",      val: "✓ Verified",        ok: true  },
                  ].map((r, i) => (
                    <div className="rd-chain-row" key={i}>
                      <span className="rd-chain-key">{r.key}</span>
                      <span className={`rd-chain-val${r.ok ? " ok" : ""}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Notices */}
              <div className="rd-notices">
                <div className="rd-notices-head">
                  <MI name="campaign" />
                  <span>Circulars & Circulars</span>
                </div>
                {NOTICES.map((n, i) => (
                  <div className="rd-notice-item" key={i}>
                    <div className="rd-notice-dot-row">
                      <span className="rd-notice-dot" />
                      <div className="rd-notice-title">{n.title}</div>
                    </div>
                    <div className="rd-notice-date">{n.date}</div>
                  </div>
                ))}
              </div>

              {/* Support Desk */}
              <div className="rd-help">
                <div className="rd-help-head">
                  <MI name="support_agent" /> Registry Help Desk
                </div>
                {[
                  { icon: "phone",         label: "Officer Hotline: Ext 409",  sub: "Mon–Fri, 9 AM – 5:30 PM" },
                  { icon: "mail_outline",  label: "ops-support@lands.gov.in",  sub: "Response within 24 hrs" },
                  { icon: "gavel",         label: "Legal Cell Desk",           sub: "Escalate complex disputes" },
                ].map((h, i) => (
                  <div className="rd-help-row" key={i}>
                    <div className="rd-help-icon"><MI name={h.icon} /></div>
                    <div>
                      <div className="rd-help-label">{h.label}</div>
                      <div className="rd-help-sub">{h.sub}</div>
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