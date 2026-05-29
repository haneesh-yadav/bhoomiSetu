import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";


const TIMELINE_COLORS = {
  VERIFIED:  "#e07a5f",
  CONFIRMED: "#e07a5f",
  GENESIS:   "#e07a5f",
  PENDING:   "#dc2626",
};

const TYPE_META = {
  Residential:  { icon: "home",     iconBg: "#e07a5f", dark: false },
  Agricultural: { icon: "grass",    iconBg: "#e07a5f", dark: false },
  Commercial:   { icon: "business", iconBg: "#1a1a1a", dark: true  },
};

/* ══════════════════════════════════════════════════
   CERTIFICATE DATA
══════════════════════════════════════════════════ */
const CERT_TYPES = [
  { id: "ec",        label: "Encumbrance Certificate",   short: "EC",  icon: "verified",        color: "#e07a5f", colorDark: "#2c1a14", textColor: "#fff",
    desc: "Confirms no outstanding loans, mortgages or legal dues on this property." },
  { id: "ownership", label: "Ownership Certificate",     short: "OC",  icon: "account_balance", color: "#1a1a1a", colorDark: "#111", textColor: "#fff",
    desc: "Official certificate proving rightful ownership as recorded on the state registry." },
  { id: "valuation", label: "Property Valuation Report", short: "PVR", icon: "bar_chart",       color: "#e07a5f", colorDark: "#2c1a14", textColor: "#fff",
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
   CSS — UserDashboard Design System
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
    font-feature-settings: 'liga';
    -webkit-font-feature-settings: 'liga';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
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
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Page root ── */
  .mp-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }

  /* ── Main container ── */
  .mp-main {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px 28px 56px;
    max-width: 1280px;
    margin: 0 auto;
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
  .mp-heading { font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .mp-heading span { color: #e07a5f; }
  .mp-topbar-right { display: flex; align-items: center; gap: 8px; }
  .mp-search-wrap {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 100px; display: flex; align-items: center; gap: 6px; padding: 7px 14px;
    transition: border-color 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .mp-search-wrap:focus-within { border-color: #e07a5f; }
  .mp-search-wrap .mi { font-size: 15px; color: #aaa; }
  .mp-search-wrap input { border: none; outline: none; background: transparent; font-family: 'Poppins', sans-serif; font-size: 11.5px; color: #333; width: 180px; }
  .mp-search-wrap input::placeholder { color: #bbb; }

  /* ══ STAT STRIP — matches UserDashboard ud-stats-strip ══ */
  .mp-stats {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  .mp-stat {
    padding: 16px 20px;
    cursor: default;
    transition: background 0.15s;
    position: relative;
    display: flex; flex-direction: column; gap: 5px;
    background: #f9f9f7;
  }
  .mp-stat:not(:last-child) { border-right: 1.5px solid #eeeeec; }
  .mp-stat:hover { background: #f3f3f0; }
  .mp-stat-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #aaa; }
  .mp-stat-value { font-size: 1.9rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: #e07a5f; }
  .mp-stat-value.danger { color: #b91c1c; }
  .mp-stat-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 9px; font-weight: 700; padding: 3px 9px;
    border-radius: 20px; width: fit-content;
  }

  /* ══ FILTER TABS ══ */
  .mp-filters {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 16px;
    padding: 10px 16px;
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .mp-filters-label {
    font-size: 10px; font-weight: 700; color: #aaa;
    text-transform: uppercase; letter-spacing: 0.09em;
    padding-right: 12px; border-right: 1.5px solid #ebebeb;
    margin-right: 2px; white-space: nowrap;
  }
  .filter-tab {
    padding: 6px 16px; border-radius: 100px;
    font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600;
    color: #888; border: 1.5px solid transparent;
    background: #f5f5f3; cursor: pointer; transition: all 0.15s; letter-spacing: 0.02em;
  }
  .filter-tab:hover { color: #444; background: #eee; border-color: #e0e0e0; }
  .filter-tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .filter-sep { width: 1px; height: 18px; background: #ebebeb; margin: 0 4px; }

  /* ══ SECTION CARD — matches ud-card ══ */
  .mp-section-zone {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mp-section-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .mp-section-title-row { display: flex; align-items: center; gap: 10px; }
  .mp-section-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .mp-section-title .mi { font-size: 17px; color: #e07a5f; }
  .mp-count-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .mp-section-body { padding: 18px 20px; }

  /* ══ PROPERTY GRID ══ */
  .mp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  /* ══ PROPERTY CARD ══ */
  .mp-card {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    padding: 16px; display: flex; flex-direction: column; gap: 11px;
    position: relative; overflow: hidden; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    animation: fadeUp 0.35s ease both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .mp-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.1); border-color: #e07a5f; }
  .mp-card-glow { position: absolute; inset: 0; pointer-events: none; border-radius: 20px; }

  .mp-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .mp-icon-wrap {
    width: 36px; height: 36px; border-radius: 11px;
    background: rgba(224,122,95,0.1);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mp-icon-wrap .mi { font-size: 18px; color: #e07a5f; }

  .mp-status-pill { font-size: 9.5px; font-weight: 600; padding: 3px 9px; border-radius: 20px; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .mp-status-pill .pill-dot { width: 5px; height: 5px; border-radius: 50%; }

  .status-active   { color: #e07a5f; background: rgba(224,122,95,0.1); }
  .status-progress { color: #b07a00; background: rgba(255,185,0,0.14); }
  .status-done     { color: #991b1b; background: rgba(220,38,38,0.1); }

  .pill-dot-active   { background: #e07a5f; }
  .pill-dot-progress { background: #e0a020; }
  .pill-dot-done     { background: #dc2626; }

  .mp-card-id { font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 500; color: #e07a5f; letter-spacing: 0.05em; }
  .mp-card-title { font-size: 13px; font-weight: 700; color: #1a1a1a; letter-spacing: -0.2px; line-height: 1.3; }
  .mp-card-org { font-size: 10px; font-weight: 500; color: #aaa; margin-top: 2px; }
  .mp-card-addr { font-size: 10.5px; font-weight: 400; color: #999; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  .mp-card-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .mp-chip { background: #f7f7f5; border-radius: 11px; padding: 9px 11px; display: flex; flex-direction: column; gap: 2px; border: 1px solid #eeeeec; }
  .mp-chip.accent { background: rgba(224,122,95,0.06); border-color: rgba(224,122,95,0.2); }
  .mp-chip-label { font-size: 9px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.5px; }
  .mp-chip-value { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .mp-chip.accent .mp-chip-value { color: #e07a5f; }

  .mp-tags { display: flex; flex-wrap: wrap; gap: 5px; }
  .mp-tag { font-size: 9.5px; font-weight: 600; padding: 2px 8px; border-radius: 7px; background: #f3f3f1; color: #777; }

  .mp-card-warning {
    background: rgba(220,38,38,0.06); border-top: 1.5px solid rgba(220,38,38,0.2);
    margin: 0 -16px; padding: 7px 16px; font-size: 10px; font-weight: 700; color: #991b1b;
    display: flex; align-items: center; gap: 5px;
  }
  .mp-card-warning .mi { font-size: 14px; }

  .mp-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1.5px solid #f0f0ee; }
  .mp-card-hash { font-family: 'DM Mono', monospace; font-size: 9px; color: #e07a5f; }
  .mp-card-cta { font-size: 10px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 4px; }
  .mp-card-cta .mi { font-size: 14px; }

  .mp-empty {
    text-align: center; padding: 40px 20px;
    background: #f9f9f7; border: 1.5px solid #eeeeec; border-radius: 16px;
    color: #aaa; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 6px;
    margin: 4px;
  }
  .mp-empty .mi { font-size: 22px; color: #ccc; }

  /* ══ BOTTOM ROW: TIMELINE & STATS ══ */
  .mp-bottom { display: flex; gap: 16px; flex-shrink: 0; }

  /* Timeline panel — matches ud-chain */
  .mp-timeline {
    flex: 2;
    background: linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 60%, #1a1a1a 100%);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 20px; padding: 18px 20px;
    display: flex; flex-direction: column; gap: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    position: relative;
  }
  .mp-timeline::before {
    content: ''; position: absolute; inset: 0; border-radius: 20px;
    background-image: radial-gradient(circle, rgba(224,122,95,0.08) 1px, transparent 1px);
    background-size: 24px 24px; pointer-events: none;
  }
  .mp-tl-title {
    font-size: 12.5px; font-weight: 700; color: rgba(255,255,255,0.85);
    display: flex; align-items: center; gap: 8px;
    position: relative; z-index: 1;
    padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .mp-tl-title .mi { font-size: 16px; color: #e07a5f; }
  .mp-tl-live {
    margin-left: auto; display: flex; align-items: center; gap: 5px;
    font-size: 9.5px; font-weight: 700; color: #e07a5f; letter-spacing: 0.09em;
  }
  .mp-tl-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e07a5f; box-shadow: 0 0 0 3px rgba(224,122,95,0.2);
    animation: pulse 2s infinite;
  }
  .mp-tl-feed  { display: flex; flex-direction: column; gap: 0; position: relative; z-index: 1; }
  .mp-tl-item  { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .mp-tl-item:last-child { border-bottom: none; }
  .mp-tl-left  { display: flex; flex-direction: column; align-items: center; gap: 3px; padding-top: 2px; }
  .mp-tl-icon  { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(224,122,95,0.15); }
  .mp-tl-icon .mi { font-size: 14px; color: #e07a5f; }
  .mp-tl-line  { width: 1.5px; height: 20px; background: rgba(255,255,255,0.05); }
  .mp-tl-body  { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .mp-tl-name  { font-size: 11.5px; font-weight: 600; color: #ccc; }
  .mp-tl-detail{ font-size: 10px; color: #555; line-height: 1.4; }
  .mp-tl-date  { font-size: 9px; font-weight: 600; padding: 2px 8px; border-radius: 20px; background: rgba(255,255,255,0.06); color: #555; flex-shrink: 0; }

  /* Stat panel — matches ud-card style */
  .mp-stat-panel {
    flex: 1; background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    min-width: 0; box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mp-sp-head {
    background: #1a1a1a; padding: 13px 20px;
    display: flex; align-items: center; gap: 8px;
  }
  .mp-sp-head .mi { font-size: 16px; color: #e07a5f; }
  .mp-sp-title { font-size: 12.5px; font-weight: 700; color: #fff; }
  .mp-sp-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
  .mp-sp-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mp-sp-block { background: #f7f7f5; border: 1px solid #eeeeec; border-radius: 13px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
  .mp-sp-block.accent { background: #1a1a1a; border-color: #1a1a1a; }
  .mp-sp-label { font-size: 9.5px; font-weight: 500; color: #aaa; }
  .mp-sp-block.accent .mp-sp-label { color: #555; }
  .mp-sp-val   { font-size: 20px; font-weight: 800; color: #e07a5f; letter-spacing: -0.3px; }
  .mp-sp-block.accent .mp-sp-val { color: #e07a5f; }
  .mp-sp-sub   { font-size: 9.5px; font-weight: 500; color: #bbb; }
  .mp-sp-block.accent .mp-sp-sub { color: #444; }
  .mp-sp-divider { height: 1.5px; background: #eeeeec; }
  .mp-sp-bar-rows { display: flex; flex-direction: column; gap: 6px; }
  .mp-sp-bar-row  { display: flex; align-items: center; gap: 8px; }
  .mp-sp-bar-name { font-size: 10px; font-weight: 500; color: #666; width: 68px; flex-shrink: 0; }
  .mp-sp-bar-bg   { flex: 1; height: 5px; background: #eeeeec; border-radius: 99px; overflow: hidden; }
  .mp-sp-bar-fill { height: 100%; border-radius: 99px; background: #e07a5f; }
  .mp-sp-bar-pct  { font-size: 9.5px; font-weight: 600; color: #bbb; width: 26px; text-align: right; flex-shrink: 0; }

  /* ══════════════════════════════════════════════════
     PROPERTY DETAIL CSS — UserDashboard Design System
  ══════════════════════════════════════════════════ */
  .pd-main { display: flex; flex-direction: column; gap: 16px; }
  .pd-topbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; flex-shrink: 0; }
  .pd-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; color: #aaa; }
  .pd-bc-link { cursor: pointer; transition: color 0.15s; color: #aaa; }
  .pd-bc-link:hover { color: #1a1a1a; }
  .pd-bc-sep { color: #ccc; }
  .pd-bc-here { color: #e07a5f; font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 600; }
  .pd-topbar-right { display: flex; align-items: center; gap: 8px; }
  .pd-back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 7px 14px; font-family: 'Poppins', sans-serif;
    font-size: 11.5px; font-weight: 600; color: #555; cursor: pointer;
    transition: background 0.15s, color 0.15s; white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .pd-back-btn .material-icons-sharp { font-size: 14px; }
  .pd-back-btn:hover { background: #f5f5f3; color: #111; border-color: #ccc; }

  /* Title zone — matches ud-hero */
  .pd-title-zone {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    animation: fadeUp 0.4s ease both;
  }
  .pd-title-inner {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    padding: 20px 24px; border-bottom: 1.5px solid #f0f0f0;
  }
  .pd-title-left { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .pd-title-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(224,122,95,0.08); border: 1.5px solid rgba(224,122,95,0.25);
    border-radius: 20px; padding: 2px 10px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.1em; color: #e07a5f; width: fit-content;
  }
  .pd-title-eyebrow .material-icons-sharp { font-size: 12px; }
  .pd-title-id { font-family: 'DM Mono', monospace; font-size: 10.5px; color: #e07a5f; font-weight: 500; }
  .pd-title-main { font-size: clamp(1.2rem, 3vw, 1.6rem); font-weight: 800; letter-spacing: -0.4px; color: #1a1a1a; line-height: 1.1; }
  .pd-title-main span { color: #e07a5f; }
  .pd-title-addr { font-size: 12px; color: #999; font-weight: 500; line-height: 1.4; }
  .pd-title-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
  .pd-title-status { border-radius: 20px; padding: 4px 14px; font-size: 11px; font-weight: 700; border: none; }
  .pd-title-value { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; line-height: 1; }
  .pd-title-value-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; color: #aaa; }

  /* Status strip — matches ud-stats-strip */
  .pd-status-strip {
    display: flex; align-items: center; gap: 8px; padding: 10px 24px;
    font-size: 12px; font-weight: 600; background: #f9f9f7;
  }
  .pd-status-strip .material-icons-sharp { font-size: 15px; flex-shrink: 0; }
  .pd-strip-clear { color: #e07a5f; }
  .pd-strip-dispute { color: #991b1b; }

  .pd-section-title { font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; color: #aaa; margin-bottom: 10px; margin-top: 18px; }
  .pd-section-title:first-of-type { margin-top: 0; }

  .pd-layout { display: grid; grid-template-columns: 1fr 280px; gap: 16px; align-items: start; }
  .pd-sidebar { display: flex; flex-direction: column; gap: 16px; }

  /* Zone — matches ud-card */
  .pd-zone {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    padding: 16px; display: flex; flex-direction: column; gap: 12px;
    animation: fadeUp 0.4s ease 0.08s both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .pd-zone + .pd-zone { margin-top: 16px; }
  .pd-zone-head {
    background: #1a1a1a; margin: -16px -16px 0; padding: 13px 16px; border-radius: 18px 18px 0 0;
    display: flex; align-items: center; gap: 8px; margin-bottom: 14px;
  }
  .pd-zone-head .mi { font-size: 16px; color: #e07a5f; }
  .pd-zone-head-title { font-size: 12.5px; font-weight: 700; color: #fff; }

  .pd-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .pd-info-cell {
    background: #f7f7f5; border: 1.5px solid #eeeeec; border-radius: 14px;
    padding: 10px 12px; display: flex; flex-direction: column; gap: 3px;
    transition: border-color 0.15s;
  }
  .pd-info-cell:hover { border-color: #e0e0e0; }
  .pd-info-lbl { font-size: 9px; font-weight: 800; letter-spacing: 0.08em; color: #bbb; }
  .pd-info-val { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .pd-info-val-status { font-size: 12px; font-weight: 800; }
  .pd-info-cell-wide { grid-column: 1/-1; }

  /* Owner card — matches ud-chain header/body style */
  .pd-owner-card {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    overflow: hidden; animation: fadeUp 0.4s ease 0.1s both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .pd-owner-head { background: #1a1a1a; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; }
  .pd-owner-head-lbl { font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; color: rgba(255,255,255,0.45); }
  .pd-owner-verified {
    display: inline-flex; align-items: center; gap: 3px;
    background: rgba(224,122,95,0.2); border-radius: 20px;
    padding: 2px 9px; font-size: 9px; font-weight: 800; color: #e07a5f;
  }
  .pd-owner-verified .material-icons-sharp { font-size: 11px; }
  .pd-owner-body { padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
  .pd-owner-avatar {
    width: 42px; height: 42px; border-radius: 12px;
    background: linear-gradient(135deg, #e07a5f, #c05030);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(224,122,95,0.15);
  }
  .pd-owner-name { font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px; }
  .pd-owner-since { font-size: 11px; color: #999; font-weight: 500; margin-top: 2px; }
  .pd-owner-tag {
    margin-left: auto; display: inline-flex; align-items: center; gap: 3px;
    background: rgba(224,122,95,0.1); border-radius: 20px;
    padding: 3px 10px; font-size: 10px; font-weight: 700; color: #e07a5f; flex-shrink: 0;
  }

  /* Blockchain card — same as ud-chain */
  .pd-chain-card {
    background: linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 60%, #1a1a1a 100%);
    border: 1.5px solid rgba(255,255,255,0.08); border-radius: 20px;
    padding: 14px 16px; animation: fadeUp 0.4s ease 0.12s both;
    position: relative; overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .pd-chain-card::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(224,122,95,0.08) 1px, transparent 1px);
    background-size: 24px 24px; pointer-events: none;
  }
  .pd-chain-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; position: relative; z-index: 1; }
  .pd-chain-title { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px; }
  .pd-chain-title .mi { font-size: 14px; color: #e07a5f; }
  .pd-chain-live { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; color: #e07a5f; }
  .pd-chain-dot { width: 6px; height: 6px; border-radius: 50%; background: #e07a5f; box-shadow: 0 0 0 3px rgba(224,122,95,0.2); animation: pulse 2s ease infinite; flex-shrink: 0; }
  .pd-chain-rows { display: flex; flex-direction: column; gap: 8px; position: relative; z-index: 1; }
  .pd-chain-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .pd-chain-row:last-child { border-bottom: none; }
  .pd-chain-label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; }
  .pd-chain-val { font-family: 'DM Mono', monospace; font-size: 10.5px; color: rgba(255,255,255,0.5); font-weight: 500; }
  .pd-chain-val-green { font-size: 11px; font-weight: 700; color: #e07a5f; }

  /* Actions card */
  .pd-actions-card {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    overflow: hidden; animation: fadeUp 0.4s ease 0.14s both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .pd-actions-head { background: #1a1a1a; padding: 10px 16px; }
  .pd-actions-head-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: 0.08em; color: rgba(255,255,255,0.4); }
  .pd-actions-body { padding: 12px; display: flex; flex-direction: column; gap: 7px; }
  .pd-action-btn {
    width: 100%; padding: 10px 14px; border-radius: 10px;
    font-size: 12px; font-weight: 600; cursor: pointer;
    font-family: 'Poppins', sans-serif; display: flex; align-items: center; gap: 8px;
    transition: all 0.15s; border: 1.5px solid transparent;
  }
  .pd-action-btn .material-icons-sharp { font-size: 15px; flex-shrink: 0; }
  .pd-btn-primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .pd-btn-primary:hover { background: #e07a5f; border-color: #e07a5f; }
  .pd-btn-outline { background: #fff; color: #555; border-color: #e0e0e0; }
  .pd-btn-outline:hover { background: #f5f5f3; color: #111; border-color: #ccc; }
  .pd-btn-danger { background: rgba(220,38,38,0.06); color: #991b1b; border-color: rgba(220,38,38,0.2); }
  .pd-btn-danger:hover { background: rgba(220,38,38,0.12); }
  .pd-btn-purple { background: rgba(224,122,95,0.08); color: #e07a5f; border-color: rgba(224,122,95,0.2); }
  .pd-btn-purple:hover { background: rgba(224,122,95,0.15); }

  /* Timeline section */
  .pd-timeline-section {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    overflow: hidden; animation: fadeUp 0.4s ease 0.16s both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .pd-timeline-header {
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px;
  }
  .pd-timeline-tag {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .pd-timeline-title {
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
    display: flex; align-items: center; gap: 10px;
  }
  .pd-timeline-title .mi { font-size: 17px; color: #e07a5f; }
  .pd-timeline-sub { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; }
  .pd-timeline-body { padding: 16px 20px; }

  .pd-tl-list { display: flex; flex-direction: column; }
  .pd-tl-item { display: flex; gap: 12px; }
  .pd-tl-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .pd-tl-dot { width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; margin-top: 4px; background: #e07a5f; }
  .pd-tl-line { flex: 1; width: 2px; background: #eeeeec; border-radius: 99px; margin: 4px 0; min-height: 16px; }
  .pd-tl-block {
    flex: 1; border-radius: 14px; padding: 12px 14px; margin-bottom: 8px;
    background: #f7f7f5; border: 1.5px solid #eeeeec; transition: border-color 0.15s;
  }
  .pd-tl-block:hover { border-color: #e07a5f; }
  .pd-tl-block-active { background: rgba(224,122,95,0.05); border-color: rgba(224,122,95,0.3); }
  .pd-tl-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .pd-tl-event { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .pd-tl-badge { border-radius: 8px; padding: 2px 9px; font-size: 9px; font-weight: 800; background: rgba(224,122,95,0.12); color: #e07a5f; }
  .pd-tl-parties { font-size: 11px; color: #999; margin-bottom: 5px; }
  .pd-tl-bottom { display: flex; justify-content: space-between; align-items: center; }
  .pd-tl-hash { font-family: 'DM Mono', monospace; font-size: 9.5px; color: #e07a5f; }
  .pd-tl-date { font-size: 10px; font-weight: 600; color: #bbb; }

  /* ══ CERTIFICATES SECTION ══ */
  .pd-cert-section {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    overflow: hidden; animation: fadeUp 0.4s ease 0.18s both;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .pd-cert-header {
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px;
  }
  .pd-cert-header-left { display: flex; align-items: center; gap: 10px; }
  .pd-cert-title {
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
    display: flex; align-items: center; gap: 10px;
  }
  .pd-cert-title .mi { font-size: 17px; color: #e07a5f; }
  .pd-cert-title span { color: #e07a5f; }
  .pd-cert-count-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .pd-cert-preview-live {
    display: flex; align-items: center; gap: 5px;
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.09em; color: #e07a5f;
  }
  .pd-cert-preview-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #e07a5f; animation: pulse 2s infinite;
  }

  .pd-cert-body { display: flex; gap: 0; }
  .pd-cert-types { flex: 1; display: flex; flex-direction: column; gap: 0; border-right: 1.5px solid #f0f0f0; }
  .pd-cert-type-row {
    display: flex; align-items: center; gap: 12px; padding: 13px 16px;
    cursor: pointer; border-bottom: 1.5px solid #f5f5f3;
    transition: background 0.15s; position: relative;
  }
  .pd-cert-type-row:last-of-type { border-bottom: none; }
  .pd-cert-type-row:hover { background: #fafaf8; }
  .pd-cert-type-row.selected { background: #1a1a1a; }
  .pd-cert-type-row.selected::after {
    content: ''; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 50%; border-radius: 3px 0 0 3px;
    background: #e07a5f;
  }
  .pd-cert-badge {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(224,122,95,0.08); transition: background 0.15s;
  }
  .pd-cert-badge .mi { font-size: 19px; color: #e07a5f; transition: color 0.15s; }
  .pd-cert-type-row.selected .pd-cert-badge { background: rgba(224,122,95,0.2); }
  .pd-cert-type-row.selected .pd-cert-badge .mi { color: #e07a5f; }
  .pd-cert-type-body { flex: 1; min-width: 0; }
  .pd-cert-type-short { font-family: 'DM Mono', monospace; font-size: 8.5px; color: #bbb; letter-spacing: 0.08em; margin-bottom: 1px; }
  .pd-cert-type-row.selected .pd-cert-type-short { color: rgba(255,255,255,0.3); }
  .pd-cert-type-name { font-size: 12px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .pd-cert-type-row.selected .pd-cert-type-name { color: #fff; }
  .pd-cert-type-desc { font-size: 9.5px; font-weight: 500; color: #bbb; line-height: 1.4; margin-top: 1px; }
  .pd-cert-type-row.selected .pd-cert-type-desc { color: rgba(255,255,255,0.3); }

  .pd-cert-past {
    border-top: 1.5px solid #f0f0f0;
    padding: 12px 16px 14px;
    background: #f9f9f7;
  }
  .pd-cert-past-title { font-size: 9px; font-weight: 800; letter-spacing: 0.09em; color: #bbb; text-transform: uppercase; margin-bottom: 8px; }
  .pd-cert-past-list { display: flex; flex-direction: column; gap: 5px; }
  .pd-cert-past-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px;
    background: #fff; border: 1.5px solid #eeeeec; border-radius: 11px;
    transition: background 0.15s, border-color 0.15s;
  }
  .pd-cert-past-row:hover { background: #fafaf8; border-color: #e07a5f; }
  .pd-cert-past-icon { width: 24px; height: 24px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(224,122,95,0.1); }
  .pd-cert-past-icon .mi { font-size: 13px; color: #e07a5f; }
  .pd-cert-past-body { flex: 1; min-width: 0; }
  .pd-cert-past-name { font-size: 10.5px; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pd-cert-past-date { font-size: 8.5px; font-weight: 600; color: #bbb; font-family: 'DM Mono', monospace; margin-top: 1px; }
  .pd-cert-past-dl {
    background: #1a1a1a; color: #fff; border: none; border-radius: 7px;
    padding: 4px 10px; font-family: 'Poppins', sans-serif;
    font-size: 9.5px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 3px; transition: background 0.15s; flex-shrink: 0;
  }
  .pd-cert-past-dl:hover { background: #e07a5f; }
  .pd-cert-past-dl .mi { font-size: 11px; }

  .pd-cert-panel { width: 260px; flex-shrink: 0; display: flex; flex-direction: column; }
  .pd-cert-preview { background: linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 60%, #1a1a1a 100%); flex: 1; padding: 14px; display: flex; flex-direction: column; gap: 10px; position: relative; }
  .pd-cert-preview::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(224,122,95,0.06) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none;
  }
  .pd-cert-preview-placeholder { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; text-align: center; padding: 20px 0; position: relative; z-index: 1; }
  .pd-cert-preview-placeholder .mi { font-size: 28px; color: #2a2a2a; }
  .pd-cert-preview-placeholder-txt { font-size: 11px; color: #444; line-height: 1.6; }

  .pd-cert-preview-seal-row { display: flex; flex-direction: column; align-items: center; gap: 3px; padding-bottom: 10px; margin-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.07); text-align: center; position: relative; z-index: 1; }
  .pd-cert-preview-seal {
    width: 38px; height: 38px; border-radius: 50%;
    border: 2px solid rgba(224,122,95,0.3); background: rgba(224,122,95,0.1);
    display: flex; align-items: center; justify-content: center; margin-bottom: 2px;
  }
  .pd-cert-preview-seal .mi { font-size: 18px; color: #e07a5f; }
  .pd-cert-preview-gov { font-size: 7.5px; font-weight: 700; letter-spacing: 0.1em; color: #444; text-transform: uppercase; }
  .pd-cert-preview-name { font-size: 11px; font-weight: 800; color: #fff; letter-spacing: -0.2px; }

  .pd-cert-preview-rows { display: flex; flex-direction: column; gap: 0; position: relative; z-index: 1; }
  .pd-cert-preview-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .pd-cert-preview-row:last-child { border-bottom: none; }
  .pd-cert-preview-lbl { font-size: 9px; font-weight: 500; color: #555; }
  .pd-cert-preview-val { font-family: 'DM Mono', monospace; font-size: 9px; color: #ccc; font-weight: 500; }
  .pd-cert-preview-val.green { color: #e07a5f; font-weight: 700; }
  .pd-cert-preview-val.amber { color: #f59e0b; font-weight: 700; }

  .pd-cert-preview-hash { background: rgba(255,255,255,0.03); border-radius: 10px; padding: 8px 10px; border: 1px solid rgba(255,255,255,0.06); position: relative; z-index: 1; }
  .pd-cert-preview-hash-lbl { font-size: 8px; font-weight: 700; color: #444; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
  .pd-cert-preview-hash-val { font-family: 'DM Mono', monospace; font-size: 9px; color: #e07a5f; word-break: break-all; }

  .pd-cert-gen-btn {
    width: 100%; padding: 14px; border: none;
    font-family: 'Poppins', sans-serif; font-size: 12.5px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.18s; background: #e07a5f; color: #fff;
  }
  .pd-cert-gen-btn:hover:not(:disabled) { filter: brightness(1.1); }
  .pd-cert-gen-btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .pd-cert-gen-btn .mi { font-size: 16px; }

  .pd-cert-spinner { width: 13px; height: 13px; border: 2.5px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

  /* ══ ADD PROPERTY MODAL — UserDashboard Design ══ */
  .modal-overlay {
    position: fixed; top: 60px; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.45); backdrop-filter: blur(5px);
    z-index: 999; display: flex; align-items: center; justify-content: center;
    padding: 16px; animation: fadeIn 0.2s ease;
    font-family: 'Poppins', sans-serif;
  }

  .modal-card {
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 24px;
    width: 100%; max-width: 580px;
    max-height: calc(100vh - 60px - 32px); overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: slideUp 0.25s ease;
    scrollbar-width: none; font-family: 'Poppins', sans-serif;
  }
  .modal-card::-webkit-scrollbar { display: none; }

  .modal-header {
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-radius: 22px 22px 0 0;
  }
  .modal-header-left { display: flex; align-items: center; gap: 10px; }
  .modal-header-icon {
    width: 38px; height: 38px; border-radius: 12px;
    background: rgba(224,122,95,0.15);
    display: flex; align-items: center; justify-content: center;
  }
  .modal-header-icon .mi { font-size: 19px; color: #e07a5f; }
  .modal-title { font-size: 15px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
  .modal-title span { color: #e07a5f; }
  .modal-subtitle { font-size: 10.5px; font-weight: 500; color: rgba(255,255,255,0.35); margin-top: 1px; }
  .modal-close-btn {
    width: 32px; height: 32px; border-radius: 10px;
    border: 1.5px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06);
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #888; transition: background 0.15s, color 0.15s;
  }
  .modal-close-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .modal-close-btn .mi { font-size: 17px; }

  .modal-body { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 14px; }

  .modal-type-group { display: flex; flex-direction: column; gap: 8px; }
  .modal-field-label { font-size: 10.5px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.06em; }
  .modal-type-btns { display: flex; gap: 7px; }
  .modal-type-btn {
    flex: 1; padding: 10px 8px; border-radius: 10px; border: 1.5px solid #e0e0e0;
    background: #f5f5f3; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 600; color: #888;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: all 0.15s;
  }
  .modal-type-btn .mi { font-size: 15px; }
  .modal-type-btn:hover { border-color: #e07a5f; color: #e07a5f; background: rgba(224,122,95,0.04); }
  .modal-type-btn.active-res { background: rgba(224,122,95,0.08); border-color: #e07a5f; color: #e07a5f; }
  .modal-type-btn.active-agr { background: rgba(224,122,95,0.08); border-color: #e07a5f; color: #e07a5f; }
  .modal-type-btn.active-com { background: #1a1a1a; border-color: #1a1a1a; color: #fff; }

  .modal-field-group { display: flex; flex-direction: column; gap: 6px; }
  .modal-row { display: flex; gap: 10px; }
  .modal-row .modal-field-group { flex: 1; }

  .modal-input-wrap { position: relative; }
  .modal-input-icon {
    font-family: 'Material Icons Sharp'; font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center; user-select: none;
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    font-size: 18px; color: #ccc; pointer-events: none;
  }
  .modal-input {
    width: 100%; padding: 11px 14px 11px 36px;
    border: 1.5px solid #e0e0e0; border-radius: 12px;
    background: #f9f9f7;
    font-size: 12px; font-family: 'Poppins', sans-serif;
    color: #1a1a1a; outline: none;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  }
  .modal-input:focus {
    border-color: #e07a5f; background: #fff;
    box-shadow: 0 0 0 3px rgba(224,122,95,0.12);
  }
  .modal-input::placeholder { color: #ccc; }

  .modal-divider { height: 1.5px; background: #f0f0ee; margin: 2px 0; }

  .modal-footer { display: flex; gap: 8px; padding: 0 20px 20px; }
  .modal-btn-cancel {
    flex: 1; padding: 12px; border: 1.5px solid #e0e0e0; border-radius: 12px;
    background: #f5f5f3; color: #888;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: background 0.15s, color 0.15s;
  }
  .modal-btn-cancel:hover { background: #eee; color: #1a1a1a; }
  .modal-btn-save {
    flex: 2; padding: 12px; border: none; border-radius: 12px;
    background: #e07a5f; color: #fff;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: background 0.15s, transform 0.15s;
    box-shadow: 0 3px 12px rgba(224,122,95,0.3);
  }
  .modal-btn-save .mi { font-size: 15px; }
  .modal-btn-save:hover:not(:disabled) { background: #c05030; transform: translateY(-1px); }
  .modal-btn-save:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .modal-spinner {
    width: 14px; height: 14px;
    border: 2px solid currentColor; border-top-color: transparent;
    border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }

  /* ── View btn (matches ud-table view-btn) ── */
  .view-btn {
    background: none; border: 1.5px solid #e0e0e0; border-radius: 9px;
    padding: 4px 12px; font-family: 'Poppins', sans-serif;
    font-size: 10.5px; font-weight: 600; cursor: pointer; color: #444;
    display: flex; align-items: center; gap: 4px; transition: all 0.14s;
  }
  .view-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
  .view-btn .mi { font-size: 12px; }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 1100px) {
    .mp-stats { grid-template-columns: repeat(2, 1fr); }
    .mp-stat:nth-child(2) { border-right: none; }
    .mp-stat:nth-child(1), .mp-stat:nth-child(2) { border-bottom: 1.5px solid #eeeeec; }
    .mp-grid { grid-template-columns: 1fr 1fr; }
    .mp-bottom { flex-direction: column; }
    .pd-layout { grid-template-columns: 1fr; }
    .pd-title-right { display: none; }
    .pd-info-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .mp-main { padding: 10px 14px 80px; gap: 12px; }
    .mp-topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
    .mp-topbar-right { width: 100%; }
    .mp-search-wrap { flex: 1; }
    .mp-search-wrap input { width: 100%; min-width: 0; }
    .mp-grid { grid-template-columns: 1fr; }
    .mp-filters { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; }
    .mp-filters::-webkit-scrollbar { display: none; }
    .filter-tab { flex-shrink: 0; }
    .mp-sp-grid { grid-template-columns: 1fr 1fr; }
    .pd-info-grid { grid-template-columns: 1fr; }
    .modal-row { flex-direction: column; gap: 14px; }
    .pd-cert-body { flex-direction: column; }
    .pd-cert-types { border-right: none; border-bottom: 1.5px solid #f0f0f0; }
    .pd-cert-panel { width: 100%; }
  }
  @media (max-width: 900px) { .pd-layout { grid-template-columns: 1fr; } }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MIcon = ({ name, style }) => (
  <span className="mi" style={style}>{name}</span>
);

/* ══════════════════════════════════════════════════
   CERTIFICATES SECTION
══════════════════════════════════════════════════ */
function CertificatesSection({ property, user }) {
  const [selectedCert, setCert]      = useState(null);
  const [generating,   setGen]       = useState(false);
  const [generated,    setGenerated] = useState(false);

  const cert = CERT_TYPES.find(c => c.id === selectedCert);

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
          <div className="pd-cert-title">
            <MIcon name="workspace_premium" /> Property <span>Certificates</span>
          </div>
          <div className="pd-cert-count-pill">{CERT_TYPES.length} types</div>
        </div>
        {generated && (
          <div className="pd-cert-preview-live">
            <span className="pd-cert-preview-live-dot" />
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
                  <div className="pd-cert-past-icon">
                    <MIcon name={pc.icon} />
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

        {/* Right panel */}
        <div className="pd-cert-panel">
          <div className="pd-cert-preview">
            {cert ? (
              <>
                <div className="pd-cert-preview-seal-row">
                  <div className="pd-cert-preview-seal">
                    <MIcon name={cert.icon} />
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
              background: generated ? "#e07a5f" : cert ? "#e07a5f" : "#eeeeec",
              color:      generated ? "#fff"    : cert ? "#fff"    : "#aaa",
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
      String(p.id).toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q)      ||
      p.district.toLowerCase().includes(q)   ||
      p.surveyNo.toLowerCase().includes(q)   ||
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
      icon:   meta.icon,
      name:   p.title,
      detail: `${p.status} · ${p.area} · ${p.district}`,
      date:   p.registeredOn,
    };
  });

  /* ── Type distribution bars ── */
  const typeCounts = { Residential: residential, Commercial: commercial, Agricultural: allProperties.filter(p => p.type === "Agricultural").length };
  const maxCount   = Math.max(...Object.values(typeCounts), 1);
  const typeBars   = Object.entries(typeCounts).map(([name, count]) => ({
    name, pct: Math.round((count / maxCount) * 100),
  }));

  /* ── STAT data matching ud-stat-strip style ── */
  const STATS = [
    { label: "Total Properties", value: allProperties.length, badgeBg: "rgba(224,122,95,0.1)", badgeColor: "#e07a5f", badgeText: "registered" },
    { label: "Commercial",       value: commercial,           badgeBg: "rgba(224,122,95,0.1)", badgeColor: "#e07a5f", badgeText: "properties" },
    { label: "Residential",      value: residential,          badgeBg: "rgba(224,122,95,0.1)", badgeColor: "#e07a5f", badgeText: "properties" },
    { label: "Clear Title",      value: clearTitle,           badgeBg: disputed > 0 ? "rgba(220,38,38,0.1)" : "rgba(224,122,95,0.1)", badgeColor: disputed > 0 ? "#991b1b" : "#e07a5f", badgeText: disputed > 0 ? `${disputed} disputed` : "no disputes", danger: disputed > 0 },
  ];

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
                  background: "#e07a5f", color: "#fff",
                  padding: "9px 20px", borderRadius: "10px",
                  border: "none", fontFamily: "'Poppins', sans-serif",
                  fontWeight: "700", fontSize: "12px",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                  transition: "background 0.15s, transform 0.15s",
                  boxShadow: "0 3px 12px rgba(224,122,95,0.3)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c05030"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#e07a5f"; e.currentTarget.style.transform = "none"; }}
              >
                <MIcon name="add_home" /> Add Property
              </button>
            </div>
          </div>

          {/* ══ STAT STRIP (Only show when not in detail view) ══ */}
          {!detailView && (
            <div className="mp-stats">
              {STATS.map((s, i) => (
                <div key={i} className="mp-stat">
                  <div className="mp-stat-label">{s.label}</div>
                  <div className={`mp-stat-value${s.danger ? " danger" : ""}`}>{s.value}</div>
                  <div className="mp-stat-badge" style={{ background: s.badgeBg, color: s.badgeColor }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.badgeColor, display: "inline-block" }} />
                    {s.badgeText}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ CONTENT ══ */}
          {detailView ? (
            /* ── DETAIL VIEW ── */
            <div>
              <div className="pd-main" style={{ padding: "4px 0" }}>

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
                  <div className="pd-title-inner">
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
                      <div className="pd-title-status" style={{ background: "rgba(224,122,95,0.12)", color: "#e07a5f" }}>
                        {detailView.status}
                      </div>
                      <div className="pd-title-value">{detailView.marketValue}</div>
                      <div className="pd-title-value-lbl">ESTIMATED MARKET VALUE</div>
                    </div>
                  </div>

                  {/* Status strip inside hero card */}
                  <div className={`pd-status-strip ${detailView.disputeActive ? "pd-strip-dispute" : "pd-strip-clear"}`}>
                    <span className="material-icons-sharp">
                      {detailView.disputeActive ? "warning" : "verified"}
                    </span>
                    {detailView.disputeActive
                      ? "Active dispute on this property — resolution in progress"
                      : "No active disputes · Record integrity verified on-chain"
                    }
                  </div>
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
                            <div className="pd-info-lbl">{row.label}</div>
                            <div className={row.isStatus ? "pd-info-val-status" : "pd-info-val"}
                              style={row.isStatus ? {
                                color: detailView.disputeActive ? "#991b1b" : detailView.encumbrance ? "#b07a00" : "#e07a5f"
                              } : {}}>
                              {row.val || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="pd-section-title">OWNERSHIP HISTORY</div>
                    <div className="pd-timeline-section">
                      <div className="pd-timeline-header">
                        <div className="pd-timeline-title">
                          <MIcon name="timeline" /> Ownership History
                        </div>
                        <div className="pd-timeline-tag">{(detailView.timeline || []).length} Events</div>
                      </div>
                      <div className="pd-timeline-body">
                        {(detailView.timeline || []).length > 0 ? (
                          <div className="pd-tl-list">
                            {(detailView.timeline || []).map((tl, i) => {
                              const isLast = i === (detailView.timeline.length - 1);
                              const isFirst = i === 0;
                              return (
                                <div key={i} className="pd-tl-item">
                                  <div className="pd-tl-spine">
                                    <div className="pd-tl-dot" style={{ background: TIMELINE_COLORS[tl.event] || "#e07a5f" }} />
                                    {!isLast && <div className="pd-tl-line" />}
                                  </div>
                                  <div className={`pd-tl-block${isFirst ? " pd-tl-block-active" : ""}`}>
                                    <div className="pd-tl-top">
                                      <div className="pd-tl-event">{tl.event}</div>
                                      <div className="pd-tl-badge">{tl.type || tl.event}</div>
                                    </div>
                                    {tl.parties && <div className="pd-tl-parties">{tl.parties}</div>}
                                    <div className="pd-tl-bottom">
                                      <div className="pd-tl-hash">{tl.hash ? tl.hash.slice(0, 20) + "…" : "0x—"}</div>
                                      <div className="pd-tl-date">{tl.date}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mp-empty">
                            <MIcon name="timeline" /> No ownership history available.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Certificates */}
                    <div className="pd-section-title">CERTIFICATES</div>
                    <CertificatesSection property={detailView} user={user} />

                  </div>

                  {/* SIDEBAR */}
                  <div className="pd-sidebar">

                    {/* Blockchain card */}
                    <div className="pd-chain-card">
                      <div className="pd-chain-head">
                        <div className="pd-chain-title">
                          <MIcon name="hub" /> Blockchain Record
                        </div>
                        <span className="pd-chain-live"><span className="pd-chain-dot" /> LIVE</span>
                      </div>
                      <div className="pd-chain-rows">
                        {[
                          { key: "Block No.",  val: detailView.blockNumber || "#1,847,392" },
                          { key: "Hash",       val: detailView.hash ? detailView.hash.slice(0,10) + "…" : "0x—" },
                          { key: "Network",    val: "TN State Registry" },
                          { key: "Integrity",  val: "✓ Verified", ok: true },
                        ].map((r, i) => (
                          <div className="pd-chain-row" key={i}>
                            <span className="pd-chain-label">{r.key}</span>
                            <span className={r.ok ? "pd-chain-val-green" : "pd-chain-val"}>{r.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions card */}
                    <div className="pd-actions-card">
                      <div className="pd-actions-head">
                        <div className="pd-actions-head-lbl">QUICK ACTIONS</div>
                      </div>
                      <div className="pd-actions-body">
                        <button className="pd-action-btn pd-btn-primary" onClick={() => navigate("/user/transfers")}>
                          <span className="material-icons-sharp">swap_horiz</span>
                          Initiate Transfer
                        </button>
                        <button className="pd-action-btn pd-btn-purple">
                          <span className="material-icons-sharp">gavel</span>
                          File Mutation
                        </button>
                        <button className="pd-action-btn pd-btn-outline">
                          <span className="material-icons-sharp">download</span>
                          Export Details
                        </button>
                        {detailView.disputeActive && (
                          <button className="pd-action-btn pd-btn-danger">
                            <span className="material-icons-sharp">report</span>
                            View Dispute
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          ) : (
            /* ── LIST VIEW ── */
            <>
              {/* Filter bar */}
              <div className="mp-filters">
                <span className="mp-filters-label">Filter</span>
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`filter-tab${activeFilter === f ? " active" : ""}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Property grid */}
              <div className="mp-section-zone">
                <div className="mp-section-header">
                  <div className="mp-section-title">
                    <MIcon name="home_work" /> Properties
                    <span className="mp-count-pill">{filtered.length} Records</span>
                  </div>
                </div>
                <div className="mp-section-body">
                  {loadingProps ? (
                    <div className="mp-empty"><MIcon name="hourglass_empty" /> Loading properties…</div>
                  ) : filtered.length === 0 ? (
                    <div className="mp-empty"><MIcon name="home_work" /> No properties found.</div>
                  ) : (
                    <div className="mp-grid">
                      {filtered.map((p, idx) => {
                        const meta     = TYPE_META[p.type] || TYPE_META.Residential;
                        const stCls    = p.disputeActive ? "status-done" : p.encumbrance ? "status-progress" : "status-active";
                        const dotCls   = p.disputeActive ? "pill-dot-done" : p.encumbrance ? "pill-dot-progress" : "pill-dot-active";
                        const stLabel  = p.disputeActive ? "Disputed" : p.encumbrance ? "Encumbered" : "Clear Title";

                        return (
                          <div
                            key={p.id}
                            className="mp-card"
                            style={{ animationDelay: `${idx * 0.04}s` }}
                            onClick={() => setDetailView(p)}
                          >
                            <div className="mp-card-header">
                              <div className="mp-icon-wrap">
                                <MIcon name={meta.icon} />
                              </div>
                              <div className={`mp-status-pill ${stCls}`}>
                                <span className={`pill-dot ${dotCls}`} />
                                {stLabel}
                              </div>
                            </div>

                            <div>
                              <div className="mp-card-id">{p.id}</div>
                              <div className="mp-card-title">{p.title}</div>
                              {p.district && <div className="mp-card-org">{p.district}, {p.state}</div>}
                              {p.address && <div className="mp-card-addr">{p.address}</div>}
                            </div>

                            <div className="mp-card-chips">
                              <div className="mp-chip">
                                <div className="mp-chip-label">Area</div>
                                <div className="mp-chip-value">{p.area || "—"}</div>
                              </div>
                              <div className="mp-chip accent">
                                <div className="mp-chip-label">Market Value</div>
                                <div className="mp-chip-value">{p.marketValue || "—"}</div>
                              </div>
                              <div className="mp-chip">
                                <div className="mp-chip-label">Survey No.</div>
                                <div className="mp-chip-value">{p.surveyNo || "—"}</div>
                              </div>
                              <div className="mp-chip">
                                <div className="mp-chip-label">Registered</div>
                                <div className="mp-chip-value">{p.registeredOn || "—"}</div>
                              </div>
                            </div>

                            <div className="mp-tags">
                              <span className="mp-tag">{p.type}</span>
                              {p.encumbrance && <span className="mp-tag" style={{ color: "#b07a00" }}>Encumbered</span>}
                              {p.disputeActive && <span className="mp-tag" style={{ color: "#991b1b" }}>Dispute Active</span>}
                            </div>

                            {p.disputeActive && (
                              <div className="mp-card-warning">
                                <MIcon name="warning" />
                                Active dispute — action required
                              </div>
                            )}

                            <div className="mp-card-footer">
                              <div className="mp-card-hash">
                                {p.hash ? p.hash.slice(0, 14) + "…" : "0x—"}
                              </div>
                              <div className="mp-card-cta">
                                View Details <MIcon name="arrow_forward" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ══ BOTTOM ROW ══ */}
              {allProperties.length > 0 && (
                <div className="mp-bottom">

                  {/* Timeline */}
                  <div className="mp-timeline">
                    <div className="mp-tl-title">
                      <MIcon name="history" /> Registration Timeline
                      <span className="mp-tl-live"><span className="mp-tl-live-dot" /> LIVE</span>
                    </div>
                    <div className="mp-tl-feed">
                      {timelineItems.slice(0, 5).map((item, i) => (
                        <div className="mp-tl-item" key={i}>
                          <div className="mp-tl-left">
                            <div className="mp-tl-icon">
                              <MIcon name={item.icon} />
                            </div>
                            {i < timelineItems.slice(0, 5).length - 1 && <div className="mp-tl-line" />}
                          </div>
                          <div className="mp-tl-body">
                            <div className="mp-tl-name">{item.name}</div>
                            <div className="mp-tl-detail">{item.detail}</div>
                          </div>
                          <div className="mp-tl-date">{item.date || "—"}</div>
                        </div>
                      ))}
                      {timelineItems.length === 0 && (
                        <div style={{ color: "#444", fontSize: "11px", padding: "8px 0" }}>No timeline data.</div>
                      )}
                    </div>
                  </div>

                  {/* Stats panel */}
                  <div className="mp-stat-panel">
                    <div className="mp-sp-head">
                      <MIcon name="bar_chart" />
                      <div className="mp-sp-title">Portfolio Overview</div>
                    </div>
                    <div className="mp-sp-body">
                      <div className="mp-sp-grid">
                        <div className="mp-sp-block accent">
                          <div className="mp-sp-label">Total Registered</div>
                          <div className="mp-sp-val">{allProperties.length}</div>
                          <div className="mp-sp-sub">properties</div>
                        </div>
                        <div className="mp-sp-block">
                          <div className="mp-sp-label">Clear Title</div>
                          <div className="mp-sp-val">{clearTitle}</div>
                          <div className="mp-sp-sub">no disputes</div>
                        </div>
                        <div className="mp-sp-block">
                          <div className="mp-sp-label">Residential</div>
                          <div className="mp-sp-val">{residential}</div>
                          <div className="mp-sp-sub">properties</div>
                        </div>
                        <div className="mp-sp-block">
                          <div className="mp-sp-label">Commercial</div>
                          <div className="mp-sp-val">{commercial}</div>
                          <div className="mp-sp-sub">properties</div>
                        </div>
                      </div>
                      <div className="mp-sp-divider" />
                      <div className="mp-sp-bar-rows">
                        {typeBars.map((b, i) => (
                          <div className="mp-sp-bar-row" key={i}>
                            <div className="mp-sp-bar-name">{b.name}</div>
                            <div className="mp-sp-bar-bg">
                              <div className="mp-sp-bar-fill" style={{ width: `${b.pct}%` }} />
                            </div>
                            <div className="mp-sp-bar-pct">{b.pct}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ══ ADD PROPERTY MODAL ══ */}
      {showAddModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="modal-card">

            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-header-icon">
                  <MIcon name="add_home" />
                </div>
                <div>
                  <div className="modal-title">Register <span>Property</span></div>
                  <div className="modal-subtitle">Add a new property to the state registry</div>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <MIcon name="close" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">

                <div className="modal-field-group">
                  <div className="modal-field-label">Title</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">title</span>
                    <input className="modal-input" required value={newProperty.title}
                      onChange={e => setNewProperty({ ...newProperty, title: e.target.value })}
                      placeholder='e.g. "Ancestral Home" or "Farm Land"' />
                  </div>
                </div>

                <div className="modal-type-group">
                  <div className="modal-field-label">Type</div>
                  <div className="modal-type-btns">
                    {[
                      { val: "Residential",  icon: "home",     cls: "active-res" },
                      { val: "Agricultural", icon: "grass",    cls: "active-agr" },
                      { val: "Commercial",   icon: "business", cls: "active-com" },
                    ].map(t => (
                      <button key={t.val} type="button"
                        className={`modal-type-btn${newProperty.type === t.val ? ` ${t.cls}` : ""}`}
                        onClick={() => setNewProperty({ ...newProperty, type: t.val })}>
                        <MIcon name={t.icon} /> {t.val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-field-group">
                  <div className="modal-field-label">Area</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">straighten</span>
                    <input className="modal-input" required value={newProperty.area}
                      onChange={e => setNewProperty({ ...newProperty, area: e.target.value })}
                      placeholder='e.g. "1500 sqft" or "2 Acres"' />
                  </div>
                </div>

                <div className="modal-field-group">
                  <div className="modal-field-label">Address</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">location_on</span>
                    <input className="modal-input" required value={newProperty.address}
                      onChange={e => setNewProperty({ ...newProperty, address: e.target.value })}
                      placeholder="Full street address or location description" />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-field-group">
                    <div className="modal-field-label">District</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">map</span>
                      <input className="modal-input" required value={newProperty.district}
                        onChange={e => setNewProperty({ ...newProperty, district: e.target.value })}
                        placeholder="e.g. Chennai" />
                    </div>
                  </div>
                  <div className="modal-field-group">
                    <div className="modal-field-label">State</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">flag</span>
                      <input className="modal-input" required value={newProperty.state}
                        onChange={e => setNewProperty({ ...newProperty, state: e.target.value })}
                        placeholder="e.g. Tamil Nadu" />
                    </div>
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-field-group">
                    <div className="modal-field-label">Pincode</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">pin</span>
                      <input className="modal-input" required value={newProperty.pincode}
                        onChange={e => setNewProperty({ ...newProperty, pincode: e.target.value })}
                        placeholder="6-digit postal code" />
                    </div>
                  </div>
                  <div className="modal-field-group">
                    <div className="modal-field-label">Survey No.</div>
                    <div className="modal-input-wrap">
                      <span className="mi modal-input-icon">tag</span>
                      <input className="modal-input" required value={newProperty.surveyNo}
                        onChange={e => setNewProperty({ ...newProperty, surveyNo: e.target.value })}
                        placeholder="Govt. survey / plot number" />
                    </div>
                  </div>
                </div>

                <div className="modal-divider" />

                <div className="modal-field-group">
                  <div className="modal-field-label">Market Value</div>
                  <div className="modal-input-wrap">
                    <span className="mi modal-input-icon">currency_rupee</span>
                    <input className="modal-input" required value={newProperty.marketValue}
                      onChange={e => setNewProperty({ ...newProperty, marketValue: e.target.value })}
                      placeholder='e.g. "₹ 45,00,000"' />
                  </div>
                </div>

              </div>

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