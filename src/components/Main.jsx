import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const FEATURES = [
  { icon: "sync_alt",        title: "Transfer Workflow",        desc: "Seller initiates, buyer confirms, registrar approves. Every step logged, timestamped, and tied to uploaded documents.", color: "#C8F135", tag: "LEGAL PROCESS"    },
  { icon: "history",         title: "Ownership Timeline",       desc: "Visual chain-of-custody showing every owner, transfer date, and transaction since the property's first registration.",   color: "#F07060", tag: "FULL HISTORY"      },
  { icon: "gavel",           title: "Dispute Management",       desc: "Flag suspicious records, submit evidence, track resolution. Dispute status is visible to all involved parties.",          color: "#5B4FD4", tag: "ACCOUNTABILITY"   },
  { icon: "account_tree",    title: "Mutation & Inheritance",   desc: "Legal heirs submit inheritance claims. Court orders and succession documents processed through an official workflow.",     color: "#2EC4A0", tag: "LEGAL SUCCESSION" },
  { icon: "track_changes",   title: "Transfer Status Tracking", desc: "Both seller and buyer can track every stage of a transfer in real time — from initiation to final registrar approval.",    color: "#C8F135", tag: "TRANSPARENCY"     },
  { icon: "link",            title: "Blockchain-Ready Ledger",  desc: "Every record carries a cryptographic hash. Designed for seamless blockchain integration and tamper-proof verification.",   color: "#F07060", tag: "FUTURE-PROOF"     },
];

const STEPS = [
  { num: "01", title: "Create Your Account",  desc: "Register as a property owner or citizen. Your identity is verified and linked to your registered properties.",                 color: "#C8F135" },
  { num: "02", title: "View Your Properties", desc: "Log in to see all your registered land parcels, ownership history, and current status — all in one place.",                   color: "#F07060" },
  { num: "03", title: "Initiate Transfer",    desc: "Submit a transfer request with required documents. The buyer confirms their side, and the request enters the registrar queue.", color: "#5B4FD4" },
  { num: "04", title: "Registrar Approval",   desc: "The assigned registrar reviews all documents, verifies identities, then approves or requests clarification.",                  color: "#2EC4A0" },
  { num: "05", title: "Ledger Updated",       desc: "Ownership officially updated. A new block is added to the property's immutable timeline with a cryptographic hash.",            color: "#C8F135" },
];

const STATS = [
  { value: "2.4M+",  label: "Properties Registered", color: "#C8F135" },
  { value: "100%",  label: "Verification Accuracy",  color: "#F07060" },
  { value: "28",     label: "States Covered",          color: "#5B4FD4" },
  { value: "3 Days", label: "Avg. Transfer Time",      color: "#2EC4A0" },
];

const LEDGER_BLOCKS = [
  { event: "Ownership Transfer",   sub: "Haneesh Yadav → Avishek Nandi",  date: "22 March 2026", hash: "0x3f9a...c4e5", color: "#C8F135", status: "VERIFIED"  },
  { event: "Mutation Approved",    sub: "Survey #4521-B Updated",     date: "24 March 2026", hash: "0xa1b2...ef01", color: "#2EC4A0", status: "CONFIRMED" },
  { event: "Initial Registration", sub: "Govt. Records → Haneesh Yadav", date: "08 December 2006", hash: "0x7f8e...f6e5", color: "#5B4FD4", status: "GENESIS"   },
];

const PROP_ROWS = [
  { label: "Current Owner", value: "Haneesh Yadav",        bold: true  },
  { label: "Survey Number", value: "2609/A, Block G"               },
  { label: "Area",          value: "2,400 sq.ft."                  },
  { label: "District",      value: "Gurgaon, Haryana"            },
  { label: "Status",        value: "Clear Title",         badge: true },
  { label: "Last Transfer", value: "01 December 2017"               },
];

const CITIZEN_FEATURES   = ["View & manage my properties", "Initiate ownership transfers", "Track transfer status step-by-step", "Submit mutation / inheritance requests", "File dispute reports", "Download verified certificates"];
const REGISTRAR_FEATURES = ["Pending approvals queue", "Review & approve/reject transfers", "Verify uploaded documents", "Resolve flagged disputes", "Full audit log access", "All-properties overview"];
const HASHES             = ["0x3f9a1bc2...c4e5f6", "0xa1b2c3d4...ef0112", "0x7f8e9d0c...f6e523", "0x2c4d6e8f...5e6f78"];

/* ══════════════════════════════════════════════════
   CSS STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Poppins:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  /* ── Reset ── */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #EFEFEB;
  }

  ::-webkit-scrollbar-thumb {
    background: #0D3D2B;
    border-radius: 4px;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes float1 {
    0%,100% { transform: translateY(0) rotate(-6deg); }
    50%     { transform: translateY(-14px) rotate(-6deg); }
  }

  @keyframes float2 {
    0%,100% { transform: translateY(0) rotate(10deg); }
    50%     { transform: translateY(-10px) rotate(10deg); }
  }

  @keyframes float3 {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-8px); }
  }

  @keyframes hashfade {
    0%   { opacity: 0; transform: translateY(5px); }
    15%  { opacity: 1; transform: translateY(0); }
    85%  { opacity: 1; }
    100% { opacity: 0; }
  }

  /* ── Page ── */
  .main-page {
    font-family: 'Bricolage Grotesque', sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }

  .main-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(13,61,43,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,61,43,0.07) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── Material Icon helper ── */
  .mi {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  /* ── Selection Box ── */
  .sel-box {
    position: relative;
    display: inline-block;
  }

  .sel-box-inner {
    border: 2px dashed var(--sel-color);
    border-radius: 4px;
    padding: 5px 10px;
  }

  .sel-handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #fff;
    border: 2px solid var(--sel-color);
    border-radius: 1px;
    display: block;
  }

  .sel-tl { top: -4px;    left: -4px;  }
  .sel-tr { top: -4px;    right: -4px; }
  .sel-bl { bottom: -4px; left: -4px;  }
  .sel-br { bottom: -4px; right: -4px; }

  .sel-tag {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #0D3D2B;
  }

  /* ── HERO ── */
  .hero-section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 2.5rem 4rem;
    position: relative;
    overflow: hidden;
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 840px;
    animation: fadeUp 0.65s ease both;
  }

  .hero-h1-line1 {
    font-size: clamp(3rem,8.5vw,6.8rem);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -0.04em;
    margin-bottom: 0.2rem;
    color: #0D3D2B;
    margin-top: 1.5rem;
  }

  .hero-h1-line2 {
    font-size: clamp(3rem,8.5vw,6.8rem);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -0.04em;
    margin-bottom: 1.75rem;
    color: #0D3D2B;
  }

  .hero-highlight {
    background: #C8F135;
    border: 3px solid #0D3D2B;
    border-radius: 14px;
    padding: 2px 18px;
    display: inline-block;
  }

  .hero-subtitle {
    font-size: clamp(0.95rem,2vw,1.15rem);
    color: rgba(13,61,43,0.62);
    max-width: 560px;
    margin: 0 auto 2.5rem;
    line-height: 1.72;
    font-weight: 500;
  }

  /* Floating hero decorations */
  .hero-float   { position: absolute; z-index: 1; }
  .hero-float-1 { top: 12%;    right: 7%;  animation: float1 4s   ease-in-out infinite; }
  .hero-float-2 { top: 20%;    left: 6%;   animation: float2 5s   ease-in-out infinite; }
  .hero-float-3 { bottom: 25%; right: 8%;  animation: float3 5.5s ease-in-out infinite; }
  .hero-float-4 { bottom: 30%; left: 5%;   animation: float1 6s   ease-in-out infinite; }
  .hero-float-5 { top: 58%;    right: 3%;  opacity: 0.45; }
  .hero-star-1  { position: absolute; z-index: 1; top: 32%;    left: 13%;  color: #5B4FD4; font-size: 1.4rem; opacity: 0.55; }
  .hero-star-2  { position: absolute; z-index: 1; bottom: 38%; right: 16%; color: #F07060; font-size: 0.9rem; opacity: 0.5; }

  .hero-chain-box {
    width: 88px;
    height: 88px;
    border: 2.5px solid #0D3D2B;
    border-radius: 12px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 4px 0 #0D3D2B;
  }

  .hero-chain-box .mi {
    font-size: 2.4rem;
    color: #0D3D2B;
  }

  .hero-hash-chip {
    padding: 7px 13px;
    border: 2.5px solid #0D3D2B;
    border-radius: 8px;
    background: #5B4FD4;
    font-size: 0.68rem;
    font-weight: 800;
    color: #fff;
    font-family: monospace;
    box-shadow: 3px 3px 0 #0D3D2B;
  }

  .cursor-tilt { transform: rotate(15deg); }

  /* Browser chrome */
  .browser-chrome {
    border: 2.5px solid #0D3D2B;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    max-width: 600px;
    margin: 0 auto 1.5rem;
  }

  .browser-tabs {
    border-bottom: 2.5px solid #0D3D2B;
    display: flex;
    align-items: flex-end;
    padding: 8px 12px 0;
    gap: 6px;
    background: #F0F0EC;
  }

  .browser-tab-1 {
    width: 80px;
    height: 28px;
    background: #2EC4A0;
    border-radius: 8px 8px 0 0;
    border: 2px solid #0D3D2B;
    border-bottom: none;
  }

  .browser-tab-2 {
    width: 60px;
    height: 22px;
    background: #5B4FD4;
    border-radius: 8px 8px 0 0;
    border: 2px solid #0D3D2B;
    border-bottom: none;
    opacity: 0.7;
  }

  .browser-urlbar {
    flex: 1;
    display: flex;
    gap: 6px;
    padding-bottom: 4px;
    margin-left: 8px;
  }

  .browser-url {
    flex: 1;
    height: 22px;
    background: #C8F135;
    border-radius: 6px;
    border: 2px solid #0D3D2B;
    display: flex;
    align-items: center;
    padding-left: 8px;
  }

  .browser-url span {
    font-size: 0.58rem;
    font-weight: 800;
    color: #0D3D2B;
    font-family: monospace;
  }

  .browser-go {
    width: 58px;
    height: 22px;
    background: #F07060;
    border-radius: 6px;
    border: 2px solid #0D3D2B;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .browser-go span {
    font-size: 0.58rem;
    font-weight: 800;
    color: #0D3D2B;
  }

  .browser-menu {
    width: 26px;
    height: 22px;
    border: 2px solid #0D3D2B;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .browser-menu .mi {
    font-size: 1rem;
    color: #0D3D2B;
  }

  /* Search row */
  .search-row {
    padding: 1rem 1.25rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .search-input {
    flex: 1;
    padding: 0.7rem 1rem;
    border: 2px solid #0D3D2B;
    border-radius: 8px;
    background: #F8F8F4;
    font-size: 0.88rem;
    font-family: inherit;
    font-weight: 500;
    outline: none;
    color: #0D3D2B;
    transition: background 0.2s;
  }

  .search-input:focus {
    background: #fff;
  }

  .search-input::placeholder {
    color: rgba(13,61,43,0.38);
  }

  .search-btn {
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    border: 2.5px solid #0D3D2B;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.875rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .search-btn:hover {
    background: #0D3D2B;
    color: #C8F135;
  }

  /* Hash bar */
  .hash-bar {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1.1rem;
    border: 2.5px solid #0D3D2B;
    border-radius: 8px;
    background: #fff;
    box-shadow: 3px 3px 0 #0D3D2B;
  }

  .hash-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2EC4A0;
    box-shadow: 0 0 0 3px rgba(46,196,160,0.25);
    flex-shrink: 0;
  }

  .hash-label {
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.45);
  }

  .hash-value {
    font-size: 0.7rem;
    font-family: 'DM Mono', monospace;
    color: #5B4FD4;
    font-weight: 500;
    animation: hashfade 2.2s ease infinite;
  }

  /* ── STATS ── */
  .stats-bar {
    border-top: 2.5px solid #0D3D2B;
    border-bottom: 2.5px solid #0D3D2B;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    background: #fff;
    position: relative;
    z-index: 2;
  }

  .stat-cell {
    padding: 2rem 1.5rem;
    text-align: center;
    transition: transform 0.2s;
  }

  .stat-cell:not(:last-child) {
    border-right: 2.5px solid #0D3D2B;
  }

  .stat-cell:hover {
    transform: translateY(-3px);
  }

  .stat-value {
    display: inline-block;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    padding: 3px 16px;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
    color: #0D3D2B;
  }

  .stat-label {
    font-size: 0.73rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: rgba(13,61,43,0.5);
  }

  /* ── FEATURES ── */
  .features-section {
    padding: 6rem 2.5rem;
    position: relative;
    z-index: 2;
  }

  .section-header {
    margin-bottom: 3.5rem;
  }

  .section-title {
    font-size: clamp(2rem,5vw,3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-top: 1rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    border: 2.5px solid #0D3D2B;
    border-radius: 16px;
    overflow: hidden;
  }

  .feat-card {
    padding: 2rem;
    background: #fff;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .feat-card:hover {
    transform: translateY(-3px);
    box-shadow: 5px 5px 0 #0D3D2B;
  }

  .feat-card:nth-child(-n+3)     { border-bottom: 2.5px solid #0D3D2B; }
  .feat-card:not(:nth-child(3n)) { border-right:  2.5px solid #0D3D2B; }

  .feat-icon {
    width: 48px;
    height: 48px;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .feat-icon .mi {
    font-size: 1.5rem;
    color: #0D3D2B;
  }

  .feat-tag {
    display: inline-block;
    border: 1.5px solid #0D3D2B;
    border-radius: 4px;
    padding: 1px 8px;
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
    color: #0D3D2B;
  }

  .feat-title {
    font-weight: 800;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #0D3D2B;
  }

  .feat-desc {
    font-size: 0.84rem;
    color: rgba(13,61,43,0.58);
    line-height: 1.65;
  }

  /* ── HOW IT WORKS ── */
  .how-section {
    border-top: 2.5px solid #0D3D2B;
    border-bottom: 2.5px solid #0D3D2B;
    background: #0D3D2B;
    padding: 6rem 2.5rem;
    position: relative;
    z-index: 2;
  }

  .how-header {
    margin-bottom: 3.5rem;
  }

  .how-tag {
    display: inline-block;
    background: #C8F135;
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 4px;
    padding: 2px 10px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #0D3D2B;
    margin-bottom: 1rem;
  }

  .how-title {
    font-size: clamp(2rem,5vw,3.5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.1;
  }

  .how-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .step-row {
    display: flex;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid rgba(255,255,255,0.1);
  }

  .step-row:hover {
    background: rgba(255,255,255,0.07);
  }

  .step-num {
    width: 36px;
    height: 36px;
    min-width: 36px;
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.62rem;
    font-weight: 800;
    font-family: 'DM Mono', monospace;
    transition: all 0.2s;
  }

  .step-title {
    font-weight: 800;
    font-size: 0.95rem;
    color: #fff;
    margin-bottom: 0.3rem;
  }

  .step-desc {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.48);
    line-height: 1.6;
  }

  /* Ledger chrome */
  .ledger-chrome {
    border: 2.5px solid #0D3D2B;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
  }

  .ledger-tab-1 {
    width: 80px;
    height: 28px;
    background: #C8F135;
    border-radius: 8px 8px 0 0;
    border: 2px solid #0D3D2B;
    border-bottom: none;
  }

  .ledger-tab-2 {
    width: 60px;
    height: 22px;
    background: #5B4FD4;
    border-radius: 8px 8px 0 0;
    border: 2px solid #0D3D2B;
    border-bottom: none;
    opacity: 0.7;
  }

  .ledger-body {
    padding: 1.25rem;
  }

  .ledger-meta {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.38);
    margin-bottom: 1rem;
  }

  .ledger-connector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 3px 0 3px 14px;
  }

  .ledger-conn-line {
    width: 2px;
    height: 14px;
    background: rgba(13,61,43,0.12);
    border-radius: 2px;
  }

  .ledger-conn-text {
    font-size: 0.58rem;
    color: rgba(13,61,43,0.28);
    font-family: monospace;
  }

  .ledger-block {
    border-radius: 10px;
    padding: 0.85rem 1rem;
  }

  .ledger-blk-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.35rem;
  }

  .ledger-blk-event {
    font-weight: 800;
    font-size: 0.82rem;
    color: #0D3D2B;
  }

  .ledger-blk-badge {
    border: 1.5px solid #0D3D2B;
    border-radius: 4px;
    padding: 1px 7px;
    font-size: 0.58rem;
    font-weight: 800;
    color: #0D3D2B;
  }

  .ledger-blk-sub {
    font-size: 0.7rem;
    color: rgba(13,61,43,0.52);
    margin-bottom: 0.35rem;
  }

  .ledger-blk-hash {
    font-family: 'DM Mono', monospace;
    font-size: 0.64rem;
    color: #5B4FD4;
  }

  /* ── VERIFY ── */
  .verify-section {
    padding: 6rem 2.5rem;
    position: relative;
    z-index: 2;
  }

  .verify-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
  }

  .verify-title {
    font-size: clamp(2rem,4vw,3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 1rem 0;
  }

  .verify-desc {
    font-size: 0.95rem;
    color: rgba(13,61,43,0.6);
    line-height: 1.72;
    margin-bottom: 2rem;
  }

  .verify-list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .verify-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .verify-check {
    width: 22px;
    height: 22px;
    background: #C8F135;
    border: 2px solid #0D3D2B;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .verify-check .mi {
    font-size: 0.85rem;
    color: #0D3D2B;
    font-weight: 800;
  }

  .verify-text {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .prop-wrap {
    position: relative;
  }

  .prop-cursor {
    position: absolute;
    top: -18px;
    right: 18px;
    z-index: 3;
  }

  .prop-card {
    border: 2.5px solid #0D3D2B;
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    box-shadow: 6px 6px 0 #0D3D2B;
  }

  .prop-header {
    background: #C8F135;
    border-bottom: 2.5px solid #0D3D2B;
    padding: 0.85rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .prop-id {
    font-weight: 800;
    font-size: 0.82rem;
  }

  .prop-verified {
    background: #2EC4A0;
    border: 1.5px solid #0D3D2B;
    border-radius: 5px;
    padding: 2px 10px;
    font-size: 0.62rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .prop-verified .mi {
    font-size: 0.75rem;
  }

  .prop-body {
    padding: 1.25rem;
  }

  .prop-row {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
  }

  .prop-row:not(:last-child) {
    border-bottom: 1px solid rgba(13,61,43,0.09);
  }

  .prop-row-label {
    font-size: 0.76rem;
    color: rgba(13,61,43,0.48);
    font-weight: 600;
  }

  .prop-row-value {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
  }

  .prop-row-bold {
    font-weight: 800;
  }

  .prop-row-badge {
    background: #C8F135;
    border: 1.5px solid #0D3D2B;
    border-radius: 4px;
    padding: 1px 8px;
    font-size: 0.7rem;
    font-weight: 800;
  }

  .prop-hash-box {
    margin-top: 1rem;
    padding: 0.65rem;
    background: #F0F0EC;
    border: 1.5px solid rgba(13,61,43,0.13);
    border-radius: 8px;
  }

  .prop-hash-lbl {
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.38);
    margin-bottom: 3px;
  }

  .prop-hash-val {
    font-family: 'DM Mono', monospace;
    font-size: 0.66rem;
    color: #5B4FD4;
  }

  /* ── DASHBOARDS ── */
  .dashboards-section {
    border-top: 2.5px solid #0D3D2B;
    background: #fff;
    padding: 6rem 2.5rem;
    position: relative;
    z-index: 2;
  }

  .dashboards-header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .dashboards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .dash-card {
    border: 2.5px solid #0D3D2B;
    border-radius: 16px;
    overflow: hidden;
  }

  .dash-card-citizen   { box-shadow: 5px 5px 0 #F07060; }
  .dash-card-registrar { box-shadow: 5px 5px 0 #5B4FD4; }

  .dash-head {
    border-bottom: 2.5px solid #0D3D2B;
    padding: 1.25rem 1.5rem;
  }

  .dash-head-citizen   { background: #F07060; }
  .dash-head-registrar { background: #5B4FD4; }

  .dash-icon {
    margin-bottom: 0.4rem;
  }

  .dash-icon .mi {
    font-size: 2rem;
    color: #fff;
  }

  .dash-name {
    font-weight: 800;
    font-size: 1.3rem;
    color: #fff;
  }

  .dash-sub {
    font-size: 0.78rem;
    margin-top: 0.2rem;
    color: rgba(255,255,255,0.7);
  }

  .dash-body {
    padding: 1.5rem;
    background: #fff;
  }

  .dash-item {
    display: flex;
    gap: 0.75rem;
    padding: 0.55rem 0;
  }

  .dash-item:not(:last-of-type) {
    border-bottom: 1px solid rgba(13,61,43,0.08);
  }

  .dash-arrow-green  { color: #2EC4A0; font-weight: 800; }
  .dash-arrow-purple { color: #5B4FD4; font-weight: 800; }

  .dash-item-text {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .dash-btn {
    margin-top: 1.25rem;
    width: 100%;
    padding: 0.75rem;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.18s;
  }

  .dash-btn:hover {
    opacity: 0.88;
  }

  .dash-btn-citizen   { background: #F07060; color: #fff; }
  .dash-btn-registrar { background: #5B4FD4; color: #fff; }

  /* ── CTA ── */
  .cta-section {
    border-top: 2.5px solid #0D3D2B;
    padding: 6rem 2.5rem 5rem;
    text-align: center;
    position: relative;
    z-index: 2;
    overflow: hidden;
  }

  .cta-bg-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 18vw;
    font-weight: 800;
    color: rgba(13,61,43,0.04);
    letter-spacing: -0.05em;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
  }

  .cta-inner {
    position: relative;
    z-index: 1;
    max-width: 700px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: clamp(2.5rem,6vw,4.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.05;
    margin: 1.5rem 0 1.25rem;
  }

  .cta-highlight {
    background: #C8F135;
    border: 3px solid #0D3D2B;
    border-radius: 12px;
    padding: 0 14px;
    display: inline-block;
  }

  .cta-desc {
    font-size: 1rem;
    color: rgba(13,61,43,0.58);
    line-height: 1.72;
    margin-bottom: 2.5rem;
  }

  .cta-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .cta-btn {
    padding: 0.9rem 2.2rem;
    border-radius: 12px;
    border: 2.5px solid #0D3D2B;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 4px 4px 0 #0D3D2B;
    transition: background 0.18s;
  }

  .cta-primary {
    background: #C8F135;
    color: #0D3D2B;
  }

  .cta-primary:hover {
    background: #a8d41a;
  }

  .cta-secondary {
    background: transparent;
    color: #0D3D2B;
  }

  .cta-secondary:hover {
    background: #F0F0EC;
  }

  /* ── FOOTER ── */
  .main-footer {
    position: relative;
    z-index: 2;
    background: #0D3D2B;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
    /* Flat top — no wave, no margin, no curve */
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  /* Outer wrapper: brand col on left, bordered box on right */
  .footer-body {
    padding: 2.5rem 2.5rem 0;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: stretch;
    gap: 2rem;
  }

  /* Brand column — sits freely on the left, no border */
  .footer-brand-col {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 0 0 300px;
    padding-right: 1rem;
    padding-bottom: 2.5rem;
  }

  .footer-logo-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.25rem;
  }

  .footer-logo-img {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .footer-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
    line-height: 1;
    font-family: 'Poppins', sans-serif;
  }

  .footer-tagline {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.5);
    font-weight: 400;
    line-height: 1.65;
    max-width: 240px;
    font-family: 'Poppins', sans-serif;
  }

  .footer-builders {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.25);
    font-weight: 400;
    margin-top: auto;
    padding-top: 2rem;
    font-family: 'Poppins', sans-serif;
  }

  /* The bordered rectangle that holds the 3 link columns */
  .footer-cols-box {
    flex: 1;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    overflow: hidden;
  }

  /* Each link column */
  .footer-col {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 2rem 2rem 2.5rem;
  }

  .footer-col:not(:last-child) {
    border-right: 1px solid rgba(255,255,255,0.15);
  }

  .footer-col-heading {
    font-size: 0.82rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.01em;
    margin-bottom: 1.25rem;
    font-family: 'Poppins', sans-serif;
  }

  .footer-col-link {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.45);
    font-weight: 400;
    cursor: pointer;
    transition: color 0.18s;
    white-space: nowrap;
    padding: 0.38rem 0;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-family: 'Poppins', sans-serif;
    text-decoration: none;
  }

  .footer-col-link:hover {
    color: #C8F135;
  }

  .footer-col-link .ext-arrow {
    font-size: 0.7rem;
    opacity: 0.55;
  }

  /* Privacy choices badge */
  .footer-privacy-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.82rem;
    color: rgba(255,255,255,0.45);
    font-weight: 400;
    cursor: pointer;
    padding: 0.38rem 0;
    transition: color 0.18s;
    font-family: 'Poppins', sans-serif;
  }

  .footer-privacy-badge:hover {
    color: rgba(255,255,255,0.7);
  }

  .footer-privacy-icon {
    display: inline-flex;
    align-items: center;
    background: #1a73e8;
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 0.6rem;
    font-weight: 800;
    color: #fff;
    flex-shrink: 0;
    gap: 2px;
  }

  .footer-privacy-x {
    background: #e53935;
    border-radius: 3px;
    padding: 1px 3px;
    font-size: 0.55rem;
  }

  /* Large watermark text — sits BELOW the footer-body, inside the footer */
  .footer-bg-word {
    display: block;
    text-align: center;
    font-size: clamp(4rem, 14vw, 11rem);
    font-weight: 800;
    color: rgba(255,255,255,0.05);
    letter-spacing: -0.03em;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
    font-family: 'Poppins', sans-serif;
    line-height: 0.85;
    overflow: hidden;
    padding-bottom: 0.5rem;
  }

  /* Footer responsive */
  @media (max-width: 900px) {
    .footer-body {
      flex-direction: column;
      gap: 2rem;
    }

    .footer-brand-col {
      flex: none;
      padding-right: 0;
      padding-bottom: 0;
    }

    .footer-cols-box {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .footer-body {
      padding: 2rem 1.25rem 0;
    }

    .footer-cols-box {
      grid-template-columns: 1fr 1fr;
    }

    .footer-col:last-child {
      border-right: none;
      border-top: 1px solid rgba(255,255,255,0.15);
      grid-column: 1 / -1;
    }
  }

  /* ── RESPONSIVE ── */

  /* Tablet — ≤ 1024px */
  @media (max-width: 1024px) {
    .hero-section    { padding: 80px 1.5rem 3rem; }
    .features-grid   { grid-template-columns: repeat(2,1fr); }

    .feat-card:nth-child(-n+3)     { border-bottom: none; }
    .feat-card:not(:nth-child(3n)) { border-right: none; }
    .feat-card:nth-child(odd)      { border-right: 2.5px solid #0D3D2B; }
    .feat-card:nth-child(-n+4)     { border-bottom: 2.5px solid #0D3D2B; }

    .how-grid        { grid-template-columns: 1fr; gap: 2.5rem; }
    .verify-grid     { grid-template-columns: 1fr; gap: 3rem; }
    .dashboards-grid { grid-template-columns: 1fr 1fr; gap: 1.25rem; }

    .features-section,
    .how-section,
    .verify-section,
    .dashboards-section,
    .cta-section     { padding: 4rem 1.5rem; }
  }

  /* Mobile — ≤ 768px */
  @media (max-width: 768px) {
    .hero-section    { padding: 100px 1.25rem 2.5rem; min-height: auto; }

    .hero-h1-line1,
    .hero-h1-line2   { font-size: clamp(2.4rem,10vw,4rem); }

    .hero-float-1,
    .hero-float-2,
    .hero-float-3,
    .hero-float-4,
    .hero-float-5    { display: none; }
    .hero-star-1,
    .hero-star-2     { display: none; }

    .search-row      { flex-direction: column; gap: 0.6rem; }
    .search-btn      { width: 100%; }

    .stats-bar       { grid-template-columns: repeat(2,1fr); }
    .stat-cell:nth-child(2)              { border-right: none; }
    .stat-cell:nth-child(1),
    .stat-cell:nth-child(2)              { border-bottom: 2.5px solid #0D3D2B; }

    .features-grid   { grid-template-columns: 1fr; }
    .feat-card:nth-child(odd)            { border-right: none; }
    .feat-card:nth-child(-n+4)           { border-bottom: none; }
    .feat-card:not(:last-child)          { border-bottom: 2.5px solid #0D3D2B; }

    .how-section     { padding: 3rem 1.25rem; }
    .how-grid        { grid-template-columns: 1fr; gap: 2rem; }

    .verify-section  { padding: 3rem 1.25rem; }
    .verify-grid     { grid-template-columns: 1fr; gap: 2rem; }

    .dashboards-section { padding: 3rem 1.25rem; }
    .dashboards-grid    { grid-template-columns: 1fr; }

    .cta-section     { padding: 3rem 1.25rem; }
    .cta-actions     { flex-direction: column; align-items: center; }
    .cta-btn         { width: 100%; max-width: 360px; }

    .section-inner   { padding: 0; }

    .features-section,
    .dashboards-section { padding: 3rem 1.25rem; }

    /* footer responsive handled in footer block above */
  }

  /* Small mobile — ≤ 480px */
  @media (max-width: 480px) {
    .hero-h1-line1,
    .hero-h1-line2   { font-size: clamp(2rem,12vw,3rem); }
    .hash-bar        { flex-wrap: wrap; justify-content: center; }
    .stat-value      { font-size: 1.5rem; }
    .browser-chrome  { border-radius: 12px; }
    .cta-bg-text     { display: none; }
  }
`;

/* ══════════════════════════════════════════════════
   REUSABLE COMPONENTS
══════════════════════════════════════════════════ */
const MIcon = ({ name, className = "" }) => (
  <span className={`mi ${className}`}>{name}</span>
);

const SelectionBox = ({ children, color = "#5B4FD4" }) => (
  <div className="sel-box" style={{ "--sel-color": color }}>
    <div className="sel-box-inner">{children}</div>
    <span className="sel-handle sel-tl" />
    <span className="sel-handle sel-tr" />
    <span className="sel-handle sel-bl" />
    <span className="sel-handle sel-br" />
  </div>
);

const Cursor = ({ className = "" }) => (
  <svg width="28" height="32" viewBox="0 0 28 32" fill="none" className={className}>
    <path d="M4 2L4 24L10 18L14 28L17 27L13 17L22 17L4 2Z" fill="white" stroke="#0D3D2B" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

/* ══════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════ */
export default function BhoomiSetuLanding() {
  const navigate = useNavigate();

  const [searchVal,  setSearchVal]  = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [hashIdx,    setHashIdx]    = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % STEPS.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHashIdx(i => (i + 1) % HASHES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div className="main-page">
        <div className="main-grid-bg" />

        {/* ══ HERO ══ */}
        <section className="hero-section">

          {/* Floating decorations */}
          <div className="hero-float hero-float-1">
            <div className="hero-chain-box">
              <MIcon name="link" />
            </div>
          </div>
          <div className="hero-float hero-float-2">
            <div className="hero-hash-chip">0x3f9a1b...c4e5</div>
          </div>
          <div className="hero-float hero-float-3">
            <SelectionBox color="#F07060">
              <span className="sel-tag">Survey #4521-B</span>
            </SelectionBox>
          </div>
          <div className="hero-float hero-float-4"><Cursor /></div>
          <div className="hero-float hero-float-5"><Cursor className="cursor-tilt" /></div>
          <span className="hero-star-1">✦</span>
          <span className="hero-star-2">✦</span>

          {/* Hero content */}
          <div className="hero-content">
            <SelectionBox color="#2EC4A0">
              <span className="sel-tag">BLOCKCHAIN-READY LAND REGISTRY PLATFORM</span>
            </SelectionBox>

            <h1 className="hero-h1-line1">Land Records,</h1>
            <h1 className="hero-h1-line2">
              <span className="hero-highlight">Transparent</span>{" "}& Trusted
            </h1>

            <p className="hero-subtitle">
              BhoomiSetu digitizes India's land registry — every ownership transfer, mutation,
              and inheritance recorded on a tamper-proof, time-stamped ledger.
              Secure, transparent, and built for every citizen.
            </p>

            {/* Search bar */}
            <div className="browser-chrome">
              <div className="browser-tabs">
                <div className="browser-tab-1" />
                <div className="browser-tab-2" />
                <div className="browser-urlbar">
                  <div className="browser-url"><span>bhoomi-setu.gov.in</span></div>
                  <div className="browser-go"><span>→ GO</span></div>
                  <div className="browser-menu"><MIcon name="more_vert" /></div>
                </div>
              </div>
              <div className="search-row">
                <input
                  className="search-input"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Enter Property ID, Survey No. or Owner Name..."
                />
                <button className="search-btn">Verify →</button>
              </div>
            </div>

            {/* Live hash bar */}
            <div className="hash-bar">
              <span className="hash-dot" />
              <span className="hash-label">LATEST BLOCK</span>
              <span className="hash-value">{HASHES[hashIdx]}</span>
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <div className="stats-bar">
          {STATS.map((s, i) => (
            <div key={i} className="stat-cell">
              <div className="stat-value" style={{ background: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══ FEATURES ══ */}
        <section id="features" className="features-section">
          <div className="section-inner">
            <div className="section-header">
              <SelectionBox color="#F07060">
                <span className="sel-tag">PLATFORM CAPABILITIES</span>
              </SelectionBox>
              <h2 className="section-title">
                Everything land ownership<br />should have always been.
              </h2>
            </div>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feat-card">
                  <div className="feat-icon" style={{ background: f.color }}>
                    <MIcon name={f.icon} />
                  </div>
                  <div className="feat-tag" style={{ background: f.color }}>{f.tag}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how-it-works" className="how-section">
          <div className="section-inner">
            <div className="how-header">
              <div className="how-tag">WORKFLOW</div>
              <h2 className="how-title">How BhoomiSetu works</h2>
            </div>
            <div className="how-grid">

              {/* Steps */}
              <div className="steps-list">
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    className="step-row"
                    style={{
                      borderColor: activeStep === i ? s.color : "rgba(255,255,255,0.1)",
                      background:  activeStep === i ? "rgba(255,255,255,0.06)" : "transparent",
                    }}
                    onClick={() => setActiveStep(i)}
                  >
                    <div
                      className="step-num"
                      style={{
                        background: activeStep === i ? s.color : "rgba(255,255,255,0.08)",
                        color:      activeStep === i ? "#0D3D2B" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {s.num}
                    </div>
                    <div>
                      <div className="step-title">{s.title}</div>
                      <div className="step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ledger */}
              <div className="ledger-chrome">
                <div className="browser-tabs">
                  <div className="ledger-tab-1" />
                  <div className="ledger-tab-2" />
                  <div className="browser-urlbar">
                    <div className="browser-url"><span>bhoomi-setu.gov.in</span></div>
                    <div className="browser-go"><span>→ GO</span></div>
                    <div className="browser-menu"><MIcon name="more_vert" /></div>
                  </div>
                </div>
                <div className="ledger-body">
                  <div className="ledger-meta">IMMUTABLE LEDGER — PROPERTY #TN-4521-2019</div>
                  {LEDGER_BLOCKS.map((b, i) => (
                    <div key={i}>
                      {i > 0 && (
                        <div className="ledger-connector">
                          <div className="ledger-conn-line" />
                          <span className="ledger-conn-text">← prev_hash</span>
                        </div>
                      )}
                      <div
                        className="ledger-block"
                        style={{
                          border:     `2.5px solid ${i === 0 ? b.color : "#0D3D2B"}`,
                          background: i === 0 ? `${b.color}22` : "#F8F8F4",
                        }}
                      >
                        <div className="ledger-blk-top">
                          <span className="ledger-blk-event">{b.event}</span>
                          <span className="ledger-blk-badge" style={{ background: b.color }}>{b.status}</span>
                        </div>
                        <div className="ledger-blk-sub">{b.sub} · {b.date}</div>
                        <div className="ledger-blk-hash">{b.hash}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ PROPERTY DETAIL ══ */}
        <section id="verify" className="verify-section">
          <div className="section-inner">
            <div className="verify-grid">

              {/* Left: text */}
              <div>
                <SelectionBox color="#2EC4A0">
                  <span className="sel-tag">YOUR PROPERTY DASHBOARD</span>
                </SelectionBox>
                <h2 className="verify-title">
                  Every detail.<br />One secure place.
                </h2>
                <p className="verify-desc">
                  Once logged in, every property you own is fully visible — complete with
                  ownership history, survey details, ongoing transfer status, and a
                  cryptographic hash tied to the blockchain ledger.
                </p>
                <div className="verify-list">
                  {[
                    "Full ownership & transfer history",
                    "Live transfer & mutation status",
                    "Dispute tracking per property",
                    "Verified certificates on demand",
                    "Cryptographic hash on every record",
                  ].map((item, i) => (
                    <div key={i} className="verify-item">
                      <div className="verify-check">
                        <MIcon name="check" />
                      </div>
                      <span className="verify-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: property detail card mockup */}
              <div className="prop-wrap">
                <div className="prop-cursor"><Cursor /></div>
                <div className="prop-card">
                  <div className="prop-header">
                    <span className="prop-id">Property #TN-4521-CHN-2019</span>
                    <span className="prop-verified">
                      <MIcon name="verified" /> VERIFIED
                    </span>
                  </div>
                  <div className="prop-body">
                    {PROP_ROWS.map((row, i) => (
                      <div key={i} className="prop-row">
                        <span className="prop-row-label">{row.label}</span>
                        {row.badge
                          ? <span className="prop-row-badge">{row.value}</span>
                          : <span className={`prop-row-value ${row.bold ? "prop-row-bold" : ""}`}>{row.value}</span>
                        }
                      </div>
                    ))}
                    <div className="prop-hash-box">
                      <div className="prop-hash-lbl">BLOCK HASH</div>
                      <div className="prop-hash-val">0x3f9a1bc2d4e5f678a9b0c1d2e3f4a5b6</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="cta-section">
          <div className="cta-bg-text">BHOOMI</div>
          <div className="cta-inner">
            <SelectionBox color="#F07060">
              <span className="sel-tag">GET STARTED TODAY</span>
            </SelectionBox>
            <h2 className="cta-title">
              Your land records deserve to be{" "}
              <span className="cta-highlight">secure</span>
            </h2>
            <p className="cta-desc">
              Join thousands of property owners and government officials who have moved to
              verified, blockchain-ready land management.
            </p>
            <div className="cta-actions">
              <button className="cta-btn cta-primary"   onClick={() => navigate("/signup")}>Register as Citizen →</button>
              <button className="cta-btn cta-secondary" onClick={() => navigate("/login")}>Registrar Login →</button>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="main-footer">

          {/* Main footer: brand left + bordered box right */}
          <div className="footer-body">

            {/* Brand column — outside the box */}
            <div className="footer-brand-col">
              <div className="footer-logo-row">
                <img src="/assets/logo.png" alt="BhoomiSetu" className="footer-logo-img" />
                <span className="footer-name">BhoomiSetu</span>
              </div>
              <p className="footer-tagline">
                Digitizing India's land records — transparent, tamper-proof,
                and built for every citizen.
              </p>
              <p className="footer-builders">
                COPYRIGHT © 2026 | BHOOMISETU
              </p>
            </div>

            {/* Bordered rectangle containing the 3 link columns */}
            <div className="footer-cols-box">

              {/* Products column */}
              <div className="footer-col">
                <div className="footer-col-heading">Features</div>
                <span className="footer-col-link">Transfer Workflow</span>
                <span className="footer-col-link">Dispute Management</span>
                <span className="footer-col-link">Mutation & Inheritance</span>
                <span className="footer-col-link">Registrar Suite</span>
                <span className="footer-col-link">Audit Log</span>
              </div>

              {/* Company column */}
              <div className="footer-col">
                <div className="footer-col-heading">Company</div>
                <span className="footer-col-link">Contact Us</span>
                <span className="footer-col-link">Help Center</span>
                <span className="footer-col-link">GitHub</span>
              </div>

              {/* Legal column */}
              <div className="footer-col">
                <div className="footer-col-heading">Legal</div>
                <span className="footer-col-link">Terms</span>
                <span className="footer-col-link">
                  Privacy Policy <span className="ext-arrow">↗</span>
                </span>
                <span className="footer-col-link">Trust</span>
                <span className="footer-col-link">Citizen Agreement</span>
                <span className="footer-privacy-badge">
                  <span className="footer-privacy-icon">
                    ✓ <span className="footer-privacy-x">✕</span>
                  </span>
                  Your Privacy Choices
                </span>
              </div>

            </div>
          </div>

          {/* Watermark text flows below the content row */}
          <div className="footer-bg-word">BHOOMISETU</div>

        </footer>

      </div>
    </>
  );
}
