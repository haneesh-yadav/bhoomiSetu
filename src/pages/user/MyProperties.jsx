import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";


const TIMELINE_COLORS = {
  VERIFIED:  "#2EC4A0",
  CONFIRMED: "#C8F135",
  GENESIS:   "#5B4FD4",
  PENDING:   "#F07060",
};

const TYPE_META = {
  Residential:  { icon: "home",     iconBg: "#C8F135", dark: false },
  Agricultural: { icon: "grass",    iconBg: "#2EC4A0", dark: false },
  Commercial:   { icon: "business", iconBg: "#5B4FD4", dark: true  },
};

/* ══════════════════════════════════════════════════
   CERTIFICATE DATA
══════════════════════════════════════════════════ */
const CERT_TYPES = [
  { id: "ec",        label: "Encumbrance Certificate",   short: "EC",  icon: "verified",        color: "#C8F135", colorDark: "#1e2a00", textColor: "#1a1a1a",
    desc: "Confirms no outstanding loans, mortgages or legal dues on this property." },
  { id: "ownership", label: "Ownership Certificate",     short: "OC",  icon: "account_balance", color: "#5B4FD4", colorDark: "#1e1a38", textColor: "#fff",
    desc: "Official certificate proving rightful ownership as recorded on the state registry." },
  { id: "valuation", label: "Property Valuation Report", short: "PVR", icon: "bar_chart",       color: "#2EC4A0", colorDark: "#0d2420", textColor: "#1a1a1a",
    desc: "Government-issued market valuation based on circle rates and recent transactions." },
];

const STATUS_CLASS = {
  "Clear Title": "status-active",
  "Encumbered":  "status-progress",
  "Disputed":    "status-done",
};

const DOT_CLASS = {
  "Clear Title": "pill-dot-active",
  "Encumbered":  "pill-dot-progress",
  "Disputed":    "pill-dot-done",
};

const FILTERS = ["All", "Residential", "Agricultural", "Commercial", "Clear Title", "Encumbered", "Disputed"];

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
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  /* ── Page root ── */
  .mp-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px
  }

  /* ── Main container ── */
  .mp-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 24px;
    overflow-x: hidden;
    min-width: 0;
  }

  /* ══ TOP BAR ══ */
  .mp-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .mp-heading { font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px; }
  .mp-heading span { color: #5B4FD4; }
  .mp-topbar-right { display: flex; align-items: center; gap: 8px; }
  .mp-search-wrap { background: #f0f0f0; border-radius: 11px; display: flex; align-items: center; gap: 6px; padding: 7px 12px; }
  .mp-search-wrap .mi { font-size: 15px; color: #aaa; }
  .mp-search-wrap input { border: none; outline: none; background: transparent; font-family: 'Poppins', sans-serif; font-size: 11.5px; color: #333; width: 180px; }
  .mp-search-wrap input::placeholder { color: #bbb; }

  /* ══ STAT STRIP ══ */
  .mp-stats { display: flex; gap: 12px; flex-shrink: 0; }
  .mp-stat { flex: 1; background: #f0f0f0; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden; }
  .mp-stat.dark  { background: #1a1a1a; }
  .mp-stat.purple { background: #1e1a38; }
  .mp-stat-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 16px; }
  .mp-stat-label { font-size: 10.5px; font-weight: 500; color: #999; }
  .mp-stat.dark .mp-stat-label, .mp-stat.purple .mp-stat-label { color: #555; }
  .mp-stat-value { font-size: 24px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .mp-stat.dark .mp-stat-value   { color: #fff; }
  .mp-stat.purple .mp-stat-value { color: #c8c2ff; }
  .mp-stat-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px; width: fit-content; color: #2a7a55; background: #e6f8ef; }
  .mp-stat.dark .mp-stat-badge   { color: #6effc2; background: rgba(110,255,194,0.12); }
  .mp-stat.purple .mp-stat-badge { color: #a89fff; background: rgba(124,110,245,0.18); }

  /* ══ FILTER TABS ══ */
  .mp-filters { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .filter-tab { padding: 5px 14px; border-radius: 20px; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 500; color: #888; border: none; background: #f0f0f0; cursor: pointer; transition: all 0.15s; }
  .filter-tab:hover { color: #444; background: #e8e8e8; }
  .filter-tab.active { background: #1a1a1a; color: #fff; }
  .filter-sep { width: 1px; height: 18px; background: #d8d8d8; margin: 0 4px; }

  /* ══ SECTION ZONE ══ */
  .mp-section-zone { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 24px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .mp-section-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px 12px; border-bottom: 1px solid #e8e8e8; flex-shrink: 0; }
  .mp-section-title-row { display: flex; align-items: center; gap: 10px; }
  .mp-section-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .mp-section-title span { color: #5B4FD4; }
  .mp-count-pill { background: #1a1a1a; color: #fff; border-radius: 20px; padding: 2px 10px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

  /* ══ PROPERTY GRID ══ */
  .mp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; flex-shrink: 0; }

  /* ══ PROPERTY CARD ══ */
  .mp-card { background: #f0f0f0; border-radius: 20px; padding: 16px; display: flex; flex-direction: column; gap: 11px; position: relative; overflow: hidden; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; animation: fadeUp 0.35s ease both; }
  .mp-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
  .mp-card.dark { background: #1a1a1a; }
  .mp-card-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 20px; }

  .mp-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .mp-icon-wrap { width: 36px; height: 36px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .mp-icon-wrap .mi { font-size: 18px; }

  .mp-status-pill { font-size: 9.5px; font-weight: 600; padding: 3px 9px; border-radius: 20px; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .mp-status-pill .pill-dot { width: 5px; height: 5px; border-radius: 50%; }

  .status-active  { color: #2a7a55; background: #e6f8ef; }
  .status-progress{ color: #b07a00; background: rgba(255,185,0,0.14); }
  .status-done    { color: #c0392b; background: rgba(240,112,96,0.12); }

  .pill-dot-active  { background: #2a7a55; }
  .pill-dot-progress{ background: #e0a020; }
  .pill-dot-done    { background: #c0392b; }

  .mp-card-id { font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 500; color: #aaa; letter-spacing: 0.05em; }
  .mp-card.dark .mp-card-id { color: #444; }
  .mp-card-title { font-size: 13px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.2px; line-height: 1.3; }
  .mp-card.dark .mp-card-title { color: #fff; }
  .mp-card-org { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 2px; }
  .mp-card.dark .mp-card-org { color: #555; }
  .mp-card-addr { font-size: 10.5px; font-weight: 400; color: #999; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .mp-card.dark .mp-card-addr { color: #555; }

  .mp-card-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .mp-chip { background: rgba(0,0,0,0.04); border-radius: 11px; padding: 9px 11px; display: flex; flex-direction: column; gap: 2px; }
  .mp-card.dark .mp-chip { background: rgba(255,255,255,0.04); }
  .mp-chip.accent { background: rgba(91,79,212,0.1); }
  .mp-card.dark .mp-chip.accent { background: rgba(91,79,212,0.2); }
  .mp-chip-label { font-size: 9px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.5px; }
  .mp-card.dark .mp-chip-label { color: #444; }
  .mp-chip-value { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .mp-card.dark .mp-chip-value { color: #ccc; }
  .mp-chip.accent .mp-chip-value { color: #5B4FD4; }
  .mp-card.dark .mp-chip.accent .mp-chip-value { color: #a89fff; }

  .mp-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .mp-tag { font-size: 9.5px; font-weight: 600; padding: 2px 8px; border-radius: 7px; background: #e4e4e4; color: #555; }
  .mp-card.dark .mp-tag { background: #2a2a2a; color: #777; }

  .mp-card-warning {
    background: rgba(240,112,96,0.08); border-top: 1px solid rgba(240,112,96,0.25);
    margin: 0 -16px; padding: 7px 16px; font-size: 10px; font-weight: 700; color: #c0392b;
    display: flex; align-items: center; gap: 5px;
  }
  .mp-card-warning .mi { font-size: 14px; }

  .mp-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.05); }
  .mp-card.dark .mp-card-footer { border-top-color: rgba(255,255,255,0.05); }
  .mp-card-hash { font-family: 'DM Mono', monospace; font-size: 9px; color: #5B4FD4; }
  .mp-card.dark .mp-card-hash { color: #7c6ef5; }
  .mp-card-cta { font-size: 10px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 4px; }
  .mp-card.dark .mp-card-cta { color: #ccc; }
  .mp-card-cta .mi { font-size: 14px; }

  .mp-empty { text-align: center; padding: 40px 20px; background: #f5f5f5; border-radius: 20px; color: #aaa; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* ══ BOTTOM ROW: TIMELINE & STATS ══ */
  .mp-bottom { display: flex; gap: 12px; flex-shrink: 0; }
  .mp-timeline { flex: 2; background: #1a1a1a; border-radius: 20px; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }
  .mp-tl-title { font-size: 13px; font-weight: 700; color: #fff; }
  .mp-tl-feed  { display: flex; flex-direction: column; gap: 0; }
  .mp-tl-item  { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .mp-tl-item:last-child { border-bottom: none; }
  .mp-tl-left  { display: flex; flex-direction: column; align-items: center; gap: 3px; padding-top: 2px; }
  .mp-tl-icon  { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .mp-tl-icon .mi { font-size: 14px; }
  .mp-tl-line  { width: 1px; height: 20px; background: rgba(255,255,255,0.05); }
  .mp-tl-body  { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .mp-tl-name  { font-size: 11.5px; font-weight: 600; color: #ccc; }
  .mp-tl-detail{ font-size: 10px; color: #555; line-height: 1.4; }
  .mp-tl-date  { font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 20px; background: rgba(255,255,255,0.05); color: #555; flex-shrink: 0; }
  
  .mp-stat-panel { flex: 1; background: #f0f0f0; border-radius: 20px; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .mp-sp-title { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .mp-sp-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mp-sp-block { background: #e8e8e8; border-radius: 13px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
  .mp-sp-block.accent { background: #1a1a1a; }
  .mp-sp-label { font-size: 9.5px; font-weight: 500; color: #aaa; }
  .mp-sp-block.accent .mp-sp-label { color: #555; }
  .mp-sp-val   { font-size: 20px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .mp-sp-block.accent .mp-sp-val { color: #fff; }
  .mp-sp-sub   { font-size: 9.5px; font-weight: 500; color: #bbb; }
  .mp-sp-block.accent .mp-sp-sub { color: #444; }
  .mp-sp-divider { height: 1px; background: #e0e0e0; }
  .mp-sp-bar-rows { display: flex; flex-direction: column; gap: 6px; }
  .mp-sp-bar-row  { display: flex; align-items: center; gap: 8px; }
  .mp-sp-bar-name { font-size: 10px; font-weight: 500; color: #555; width: 68px; flex-shrink: 0; }
  .mp-sp-bar-bg   { flex: 1; height: 5px; background: #e0e0e0; border-radius: 99px; overflow: hidden; }
  .mp-sp-bar-fill { height: 100%; border-radius: 99px; }
  .mp-sp-bar-pct  { font-size: 9.5px; font-weight: 600; color: #aaa; width: 26px; text-align: right; flex-shrink: 0; }

  /* ══════════════════════════════════════════════════
     LATEST PROPERTY DETAIL CSS (from Q7NK.jsx)
  ══════════════════════════════════════════════════ */
  .pd-main { display: flex; flex-direction: column; gap: 12px; }
  .pd-topbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; flex-shrink: 0; }
  .pd-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; color: #888; }
  .pd-bc-link { cursor: pointer; transition: color 0.15s; color: #888; }
  .pd-bc-link:hover { color: #1a1a1a; }
  .pd-bc-sep { color: #bbb; }
  .pd-bc-here { color: #5B4FD4; font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 600; }
  .pd-topbar-right { display: flex; align-items: center; gap: 8px; }
  .pd-back-btn { display: inline-flex; align-items: center; gap: 5px; background: #f0f0f0; border: none; border-radius: 11px; padding: 7px 14px; font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600; color: #555; cursor: pointer; transition: background 0.15s, color 0.15s; white-space: nowrap; }
  .pd-back-btn .material-icons-sharp { font-size: 14px; }
  .pd-back-btn:hover { background: #e8e8e8; color: #111; }

  .pd-title-zone { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 24px; padding: 16px 20px; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; animation: fadeUp 0.4s ease both; }
  .pd-title-left { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .pd-title-eyebrow { display: inline-flex; align-items: center; gap: 5px; width: fit-content; background: rgba(91,79,212,0.08); border-radius: 20px; padding: 3px 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.05em; color: #5B4FD4; }
  .pd-title-eyebrow .material-icons-sharp { font-size: 13px; }
  .pd-title-id { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #999; font-weight: 500; }
  .pd-title-main { font-size: clamp(1.2rem, 3vw, 1.7rem); font-weight: 800; letter-spacing: -0.4px; color: #1a1a1a; line-height: 1.1; }
  .pd-title-main span { color: #5B4FD4; }
  .pd-title-addr { font-size: 12px; color: #888; font-weight: 500; line-height: 1.4; }
  .pd-title-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
  .pd-title-status { border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; border: none; }
  .pd-title-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; line-height: 1; }
  .pd-title-value-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; color: #aaa; }

  .pd-status-strip { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 13px; font-size: 12px; font-weight: 600; animation: fadeUp 0.4s ease 0.05s both; border: 1.5px solid; }
  .pd-status-strip .material-icons-sharp { font-size: 15px; flex-shrink: 0; }
  .pd-strip-clear { background: rgba(46,196,160,0.08); color: #1a7a62; border-color: rgba(46,196,160,0.25); }
  .pd-strip-dispute { background: rgba(240,112,96,0.08); color: #c0392b; border-color: rgba(240,112,96,0.25); }

  .pd-section-title { font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; color: #aaa; margin-bottom: 10px; margin-top: 18px; }
  .pd-section-title:first-of-type { margin-top: 0; }

  .pd-layout { display: grid; grid-template-columns: 1fr 280px; gap: 12px; align-items: start; }
  .pd-sidebar { display: flex; flex-direction: column; gap: 0; }

  .pd-zone { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 24px; padding: 16px; display: flex; flex-direction: column; gap: 12px; animation: fadeUp 0.4s ease 0.08s both; }
  .pd-zone + .pd-zone { margin-top: 12px; }

  .pd-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .pd-info-cell { background: #fff; border: 1.5px solid #e8e8e8; border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; transition: border-color 0.15s; }
  .pd-info-cell:hover { border-color: #ccc; }
  .pd-info-lbl { font-size: 9px; font-weight: 800; letter-spacing: 0.08em; color: #bbb; }
  .pd-info-val { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .pd-info-val-status { font-size: 12px; font-weight: 800; }
  .pd-info-cell-wide { grid-column: 1/-1; }

  .pd-owner-card { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 20px; overflow: hidden; animation: fadeUp 0.4s ease 0.1s both; }
  .pd-owner-head { background: #1a1a1a; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; border-radius: 18px 18px 0 0; }
  .pd-owner-head-lbl { font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; color: rgba(255,255,255,0.45); }
  .pd-owner-verified { display: inline-flex; align-items: center; gap: 3px; background: #2EC4A0; border-radius: 20px; padding: 2px 9px; font-size: 9px; font-weight: 800; color: #fff; }
  .pd-owner-verified .material-icons-sharp { font-size: 11px; }
  .pd-owner-body { padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
  .pd-owner-avatar { width: 42px; height: 42px; border-radius: 12px; background: #5B4FD4; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0; }
  .pd-owner-name { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .pd-owner-since { font-size: 11px; color: #999; font-weight: 500; margin-top: 2px; }
  .pd-owner-tag { margin-left: auto; display: inline-flex; align-items: center; gap: 3px; background: rgba(91,79,212,0.1); border-radius: 20px; padding: 3px 10px; font-size: 10px; font-weight: 700; color: #5B4FD4; flex-shrink: 0; }

  .pd-chain-card { background: #1a1a1a; border-radius: 20px; padding: 14px 16px; animation: fadeUp 0.4s ease 0.12s both; }
  .pd-chain-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .pd-chain-title { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); }
  .pd-chain-live { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; color: #2EC4A0; }
  .pd-chain-dot { width: 6px; height: 6px; border-radius: 50%; background: #2EC4A0; animation: pulse 2s ease infinite; flex-shrink: 0; }
  .pd-chain-rows { display: flex; flex-direction: column; gap: 8px; }
  .pd-chain-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pd-chain-row:last-child { border-bottom: none; }
  .pd-chain-label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; }
  .pd-chain-val { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #fff; font-weight: 500; }
  .pd-chain-val-green { font-size: 11px; font-weight: 700; color: #2EC4A0; }

  .pd-actions-card { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 20px; overflow: hidden; animation: fadeUp 0.4s ease 0.14s both; }
  .pd-actions-head { background: #f0f0f0; border-bottom: 1px solid #e8e8e8; padding: 10px 16px; }
  .pd-actions-head-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; color: #aaa; }
  .pd-actions-body { padding: 12px; display: flex; flex-direction: column; gap: 7px; }
  .pd-action-btn { width: 100%; padding: 10px 14px; border-radius: 13px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 8px; transition: all 0.15s; border: none; }
  .pd-action-btn .material-icons-sharp { font-size: 15px; flex-shrink: 0; }
  .pd-btn-primary { background: #1a1a1a; color: #fff; }
  .pd-btn-primary:hover { background: #2a2a2a; }
  .pd-btn-outline { background: #f0f0f0; color: #555; }
  .pd-btn-outline:hover { background: #e8e8e8; color: #111; }
  .pd-btn-danger { background: rgba(240,112,96,0.1); color: #c0392b; }
  .pd-btn-danger:hover { background: rgba(240,112,96,0.18); }
  .pd-btn-purple { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .pd-btn-purple:hover { background: rgba(91,79,212,0.18); }

  .pd-timeline-section { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 24px; padding: 16px; animation: fadeUp 0.4s ease 0.16s both; }
  .pd-timeline-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px 12px; border-bottom: 1px solid #e8e8e8; margin-bottom: 12px; }
  .pd-timeline-tag { display: inline-flex; align-items: center; gap: 5px; background: #1a1a1a; border-radius: 20px; padding: 2px 10px; font-size: 9.5px; font-weight: 700; color: #fff; }
  .pd-timeline-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .pd-timeline-title span { color: #5B4FD4; }
  .pd-timeline-sub { font-size: 11px; color: #aaa; font-weight: 500; }

  .pd-tl-list { display: flex; flex-direction: column; }
  .pd-tl-item { display: flex; gap: 12px; }
  .pd-tl-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .pd-tl-dot { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; margin-top: 4px; }
  .pd-tl-line { flex: 1; width: 2px; background: #e0e0e0; margin: 4px 0; min-height: 16px; }
  .pd-tl-block { flex: 1; border-radius: 16px; padding: 12px 14px; margin-bottom: 8px; background: #fff; border: 1.5px solid #e8e8e8; transition: border-color 0.15s; }
  .pd-tl-block:hover { border-color: #ccc; }
  .pd-tl-block-active { background: rgba(91,79,212,0.04); border-color: rgba(91,79,212,0.2); }
  .pd-tl-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .pd-tl-event { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .pd-tl-badge { border-radius: 20px; padding: 2px 9px; font-size: 9px; font-weight: 800; color: #fff; }
  .pd-tl-parties { font-size: 11px; color: #999; margin-bottom: 5px; }
  .pd-tl-bottom { display: flex; justify-content: space-between; align-items: center; }
  .pd-tl-hash { font-family: 'DM Mono', monospace; font-size: 9.5px; color: #5B4FD4; }
  .pd-tl-date { font-size: 10px; font-weight: 600; color: #bbb; }

  /* ══ CERTIFICATES SECTION (inline in detail view) ══ */
  .pd-cert-section { background: rgba(240,240,240,0.4); border: 1.5px solid #e0e0e0; border-radius: 24px; overflow: hidden; animation: fadeUp 0.4s ease 0.18s both; }
  .pd-cert-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e8e8e8; }
  .pd-cert-header-left { display: flex; align-items: center; gap: 10px; }
  .pd-cert-title { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .pd-cert-title span { color: #5B4FD4; }
  .pd-cert-count-pill { background: #1a1a1a; color: #fff; border-radius: 20px; padding: 2px 10px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }

  .pd-cert-body { display: flex; gap: 0; }
  .pd-cert-types { flex: 1; display: flex; flex-direction: column; gap: 0; border-right: 1px solid #e8e8e8; }
  .pd-cert-type-row {
    display: flex; align-items: center; gap: 12px; padding: 13px 16px;
    cursor: pointer; border-bottom: 1px solid #f0f0f0;
    transition: background 0.15s; position: relative;
  }
  .pd-cert-type-row:last-child { border-bottom: none; }
  .pd-cert-type-row:hover { background: #f8f8f8; }
  .pd-cert-type-row.selected { background: var(--cert-dark); }
  .pd-cert-type-row.selected::after {
    content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 50%; border-radius: 3px 0 0 3px;
    background: var(--cert-color);
  }
  .pd-cert-badge {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.05); transition: background 0.15s;
  }
  .pd-cert-badge .mi { font-size: 19px; color: #aaa; transition: color 0.15s; }
  .pd-cert-type-row.selected .pd-cert-badge { background: var(--cert-color); }
  .pd-cert-type-row.selected .pd-cert-badge .mi { color: var(--cert-text); }
  .pd-cert-type-body { flex: 1; min-width: 0; }
  .pd-cert-type-short { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #aaa; letter-spacing: 0.08em; margin-bottom: 1px; }
  .pd-cert-type-row.selected .pd-cert-type-short { color: rgba(255,255,255,0.3); }
  .pd-cert-type-name { font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .pd-cert-type-row.selected .pd-cert-type-name { color: #fff; }
  .pd-cert-type-desc { font-size: 9.5px; font-weight: 500; color: #aaa; line-height: 1.4; margin-top: 1px; }
  .pd-cert-type-row.selected .pd-cert-type-desc { color: rgba(255,255,255,0.3); }

  .pd-cert-panel { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; }
  .pd-cert-preview { background: #1a1a1a; flex: 1; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .pd-cert-preview-placeholder { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 20px 0; }
  .pd-cert-preview-placeholder .mi { font-size: 28px; color: #2a2a2a; }
  .pd-cert-preview-placeholder-txt { font-size: 11px; color: #444; line-height: 1.6; }

  .pd-cert-preview-seal-row { display: flex; flex-direction: column; align-items: center; gap: 3px; padding-bottom: 10px; margin-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.07); text-align: center; }
  .pd-cert-preview-seal { width: 38px; height: 38px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 2px; }
  .pd-cert-preview-seal .mi { font-size: 18px; }
  .pd-cert-preview-gov { font-size: 7.5px; font-weight: 700; letter-spacing: 0.1em; color: #444; text-transform: uppercase; }
  .pd-cert-preview-name { font-size: 11px; font-weight: 800; color: #fff; letter-spacing: -0.2px; }

  .pd-cert-preview-rows { display: flex; flex-direction: column; gap: 0; }
  .pd-cert-preview-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .pd-cert-preview-row:last-child { border-bottom: none; }
  .pd-cert-preview-lbl { font-size: 9px; font-weight: 500; color: #555; }
  .pd-cert-preview-val { font-family: 'DM Mono', monospace; font-size: 9px; color: #ccc; font-weight: 500; }
  .pd-cert-preview-val.green { color: #2EC4A0; font-weight: 700; }
  .pd-cert-preview-val.amber { color: #e0a020; font-weight: 700; }

  .pd-cert-preview-hash { margin-top: 6px; padding: 5px 8px; background: rgba(255,255,255,0.04); border-radius: 8px; text-align: center; }
  .pd-cert-preview-hash-val { font-family: 'DM Mono', monospace; font-size: 8px; color: #333; }

  .pd-cert-preview-live { display: flex; align-items: center; gap: 5px; font-size: 9.5px; font-weight: 700; }
  .pd-cert-preview-live-dot { width: 5px; height: 5px; border-radius: 50%; animation: pulse 2s infinite; }

  .pd-cert-gen-btn {
    width: 100%; border: none; padding: 12px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: opacity 0.15s, background 0.2s;
  }
  .pd-cert-gen-btn:hover:not(:disabled) { opacity: 0.88; }
  .pd-cert-gen-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .pd-cert-gen-btn .mi { font-size: 15px; }

  .pd-cert-past { padding: 12px 16px; border-top: 1px solid #e8e8e8; }
  .pd-cert-past-title { font-size: 9px; font-weight: 800; letter-spacing: 0.09em; color: #bbb; text-transform: uppercase; margin-bottom: 8px; }
  .pd-cert-past-list { display: flex; flex-direction: column; gap: 5px; }
  .pd-cert-past-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #f8f8f8; border-radius: 11px; transition: background 0.15s; }
  .pd-cert-past-row:hover { background: #f0f0f0; }
  .pd-cert-past-icon { width: 24px; height: 24px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pd-cert-past-icon .mi { font-size: 13px; }
  .pd-cert-past-body { flex: 1; min-width: 0; }
  .pd-cert-past-name { font-size: 10.5px; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pd-cert-past-date { font-size: 8.5px; font-weight: 600; color: #bbb; font-family: 'DM Mono', monospace; margin-top: 1px; }
  .pd-cert-past-dl { background: #1a1a1a; color: #fff; border: none; border-radius: 7px; padding: 4px 10px; font-family: 'Poppins', sans-serif; font-size: 9.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 3px; transition: background 0.15s; flex-shrink: 0; }
  .pd-cert-past-dl:hover { background: #2a2a2a; }
  .pd-cert-past-dl .mi { font-size: 11px; }

  .pd-cert-spinner { width: 13px; height: 13px; border: 2.5px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .pd-cert-body { flex-direction: column; }
    .pd-cert-types { border-right: none; border-bottom: 1px solid #e8e8e8; }
    .pd-cert-panel { width: 100%; }
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 900px) { .pd-layout { grid-template-columns: 1fr; } }
  /* ══ ADD PROPERTY MODAL ══ */
  .modal-overlay {
    position: fixed;
    top: 60px; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(5px);
    z-index: 999;
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn 0.2s ease;
    font-family: 'Poppins', sans-serif;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-card {
    background: #dcdcdc;
    border-radius: 28px;
    width: 100%; max-width: 580px;
    max-height: calc(100vh - 60px - 32px); overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.3);
    animation: slideUp 0.25s ease;
    scrollbar-width: none;
    font-family: 'Poppins', sans-serif;
  }
  .modal-card::-webkit-scrollbar { display: none; }
  .modal-card, .modal-card * { font-family: 'Poppins', sans-serif; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 20px 16px;
    border-bottom: 1px solid #cacaca;
  }
  .modal-header-left { display: flex; align-items: center; gap: 10px; }
  .modal-header-icon {
    width: 38px; height: 38px; border-radius: 12px;
    background: rgba(91,79,212,0.12);
    display: flex; align-items: center; justify-content: center;
  }
  .modal-header-icon .mi { font-size: 19px; color: #5B4FD4; }
  .modal-title { font-size: 15px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .modal-title span { color: #5B4FD4; }
  .modal-subtitle { font-size: 10.5px; font-weight: 500; color: #888; margin-top: 1px; }
  .modal-close-btn {
    width: 32px; height: 32px; border-radius: 10px;
    border: none; background: #f0f0f0; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #888; transition: background 0.15s, color 0.15s;
  }
  .modal-close-btn:hover { background: #e4e4e4; color: #1a1a1a; }
  .modal-close-btn .mi { font-size: 17px; }

  .modal-body { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 14px; }

  /* type selector */
  .modal-type-group { display: flex; flex-direction: column; gap: 8px; }
  .modal-field-label {
    font-size: 10.5px; font-weight: 700; color: #666;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .modal-type-btns { display: flex; gap: 7px; }
  .modal-type-btn {
    flex: 1; padding: 10px 8px; border-radius: 13px; border: 1.5px solid #e0e0e0;
    background: #f0f0f0; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 600; color: #777;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: all 0.15s;
  }
  .modal-type-btn .mi { font-size: 15px; }
  .modal-type-btn:hover { border-color: #ccc; color: #444; }
  .modal-type-btn.active-res { background: rgba(200,241,53,0.15); border-color: #C8F135; color: #4a5c00; }
  .modal-type-btn.active-agr { background: rgba(46,196,160,0.12); border-color: #2EC4A0; color: #1a6a56; }
  .modal-type-btn.active-com { background: rgba(91,79,212,0.12); border-color: #5B4FD4; color: #5B4FD4; }

  /* field group */
  .modal-field-group { display: flex; flex-direction: column; gap: 6px; }
  .modal-row { display: flex; gap: 10px; }
  .modal-row .modal-field-group { flex: 1; }

  .modal-input-wrap { position: relative; }
  .modal-input-icon {
    font-family: 'Material Icons Sharp';
    font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    user-select: none;
    position: absolute; left: 11px; top: 50%;
    transform: translateY(-50%);
    font-size: 18px; color: #bbb; pointer-events: none;
  }
  .modal-input {
    width: 100%;
    padding: 11px 14px 11px 36px;
    border: 1.5px solid #e0e0e0;
    border-radius: 13px;
    background: #f0f0f0;
    font-size: 12px; font-family: 'Poppins', sans-serif;
    color: #1a1a1a; outline: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .modal-input:focus {
    border-color: #5B4FD4;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(91,79,212,0.08);
  }
  .modal-input::placeholder { color: #bbb; }

  /* divider */
  .modal-divider {
    height: 1px; background: #e0e0e0; margin: 2px 0;
  }

  /* footer buttons */
  .modal-footer {
    display: flex; gap: 8px; padding: 0 20px 20px;
  }
  .modal-btn-cancel {
    flex: 1; padding: 12px;
    border: 1.5px solid #e0e0e0; border-radius: 13px;
    background: #f0f0f0; color: #666;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: background 0.15s, color 0.15s;
  }
  .modal-btn-cancel:hover { background: #e4e4e4; color: #1a1a1a; }
  .modal-btn-save {
    flex: 2; padding: 12px;
    border: none; border-radius: 13px;
    background: #1a1a1a; color: #fff;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: background 0.15s, transform 0.15s;
  }
  .modal-btn-save .mi { font-size: 15px; }
  .modal-btn-save:hover:not(:disabled) { background: #2a2a2a; transform: translateY(-1px); }
  .modal-btn-save:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .modal-spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor; border-top-color: transparent;
    border-radius: 50%; animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 768px) {
    .mp-main { padding: 10px 10px 80px; gap: 10px; }
    .mp-topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
    .mp-topbar-right { width: 100%; }
    .mp-search-wrap { flex: 1; }
    .mp-search-wrap input { width: 100%; min-width: 0; }
    .mp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .mp-stat-value { font-size: 20px; }
    .mp-filters { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
    .mp-filters::-webkit-scrollbar { display: none; }
    .filter-tab { flex-shrink: 0; }
    .mp-grid { grid-template-columns: 1fr 1fr; }
    .mp-bottom { flex-direction: column; }
    .mp-sp-grid { grid-template-columns: 1fr 1fr; }
    .pd-info-grid { grid-template-columns: 1fr 1fr; }
    .modal-row { flex-direction: column; gap: 14px; }
  }
  @media (max-width: 1100px) {
    .mp-grid { grid-template-columns: 1fr; }
    .mp-card-chips { grid-template-columns: 1fr 1fr; }
    .pd-info-grid { grid-template-columns: 1fr; }
    .pd-title-right { display: none; }
  }
  @media (max-width: 480px) {
    .mp-grid { grid-template-columns: 1fr; }
    .mp-card-chips { grid-template-columns: 1fr 1fr; }
    .pd-info-grid { grid-template-columns: 1fr; }
    .pd-title-right { display: none; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MIcon = ({ name, style }) => (
  <span className="mi" style={style}>{name}</span>
);

/* ══════════════════════════════════════════════════
   CERTIFICATES SECTION (embedded in property detail)
══════════════════════════════════════════════════ */
function CertificatesSection({ property, user }) {
  const [selectedCert, setCert]      = useState(null);
  const [generating,   setGen]       = useState(false);
  const [generated,    setGenerated] = useState(false);

  const cert = CERT_TYPES.find(c => c.id === selectedCert);

  // Reset generated state when cert type changes
  const handleSelectCert = (id) => {
    setCert(id);
    setGenerated(false);
  };

  const handleGenerate = async () => {
    setGen(true);
    await new Promise(r => setTimeout(r, 1500));
    setGen(false);
    setGenerated(true);
  };

  // Mock past certs filtered to this property
  const pastCerts = CERT_TYPES.map(c => ({
    name: `${c.label} — ${String(property.id).slice(0, 8)}`,
    date: "18 Nov 2023",
    icon: c.icon,
    color: c.color,
  })).slice(0, 2);

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="pd-cert-section">
      <div className="pd-cert-header">
        <div className="pd-cert-header-left">
          <div className="pd-cert-title">Property <span>Certificates</span></div>
          <div className="pd-cert-count-pill">{CERT_TYPES.length} types</div>
        </div>
        {generated && (
          <div className="pd-cert-preview-live" style={{ color: "#2EC4A0" }}>
            <span className="pd-cert-preview-live-dot" style={{ background: "#2EC4A0" }} />
            READY TO DOWNLOAD
          </div>
        )}
      </div>

      <div className="pd-cert-body">
        {/* Certificate type list */}
        <div className="pd-cert-types">
          {CERT_TYPES.map(c => (
            <div
              key={c.id}
              className={`pd-cert-type-row${selectedCert === c.id ? " selected" : ""}`}
              style={{ "--cert-color": c.color, "--cert-dark": c.colorDark, "--cert-text": c.textColor }}
              onClick={() => handleSelectCert(c.id)}
            >
              <div className="pd-cert-badge">
                <MIcon name={c.icon} />
              </div>
              <div className="pd-cert-type-body">
                <div className="pd-cert-type-short">{c.short}</div>
                <div className="pd-cert-type-name">{c.label}</div>
                <div className="pd-cert-type-desc">{c.desc}</div>
              </div>
            </div>
          ))}

          {/* Past certs */}
          <div className="pd-cert-past">
            <div className="pd-cert-past-title">Previously Generated</div>
            <div className="pd-cert-past-list">
              {pastCerts.map((pc, i) => (
                <div key={i} className="pd-cert-past-row">
                  <div className="pd-cert-past-icon" style={{ background: pc.color + "22" }}>
                    <MIcon name={pc.icon} style={{ color: pc.color }} />
                  </div>
                  <div className="pd-cert-past-body">
                    <div className="pd-cert-past-name">{pc.name}</div>
                    <div className="pd-cert-past-date">{pc.date}</div>
                  </div>
                  <button className="pd-cert-past-dl">
                    <MIcon name="download" /> PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: preview + generate button */}
        <div className="pd-cert-panel">
          <div className="pd-cert-preview">
            {cert ? (
              <>
                <div className="pd-cert-preview-seal-row">
                  <div className="pd-cert-preview-seal" style={{ background: cert.colorDark, borderColor: cert.color + "40" }}>
                    <MIcon name={cert.icon} style={{ color: cert.color }} />
                  </div>
                  <div className="pd-cert-preview-gov">Government of Tamil Nadu</div>
                  <div className="pd-cert-preview-name">{cert.label}</div>
                </div>
                <div className="pd-cert-preview-rows">
                  {[
                    { label: "Property ID", val: String(property.id).slice(0, 16) + "…" },
                    { label: "Owner",       val: user?.name || "—"              },
                    { label: "Survey No.",  val: property.surveyNo              },
                    { label: "Area",        val: property.area                  },
                    { label: "District",    val: property.district              },
                    { label: "Issued On",   val: today                          },
                    { label: "Status",      val: generated ? "VALID" : "PENDING", cls: generated ? "green" : "amber" },
                  ].map((r, i) => (
                    <div key={i} className="pd-cert-preview-row">
                      <span className="pd-cert-preview-lbl">{r.label}</span>
                      <span className={`pd-cert-preview-val${r.cls ? ` ${r.cls}` : ""}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div className="pd-cert-preview-hash">
                  <div className="pd-cert-preview-hash-lbl">Document Hash</div>
                  <div className="pd-cert-preview-hash-val">{String(property.hash || property.id).slice(0, 28)}…</div>
                </div>
              </>
            ) : (
              <div className="pd-cert-preview-placeholder">
                <MIcon name="insert_drive_file" />
                <div className="pd-cert-preview-placeholder-txt">
                  Select a certificate type<br />to preview &amp; download
                </div>
              </div>
            )}
          </div>

          <button
            className="pd-cert-gen-btn"
            style={{
              background: generated ? "#2EC4A0" : cert ? cert.color : "#e8e8e8",
              color:      generated ? "#0d2420" : cert ? cert.textColor : "#aaa",
            }}
            disabled={!cert || generating}
            onClick={generated ? () => {} : handleGenerate}
          >
            {generating
              ? <><span className="pd-cert-spinner" /> Generating…</>
              : generated
                ? <><MIcon name="download" /> Download PDF</>
                : <><MIcon name="workspace_premium" /> Generate Certificate</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export default function MyProperties() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [search,       setSearch]      = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [detailView,   setDetailView]  = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  // Add Property State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "", type: "Residential", area: "", address: "", district: "", state: "", pincode: "", surveyNo: "", marketValue: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties/my-properties');
      setAllProperties(res.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoadingProps(false);
    }
  };

  useEffect(() => {
    if (user) fetchProperties();
  }, [user]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/properties', newProperty);
      setShowAddModal(false);
      setNewProperty({ title: "", type: "Residential", area: "", address: "", district: "", state: "", pincode: "", surveyNo: "", marketValue: "" });
      fetchProperties();
    } catch (error) {
      console.error("Error adding property", error);
      alert("Failed to add property");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (location.state?.openPropertyId && allProperties.length > 0) {
      const prop = allProperties.find(p => p.id === location.state.openPropertyId);
      if (prop) {
        setDetailView(prop);
        // Clear the state so it doesn't reopen if the user navigates away and back
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, allProperties]);

  const filtered = allProperties.filter(p => {
    const matchesFilter =
      activeFilter === "All"          ? true :
      activeFilter === "Clear Title"  ? p.status === "Clear Title" :
      activeFilter === "Encumbered"   ? p.encumbrance :
      activeFilter === "Disputed"     ? p.disputeActive :
      activeFilter === "Residential"  ? p.type === "Residential" :
      activeFilter === "Agricultural" ? p.type === "Agricultural" :
      activeFilter === "Commercial"   ? p.type === "Commercial" : true;

    const q = search.toLowerCase();
    const matchesSearch = !q ||
      String(p.id).toLowerCase().includes(q)       ||
      p.title.toLowerCase().includes(q)    ||
      p.district.toLowerCase().includes(q) ||
      p.surveyNo.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  /* ── Stats ── */
  const residential  = allProperties.filter(p => p.type === "Residential").length;
  const commercial   = allProperties.filter(p => p.type === "Commercial").length;
  const clearTitle   = allProperties.filter(p => p.status === "Clear Title").length;
  const disputed     = allProperties.filter(p => p.disputeActive).length;

  /* ── Timeline items ── */
  const timelineItems = allProperties.map(p => {
    const meta = TYPE_META[p.type] || TYPE_META.Residential;
    return {
      icon:      meta.icon,
      iconBg:    meta.iconBg + "22",
      iconColor: meta.iconBg,
      name:      p.title,
      detail:    `${p.status} · ${p.area} · ${p.district}`,
      date:      p.registeredOn,
    };
  });

  /* ── Type distribution bars ── */
  const typeCounts = { Residential: residential, Commercial: commercial, Agricultural: allProperties.filter(p => p.type === "Agricultural").length };
  const maxCount   = Math.max(...Object.values(typeCounts), 1);
  const BAR_COLORS = { Residential: "#C8F135", Agricultural: "#2EC4A0", Commercial: "#5B4FD4" };
  const typeBars = Object.entries(typeCounts).map(([name, count]) => ({
    name, pct: Math.round((count / maxCount) * 100), color: BAR_COLORS[name],
  }));

  return (
    <>
      <style>{styles}</style>

      <div className="mp-page">

        <div className="mp-main">

          {/* ══ TOP BAR ══ */}
          <div className="mp-topbar">
            <div className="mp-heading">
              My <span>Properties</span>
            </div>
            <div className="mp-topbar-right">
              <div className="mp-search-wrap">
                <MIcon name="search" />
                <input
                  placeholder="Search by ID, title, district..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: "#1a1a1a", color: "#fff",
                  padding: "8px 16px", borderRadius: "11px",
                  border: "none", fontFamily: "'Poppins', sans-serif",
                  fontWeight: "700", fontSize: "11.5px",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#2a2a2a"}
                onMouseLeave={e => e.currentTarget.style.background = "#1a1a1a"}
              >
                <MIcon name="add" /> Add Property
              </button>
            </div>
          </div>

          {/* ══ STAT STRIP (Only show when not in detail view) ══ */}
          {!detailView && (
            <div className="mp-stats">
              <div className="mp-stat dark">
                <div className="mp-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
                <div className="mp-stat-label">Total Properties</div>
                <div className="mp-stat-value">{allProperties.length}</div>
                <div className="mp-stat-badge">registered</div>
              </div>
              <div className="mp-stat purple">
                <div className="mp-stat-glow" style={{ background: "radial-gradient(circle at 70% 20%, rgba(91,79,212,0.25) 0%, transparent 60%)" }} />
                <div className="mp-stat-label">Commercial</div>
                <div className="mp-stat-value">{commercial}</div>
                <div className="mp-stat-badge">properties</div>
              </div>
              <div className="mp-stat">
                <div className="mp-stat-label">Residential</div>
                <div className="mp-stat-value">{residential}</div>
                <div className="mp-stat-badge">properties</div>
              </div>
              <div className="mp-stat">
                <div className="mp-stat-label">Clear Title</div>
                <div className="mp-stat-value">{clearTitle}</div>
                <div className="mp-stat-badge">
                  {disputed > 0 ? `${disputed} disputed` : "no disputes"}
                </div>
              </div>
            </div>
          )}

          {/* ══ CONTENT ZONE ══ */}
          {detailView ? (
            /* ── DETAIL VIEW (LATEST DESIGN FROM Q7NK) ── */
            <div className="mp-detail-view-container">
              <div className="pd-main" style={{ padding: "8px 0" }}>
                
                {/* ── TOP BAR ── */}
                <div className="pd-topbar">
                  <div className="pd-breadcrumb">
                    <span className="pd-bc-link" onClick={() => navigate("/user/dashboard")}>Dashboard</span>
                    <span className="pd-bc-sep">›</span>
                    <span className="pd-bc-link" onClick={() => setDetailView(null)}>My Properties</span>
                    <span className="pd-bc-sep">›</span>
                    <span className="pd-bc-here">{detailView.id}</span>
                  </div>
                  <div className="pd-topbar-right">
                    <button className="pd-back-btn" onClick={() => setDetailView(null)}>
                      <span className="material-icons-sharp">arrow_back</span>
                      Back
                    </button>
                  </div>
                </div>

                {/* ── TITLE ZONE ── */}
                <div className="pd-title-zone">
                  <div className="pd-title-left">
                    <div className="pd-title-eyebrow">
                      <span className="material-icons-sharp">{TYPE_META[detailView.type]?.icon || "home"}</span>
                      {detailView.type.toUpperCase()} PROPERTY
                    </div>
                    <div className="pd-title-id">{detailView.id}</div>
                    <div className="pd-title-main">{detailView.title}</div>
                    <div className="pd-title-addr">{detailView.address}</div>
                  </div>
                  <div className="pd-title-right">
                    <div className="pd-title-status" style={{ background: detailView.statusColor || "#2EC4A0", color: "#1a1a1a" }}>
                      {detailView.status}
                    </div>
                    <div className="pd-title-value">{detailView.marketValue}</div>
                    <div className="pd-title-value-lbl">ESTIMATED MARKET VALUE</div>
                  </div>
                </div>

                {/* ── STATUS STRIP ── */}
                <div className={`pd-status-strip ${detailView.disputeActive ? "pd-strip-dispute" : "pd-strip-clear"}`}>
                  <span className="material-icons-sharp">
                    {detailView.disputeActive ? "warning" : "verified"}
                  </span>
                  {detailView.disputeActive
                    ? "Active dispute on this property — resolution in progress"
                    : "No active disputes · Record integrity verified on-chain"
                  }
                </div>

                {/* ── TWO COLUMN LAYOUT ── */}
                <div className="pd-layout">

                  {/* LEFT */}
                  <div>

                    {/* Owner card */}
                    <div className="pd-section-title">CURRENT OWNER</div>
                    <div className="pd-owner-card">
                      <div className="pd-owner-head">
                        <span className="pd-owner-head-lbl">REGISTERED OWNER</span>
                        <span className="pd-owner-verified">
                          <span className="material-icons-sharp">check</span>
                          VERIFIED
                        </span>
                      </div>
                      <div className="pd-owner-body">
                        <div className="pd-owner-avatar">
                          {(detailView.ownerName || "O").split(" ").filter(w => w).map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="pd-owner-name">{detailView.ownerName || "Unknown Owner"}</div>
                          <div className="pd-owner-since">Owner since {detailView.lastTransfer}</div>
                        </div>
                        {user?.id === detailView.ownerId && (
                          <div className="pd-owner-tag">
                            <span className="material-icons-sharp" style={{ fontSize: 12 }}>person</span>
                            You
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Property details */}
                    <div className="pd-section-title">PROPERTY DETAILS</div>
                    <div className="pd-zone" style={{ padding: "12px" }}>
                      <div className="pd-info-grid">
                        {[
                          { label:"PROPERTY TYPE",  val: detailView.type,                  wide:false },
                          { label:"STATUS",         val: detailView.status,                wide:false, isStatus:true },
                          { label:"AREA",           val: detailView.area,                  wide:false },
                          { label:"SURVEY NO.",     val: detailView.surveyNo,              wide:false },
                          { label:"DISTRICT",       val: detailView.district,              wide:false },
                          { label:"STATE",          val: detailView.state,                 wide:false },
                          { label:"REGISTERED ON",  val: detailView.registeredOn,          wide:false },
                          { label:"LAST TRANSFER",  val: detailView.lastTransfer,          wide:false },
                          { label:"ENCUMBRANCE",    val: detailView.encumbrance ? "Yes — Loan/Mortgage recorded" : "No encumbrance on record", wide:false },
                          { label:"MARKET VALUE",   val: detailView.marketValue,           wide:false },
                          { label:"FULL ADDRESS",   val: detailView.address,               wide:true  },
                        ].map((row, i) => (
                          <div key={i} className={`pd-info-cell ${row.wide ? "pd-info-cell-wide" : ""}`}>
                            <span className="pd-info-lbl">{row.label}</span>
                            <span
                              className={`pd-info-val ${row.isStatus ? "pd-info-val-status" : ""}`}
                              style={row.isStatus ? { color: detailView.statusColor || "#2EC4A0" } : {}}
                            >
                              {row.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT SIDEBAR */}
                  <div className="pd-sidebar">

                    {/* Blockchain card */}
                    <div className="pd-section-title">BLOCKCHAIN RECORD</div>
                    <div className="pd-chain-card">
                      <div className="pd-chain-head">
                        <span className="pd-chain-title">ON-CHAIN DATA</span>
                        <span className="pd-chain-live"><span className="pd-chain-dot" />LIVE</span>
                      </div>
                      <div className="pd-chain-rows">
                        {[
                          { label: "Block Hash",  val: String(detailView.id).slice(0, 18) + "…", green: false },
                          { label: "Block No.",   val: "#" + (detailView.blockNumber?.toLocaleString() || "1,234,567"), green: false },
                          { label: "Events",      val: (detailView.timeline || []).length + " recorded", green: false },
                          { label: "Network",     val: "TN State Registry", green: false },
                          { label: "Integrity",   val: "✓ All records verified", green: true },
                        ].map((r, i) => (
                          <div className="pd-chain-row" key={i}>
                            <span className="pd-chain-label">{r.label}</span>
                            <span className={r.green ? "pd-chain-val-green" : "pd-chain-val"}>{r.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pd-section-title">ACTIONS</div>
                    <div className="pd-actions-card">
                      <div className="pd-actions-head">
                        <span className="pd-actions-head-lbl">AVAILABLE ACTIONS</span>
                      </div>
                      <div className="pd-actions-body">
                        {user?.id === detailView.currentOwner ? (
                          <>
                            <button className="pd-action-btn pd-btn-primary" onClick={() => navigate("/user/transfers")}>
                              <span className="material-icons-sharp">swap_horiz</span>
                              Initiate Transfer
                            </button>
                            <button className="pd-action-btn pd-btn-purple" onClick={() => navigate("/user/mutation")}>
                              <span className="material-icons-sharp">description</span>
                              File Mutation Request
                            </button>
                            <button className="pd-action-btn pd-btn-danger" onClick={() => navigate("/user/disputes")}>
                              <span className="material-icons-sharp">gavel</span>
                              File a Dispute
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="pd-action-btn pd-btn-outline" onClick={() => navigate("/user/disputes")}>
                              <span className="material-icons-sharp">flag</span>
                              Flag this Record
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── OWNERSHIP TIMELINE ── */}
                <div className="pd-timeline-section">
                  <div className="pd-timeline-header">
                    <div>
                      <div className="pd-timeline-tag">⛓ OWNERSHIP TIMELINE</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span className="pd-timeline-title">Every transaction, <span>immutably recorded.</span></span>
                      <span className="pd-timeline-sub" style={{ marginLeft: 8 }}>{(detailView.timeline || []).length} events</span>
                    </div>
                  </div>

                  <div className="pd-tl-list">
                    {(detailView.timeline || []).map((t, i) => {
                      const tc = TIMELINE_COLORS[t.status] || "#5B4FD4";
                      return (
                        <div key={i} className="pd-tl-item">
                          <div className="pd-tl-spine">
                            <div className="pd-tl-dot" style={{ background: tc }} />
                            {i < (detailView.timeline || []).length - 1 && <div className="pd-tl-line" />}
                          </div>
                          <div className={`pd-tl-block ${i === 0 ? "pd-tl-block-active" : ""}`}>
                            <div className="pd-tl-top">
                              <span className="pd-tl-event">{t.event}</span>
                              <span className="pd-tl-badge" style={{ background: tc, color: "#fff" }}>{t.status}</span>
                            </div>
                            {(t.from || t.to) && (
                              <div className="pd-tl-parties">
                                {t.from && t.to ? `${t.from} → ${t.to}` : t.from || t.to}
                              </div>
                            )}
                            <div className="pd-tl-bottom">
                              <span className="pd-tl-hash">{t.hash}</span>
                              <span className="pd-tl-date">{t.date}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── CERTIFICATES ── */}
                <div className="pd-section-title" style={{ marginTop: 12 }}>CERTIFICATES &amp; DOCUMENTS</div>
                <CertificatesSection property={detailView} user={user} />

              </div>
            </div>
          ) : (
            /* ── LIST VIEW ── */
            <>
              <div className="mp-section-zone">
                <div className="mp-section-header">
                  <div className="mp-section-title-row">
                    <div className="mp-section-title">
                      All <span>Properties</span>
                    </div>
                    <div className="mp-count-pill">{filtered.length} shown</div>
                  </div>
                  
                  {/* FILTER TABS */}
                  <div className="mp-filters">
                    {FILTERS.map((f, i) => (
                      <span key={f}>
                        {i === 4 && <div className="filter-sep" style={{ display: "inline-block" }} />}
                        <button
                          className={`filter-tab ${activeFilter === f ? "active" : ""}`}
                          onClick={() => setActiveFilter(f)}
                        >
                          {f}
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <div className="mp-empty">
                    <MIcon name="home_work" />
                    No properties match your search or filter.
                  </div>
                ) : (
                  <div className="mp-grid">
                    {filtered.map((p, i) => {
                      const meta       = TYPE_META[p.type] || TYPE_META.Residential;
                      const isDark     = meta.dark;
                      const statusCls  = STATUS_CLASS[p.status]  || "status-done";
                      const dotCls     = DOT_CLASS[p.status]     || "pill-dot-done";

                      return (
                        <div
                          key={p.id}
                          className={`mp-card${isDark ? " dark" : ""}`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                          onClick={() => setDetailView(p)}
                        >
                          {isDark && (
                            <div className="mp-card-glow" style={{ background: "radial-gradient(circle at 80% 10%, rgba(91,79,212,0.15) 0%, transparent 55%)" }} />
                          )}

                          {/* Header */}
                          <div className="mp-card-header">
                            <div className="mp-icon-wrap" style={{ background: isDark ? "rgba(255,255,255,0.06)" : `${meta.iconBg}22` }}>
                              <MIcon name={meta.icon} style={{ color: isDark ? "#a89fff" : meta.iconBg }} />
                            </div>
                            <div className={`mp-status-pill ${statusCls}`}>
                              <div className={`pill-dot ${dotCls}`} />
                              {p.status}
                            </div>
                          </div>

                          {/* Identity */}
                          <div>
                            <div className="mp-card-id">{String(p.id).slice(0, 16)}...</div>
                            <div className="mp-card-title">{p.title}</div>
                            <div className="mp-card-org">{p.district}</div>
                          </div>

                          <div className="mp-card-addr">{p.address}</div>

                          {/* 2×2 chips */}
                          <div className="mp-card-chips">
                            <div className="mp-chip">
                              <div className="mp-chip-label">Area</div>
                              <div className="mp-chip-value">{p.area}</div>
                            </div>
                            <div className="mp-chip">
                              <div className="mp-chip-label">Survey No.</div>
                              <div className="mp-chip-value">{p.surveyNo}</div>
                            </div>
                            <div className="mp-chip">
                              <div className="mp-chip-label">Registered</div>
                              <div className="mp-chip-value">{p.registeredOn}</div>
                            </div>
                            <div className="mp-chip accent">
                              <div className="mp-chip-label">Market Value</div>
                              <div className="mp-chip-value">{p.marketValue}</div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="mp-tags">
                            <div className="mp-tag">{p.type}</div>
                            {p.encumbrance && <div className="mp-tag">Encumbered</div>}
                            {p.disputeActive && <div className="mp-tag">Disputed</div>}
                          </div>

                          {/* Warning */}
                          {(p.disputeActive || p.encumbrance) && (
                            <div className="mp-card-warning" style={{ fontSize: "10.5px", fontWeight: 600, color: "#c0392b", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                              <MIcon name="warning" style={{ fontSize: "14px" }} />
                              {p.disputeActive ? "Active dispute on this property" : "Encumbrance recorded"}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mp-card-footer">
                            <span className="mp-card-hash">{String(p.id).slice(0, 14)}…</span>
                            <span className="mp-card-cta">
                              View Details <MIcon name="arrow_forward" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ══ BOTTOM ROW: Timeline + Stats Panel ══ */}
              <div className="mp-bottom">
                
                {/* Timeline */}
                <div className="mp-timeline">
                  <div className="mp-tl-title">Property Timeline</div>
                  <div className="mp-tl-feed">
                    {timelineItems.map((t, i) => (
                      <div className="mp-tl-item" key={i}>
                        <div className="mp-tl-left">
                          <div className="mp-tl-icon" style={{ background: t.iconBg }}>
                            <MIcon name={t.icon} style={{ color: t.iconColor }} />
                          </div>
                          {i < timelineItems.length - 1 && <div className="mp-tl-line" />}
                        </div>
                        <div className="mp-tl-body">
                          <div className="mp-tl-name">{t.name}</div>
                          <div className="mp-tl-detail">{t.detail}</div>
                        </div>
                        <div className="mp-tl-date">{t.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats panel */}
                <div className="mp-stat-panel">
                  <div className="mp-sp-title">Your Portfolio</div>
                  <div className="mp-sp-grid">
                    <div className="mp-sp-block accent">
                      <div className="mp-sp-label">Properties</div>
                      <div className="mp-sp-val">{allProperties.length}</div>
                      <div className="mp-sp-sub">total registered</div>
                    </div>
                    <div className="mp-sp-block">
                      <div className="mp-sp-label">Clear Title</div>
                      <div className="mp-sp-val">{clearTitle}</div>
                      <div className="mp-sp-sub">clean records</div>
                    </div>
                    <div className="mp-sp-block">
                      <div className="mp-sp-label">Disputed</div>
                      <div className="mp-sp-val">{disputed}</div>
                      <div className="mp-sp-sub">active disputes</div>
                    </div>
                    <div className="mp-sp-block accent">
                      <div className="mp-sp-label">Clear Rate</div>
                      <div className="mp-sp-val" style={{ fontSize: 16, paddingTop: 3 }}>
                        {Math.round((clearTitle / (allProperties.length || 1)) * 100)}%
                      </div>
                      <div className="mp-sp-sub">of portfolio</div>
                    </div>
                  </div>
                  <div className="mp-sp-divider" />
                  <div className="mp-sp-bar-rows">
                    {typeBars.map(t => (
                      <div className="mp-sp-bar-row" key={t.name}>
                        <div className="mp-sp-bar-name">{t.name}</div>
                        <div className="mp-sp-bar-bg">
                          <div className="mp-sp-bar-fill" style={{ width: `${t.pct}%`, background: t.color }} />
                        </div>
                        <div className="mp-sp-bar-pct">{t.pct}%</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            {/* ── Header ── */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-header-icon">
                  <MIcon name="add_home" />
                </div>
                <div>
                  <div className="modal-title">Add <span>Property</span></div>
                  <div className="modal-subtitle">Register a new property to your portfolio</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <MIcon name="close" />
              </button>
            </div>

            {/* ── Body ── */}
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">

                {/* Title */}
                <div className="modal-field-group">
                  <div className="modal-field-label">Title</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">title</span>
                    <input
                      className="modal-input"
                      required
                      value={newProperty.title}
                      onChange={e => setNewProperty({ ...newProperty, title: e.target.value })}
                      placeholder='e.g. "Ancestral Home" or "Farm Land"'
                    />
                  </div>
                </div>

                {/* Type selector */}
                <div className="modal-type-group">
                  <div className="modal-field-label">Type</div>
                  <div className="modal-type-btns">
                    {[
                      { val: "Residential",  icon: "home",     cls: "active-res" },
                      { val: "Agricultural", icon: "grass",    cls: "active-agr" },
                      { val: "Commercial",   icon: "business", cls: "active-com" },
                    ].map(t => (
                      <button
                        key={t.val}
                        type="button"
                        className={`modal-type-btn${newProperty.type === t.val ? ` ${t.cls}` : ""}`}
                        onClick={() => setNewProperty({ ...newProperty, type: t.val })}
                      >
                        <MIcon name={t.icon} /> {t.val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area */}
                <div className="modal-field-group">
                  <div className="modal-field-label">Area</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">straighten</span>
                    <input
                      className="modal-input"
                      required
                      value={newProperty.area}
                      onChange={e => setNewProperty({ ...newProperty, area: e.target.value })}
                      placeholder='e.g. "1500 sqft" or "2 Acres"'
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="modal-field-group">
                  <div className="modal-field-label">Address</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">location_on</span>
                    <input
                      className="modal-input"
                      required
                      value={newProperty.address}
                      onChange={e => setNewProperty({ ...newProperty, address: e.target.value })}
                      placeholder="Full street address or location description"
                    />
                  </div>
                </div>

                {/* District + State */}
                <div className="modal-row">
                  <div className="modal-field-group">
                    <div className="modal-field-label">District</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">map</span>
                      <input
                        className="modal-input"
                        required
                        value={newProperty.district}
                        onChange={e => setNewProperty({ ...newProperty, district: e.target.value })}
                        placeholder="e.g. Chennai"
                      />
                    </div>
                  </div>
                  <div className="modal-field-group">
                    <div className="modal-field-label">State</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">flag</span>
                      <input
                        className="modal-input"
                        required
                        value={newProperty.state}
                        onChange={e => setNewProperty({ ...newProperty, state: e.target.value })}
                        placeholder="e.g. Tamil Nadu"
                      />
                    </div>
                  </div>
                </div>

                {/* Pincode + Survey No. */}
                <div className="modal-row">
                  <div className="modal-field-group">
                    <div className="modal-field-label">Pincode</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">pin</span>
                      <input
                        className="modal-input"
                        required
                        value={newProperty.pincode}
                        onChange={e => setNewProperty({ ...newProperty, pincode: e.target.value })}
                        placeholder="6-digit postal code"
                      />
                    </div>
                  </div>
                  <div className="modal-field-group">
                    <div className="modal-field-label">Survey No.</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">tag</span>
                      <input
                        className="modal-input"
                        required
                        value={newProperty.surveyNo}
                        onChange={e => setNewProperty({ ...newProperty, surveyNo: e.target.value })}
                        placeholder="Govt. survey / plot number"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-divider" />

                {/* Market Value */}
                <div className="modal-field-group">
                  <div className="modal-field-label">Market Value</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">currency_rupee</span>
                    <input
                      className="modal-input"
                      required
                      value={newProperty.marketValue}
                      onChange={e => setNewProperty({ ...newProperty, marketValue: e.target.value })}
                      placeholder='e.g. "₹ 45,00,000"'
                    />
                  </div>
                </div>

              </div>

              {/* ── Footer ── */}
              <div className="modal-footer">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn-save" disabled={submitting}>
                  {submitting
                    ? <><span className="modal-spinner" /> Registering…</>
                    : <><MIcon name="add_home" /> Register Property</>
                  }
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}