import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════ */
const ACTIVITY = [
  { icon: "check_circle",    label: "Transfer Approved",      sub: "TN-4521-CHN-2019 · Ownership updated",           date: "12 Jan 2024", color: "#2EC4A0" },
  { icon: "sync",            label: "Transfer Initiated",     sub: "TN-4521-CHN-2019 · Awaiting buyer confirmation",  date: "10 Jan 2024", color: "#d4a84b" },
  { icon: "call_split",      label: "Mutation Request Filed", sub: "TN-7734-MDU-2021 · Inheritance claim submitted",  date: "05 Dec 2023", color: "#9b8de0" },
  { icon: "download",        label: "Certificate Downloaded", sub: "Encumbrance Certificate — TN-1182-CBE-2018",      date: "18 Nov 2023", color: "#e8533a" },
  { icon: "verified",        label: "Property Verified",      sub: "TN-4521-CHN-2019 · Public record accessed",       date: "01 Nov 2023", color: "#2EC4A0" },
];

const TYPE_META = {
  Residential:  { icon: "home",     iconBg: "#C8F135" },
  Agricultural: { icon: "grass",    iconBg: "#2EC4A0" },
  Commercial:   { icon: "business", iconBg: "#5B4FD4" },
};

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
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0.25; }
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
    padding-top: 60px
  }

  /* ── Main wrapper ── */
  .ud-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
  }

  /* ══ TOP BAR ══ */
  .ud-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ud-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .ud-heading span { color: #e07a5f; }
  .ud-topbar-right {
    display: flex; align-items: center; gap: 8px;
  }
  .ud-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .ud-meta-chip .mi { font-size: 13px; color: #aaa; }
  .ud-add-btn {
    background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 7px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: background 0.15s;
  }
  .ud-add-btn:hover { background: #2a2a2a; }
  .ud-add-btn .mi { font-size: 14px; }

  /* ══ STAT STRIP ══ */
  .ud-stats {
    display: flex; gap: 12px; flex-shrink: 0;
  }
  .ud-stat {
    flex: 1; border-radius: 16px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 4px;
    position: relative; overflow: hidden;
  }
  .ud-stat.light  { background: #f0f0f0; }
  .ud-stat.dark   { background: #1a1a1a; }
  .ud-stat.purple { background: #1e1a38; }
  .ud-stat.orange { background: #2a1a10; }
  .ud-stat-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .ud-stat-label { font-size: 10.5px; font-weight: 500; color: #999; }
  .ud-stat.dark .ud-stat-label,
  .ud-stat.purple .ud-stat-label,
  .ud-stat.orange .ud-stat-label { color: #555; }
  .ud-stat-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; }
  .ud-stat.dark .ud-stat-value   { color: #fff; }
  .ud-stat.purple .ud-stat-value { color: #c8c2ff; }
  .ud-stat.orange .ud-stat-value { color: #ffb380; }
  .ud-stat-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 10px; font-weight: 600; padding: 2px 7px;
    border-radius: 20px; width: fit-content;
    color: #2a7a55; background: #e6f8ef;
  }
  .ud-stat.dark .ud-stat-badge   { color: #6effc2; background: rgba(110,255,194,0.12); }
  .ud-stat.purple .ud-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }
  .ud-stat.orange .ud-stat-badge { color: #ffb380; background: rgba(255,140,80,0.18); }

  /* ══ QUICK ACTIONS ══ */
  .ud-actions-row {
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .ud-action-btn {
    display: flex; align-items: center; gap: 7px;
    border: none; border-radius: 13px;
    padding: 10px 16px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .ud-action-btn .mi { font-size: 15px; }
  .ud-action-btn.primary   { background: #1a1a1a; color: #fff; }
  .ud-action-btn.primary:hover { background: #2a2a2a; }
  .ud-action-btn.ghost {
    background: #f0f0f0; color: #555;
  }
  .ud-action-btn.ghost:hover { background: #e8e8e8; color: #111; }
  .ud-action-btn.purple-btn { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .ud-action-btn.purple-btn:hover { background: rgba(91,79,212,0.18); }

  /* ══ TWO-COLUMN LAYOUT ══ */
  .ud-content-row {
    display: flex; gap: 12px; align-items: flex-start;
  }
  .ud-col-left  { flex: 2; display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .ud-col-right { flex: 1; display: flex; flex-direction: column; gap: 12px; min-width: 0; }

  /* ══ SECTION ZONE ══ */
  .ud-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .ud-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
  }
  .ud-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .ud-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .ud-zone-title span { color: #5B4FD4; }
  .ud-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .ud-zone-link {
    font-size: 10.5px; font-weight: 600; color: #888;
    background: none; border: none; font-family: inherit;
    cursor: pointer; display: flex; align-items: center; gap: 3px;
    transition: color 0.15s;
  }
  .ud-zone-link:hover { color: #1a1a1a; }
  .ud-zone-link .mi { font-size: 13px; }

  /* ══ PROPERTY CARDS (compact — like hack-card) ══ */
  .ud-prop-card {
    background: #f0f0f0; border-radius: 18px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.3s ease both;
  }
  .ud-prop-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
  .ud-prop-card.dark { background: #1a1a1a; }

  .ud-prop-row1 { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .ud-prop-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ud-prop-icon-wrap .mi { font-size: 16px; }
  .ud-prop-status-pill {
    font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 20px;
    display: flex; align-items: center; gap: 4px; flex-shrink: 0;
  }
  .ud-prop-status-pill .pdot { width: 5px; height: 5px; border-radius: 50%; }
  .s-clear   { color: #2a7a55; background: #e6f8ef; }
  .s-enc     { color: #b07a00; background: rgba(255,185,0,0.14); }
  .s-disp    { color: #c0392b; background: rgba(240,80,80,0.12); }
  .d-clear   { background: #2a7a55; }
  .d-enc     { background: #e0a020; }
  .d-disp    { background: #c0392b; }

  .ud-prop-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    color: #aaa; letter-spacing: 0.05em; margin-bottom: 2px;
  }
  .ud-prop-card.dark .ud-prop-id { color: #444; }
  .ud-prop-title {
    font-size: 12.5px; font-weight: 700; color: #1a1a1a;
    letter-spacing: -0.2px; line-height: 1.3;
  }
  .ud-prop-card.dark .ud-prop-title { color: #fff; }
  .ud-prop-meta { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 1px; }
  .ud-prop-card.dark .ud-prop-meta { color: #555; }

  .ud-prop-chips { display: flex; gap: 6px; }
  .ud-prop-chip {
    flex: 1; background: rgba(0,0,0,0.04); border-radius: 9px; padding: 7px 10px;
    display: flex; flex-direction: column; gap: 2px;
  }
  .ud-prop-card.dark .ud-prop-chip { background: rgba(255,255,255,0.04); }
  .ud-prop-chip-label { font-size: 8.5px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.4px; }
  .ud-prop-card.dark .ud-prop-chip-label { color: #444; }
  .ud-prop-chip-val { font-size: 11px; font-weight: 700; color: #1a1a1a; }
  .ud-prop-card.dark .ud-prop-chip-val { color: #ccc; }

  .ud-prop-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05);
  }
  .ud-prop-card.dark .ud-prop-footer { border-top-color: rgba(255,255,255,0.05); }
  .ud-prop-hash { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #5B4FD4; }
  .ud-prop-card.dark .ud-prop-hash { color: #7c6ef5; }
  .ud-prop-cta { font-size: 10px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 3px; }
  .ud-prop-card.dark .ud-prop-cta { color: #ccc; }
  .ud-prop-cta .mi { font-size: 13px; }

  /* ══ TRANSFER ROWS ══ */
  .ud-transfer-list { display: flex; flex-direction: column; gap: 6px; }
  .ud-transfer-row {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    transition: transform 0.15s;
  }
  .ud-transfer-row:hover { transform: translateY(-1px); }
  .ud-transfer-icon {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ud-transfer-icon .mi { font-size: 15px; }
  .ud-transfer-body { flex: 1; min-width: 0; }
  .ud-transfer-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .ud-transfer-sub   { font-size: 9.5px; font-weight: 500; color: #aaa; margin-top: 1px; }
  .ud-transfer-date  { font-size: 9px; font-weight: 600; color: #bbb; font-family: 'DM Mono', monospace; white-space: nowrap; }
  .t-pending   { color: #b07a00; background: rgba(255,185,0,0.13); }
  .t-completed { color: #2a7a55; background: rgba(46,196,160,0.13); }
  .t-reviewing { color: #5B4FD4; background: rgba(91,79,212,0.12); }

  /* ══ BLOCKCHAIN STATUS PANEL ══ */
  .ud-chain-zone {
    background: #1a1a1a; border-radius: 20px; overflow: hidden;
  }
  .ud-chain-head {
    padding: 14px 16px 10px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ud-chain-head-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: #555;
    text-transform: uppercase;
  }
  .ud-chain-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 10px; font-weight: 700; color: #2EC4A0;
  }
  .ud-chain-live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #2EC4A0;
    animation: pulse 2s infinite;
  }
  .ud-chain-rows { padding: 4px 0 8px; }
  .ud-chain-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 16px; border-bottom: 1px solid rgba(255,255,255,0.03);
  }
  .ud-chain-row:last-child { border-bottom: none; }
  .ud-chain-label { font-size: 10.5px; font-weight: 500; color: #555; }
  .ud-chain-val   { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #ccc; }
  .ud-chain-val-green { font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 600; color: #2EC4A0; }

  /* ══ ACTIVITY FEED ══ */
  .ud-activity-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0; border-radius: 24px; overflow: hidden;
  }
  .ud-activity-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-bottom: 1px solid #e8e8e8;
  }
  .ud-activity-head-left { display: flex; align-items: center; gap: 8px; }
  .ud-activity-head-dot  { width: 6px; height: 6px; border-radius: 50%; background: #1a1a1a; }
  .ud-activity-head-txt  { font-size: 11px; font-weight: 700; letter-spacing: 0.07em; color: #aaa; text-transform: uppercase; }
  .ud-activity-grid {
    display: grid; grid-template-columns: repeat(5, 1fr);
  }
  .ud-activity-item {
    padding: 14px 16px; display: flex; flex-direction: column; gap: 5px;
    border-right: 1px solid #e8e8e8; transition: background 0.15s;
  }
  .ud-activity-item:last-child { border-right: none; }
  .ud-activity-item:hover { background: rgba(0,0,0,0.02); }
  .ud-activity-icon-row { display: flex; align-items: center; gap: 7px; margin-bottom: 3px; }
  .ud-activity-color-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .ud-activity-icon-wrap {
    width: 24px; height: 24px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .ud-activity-icon-wrap .mi { font-size: 13px; }
  .ud-activity-label { font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .ud-activity-sub   { font-size: 10px; color: #999; line-height: 1.5; }
  .ud-activity-date  { font-size: 9px; font-weight: 600; color: #bbb; margin-top: 3px; font-family: 'DM Mono', monospace; }

  /* ══ MINI STATS PANEL ══ */
  .ud-mini-stats {
    background: #f0f0f0; border-radius: 20px; padding: 16px 18px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .ud-mini-title { font-size: 12.5px; font-weight: 700; color: #1a1a1a; }
  .ud-mini-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ud-mini-block {
    background: #e8e8e8; border-radius: 12px; padding: 11px;
    display: flex; flex-direction: column; gap: 3px;
  }
  .ud-mini-block.accent { background: #1a1a1a; }
  .ud-mini-block-label { font-size: 9px; font-weight: 500; color: #aaa; }
  .ud-mini-block.accent .ud-mini-block-label { color: #555; }
  .ud-mini-block-val   { font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .ud-mini-block.accent .ud-mini-block-val { color: #fff; }
  .ud-mini-block-sub   { font-size: 9px; color: #bbb; }
  .ud-mini-block.accent .ud-mini-block-sub { color: #444; }
  .ud-mini-divider { height: 1px; background: #e0e0e0; }
  .ud-mini-bar-rows { display: flex; flex-direction: column; gap: 7px; }
  .ud-mini-bar-row  { display: flex; align-items: center; gap: 8px; }
  .ud-mini-bar-name { font-size: 10px; font-weight: 500; color: #555; width: 72px; flex-shrink: 0; }
  .ud-mini-bar-bg   { flex: 1; height: 5px; background: #e0e0e0; border-radius: 99px; overflow: hidden; }
  .ud-mini-bar-fill { height: 100%; border-radius: 99px; }
  .ud-mini-bar-pct  { font-size: 9px; font-weight: 600; color: #aaa; width: 26px; text-align: right; flex-shrink: 0; }

  /* ══ TIMELINE ══ */
  .ud-timeline-zone {
    background: #1a1a1a; border-radius: 20px; padding: 16px 18px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .ud-tl-title { font-size: 12.5px; font-weight: 700; color: #fff; }
  .ud-tl-feed  { display: flex; flex-direction: column; }
  .ud-tl-item  {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .ud-tl-item:last-child { border-bottom: none; }
  .ud-tl-left  { display: flex; flex-direction: column; align-items: center; gap: 2px; padding-top: 2px; }
  .ud-tl-icon  { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ud-tl-icon .mi { font-size: 13px; }
  .ud-tl-line  { width: 1px; height: 18px; background: rgba(255,255,255,0.05); }
  .ud-tl-body  { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
  .ud-tl-name  { font-size: 10.5px; font-weight: 600; color: #ccc; }
  .ud-tl-detail{ font-size: 9.5px; color: #555; line-height: 1.4; }
  .ud-tl-date  {
    font-size: 8.5px; font-weight: 600; padding: 2px 7px; border-radius: 20px;
    background: rgba(255,255,255,0.05); color: #555; flex-shrink: 0; white-space: nowrap;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) {
    .ud-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .ud-content-row { flex-direction: column; }
    .ud-activity-grid { grid-template-columns: repeat(3, 1fr); }
    .ud-activity-item:nth-child(3) { border-right: none; }
  }
  @media (max-width: 580px) {
    .ud-main { padding: 10px 10px 80px; gap: 10px; }
    .ud-topbar { flex-direction: column; align-items: flex-start; }
    .ud-activity-grid { grid-template-columns: 1fr 1fr; }
    .ud-activity-item:nth-child(2n) { border-right: none; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => <span className="mi" style={style}>{name}</span>;

function statusMeta(p) {
  if (p.disputeActive) return { cls: "s-disp", dotCls: "d-disp" };
  if (p.encumbrance)   return { cls: "s-enc",  dotCls: "d-enc"  };
  return { cls: "s-clear", dotCls: "d-clear" };
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
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const pendingTransfers = transfers.filter(t => t.status !== "Completed" && t.status !== "APPROVED").length;
  const activeDisputes   = disputes.filter(d => d.status === "ACTIVE").length;
  const clearTitle       = properties.filter(p => p.status === "Clear Title").length;

  /* type distribution bars */
  const typeCounts = {
    Residential:  properties.filter(p => p.type === "Residential").length,
    Agricultural: properties.filter(p => p.type === "Agricultural").length,
    Commercial:   properties.filter(p => p.type === "Commercial").length,
  };
  const maxCount = Math.max(...Object.values(typeCounts), 1);
  const BAR_CLR  = { Residential: "#C8F135", Agricultural: "#2EC4A0", Commercial: "#5B4FD4" };

  /* timeline from recent properties */
  const tlItems = properties.slice(0, 5).map(p => {
    const meta = TYPE_META[p.type] || TYPE_META.Residential;
    return { icon: meta.icon, iconBg: meta.iconBg + "22", iconColor: meta.iconBg, name: p.title, detail: `${p.status} · ${p.area}`, date: p.registeredOn };
  });

  /* transfer status helper */
  const tStatus = (t) => {
    if (t.status === "Completed") return { cls: "t-completed", icon: "check_circle" };
    if (t.status === "Reviewing") return { cls: "t-reviewing", icon: "manage_search" };
    return { cls: "t-pending", icon: "pending" };
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ud-page">

        <div className="ud-main">

          {/* ══ TOP BAR ══ */}
          <div className="ud-topbar">
            <div className="ud-heading">
              Welcome back, <span>{user?.name ?? "Citizen"}</span>
            </div>
            <div className="ud-topbar-right">
              {user?.state && (
                <div className="ud-meta-chip">
                  <MI name="location_on" /> {user.state}
                </div>
              )}
              {user?.aadhaar && (
                <div className="ud-meta-chip">
                  <MI name="lock" /> ••••{user.aadhaar?.slice(-4)}
                </div>
              )}
              <button className="ud-add-btn" onClick={() => navigate("/user/transfers")}>
                <MI name="add" /> Initiate Transfer
              </button>
            </div>
          </div>

          {/* ══ STAT STRIP ══ */}
          <div className="ud-stats">
            <div className="ud-stat dark">
              <div className="ud-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
              <div className="ud-stat-label">Properties Owned</div>
              <div className="ud-stat-value">{properties.length}</div>
              <div className="ud-stat-badge">registered</div>
            </div>
            <div className="ud-stat purple">
              <div className="ud-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(91,79,212,0.25) 0%, transparent 60%)" }} />
              <div className="ud-stat-label">Pending Transfers</div>
              <div className="ud-stat-value">{pendingTransfers}</div>
              <div className="ud-stat-badge">in progress</div>
            </div>
            <div className="ud-stat orange">
              <div className="ud-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,140,80,0.2) 0%, transparent 60%)" }} />
              <div className="ud-stat-label">Active Disputes</div>
              <div className="ud-stat-value">{activeDisputes}</div>
              <div className="ud-stat-badge">need attention</div>
            </div>
            <div className="ud-stat light">
              <div className="ud-stat-label">Clear Title</div>
              <div className="ud-stat-value">{clearTitle}</div>
              <div className="ud-stat-badge">clean records</div>
            </div>
          </div>

          {/* ══ QUICK ACTIONS ══ */}
          <div className="ud-actions-row">
            <button className="ud-action-btn primary" onClick={() => navigate("/user/transfers")}>
              <MI name="swap_horiz" /> Initiate Transfer
            </button>
            <button className="ud-action-btn ghost" onClick={() => navigate("/user/properties")}>
              <MI name="home_work" /> My Properties
            </button>

            <button className="ud-action-btn purple-btn" onClick={() => navigate("/user/mutations")}>
              <MI name="edit_document" /> File Mutation
            </button>
          </div>

          {/* ══ TWO-COLUMN CONTENT ══ */}
          <div className="ud-content-row">

            {/* ── LEFT COLUMN ── */}
            <div className="ud-col-left">

              {/* Properties section */}
              <div className="ud-zone">
                <div className="ud-zone-header">
                  <div className="ud-zone-title-row">
                    <div className="ud-zone-title">My <span>Properties</span></div>
                    <div className="ud-zone-pill">{properties.length} total</div>
                  </div>
                  <button className="ud-zone-link" onClick={() => navigate("/user/properties")}>
                    View all <MI name="arrow_forward" />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {properties.slice(0, 4).map((p, i) => {
                    const meta = TYPE_META[p.type] || TYPE_META.Residential;
                    const { cls, dotCls } = statusMeta(p);
                    const isDark = p.type === "Commercial";
                    return (
                      <div
                        key={p.id}
                        className={`ud-prop-card${isDark ? " dark" : ""}`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                        onClick={() => navigate("/user/properties", { state: { openPropertyId: p.id } })}
                      >
                        <div className="ud-prop-row1">
                          <div className="ud-prop-icon-wrap" style={{ background: isDark ? "rgba(255,255,255,0.06)" : meta.iconBg + "22" }}>
                            <MI name={meta.icon} style={{ color: isDark ? "#a89fff" : meta.iconBg }} />
                          </div>
                          <div className={`ud-prop-status-pill ${cls}`}>
                            <div className={`pdot ${dotCls}`} />
                            {p.status}
                          </div>
                        </div>
                        <div>
                          <div className="ud-prop-id">{p.id}</div>
                          <div className="ud-prop-title">{p.title}</div>
                          <div className="ud-prop-meta">{p.district}</div>
                        </div>
                        <div className="ud-prop-chips">
                          <div className="ud-prop-chip">
                            <div className="ud-prop-chip-label">Area</div>
                            <div className="ud-prop-chip-val">{p.area}</div>
                          </div>
                          <div className="ud-prop-chip">
                            <div className="ud-prop-chip-label">Value</div>
                            <div className="ud-prop-chip-val">{p.marketValue}</div>
                          </div>
                        </div>
                        <div className="ud-prop-footer">
                          <span className="ud-prop-hash">{p.hash?.slice(0, 18)}…</span>
                          <span className="ud-prop-cta">View <MI name="arrow_forward" /></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="ud-col-right">

              {/* Blockchain status */}
              <div className="ud-chain-zone">
                <div className="ud-chain-head">
                  <span className="ud-chain-head-title">Blockchain Status</span>
                  <span className="ud-chain-live">
                    <span className="ud-chain-live-dot" /> LIVE
                  </span>
                </div>
                <div className="ud-chain-rows">
                  {[
                    { label: "Latest Block",  val: "#1,847,392",     green: false },
                    { label: "Your Records",  val: `${properties.length} on-chain`, green: false },
                    { label: "Last Hash",     val: "0x3f9a…c4e5",    green: false },
                    { label: "Network",       val: "TN State Registry", green: true },
                    { label: "Integrity",     val: "✓ Verified",     green: true },
                  ].map((r, i) => (
                    <div className="ud-chain-row" key={i}>
                      <span className="ud-chain-label">{r.label}</span>
                      <span className={r.green ? "ud-chain-val-green" : "ud-chain-val"}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              

              

            </div>
          </div>

          {/* ══ ACTIVITY FEED (full width) ══ */}
          <div className="ud-activity-zone">
            <div className="ud-activity-head">
              <div className="ud-activity-head-left">
                <div className="ud-activity-head-dot" />
                <span className="ud-activity-head-txt">Recent Activity</span>
              </div>
            </div>
            <div className="ud-activity-grid">
              {ACTIVITY.map((a, i) => (
                <div className="ud-activity-item" key={i}>
                  <div className="ud-activity-icon-row">
                    <div className="ud-activity-color-dot" style={{ background: a.color }} />
                    <div className="ud-activity-icon-wrap" style={{ background: a.color + "18" }}>
                      <MI name={a.icon} style={{ color: a.color }} />
                    </div>
                  </div>
                  <div className="ud-activity-label">{a.label}</div>
                  <div className="ud-activity-sub">{a.sub}</div>
                  <div className="ud-activity-date">{a.date}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}