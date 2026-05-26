import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const STEPS = [
  { num: "01", label: "Select Property" },
  { num: "02", label: "Buyer Details"   },
  { num: "03", label: "Documents"       },
  { num: "04", label: "Review & Submit" },
];

const REQUIRED_DOCS = [
  { id: "sale_deed", label: "Sale Deed",                    required: true  },
  { id: "ec",        label: "Encumbrance Certificate (EC)", required: true  },
  { id: "aadhaar",   label: "Identity Proof (Aadhaar)",     required: true  },
  { id: "patta",     label: "Patta / Chitta",               required: false },
  { id: "noc",       label: "No Objection Certificate",     required: false },
];

const TYPE_META = {
  Residential:  { icon: "home",     iconBg: "#C8F135" },
  Agricultural: { icon: "grass",    iconBg: "#2EC4A0" },
  Commercial:   { icon: "business", iconBg: "#5B4FD4", dark: true },
};

const TABS = [
  { id: "initiate",  label: "Initiate Transfer",  icon: "add_circle_outline" },
  { id: "status",    label: "Transfer Status",     icon: "swap_horiz"         },
  { id: "incoming",  label: "Incoming Requests",   icon: "inbox"              },
];

/* ══════════════════════════════════════════════════
   COMBINED CSS
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
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0.25; }
  }

  /* ── Page root ── */
  .tr-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }

  /* ── Main wrapper ── */
  .tr-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 14px 32px;
    overflow-x: hidden;
    animation: fadeUp 0.35s ease both;
  }

  /* ══ TOP BAR ══ */
  .tr-topbar {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 10px; flex-shrink: 0;
  }
  .tr-heading {
    font-size: 18px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.4px;
  }
  .tr-heading span { color: #5B4FD4; }
  .tr-topbar-right { display: flex; align-items: center; gap: 8px; }
  .tr-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #f0f0f0; border-radius: 11px;
    padding: 6px 12px;
    font-size: 11px; font-weight: 500; color: #666;
  }
  .tr-meta-chip .mi { font-size: 13px; color: #aaa; }
  .tr-meta-chip.orange { background: rgba(240,160,48,0.12); color: #c07000; }
  .tr-meta-chip.orange .mi { color: #F0A030; }

  /* ══ TAB BAR ══ */
  .tr-tab-bar {
    display: flex;
    gap: 6px;
    background: rgba(240,240,240,0.6);
    border: 1.5px solid #e0e0e0;
    border-radius: 18px;
    padding: 6px;
    flex-shrink: 0;
  }
  .tr-tab {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    padding: 9px 12px;
    border: none; border-radius: 12px;
    font-family: 'Poppins', sans-serif;
    font-size: 11.5px; font-weight: 700;
    cursor: pointer;
    color: #999;
    background: transparent;
    transition: all 0.18s;
    white-space: nowrap;
    position: relative;
  }
  .tr-tab .mi { font-size: 15px; }
  .tr-tab:hover { color: #555; background: rgba(255,255,255,0.5); }
  .tr-tab.active {
    background: #1a1a1a;
    color: #fff;
    box-shadow: 0 2px 8px rgba(26,26,26,0.2);
  }
  .tr-tab.active .mi { color: #C8F135; }
  .tr-tab-badge {
    min-width: 16px; height: 16px;
    background: #F0A030;
    color: #fff;
    border-radius: 20px;
    font-size: 9px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px;
  }

  /* ══ SHARED ZONE ══ */
  .tr-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .tr-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 4px 8px 12px;
    border-bottom: 1px solid #e8e8e8;
    flex-shrink: 0;
  }
  .tr-zone-title-row { display: flex; align-items: center; gap: 10px; }
  .tr-zone-title {
    font-size: 14px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.3px;
  }
  .tr-zone-title span { color: #5B4FD4; }
  .tr-zone-pill {
    background: #1a1a1a; color: #fff;
    border-radius: 20px; padding: 2px 10px;
    font-size: 9.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .tr-zone-pill.orange { background: rgba(240,160,48,0.15); color: #c07000; }
  .tr-zone-pill.purple { background: rgba(91,79,212,0.1); color: #5B4FD4; }

  /* ══ STEP PROGRESS BAR ══ */
  .tr-progress-zone {
    background: rgba(240,240,240,0.4);
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 0;
    flex-shrink: 0;
    overflow: hidden;
  }
  .tr-step-item {
    display: flex; align-items: center; gap: 10px;
    flex: 1; position: relative;
  }
  .tr-step-connector {
    flex: 1; height: 2px; background: #e0e0e0;
    margin: 0 6px; transition: background 0.3s;
  }
  .tr-step-connector.done { background: #2EC4A0; }
  .tr-step-bubble {
    width: 32px; height: 32px;
    border-radius: 10px;
    border: 2px solid #e0e0e0;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 800;
    color: #bbb; background: #f0f0f0;
    flex-shrink: 0; transition: all 0.2s;
    position: relative; z-index: 1;
  }
  .tr-step-bubble.active {
    background: #1a1a1a; border-color: #1a1a1a; color: #fff;
    box-shadow: 0 2px 8px rgba(26,26,26,0.25);
  }
  .tr-step-bubble.done { background: #2EC4A0; border-color: #2EC4A0; color: #fff; }
  .tr-step-bubble .mi { font-size: 14px; }
  .tr-step-info { display: flex; flex-direction: column; gap: 1px; }
  .tr-step-num-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 700; color: #bbb; letter-spacing: 0.05em;
  }
  .tr-step-name { font-size: 11px; font-weight: 700; color: #999; white-space: nowrap; }
  .tr-step-name.active { color: #1a1a1a; }
  .tr-step-name.done   { color: #2EC4A0; }

  /* ══ PROPERTY LIST (step 1) ══ */
  .tr-prop-list { display: flex; flex-direction: column; gap: 10px; }
  .tr-prop-card {
    background: #f0f0f0; border-radius: 16px;
    padding: 14px 16px; display: flex; align-items: center; gap: 14px;
    cursor: pointer; border: 2px solid transparent;
    transition: all 0.18s; position: relative; overflow: hidden;
  }
  .tr-prop-card:hover { background: #e8e8e8; border-color: #d0d0d0; }
  .tr-prop-card.selected { background: #1a1a1a; border-color: #1a1a1a; }
  .tr-prop-card.selected .tr-prop-card-id,
  .tr-prop-card.selected .tr-prop-card-district { color: rgba(255,255,255,0.45); }
  .tr-prop-card.selected .tr-prop-card-title { color: #fff; }
  .tr-prop-card.selected .tr-prop-card-chip-label { color: rgba(255,255,255,0.4); }
  .tr-prop-card.selected .tr-prop-card-chip-val { color: rgba(255,255,255,0.85); }
  .tr-prop-card-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(circle at 85% 10%, rgba(200,241,53,0.15) 0%, transparent 50%);
  }
  .tr-prop-icon-wrap {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .tr-prop-icon-wrap .mi { font-size: 20px; }
  .tr-prop-card-body { flex: 1; min-width: 0; }
  .tr-prop-card-id {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px; font-weight: 500; color: #aaa; margin-bottom: 2px;
  }
  .tr-prop-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tr-prop-card-district { font-size: 11px; color: #888; margin-top: 2px; }
  .tr-prop-card-chips { display: flex; gap: 8px; margin-left: auto; }
  .tr-prop-card-chip {
    background: rgba(255,255,255,0.6); border-radius: 10px; padding: 6px 10px; text-align: center;
  }
  .tr-prop-card.selected .tr-prop-card-chip { background: rgba(255,255,255,0.08); }
  .tr-prop-card-chip-label { font-size: 9px; font-weight: 600; color: #aaa; }
  .tr-prop-card-chip-val   { font-size: 11px; font-weight: 800; color: #1a1a1a; }
  .tr-prop-check {
    width: 26px; height: 26px; border-radius: 8px;
    border: 2px solid #d8d8d8; background: #fff;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s;
  }
  .tr-prop-check .mi { font-size: 14px; color: #ddd; }
  .tr-prop-check.checked { background: #C8F135; border-color: #C8F135; }
  .tr-prop-check.checked .mi { color: #1a1a1a; }

  /* ══ FIELDS (step 2) ══ */
  .tr-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .tr-field { display: flex; flex-direction: column; gap: 6px; }
  .tr-field-full { grid-column: 1 / -1; }
  .tr-label {
    font-size: 10px; font-weight: 800;
    letter-spacing: 0.06em; color: #888; text-transform: uppercase;
  }
  .tr-input {
    background: #f0f0f0; border: 2px solid transparent;
    border-radius: 12px; padding: 10px 14px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500;
    color: #1a1a1a; outline: none; transition: all 0.18s;
  }
  .tr-input:focus { border-color: #5B4FD4; background: #fff; }
  .tr-input::placeholder { color: #bbb; }
  .tr-input.error { border-color: #e8533a; background: rgba(232,83,58,0.04); }
  .tr-hint { font-size: 10px; font-weight: 500; color: #aaa; }
  .tr-err-msg {
    font-size: 10.5px; font-weight: 700; color: #e8533a;
    display: flex; align-items: center; gap: 4px;
  }
  .tr-err-msg .mi { font-size: 13px; }

  /* ══ DOCUMENTS (step 3) ══ */
  .tr-doc-list { display: flex; flex-direction: column; gap: 8px; }
  .tr-doc-row {
    background: #f0f0f0; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    transition: all 0.18s; border: 2px solid transparent;
  }
  .tr-doc-row:hover { background: #e8e8e8; }
  .tr-doc-row.uploaded { background: rgba(46,196,160,0.08); border-color: rgba(46,196,160,0.3); }
  .tr-doc-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.7);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .tr-doc-icon .mi { font-size: 17px; color: #5B4FD4; }
  .tr-doc-row.uploaded .tr-doc-icon .mi { color: #2EC4A0; }
  .tr-doc-name { font-size: 12.5px; font-weight: 700; color: #1a1a1a; flex: 1; }
  .tr-doc-req-badge {
    font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px;
    background: #1a1a1a; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0;
  }
  .tr-doc-req-badge.optional { background: #f0f0f0; color: #aaa; border: 1px solid #e0e0e0; }
  .tr-doc-upload-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 10px;
    padding: 7px 14px; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s; flex-shrink: 0;
  }
  .tr-doc-upload-btn:hover { background: #2a2a2a; }
  .tr-doc-done-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 700; color: #2EC4A0; flex-shrink: 0;
  }
  .tr-doc-done-badge .mi { font-size: 16px; }

  /* ══ REVIEW (step 4) ══ */
  .tr-review-block { background: #f0f0f0; border-radius: 16px; overflow: hidden; }
  .tr-review-block-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-bottom: 1px solid #e8e8e8;
  }
  .tr-review-block-label { font-size: 10px; font-weight: 800; color: #aaa; text-transform: uppercase; letter-spacing: 0.08em; }
  .tr-review-edit-btn {
    background: none; border: 1.5px solid #ddd;
    border-radius: 8px; padding: 3px 10px;
    font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 700; color: #888;
    cursor: pointer; transition: all 0.15s;
  }
  .tr-review-edit-btn:hover { background: #5B4FD4; color: #fff; border-color: #5B4FD4; }
  .tr-review-rows { padding: 4px 0; }
  .tr-review-row {
    display: flex; align-items: center; justify-content: space-between; padding: 9px 14px;
  }
  .tr-review-row:not(:last-child) { border-bottom: 1px solid #e8e8e8; }
  .tr-review-row-key { font-size: 11px; font-weight: 600; color: #aaa; }
  .tr-review-row-val { font-size: 12px; font-weight: 800; color: #1a1a1a; font-family: 'DM Mono', monospace; }
  .tr-review-row-val.green { display: flex; align-items: center; gap: 5px; color: #2EC4A0; font-family: 'Poppins', sans-serif; }
  .tr-review-row-val.green .mi { font-size: 14px; }

  /* ── Declaration ── */
  .tr-declaration {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px; background: #f0f0f0; border-radius: 14px;
    cursor: pointer; border: 2px solid transparent; transition: border-color 0.18s; margin-top: 4px;
  }
  .tr-declaration:hover { border-color: #d8d8d8; }
  .tr-checkbox {
    width: 22px; height: 22px; min-width: 22px; border-radius: 6px;
    border: 2px solid #d0d0d0; background: #fff;
    display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all 0.15s;
  }
  .tr-checkbox .mi { font-size: 13px; color: #ddd; }
  .tr-checkbox.checked { background: #1a1a1a; border-color: #1a1a1a; }
  .tr-checkbox.checked .mi { color: #C8F135; }
  .tr-decl-text { font-size: 12px; font-weight: 500; color: #666; line-height: 1.6; }

  /* ══ NAV BUTTONS ══ */
  .tr-nav { display: flex; gap: 10px; align-items: center; padding-top: 4px; }
  .tr-btn-back {
    background: #f0f0f0; color: #555; border: none; border-radius: 13px;
    padding: 11px 20px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: all 0.15s; white-space: nowrap;
  }
  .tr-btn-back:hover { background: #e8e8e8; color: #111; }
  .tr-btn-back .mi { font-size: 16px; }
  .tr-btn-next {
    flex: 1; background: #1a1a1a; color: #fff; border: none; border-radius: 13px;
    padding: 11px 20px; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s;
  }
  .tr-btn-next:hover { background: #2a2a2a; }
  .tr-btn-next:disabled { opacity: 0.5; cursor: not-allowed; }
  .tr-btn-next .mi { font-size: 16px; }
  .tr-btn-next.submit { background: rgba(91,79,212,0.1); color: #5B4FD4; }
  .tr-btn-next.submit:hover { background: rgba(91,79,212,0.18); }

  /* ══ SUCCESS (initiate) ══ */
  .tr-success-wrap {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 40px 24px; animation: fadeUp 0.4s ease both;
  }
  .tr-success-icon {
    width: 68px; height: 68px; background: #1a1a1a;
    border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
  }
  .tr-success-icon .mi { font-size: 32px; color: #C8F135; }
  .tr-success-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #1a1a1a; margin-bottom: 8px; }
  .tr-success-title span { color: #5B4FD4; }
  .tr-success-sub { font-size: 12.5px; color: #888; line-height: 1.7; max-width: 400px; margin-bottom: 20px; }
  .tr-success-txn {
    background: #1a1a1a; color: #C8F135; border-radius: 10px; padding: 8px 20px;
    font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; margin-bottom: 24px;
  }
  .tr-success-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .tr-suc-btn-primary {
    background: #1a1a1a; color: #fff; border: none; border-radius: 13px; padding: 11px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s;
  }
  .tr-suc-btn-primary:hover { background: #2a2a2a; }
  .tr-suc-btn-outline {
    background: #f0f0f0; color: #555; border: none; border-radius: 13px; padding: 11px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .tr-suc-btn-outline:hover { background: #e8e8e8; color: #111; }

  /* ══ TRANSFER CARDS (status/incoming) ══ */
  .tr-cards-scroll {
    display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin;
  }
  .tr-cards-scroll::-webkit-scrollbar { height: 3px; }
  .tr-cards-scroll::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }

  .tr-txn-card {
    background: #f0f0f0; border-radius: 20px; padding: 14px 16px;
    flex-shrink: 0; width: 240px;
    display: flex; flex-direction: column; gap: 10px;
    cursor: pointer; transition: all 0.18s;
    position: relative; overflow: hidden; animation: fadeUp 0.4s ease both;
  }
  .tr-txn-card:hover { background: #e8e8e8; transform: translateY(-2px); }
  .tr-txn-card-id { font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 500; color: #aaa; }
  .tr-txn-card-title { font-size: 13px; font-weight: 800; color: #1a1a1a; line-height: 1.3; }
  .tr-txn-card-sub { font-size: 11px; color: #888; }
  .tr-txn-card-badge {
    display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 20px;
    font-size: 9.5px; font-weight: 700; width: fit-content;
  }
  .tr-mini-steps { display: flex; align-items: center; gap: 3px; }
  .tr-mini-step { flex: 1; height: 3px; border-radius: 2px; background: #e0e0e0; transition: background 0.3s; }
  .tr-mini-step.done   { background: #2EC4A0; }
  .tr-mini-step.active { background: #5B4FD4; }
  .tr-txn-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid #e8e8e8;
  }
  .tr-txn-card-date { font-size: 10px; font-weight: 600; color: #bbb; }
  .tr-txn-card-val  { font-size: 11.5px; font-weight: 800; color: #1a1a1a; }

  /* ── Incoming card ── */
  .tr-inc-card {
    background: #f0f0f0; border: 2px solid rgba(240,160,48,0.4);
    border-radius: 20px; padding: 14px 16px;
    flex-shrink: 0; width: 240px;
    display: flex; flex-direction: column; gap: 10px;
    cursor: pointer; transition: all 0.18s;
    position: relative; overflow: hidden; animation: fadeUp 0.4s ease both;
  }
  .tr-inc-card:hover { background: #ebebeb; transform: translateY(-2px); }
  .tr-inc-pulse {
    width: 8px; height: 8px; border-radius: 50%;
    background: #F0A030; box-shadow: 0 0 0 3px rgba(240,160,48,0.25);
    flex-shrink: 0; animation: pulse 1.4s ease-in-out infinite;
  }
  .tr-inc-badge {
    background: rgba(240,160,48,0.15); color: #c07000;
    border-radius: 20px; padding: 2px 9px;
    font-size: 9.5px; font-weight: 700;
    display: inline-flex; align-items: center; gap: 4px; width: fit-content;
  }
  .tr-inc-value { font-size: 12px; font-weight: 800; color: #1a1a1a; }
  .tr-inc-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px; border-top: 1px solid rgba(240,160,48,0.2);
  }

  /* ── New transfer dashed card ── */
  .tr-new-card {
    flex-shrink: 0; width: 160px;
    border: 2px dashed #d8d8d8; border-radius: 20px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; cursor: pointer; transition: all 0.18s; min-height: 140px;
  }
  .tr-new-card:hover { border-color: #5B4FD4; background: rgba(91,79,212,0.04); }
  .tr-new-card:hover .tr-new-card-icon { color: #5B4FD4; }
  .tr-new-card-icon { font-size: 28px; color: #ccc; transition: color 0.18s; }
  .tr-new-card-icon .mi { font-size: 28px; }
  .tr-new-card-lbl { font-size: 11px; font-weight: 700; color: #aaa; }

  /* ══ EMPTY STATE ══ */
  .tr-empty {
    text-align: center; padding: 40px 24px;
    border: 2px dashed #e0e0e0; border-radius: 18px;
  }
  .tr-empty .mi { font-size: 36px; color: #d8d8d8; display: block; margin: 0 auto 10px; }
  .tr-empty-title { font-size: 14px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
  .tr-empty-sub   { font-size: 12px; color: #aaa; }
  .tr-empty-btn {
    margin-top: 14px; background: #1a1a1a; color: #fff; border: none;
    border-radius: 11px; padding: 8px 18px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: background 0.15s;
  }
  .tr-empty-btn:hover { background: #2a2a2a; }
  .tr-empty-btn .mi { font-size: 14px; }

  /* ══ DETAIL VIEW ══ */
  .tr-detail-view { display: flex; flex-direction: column; gap: 12px; animation: slideIn 0.25s ease both; }
  .tr-detail-back {
    background: #f0f0f0; color: #555; border: none; border-radius: 11px; padding: 8px 14px;
    font-family: 'Poppins', sans-serif; font-size: 11.5px; font-weight: 600;
    cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
    transition: all 0.15s; width: fit-content;
  }
  .tr-detail-back:hover { background: #e8e8e8; color: #111; }
  .tr-detail-back .mi { font-size: 14px; }
  .tr-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .tr-info-cell { background: #f0f0f0; border-radius: 14px; padding: 10px 14px; }
  .tr-info-lbl { font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em; color: #aaa; text-transform: uppercase; margin-bottom: 3px; }
  .tr-info-val { font-size: 12.5px; font-weight: 800; color: #1a1a1a; font-family: 'DM Mono', monospace; }

  /* Transfer timeline */
  .tr-tl-list { display: flex; flex-direction: column; }
  .tr-tl-item { display: flex; gap: 12px; }
  .tr-tl-spine { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .tr-tl-dot {
    width: 14px; height: 14px; border-radius: 5px; border: 2px solid #e0e0e0;
    background: #f0f0f0; flex-shrink: 0; margin-top: 2px; transition: all 0.2s;
  }
  .tr-tl-dot.done   { background: #2EC4A0; border-color: #2EC4A0; }
  .tr-tl-dot.active { background: #5B4FD4; border-color: #5B4FD4; }
  .tr-tl-line { flex: 1; width: 2px; background: #e8e8e8; margin: 2px 0; min-height: 18px; transition: background 0.3s; }
  .tr-tl-line.done { background: #2EC4A0; }
  .tr-tl-content { flex: 1; padding-bottom: 14px; }
  .tr-tl-step { font-size: 12.5px; font-weight: 800; color: #1a1a1a; margin-bottom: 2px; }
  .tr-tl-step.pending { color: #bbb; font-weight: 500; }
  .tr-tl-actor { font-size: 11px; color: #aaa; }
  .tr-tl-date  { font-size: 10.5px; font-weight: 600; color: #bbb; margin-top: 2px; }

  /* Ownership timeline */
  .tr-own-list { display: flex; flex-direction: column; }
  .tr-own-item { display: flex; gap: 12px; }
  .tr-own-dot {
    width: 12px; height: 12px; border-radius: 50%; border: 2px solid #e0e0e0;
    flex-shrink: 0; margin-top: 4px;
  }
  .tr-own-dot.genesis   { background: #C8F135; border-color: #1a1a1a; }
  .tr-own-dot.confirmed { background: #2EC4A0; border-color: #2EC4A0; }
  .tr-own-dot.pending   { background: #F0A030; border-color: #F0A030; }
  .tr-own-line { flex: 1; width: 2px; background: #e8e8e8; margin: 2px 0; min-height: 20px; }
  .tr-own-content { flex: 1; padding-bottom: 14px; }
  .tr-own-event   { font-size: 12.5px; font-weight: 800; color: #1a1a1a; }
  .tr-own-parties { font-size: 11px; color: #aaa; margin-top: 2px; }
  .tr-own-date    { font-size: 10.5px; color: #bbb; margin-top: 2px; }
  .tr-own-hash    { font-family: 'DM Mono', monospace; font-size: 9.5px; color: rgba(91,79,212,0.6); margin-top: 3px; }
  .tr-own-badge   { display: inline-block; border-radius: 20px; padding: 2px 8px; font-size: 9px; font-weight: 800; margin-top: 4px; }
  .tr-own-badge.genesis   { background: rgba(200,241,53,0.3); color: #1a1a1a; }
  .tr-own-badge.confirmed { background: rgba(46,196,160,0.15); color: #1a8070; }
  .tr-own-badge.pending   { background: rgba(240,160,48,0.15); color: #c07000; }

  /* Notes */
  .tr-notes { background: #f0f0f0; border-radius: 14px; padding: 12px 14px; }
  .tr-notes-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em; color: #aaa; text-transform: uppercase; margin-bottom: 6px; }
  .tr-notes-text  { font-size: 12px; color: #666; line-height: 1.6; }

  /* Action buttons inside detail */
  .tr-detail-action-row { display: flex; gap: 10px; }
  .tr-action-btn-primary {
    flex: 1; background: #1a1a1a; color: #fff; border: none; border-radius: 13px; padding: 11px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s;
  }
  .tr-action-btn-primary:hover { background: #2a2a2a; }
  .tr-action-btn-primary .mi { font-size: 16px; }

  /* ══ MODAL ══ */
  .tr-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(26,26,26,0.45); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .tr-modal {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 24px; width: 100%; max-width: 440px;
    overflow: hidden; font-family: 'Poppins', sans-serif;
    animation: fadeUp 0.25s ease both; box-shadow: 0 20px 60px rgba(26,26,26,0.15);
  }
  .tr-modal-head { background: #1a1a1a; padding: 18px 20px; display: flex; align-items: center; gap: 12px; }
  .tr-modal-head-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(240,160,48,0.2);
    display: flex; align-items: center; justify-content: center;
  }
  .tr-modal-head-icon .mi { font-size: 20px; color: #F0A030; }
  .tr-modal-title { font-size: 14px; font-weight: 800; color: #fff; }
  .tr-modal-sub   { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
  .tr-modal-body  { padding: 20px; }
  .tr-modal-prop { background: #f0f0f0; border-radius: 16px; padding: 12px 14px; margin-bottom: 14px; }
  .tr-modal-prop-title { font-size: 13px; font-weight: 800; color: #1a1a1a; }
  .tr-modal-prop-meta  { font-size: 11px; color: #aaa; margin-top: 2px; }
  .tr-modal-prop-value { font-size: 12px; font-weight: 700; color: #1a1a1a; margin-top: 6px; }
  .tr-modal-consent {
    display: flex; align-items: flex-start; gap: 10px;
    cursor: pointer; margin-bottom: 14px; padding: 12px 14px;
    background: #f0f0f0; border-radius: 14px; border: 2px solid transparent; transition: border-color 0.15s;
  }
  .tr-modal-consent:hover { border-color: #d8d8d8; }
  .tr-modal-check-box {
    width: 20px; height: 20px; min-width: 20px; border: 2px solid #d0d0d0;
    border-radius: 5px; background: #fff;
    display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all 0.15s;
  }
  .tr-modal-check-box .mi { font-size: 12px; color: #ddd; }
  .tr-modal-check-box.checked { background: #1a1a1a; border-color: #1a1a1a; }
  .tr-modal-check-box.checked .mi { color: #C8F135; }
  .tr-modal-consent-text { font-size: 11.5px; color: #666; line-height: 1.6; }
  .tr-modal-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .tr-modal-label { font-size: 10px; font-weight: 800; letter-spacing: 0.06em; color: #aaa; text-transform: uppercase; }
  .tr-modal-input {
    background: #f0f0f0; border: 2px solid transparent; border-radius: 12px; padding: 10px 14px;
    font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 500;
    color: #1a1a1a; outline: none; transition: all 0.18s; width: 100%;
  }
  .tr-modal-input:focus { border-color: #5B4FD4; background: #fff; }
  .tr-modal-input::placeholder { color: #bbb; }
  .tr-modal-input.error { border-color: #e8533a; }
  .tr-modal-err { font-size: 10.5px; font-weight: 700; color: #e8533a; display: flex; align-items: center; gap: 4px; }
  .tr-modal-err .mi { font-size: 13px; }
  .tr-modal-actions { display: flex; gap: 10px; margin-top: 4px; }
  .tr-modal-btn-decline {
    flex: 1; padding: 11px; border: 2px solid #e8e8e8; border-radius: 13px;
    background: #fff; color: #e8533a; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s;
  }
  .tr-modal-btn-decline:hover { background: rgba(232,83,58,0.06); border-color: #e8533a; }
  .tr-modal-btn-decline:disabled { opacity: 0.4; cursor: not-allowed; }
  .tr-modal-btn-decline .mi { font-size: 15px; }
  .tr-modal-btn-confirm {
    flex: 1; padding: 11px; border: none; border-radius: 13px;
    background: #1a1a1a; color: #fff; font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.15s;
  }
  .tr-modal-btn-confirm:hover { background: #2a2a2a; }
  .tr-modal-btn-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
  .tr-modal-btn-confirm .mi { font-size: 15px; }
  .tr-modal-done { text-align: center; padding: 24px 16px; }
  .tr-modal-done .mi { font-size: 44px; display: block; margin: 0 auto 12px; }
  .tr-modal-done-title { font-size: 16px; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
  .tr-modal-done-sub   { font-size: 12px; color: #aaa; line-height: 1.6; margin-bottom: 18px; }
  .tr-modal-done-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 11px; padding: 9px 22px;
    font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.15s;
  }
  .tr-modal-done-btn:hover { background: #2a2a2a; }

  /* ── Spinner ── */
  .tr-spinner {
    width: 14px; height: 14px; border: 2px solid currentColor;
    border-top-color: transparent; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }

  /* ══ RESPONSIVE ══ */
  @media (max-width: 640px) {
    .tr-fields-grid { grid-template-columns: 1fr; }
    .tr-field-full  { grid-column: 1; }
    .tr-step-name   { display: none; }
    .tr-prop-card-chips { display: none; }
    .tr-info-grid { grid-template-columns: 1fr; }
    .tr-modal-actions { flex-direction: column; }
    .tr-tab { font-size: 10px; padding: 8px 8px; }
    .tr-tab span:not(.mi):not(.tr-tab-badge) { display: none; }
  }
`;

/* ══════════════════════════════════════════════════
   ICON HELPER
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => (
  <span className="mi" style={style}>{name}</span>
);

/* ══════════════════════════════════════════════════
   OWNERSHIP TIMELINE
══════════════════════════════════════════════════ */
function OwnershipTimeline({ timeline }) {
  const dotCls = s =>
    s === "GENESIS"   ? "genesis"   :
    s === "CONFIRMED" ? "confirmed" : "pending";
  return (
    <div className="tr-own-list">
      {timeline.map((t, i) => (
        <div key={i} className="tr-own-item">
          <div className="tr-tl-spine">
            <div className={`tr-own-dot ${dotCls(t.status)}`} />
            {i < timeline.length - 1 && <div className="tr-own-line" />}
          </div>
          <div className="tr-own-content">
            <div className="tr-own-event">{t.event}</div>
            {(t.from || t.to) && (
              <div className="tr-own-parties">
                {t.from && t.to ? `${t.from} → ${t.to}` : t.from || t.to}
              </div>
            )}
            <div className="tr-own-date">{t.date}</div>
            <div className="tr-own-hash">{t.hash}</div>
            <span className={`tr-own-badge ${dotCls(t.status)}`}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CONFIRM MODAL
══════════════════════════════════════════════════ */
function ConfirmModal({ transfer, onClose, onConfirm, onDecline }) {
  const [consent,  setConsent]  = useState(false);
  const [password, setPassword] = useState("");
  const [pwError,  setPwError]  = useState("");
  const [loading,  setLoading]  = useState(null);
  const [done,     setDone]     = useState(null);

  const handleConfirm = async () => {
    if (!consent)              { setPwError("Please accept the declaration."); return; }
    if (!password.trim())      { setPwError("Please enter your account password."); return; }
    if (password !== "user123"){ setPwError("Incorrect password. Please try again."); return; }
    setPwError("");
    setLoading("confirm");
    await new Promise(r => setTimeout(r, 1200));
    setLoading(null); setDone("confirmed"); onConfirm?.();
  };

  const handleDecline = async () => {
    setLoading("decline");
    await new Promise(r => setTimeout(r, 900));
    setLoading(null); setDone("declined"); onDecline?.();
  };

  return (
    <div className="tr-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tr-modal">
        <div className="tr-modal-head">
          <div className="tr-modal-head-icon"><MI name="gavel" /></div>
          <div>
            <div className="tr-modal-title">Confirm Transfer Request</div>
            <div className="tr-modal-sub">Response recorded on the blockchain ledger</div>
          </div>
        </div>
        <div className="tr-modal-body">
          {done ? (
            <div className="tr-modal-done">
              <MI
                name={done === "confirmed" ? "check_circle" : "cancel"}
                style={{ color: done === "confirmed" ? "#2EC4A0" : "#e8533a" }}
              />
              <div className="tr-modal-done-title">
                {done === "confirmed" ? "Transfer Confirmed!" : "Transfer Declined"}
              </div>
              <div className="tr-modal-done-sub">
                {done === "confirmed"
                  ? `You've confirmed the purchase of ${transfer.propertyTitle}. The transfer has moved to the registrar queue.`
                  : `You've declined the transfer of ${transfer.propertyTitle}. The seller has been notified.`
                }
              </div>
              <button className="tr-modal-done-btn" onClick={onClose}>Close</button>
            </div>
          ) : (
            <>
              <div className="tr-modal-prop">
                <div className="tr-modal-prop-title">{transfer.propertyTitle}</div>
                <div className="tr-modal-prop-meta">{transfer.propertyId} · {transfer.district}</div>
                <div className="tr-modal-prop-value">{transfer.saleValue} · Seller: {transfer.sellerName}</div>
              </div>
              <div className="tr-modal-consent" onClick={() => { setConsent(c => !c); setPwError(""); }}>
                <div className={`tr-modal-check-box ${consent ? "checked" : ""}`}>
                  <MI name="check" />
                </div>
                <span className="tr-modal-consent-text">
                  I confirm I am the intended buyer of this property and agree to proceed with the ownership transfer as listed. I understand this action is irreversible once approved by the registrar.
                </span>
              </div>
              <div className="tr-modal-field">
                <label className="tr-modal-label">Account Password</label>
                <input
                  type="password"
                  className={`tr-modal-input ${pwError ? "error" : ""}`}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPwError(""); }}
                  placeholder="Enter your account password"
                />
                {pwError && (
                  <span className="tr-modal-err">
                    <MI name="warning" /> {pwError}
                  </span>
                )}
              </div>
              <div className="tr-modal-actions">
                <button className="tr-modal-btn-decline" onClick={handleDecline} disabled={!!loading}>
                  {loading === "decline" ? <><span className="tr-spinner" /> Declining…</> : <><MI name="close" /> Decline</>}
                </button>
                <button className="tr-modal-btn-confirm" onClick={handleConfirm} disabled={!!loading}>
                  {loading === "confirm" ? <><span className="tr-spinner" /> Confirming…</> : <><MI name="check" /> Confirm Transfer</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: INITIATE TRANSFER
══════════════════════════════════════════════════ */
function InitiateTransferSection({ user, navigate }) {
  const [step,         setStep]        = useState(1);
  const [loading,      setLoading]     = useState(false);
  const [submitted,    setSubmitted]   = useState(false);
  const [errors,       setErrors]      = useState({});
  const [declared,     setDeclared]    = useState(false);
  const [uploadedDocs, setUploadedDocs]= useState({});
  const [selectedProp, setSelectedProp]= useState(null);
  const [buyer,        setBuyer]       = useState({ name:"", email:"", phone:"", aadhaar:"", saleValue:"" });

  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties/my-properties');
        setProperties(res.data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoadingProps(false);
      }
    };
    if (user) fetchProperties();
  }, [user]);

  const prop = properties.find(p => p.id === selectedProp);

  const setB = (k, v) => { setBuyer(b => ({...b, [k]:v})); setErrors(e => ({...e, [k]:""})); };

  const validate = (s) => {
    const e = {};
    if (s === 1 && !selectedProp) e.prop = "Please select a property.";
    if (s === 2) {
      if (!buyer.name.trim())                                 e.name      = "Buyer name is required.";
      if (!buyer.aadhaar.match(/^\d{12}$/))                  e.aadhaar   = "Enter a valid 12-digit Aadhaar.";
      if (!buyer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email     = "Enter a valid email address.";
      if (!buyer.phone.match(/^[6-9]\d{9}$/))               e.phone     = "Enter a valid 10-digit mobile number.";
      if (!buyer.saleValue.trim())                           e.saleValue = "Sale value is required.";
    }
    if (s === 3) {
      const missing = REQUIRED_DOCS.filter(d => d.required && !uploadedDocs[d.id]);
      if (missing.length) e.docs = `Please upload: ${missing.map(d => d.label).join(", ")}`;
    }
    if (s === 4 && !declared) e.declared = "Please accept the declaration to proceed.";
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const e = validate(4);
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      await api.post('/transfers', {
        propertyId: selectedProp,
        buyerEmail: buyer.email,
        remarks: "Sale deed attached, buyer details verified."
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit transfer request", error);
      setErrors({ api: error.response?.data?.message || "Failed to initiate transfer." });
    } finally {
      setLoading(false);
    }
  };

  const stepState = (n) => step === n ? "active" : step > n ? "done" : "inactive";
  const txnRef = `TXN-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  return (
    <>
      {/* Step Progress */}
      <div className="tr-progress-zone">
        {STEPS.map((s, i) => {
          const st = stepState(i + 1);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div className="tr-step-item" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className={`tr-step-bubble ${st}`}>
                  {st === "done" ? <MI name="check" /> : s.num}
                </div>
                <div className="tr-step-info">
                  <div className="tr-step-num-label">STEP {s.num}</div>
                  <div className={`tr-step-name ${st}`}>{s.label}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`tr-step-connector ${step > i + 1 ? "done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Zone */}
      <div className="tr-zone">
        {submitted ? (
          <div className="tr-success-wrap">
            <div className="tr-success-icon"><MI name="check_circle" /></div>
            <div className="tr-success-title">Transfer <span>Submitted!</span></div>
            <div className="tr-success-sub">
              Your transfer request has been queued for registrar review.<br />
              The buyer will receive a confirmation request at <strong>{buyer.email}</strong>.
            </div>
            <div className="tr-success-txn">{txnRef}</div>
            <div className="tr-success-actions">
              <button className="tr-suc-btn-primary" onClick={() => navigate("/user/transfers", { state: { tab: "status" } })}>
                Track Transfer <MI name="arrow_forward" />
              </button>
              <button className="tr-suc-btn-outline" onClick={() => navigate("/user/dashboard")}>
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="tr-zone-header">
              <div className="tr-zone-title-row">
                <div className="tr-zone-title">
                  {step === 1 && <>Select <span>Property</span></>}
                  {step === 2 && <>Buyer <span>Details</span></>}
                  {step === 3 && <>Upload <span>Documents</span></>}
                  {step === 4 && <>Review <span>&amp; Submit</span></>}
                </div>
                <div className="tr-zone-pill">Step {step} of 4</div>
              </div>
              {step === 1 && (
                <div className="tr-zone-pill purple">{properties.length} properties</div>
              )}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              properties.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#aaa", fontSize: 13 }}>
                  <MI name="home_work" style={{ fontSize: 32, display: "block", margin: "0 auto 8px", color: "#ddd" }} />
                  No registered properties found.
                </div>
              ) : (
                <div className="tr-prop-list">
                  {properties.map(p => {
                    const meta  = TYPE_META[p.type] || TYPE_META.Residential;
                    const isSel = selectedProp === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`tr-prop-card ${isSel ? "selected" : ""}`}
                        onClick={() => { setSelectedProp(p.id); setErrors({}); }}
                      >
                        {isSel && <div className="tr-prop-card-glow" />}
                        <div className="tr-prop-icon-wrap" style={{ background: isSel ? "rgba(200,241,53,0.15)" : `${meta.iconBg}22` }}>
                          <MI name={meta.icon} style={{ color: isSel ? "#C8F135" : meta.iconBg }} />
                        </div>
                        <div className="tr-prop-card-body">
                          <div className="tr-prop-card-id">{p.id}</div>
                          <div className="tr-prop-card-title">{p.title}</div>
                          <div className="tr-prop-card-district">{p.district} · {p.type}</div>
                        </div>
                        <div className="tr-prop-card-chips">
                          <div className="tr-prop-card-chip">
                            <div className="tr-prop-card-chip-label">Area</div>
                            <div className="tr-prop-card-chip-val">{p.area}</div>
                          </div>
                          <div className="tr-prop-card-chip">
                            <div className="tr-prop-card-chip-label">Value</div>
                            <div className="tr-prop-card-chip-val">{p.marketValue}</div>
                          </div>
                        </div>
                        <div className={`tr-prop-check ${isSel ? "checked" : ""}`}>
                          <MI name="check" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
            {errors.prop && (
              <div className="tr-err-msg" style={{ paddingLeft: 4 }}>
                <MI name="warning" /> {errors.prop}
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="tr-fields-grid">
                <div className="tr-field">
                  <label className="tr-label">Buyer Full Name</label>
                  <input className={`tr-input ${errors.name ? "error" : ""}`} value={buyer.name}
                    onChange={e => setB("name", e.target.value)} placeholder="As on Aadhaar" />
                  {errors.name && <div className="tr-err-msg"><MI name="warning" />{errors.name}</div>}
                </div>
                <div className="tr-field">
                  <label className="tr-label">Aadhaar Number</label>
                  <input className={`tr-input ${errors.aadhaar ? "error" : ""}`} value={buyer.aadhaar}
                    onChange={e => setB("aadhaar", e.target.value.replace(/\D/g,"").slice(0,12))} placeholder="12-digit Aadhaar" />
                  {errors.aadhaar && <div className="tr-err-msg"><MI name="warning" />{errors.aadhaar}</div>}
                </div>
                <div className="tr-field">
                  <label className="tr-label">Buyer Email</label>
                  <input className={`tr-input ${errors.email ? "error" : ""}`} type="email" value={buyer.email}
                    onChange={e => setB("email", e.target.value)} placeholder="buyer@example.com" />
                  {errors.email && <div className="tr-err-msg"><MI name="warning" />{errors.email}</div>}
                </div>
                <div className="tr-field">
                  <label className="tr-label">Mobile Number</label>
                  <input className={`tr-input ${errors.phone ? "error" : ""}`} value={buyer.phone}
                    onChange={e => setB("phone", e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit number" />
                  {errors.phone && <div className="tr-err-msg"><MI name="warning" />{errors.phone}</div>}
                </div>
                <div className="tr-field tr-field-full">
                  <label className="tr-label">Agreed Sale Value</label>
                  <input className={`tr-input ${errors.saleValue ? "error" : ""}`} value={buyer.saleValue}
                    onChange={e => setB("saleValue", e.target.value)} placeholder="₹ e.g. ₹45,00,000" />
                  <div className="tr-hint">This value will be permanently recorded on the blockchain ledger.</div>
                  {errors.saleValue && <div className="tr-err-msg"><MI name="warning" />{errors.saleValue}</div>}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6, paddingLeft: 4 }}>
                  Upload the required documents below. These will be reviewed by the Sub-Registrar before approval.
                </div>
                <div className="tr-doc-list">
                  {REQUIRED_DOCS.map(doc => (
                    <div key={doc.id} className={`tr-doc-row ${uploadedDocs[doc.id] ? "uploaded" : ""}`}>
                      <div className="tr-doc-icon"><MI name={uploadedDocs[doc.id] ? "task" : "description"} /></div>
                      <div className="tr-doc-name">{doc.label}</div>
                      <div className={`tr-doc-req-badge ${doc.required ? "" : "optional"}`}>
                        {doc.required ? "Required" : "Optional"}
                      </div>
                      {uploadedDocs[doc.id]
                        ? <div className="tr-doc-done-badge"><MI name="check_circle" /> Uploaded</div>
                        : <button className="tr-doc-upload-btn" onClick={() => setUploadedDocs(d => ({...d, [doc.id]: true}))}>+ Upload</button>
                      }
                    </div>
                  ))}
                </div>
                {errors.docs && (
                  <div className="tr-err-msg" style={{ paddingLeft: 4 }}>
                    <MI name="warning" /> {errors.docs}
                  </div>
                )}
              </>
            )}

            {/* Step 4 */}
            {step === 4 && prop && (
              <>
                <div className="tr-review-block">
                  <div className="tr-review-block-head">
                    <div className="tr-review-block-label">Property</div>
                    <button className="tr-review-edit-btn" onClick={() => setStep(1)}>Edit</button>
                  </div>
                  <div className="tr-review-rows">
                    {[
                      { k: "Property ID",  v: prop.id },
                      { k: "Title",        v: prop.title },
                      { k: "Area",         v: prop.area },
                      { k: "Market Value", v: prop.marketValue },
                      { k: "District",     v: prop.district },
                    ].map((r, i) => (
                      <div key={i} className="tr-review-row">
                        <span className="tr-review-row-key">{r.k}</span>
                        <span className="tr-review-row-val">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tr-review-block">
                  <div className="tr-review-block-head">
                    <div className="tr-review-block-label">Buyer Details</div>
                    <button className="tr-review-edit-btn" onClick={() => setStep(2)}>Edit</button>
                  </div>
                  <div className="tr-review-rows">
                    {[
                      { k: "Buyer Name", v: buyer.name },
                      { k: "Aadhaar",    v: `XXXX XXXX ${buyer.aadhaar.slice(-4)}` },
                      { k: "Email",      v: buyer.email },
                      { k: "Mobile",     v: buyer.phone },
                      { k: "Sale Value", v: buyer.saleValue },
                    ].map((r, i) => (
                      <div key={i} className="tr-review-row">
                        <span className="tr-review-row-key">{r.k}</span>
                        <span className="tr-review-row-val">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tr-review-block">
                  <div className="tr-review-block-head">
                    <div className="tr-review-block-label">Documents</div>
                    <button className="tr-review-edit-btn" onClick={() => setStep(3)}>Edit</button>
                  </div>
                  <div className="tr-review-rows">
                    {REQUIRED_DOCS.filter(d => uploadedDocs[d.id]).map((d, i) => (
                      <div key={i} className="tr-review-row">
                        <span className="tr-review-row-key">{d.label}</span>
                        <span className="tr-review-row-val green"><MI name="check_circle" /> Uploaded</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="tr-declaration" onClick={() => setDeclared(d => !d)}>
                  <div className={`tr-checkbox ${declared ? "checked" : ""}`}><MI name="check" /></div>
                  <div className="tr-decl-text">
                    I, <strong>{user?.name}</strong>, hereby declare that the above information is accurate
                    and I am the rightful owner of the property being transferred. I understand this transfer
                    will be permanently recorded on the blockchain ledger.
                  </div>
                </div>
                {errors.declared && (
                  <div className="tr-err-msg" style={{ paddingLeft: 4 }}>
                    <MI name="warning" /> {errors.declared}
                  </div>
                )}
              </>
            )}

            {/* Nav Buttons */}
            <div className="tr-nav">
              {step > 1 && (
                <button className="tr-btn-back" onClick={() => setStep(s => s - 1)}>
                  <MI name="arrow_back" /> Back
                </button>
              )}
              {step < 4 ? (
                <button className="tr-btn-next" onClick={next}>
                  {STEPS[step].label} <MI name="arrow_forward" />
                </button>
              ) : (
                <button className="tr-btn-next submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? <><span className="tr-spinner" /> Submitting…</> : <>Submit Transfer <MI name="send" /></>}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: TRANSFER STATUS
══════════════════════════════════════════════════ */
function TransferStatusSection({ user, navigate, outgoing, onOpenDetail }) {
  const renderTimeline = (transfer) => (
    <div className="tr-tl-list">
      {transfer.timeline.map((s, i) => {
        const isDone   = s.done;
        const isNext   = !s.done && (i === 0 || transfer.timeline[i - 1]?.done);
        const dotCls   = isDone ? "done" : isNext ? "active" : "";
        const lineDone = isDone && i < transfer.timeline.length - 1;
        return (
          <div key={i} className="tr-tl-item">
            <div className="tr-tl-spine">
              <div className={`tr-tl-dot ${dotCls}`} />
              {i < transfer.timeline.length - 1 && (
                <div className={`tr-tl-line ${lineDone ? "done" : ""}`} />
              )}
            </div>
            <div className="tr-tl-content">
              <div className={`tr-tl-step ${!isDone && !isNext ? "pending" : ""}`}>{s.step}</div>
              {s.actor && <div className="tr-tl-actor">by {s.actor}</div>}
              {s.date  && <div className="tr-tl-date">{s.date}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="tr-zone">
      <div className="tr-zone-header">
        <div className="tr-zone-title-row">
          <div className="tr-zone-title">Your <span>Transfers</span></div>
          <div className="tr-zone-pill">{outgoing.length} total</div>
        </div>
      </div>

      {outgoing.length === 0 ? (
        <div className="tr-empty">
          <MI name="swap_horiz" />
          <div className="tr-empty-title">No transfers yet</div>
          <div className="tr-empty-sub">Initiate a property transfer to see it tracked here.</div>
        </div>
      ) : (
        <div className="tr-cards-scroll">
          {outgoing.map((t, i) => {
            const doneCount = t.timeline.filter(s => s.done).length;
            return (
              <div
                key={t.id}
                className="tr-txn-card"
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => onOpenDetail({ type: "outgoing", transfer: t, renderTimeline })}
              >
                <div>
                  <div className="tr-txn-card-id">{t.id}</div>
                  <div className="tr-txn-card-title">{t.propertyTitle}</div>
                  <div className="tr-txn-card-sub">{t.sellerName} → {t.buyerName}</div>
                </div>
                <div className="tr-txn-card-badge" style={{ background: t.statusColor + "22", color: "#555" }}>
                  {t.status}
                </div>
                <div className="tr-mini-steps">
                  {t.timeline.map((s, j) => (
                    <div key={j} className={`tr-mini-step ${s.done ? "done" : j === doneCount ? "active" : ""}`} />
                  ))}
                </div>
                <div className="tr-txn-card-footer">
                  <span className="tr-txn-card-date">Initiated {t.initiatedOn}</span>
                  <span className="tr-txn-card-val">{t.saleValue}</span>
                </div>
              </div>
            );
          })}
          <div className="tr-new-card" onClick={() => {}}>
            <div className="tr-new-card-icon"><MI name="add_circle_outline" /></div>
            <div className="tr-new-card-lbl">New Transfer</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SECTION: INCOMING REQUESTS
══════════════════════════════════════════════════ */
function IncomingRequestsSection({ incoming, onOpenDetail }) {
  return (
    <div className="tr-zone">
      <div className="tr-zone-header">
        <div className="tr-zone-title-row">
          <div className="tr-zone-title">Incoming <span>Requests</span></div>
          {incoming.length > 0 && (
            <div className="tr-zone-pill orange">{incoming.length} pending</div>
          )}
        </div>
        <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Requires your confirmation</span>
      </div>

      {incoming.length === 0 ? (
        <div className="tr-empty">
          <MI name="inbox" />
          <div className="tr-empty-title">No incoming requests</div>
          <div className="tr-empty-sub">Transfer requests from sellers will appear here.</div>
        </div>
      ) : (
        <div className="tr-cards-scroll">
          {incoming.map((t, i) => (
            <div
              key={t.id}
              className="tr-inc-card"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => onOpenDetail({ type: "incoming", transfer: t })}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="tr-inc-pulse" />
                <span className="tr-txn-card-id">{t.id}</span>
              </div>
              <div className="tr-txn-card-title">{t.propertyTitle}</div>
              <div className="tr-txn-card-sub">From {t.sellerName}</div>
              <div className="tr-inc-value">{t.saleValue}</div>
              <div className="tr-inc-footer">
                <span className="tr-txn-card-date">Sent {t.initiatedOn}</span>
                <span className="tr-inc-badge">Tap to review <MI name="arrow_forward" style={{ fontSize: 13 }} /></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN: TRANSFERS PAGE
══════════════════════════════════════════════════ */
export default function Transfers() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab,   setActiveTab]   = useState("initiate");
  const [detailView,  setDetailView]  = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [outgoing, setOutgoing] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await api.get('/transfers/my-transfers');
        const transfers = res.data;
        // In the backend, we mapped sellerName and buyerEmail. We can use user.email or user.name.
        // If the user's name matches sellerName, they are the seller (outgoing).
        // If the user's name matches buyerName, they are the buyer (incoming).
        const out = transfers.filter(t => t.sellerName === user.name);
        const inc = transfers.filter(t => t.buyerName === user.name || t.buyerEmail === user.email);
        
        // Mock timeline/history mapping for now until full backend timeline exists
        const formattedOut = out.map(t => ({
          ...t,
          timeline: [
            { step: "Initiated", actor: "You", date: "Today", done: true },
            { step: "Review", actor: "Registrar", done: t.status !== "PENDING" }
          ]
        }));
        const formattedInc = inc.map(t => ({
          ...t,
          ownershipTimeline: [
            { event: "Sale Initiated", from: t.sellerName, to: "You", status: "PENDING" }
          ]
        }));

        setOutgoing(formattedOut);
        setIncoming(formattedInc);
      } catch (error) {
        console.error("Failed to fetch transfers:", error);
      } finally {
        setLoadingTransfers(false);
      }
    };
    if (user) fetchTransfers();
  }, [user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setDetailView(null);
    setShowConfirm(false);
  };

  const handleOpenDetail = (detail) => setDetailView(detail);
  const handleCloseDetail = () => { setDetailView(null); setShowConfirm(false); };

  /* ── Detail view renderer (shared by status + incoming) ── */
  const renderDetailView = () => {
    const { type, transfer, renderTimeline } = detailView;
    return (
      <div className="tr-detail-view">
        <button className="tr-detail-back" onClick={handleCloseDetail}>
          <MI name="arrow_back" /> Back
        </button>

        {/* Info grid */}
        <div className="tr-zone">
          <div className="tr-zone-header">
            <div className="tr-zone-title-row">
              <div className="tr-zone-title">
                {type === "incoming" ? <>Incoming <span>Request</span></> : <>Transfer <span>Details</span></>}
              </div>
              <div className={`tr-zone-pill ${type === "incoming" ? "orange" : "purple"}`}>
                {transfer.id}
              </div>
            </div>
          </div>
          <div className="tr-info-grid">
            {[
              { label: "Property",   value: transfer.propertyTitle },
              { label: "Sale Value", value: transfer.saleValue     },
              { label: "Seller",     value: transfer.sellerName    },
              { label: "Buyer",      value: transfer.buyerName     },
              { label: "Initiated",  value: transfer.initiatedOn   },
              {
                label: type === "incoming" ? "Status" : "Completed",
                value: type === "incoming" ? transfer.status : (transfer.completedOn || "In progress")
              },
            ].map((r, i) => (
              <div key={i} className="tr-info-cell">
                <div className="tr-info-lbl">{r.label}</div>
                <div className="tr-info-val">{r.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Outgoing timeline */}
        {type === "outgoing" && renderTimeline && (
          <div className="tr-zone">
            <div className="tr-zone-header">
              <div className="tr-zone-title-row">
                <div className="tr-zone-title">Transfer <span>Timeline</span></div>
              </div>
            </div>
            {renderTimeline(transfer)}
            {transfer.notes && (
              <div className="tr-notes">
                <div className="tr-notes-label">Registrar Notes</div>
                <div className="tr-notes-text">{transfer.notes}</div>
              </div>
            )}
          </div>
        )}

        {/* Incoming ownership history + confirm */}
        {type === "incoming" && (
          <div className="tr-zone">
            <div className="tr-zone-header">
              <div className="tr-zone-title-row">
                <div className="tr-zone-title">Ownership <span>History</span></div>
              </div>
            </div>
            <OwnershipTimeline timeline={transfer.ownershipTimeline} />
            {transfer.notes && (
              <div className="tr-notes">
                <div className="tr-notes-label">Seller Note</div>
                <div className="tr-notes-text">{transfer.notes}</div>
              </div>
            )}
            <div className="tr-detail-action-row">
              <button className="tr-action-btn-primary" onClick={() => setShowConfirm(true)}>
                <MI name="how_to_vote" /> Confirm or Decline Transfer
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="tr-page">

        <div className="tr-main">

          {/* ══ TOP BAR ══ */}
          <div className="tr-topbar">
            <div className="tr-heading">Property <span>Transfers</span></div>
            <div className="tr-topbar-right">
              {incoming.length > 0 && (
                <div className="tr-meta-chip orange">
                  <MI name="notifications_active" />
                  {incoming.length} pending
                </div>
              )}
              <div className="tr-meta-chip">
                <MI name="swap_horiz" />
                {outgoing.length} transfers
              </div>
            </div>
          </div>

          {/* ══ TAB BAR ══ */}
          {!detailView && (
            <div className="tr-tab-bar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`tr-tab ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <MI name={tab.icon} />
                  <span>{tab.label}</span>
                  {tab.id === "incoming" && incoming.length > 0 && (
                    <span className="tr-tab-badge">{incoming.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ══ TAB CONTENT ══ */}
          {detailView ? (
            renderDetailView()
          ) : (
            <>
              {activeTab === "initiate" && (
                <InitiateTransferSection user={user} navigate={navigate} />
              )}
              {activeTab === "status" && (
                <TransferStatusSection
                  user={user}
                  navigate={navigate}
                  outgoing={outgoing}
                  onOpenDetail={handleOpenDetail}
                />
              )}
              {activeTab === "incoming" && (
                <IncomingRequestsSection
                  incoming={incoming}
                  onOpenDetail={handleOpenDetail}
                />
              )}
            </>
          )}

        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && detailView?.type === "incoming" && (
        <ConfirmModal
          transfer={detailView.transfer}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {}}
          onDecline={() => {}}
        />
      )}
    </>
  );
}