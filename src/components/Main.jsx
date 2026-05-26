import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const FEATURES = [
  { icon: "sync_alt",     title: "Transfer Workflow",        desc: "Seller initiates, buyer confirms, registrar approves. Every step logged, timestamped, and tied to uploaded documents.", color: "#2A7D4F", tag: "LEGAL PROCESS"    },
  { icon: "history",      title: "Ownership Timeline",       desc: "Visual chain-of-custody showing every owner, transfer date, and transaction since the property's first registration.",   color: "#2EC4A0", tag: "FULL HISTORY"      },
  { icon: "gavel",        title: "Dispute Management",       desc: "Flag suspicious records, submit evidence, track resolution. Dispute status is visible to all involved parties.",          color: "#e07a5f", tag: "ACCOUNTABILITY"   },
  { icon: "account_tree", title: "Mutation & Inheritance",   desc: "Legal heirs submit inheritance claims. Court orders and succession documents processed through an official workflow.",     color: "#2A7D4F", tag: "LEGAL SUCCESSION" },
  { icon: "track_changes",title: "Transfer Status Tracking", desc: "Both seller and buyer can track every stage of a transfer in real time — from initiation to final registrar approval.",    color: "#2EC4A0", tag: "TRANSPARENCY"     },
  { icon: "link",         title: "Blockchain-Ready Ledger",  desc: "Every record carries a cryptographic hash. Designed for seamless blockchain integration and tamper-proof verification.",   color: "#e07a5f", tag: "FUTURE-PROOF"     },
];

const STEPS = [
  { num: "01", title: "Create Your Account",  desc: "Register as a property owner or citizen. Your identity is verified and linked to your registered properties.",                 color: "#2A7D4F" },
  { num: "02", title: "View Your Properties", desc: "Log in to see all your registered land parcels, ownership history, and current status — all in one place.",                   color: "#2EC4A0" },
  { num: "03", title: "Initiate Transfer",    desc: "Submit a transfer request with required documents. The buyer confirms their side, and the request enters the registrar queue.", color: "#e07a5f" },
  { num: "04", title: "Registrar Approval",   desc: "The assigned registrar reviews all documents, verifies identities, then approves or requests clarification.",                  color: "#2A7D4F" },
  { num: "05", title: "Ledger Updated",       desc: "Ownership officially updated. A new block is added to the property's immutable timeline with a cryptographic hash.",            color: "#2EC4A0" },
];

const STATS = [
  { value: "2.4M+",  label: "Properties Registered", color: "#2A7D4F",  textColor: "#b8f0cc", bg: "#0f2318" },
  { value: "100%",   label: "Verification Accuracy",  color: "#2EC4A0",  textColor: "#6effc2", bg: "#0f2420" },
  { value: "28",     label: "States Covered",          color: "#e07a5f",  textColor: "#ffb380", bg: "#2a1a10" },
  { value: "3 Days", label: "Avg. Transfer Time",      color: "#fff",     textColor: "#fff",    bg: "#1a1a1a" },
];

const LEDGER_BLOCKS = [
  { event: "Ownership Transfer",   sub: "Haneesh Yadav → Avishek Nandi",    date: "22 March 2026",    hash: "0x3f9a...c4e5", color: "#2A7D4F", status: "VERIFIED"  },
  { event: "Mutation Approved",    sub: "Survey #4521-B Updated",            date: "24 March 2026",    hash: "0xa1b2...ef01", color: "#2EC4A0", status: "CONFIRMED" },
  { event: "Initial Registration", sub: "Govt. Records → Haneesh Yadav",     date: "08 December 2006", hash: "0x7f8e...f6e5", color: "#e07a5f", status: "GENESIS"   },
];

const PROP_ROWS = [
  { label: "Current Owner", value: "Haneesh Yadav",     bold: true  },
  { label: "Survey Number", value: "2609/A, Block G"              },
  { label: "Area",          value: "2,400 sq.ft."                 },
  { label: "District",      value: "Gurgaon, Haryana"           },
  { label: "Status",        value: "Clear Title",        badge: true },
  { label: "Last Transfer", value: "01 December 2017"              },
];

const HASHES = ["0x3f9a1bc2...c4e5f6", "0xa1b2c3d4...ef0112", "0x7f8e9d0c...f6e523", "0x2c4d6e8f...5e6f78"];

/* ══════════════════════════════════════════════════
   CSS — Matches UserDashboard + Header design system
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #e8e4db; }
  ::-webkit-scrollbar-thumb { background: #c0bdb5; border-radius: 4px; }

  .mi {
    font-family: 'Material Icons Sharp';
    font-style: normal; font-weight: normal; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    user-select: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hashfade {
    0%   { opacity: 0; transform: translateY(5px); }
    15%  { opacity: 1; transform: translateY(0); }
    85%  { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes float1 {
    0%,100% { transform: translateY(0) rotate(-4deg); }
    50%     { transform: translateY(-12px) rotate(-4deg); }
  }
  @keyframes float2 {
    0%,100% { transform: translateY(0) rotate(8deg); }
    50%     { transform: translateY(-9px) rotate(8deg); }
  }

  /* ── Root ── */
  .mp {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    color: #1a1a1a;
    min-height: 100vh;
  }

  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ════════════════════════════
     HERO
  ════════════════════════════ */
  .mp-hero {
    min-height: 100vh;
    background: linear-gradient(160deg, #1a1a1a 0%, #2c2c2c 55%, #0f2318 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 90px 2rem 4rem;
    position: relative; overflow: hidden;
  }

  /* subtle dot-grid overlay */
  .mp-hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      radial-gradient(circle, rgba(42,125,79,0.12) 1px, transparent 1px);
    background-size: 36px 36px;
    pointer-events: none;
  }

  .mp-hero-float {
    position: absolute; z-index: 1;
  }
  .mp-hero-float-1 { top: 14%; right: 8%;  animation: float1 4.5s ease-in-out infinite; }
  .mp-hero-float-2 { top: 22%; left: 6%;   animation: float2 5.5s ease-in-out infinite; }
  .mp-hero-float-3 { bottom: 28%; right: 9%; animation: float1 6s ease-in-out infinite; }
  .mp-hero-float-4 { bottom: 32%; left: 5%;  animation: float2 5s ease-in-out infinite; }

  .mp-hero-chip {
    padding: 5px 14px;
    border-radius: 20px;
    background: rgba(42,125,79,0.18);
    border: 1.5px solid rgba(42,125,79,0.4);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; color: #8FD4A8;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .mp-hero-chip-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #2A7D4F;
    animation: pulse 1.8s ease-in-out infinite;
  }

  .mp-hero-content {
    position: relative; z-index: 2;
    text-align: center; max-width: 820px;
    animation: fadeUp 0.65s ease both;
  }

  .mp-hero-h1 {
    font-size: clamp(2.8rem, 8vw, 6.2rem);
    font-weight: 800;
    line-height: 1.0;
    letter-spacing: -0.04em;
    color: #fff;
    margin: 1rem 0 0.25rem;
  }

  .mp-hero-h1-accent {
    background: linear-gradient(90deg, #2A7D4F, #8FD4A8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mp-hero-sub {
    font-size: clamp(0.88rem, 2vw, 1.05rem);
    color: rgba(255,255,255,0.5);
    max-width: 520px;
    margin: 1.2rem auto 2.2rem;
    line-height: 1.75;
    font-weight: 400;
  }

  /* Browser card */
  .mp-browser {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    overflow: hidden;
    max-width: 580px;
    margin: 0 auto 1.5rem;
    backdrop-filter: blur(10px);
  }

  .mp-browser-bar {
    background: rgba(255,255,255,0.06);
    border-bottom: 1.5px solid rgba(255,255,255,0.08);
    padding: 10px 14px;
    display: flex; align-items: center; gap: 8px;
  }

  .mp-browser-dot {
    width: 8px; height: 8px; border-radius: 50%;
  }

  .mp-browser-url {
    flex: 1;
    background: rgba(255,255,255,0.08);
    border-radius: 7px;
    padding: 4px 10px;
    font-size: 10.5px; font-weight: 500;
    color: rgba(255,255,255,0.4);
    font-family: 'DM Mono', monospace;
    margin: 0 8px;
  }

  .mp-search-row {
    padding: 14px 14px;
    display: flex; gap: 10px;
  }

  .mp-search-input {
    flex: 1;
    background: rgba(255,255,255,0.07);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px; font-weight: 500;
    font-family: 'Poppins', sans-serif;
    color: #fff; outline: none;
    transition: border-color 0.2s;
  }
  .mp-search-input:focus { border-color: rgba(42,125,79,0.6); }
  .mp-search-input::placeholder { color: rgba(255,255,255,0.28); }

  .mp-search-btn {
    background: #2A7D4F; color: #fff;
    border: none; border-radius: 12px;
    padding: 10px 18px;
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700;
    cursor: pointer; transition: background 0.15s;
    white-space: nowrap;
  }
  .mp-search-btn:hover { background: #1f6040; }

  /* Live hash bar */
  .mp-hash-bar {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 7px 16px;
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px;
  }
  .mp-hash-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #2EC4A0;
    box-shadow: 0 0 0 3px rgba(46,196,160,0.2);
  }
  .mp-hash-label {
    font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.1em; color: rgba(255,255,255,0.35);
  }
  .mp-hash-value {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: #8FD4A8;
    animation: hashfade 2.2s ease infinite;
  }

  /* Floating decorative chips */
  .mp-float-chip {
    padding: 8px 14px;
    background: rgba(26,26,26,0.85);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    font-size: 11px; font-weight: 600;
    color: #fff;
    backdrop-filter: blur(6px);
    display: flex; align-items: center; gap: 8px;
  }
  .mp-float-icon {
    width: 24px; height: 24px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .mp-float-icon .mi { font-size: 13px; color: #fff; }

  /* ════════════════════════════
     STATS
  ════════════════════════════ */
  .mp-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    background: #1a1a1a;
    border-top: 1.5px solid rgba(255,255,255,0.08);
    border-bottom: 1.5px solid rgba(255,255,255,0.08);
  }

  .mp-stat {
    padding: 2rem 1.5rem;
    text-align: center;
    position: relative; overflow: hidden;
    transition: transform 0.2s;
    cursor: default;
  }
  .mp-stat:not(:last-child) {
    border-right: 1.5px solid rgba(255,255,255,0.08);
  }
  .mp-stat:hover { transform: translateY(-3px); }

  .mp-stat-value {
    font-size: 2rem; font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 0.4rem;
  }
  .mp-stat-label {
    font-size: 10.5px; font-weight: 600;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
  }
  .mp-stat-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 9.5px; font-weight: 700;
    padding: 2px 9px; border-radius: 20px;
    margin-top: 0.4rem; width: fit-content; margin-left: auto; margin-right: auto;
  }

  /* ════════════════════════════
     FEATURES
  ════════════════════════════ */
  .mp-features {
    padding: 5rem 2rem;
    background: #dcdcdc;
    position: relative; z-index: 2;
  }

  .mp-section-label {
    display: inline-flex; align-items: center; gap: 7px;
    background: #f0f0f0;
    border: 1.5px solid #d0d0d0;
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; color: #666;
  }

  .mp-section-title {
    font-size: clamp(1.8rem, 4.5vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 1rem 0 0.75rem;
    color: #1a1a1a;
  }
  .mp-section-title span { color: #2A7D4F; }

  .mp-section-sub {
    font-size: 0.9rem;
    color: rgba(26,26,26,0.5);
    line-height: 1.7;
    max-width: 520px;
  }

  .mp-features-header {
    margin-bottom: 2.5rem;
  }

  .mp-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .mp-feat-card {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 20px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .mp-feat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
  }

  .mp-feat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.85rem;
  }
  .mp-feat-icon .mi { font-size: 1.4rem; color: #fff; }

  .mp-feat-tag {
    display: inline-block;
    border-radius: 6px;
    padding: 2px 9px;
    font-size: 9px; font-weight: 800;
    letter-spacing: 0.1em;
    margin-bottom: 0.6rem;
    color: #fff;
  }

  .mp-feat-title {
    font-weight: 800; font-size: 0.95rem;
    margin-bottom: 0.45rem; color: #1a1a1a;
  }

  .mp-feat-desc {
    font-size: 0.81rem;
    color: rgba(26,26,26,0.5);
    line-height: 1.65;
  }

  /* ════════════════════════════
     HOW IT WORKS
  ════════════════════════════ */
  .mp-how {
    background: #1a1a1a;
    padding: 5rem 2rem;
    position: relative; z-index: 2;
  }

  .mp-how-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(42,125,79,0.15);
    border: 1.5px solid rgba(42,125,79,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; color: #8FD4A8;
    margin-bottom: 1rem;
  }

  .mp-how-title {
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1; color: #fff;
    margin-bottom: 2.5rem;
  }
  .mp-how-title span { color: #2A7D4F; }

  .mp-how-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .mp-steps-list {
    display: flex; flex-direction: column; gap: 6px;
  }

  .mp-step-row {
    display: flex; gap: 1rem;
    padding: 1rem 1.1rem;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1.5px solid rgba(255,255,255,0.07);
  }
  .mp-step-row:hover { background: rgba(255,255,255,0.04); }

  .mp-step-num {
    width: 34px; height: 34px; min-width: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    font-family: 'DM Mono', monospace;
    transition: all 0.2s;
  }

  .mp-step-title {
    font-weight: 700; font-size: 0.9rem;
    color: #fff; margin-bottom: 0.25rem;
  }
  .mp-step-desc {
    font-size: 0.78rem;
    color: rgba(255,255,255,0.4);
    line-height: 1.6;
  }

  /* Ledger chrome */
  .mp-ledger {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    overflow: hidden;
  }

  .mp-ledger-topbar {
    background: rgba(255,255,255,0.05);
    border-bottom: 1.5px solid rgba(255,255,255,0.08);
    padding: 10px 14px;
    display: flex; align-items: center; gap: 6px;
  }

  .mp-ledger-meta {
    font-size: 9.5px; font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.3);
    padding: 1rem 1.25rem 0.6rem;
  }

  .mp-ledger-body { padding: 0 1.25rem 1.25rem; }

  .mp-ledger-connector {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 0 4px 12px;
  }
  .mp-ledger-conn-line {
    width: 2px; height: 12px;
    background: rgba(255,255,255,0.1);
    border-radius: 2px;
  }
  .mp-ledger-conn-text {
    font-size: 9px; color: rgba(255,255,255,0.2);
    font-family: 'DM Mono', monospace;
  }

  .mp-ledger-block {
    border-radius: 12px;
    padding: 0.8rem 1rem;
    border: 1.5px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    transition: background 0.2s;
  }
  .mp-ledger-block:hover { background: rgba(255,255,255,0.05); }

  .mp-ledger-blk-top {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 0.3rem;
  }
  .mp-ledger-blk-event {
    font-weight: 700; font-size: 0.8rem; color: #fff;
  }
  .mp-ledger-blk-badge {
    border-radius: 6px; padding: 2px 8px;
    font-size: 9px; font-weight: 800; color: #fff;
  }
  .mp-ledger-blk-sub {
    font-size: 0.68rem; color: rgba(255,255,255,0.4);
    margin-bottom: 0.3rem;
  }
  .mp-ledger-blk-hash {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem; color: #8FD4A8;
  }

  /* ════════════════════════════
     VERIFY / PROPERTY DETAIL
  ════════════════════════════ */
  .mp-verify {
    padding: 5rem 2rem;
    background: #dcdcdc;
    position: relative; z-index: 2;
  }

  .mp-verify-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .mp-verify-title {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 1rem 0; color: #1a1a1a;
  }
  .mp-verify-title span { color: #2A7D4F; }

  .mp-verify-desc {
    font-size: 0.9rem;
    color: rgba(26,26,26,0.55);
    line-height: 1.72;
    margin-bottom: 1.75rem;
  }

  .mp-verify-list {
    display: flex; flex-direction: column; gap: 0.65rem;
  }

  .mp-verify-item {
    display: flex; align-items: center; gap: 0.7rem;
  }

  .mp-verify-check {
    width: 20px; height: 20px;
    background: #1a1a1a;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mp-verify-check .mi { font-size: 12px; color: #2A7D4F; }

  .mp-verify-text {
    font-size: 0.87rem; font-weight: 600; color: #1a1a1a;
  }

  .mp-prop-wrap { position: relative; }

  .mp-prop-card {
    background: #fff;
    border: 1.5px solid #e0e0e0;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  .mp-prop-header {
    background: #1a1a1a;
    padding: 1rem 1.25rem;
    display: flex; justify-content: space-between; align-items: center;
  }

  .mp-prop-id {
    font-weight: 700; font-size: 0.8rem; color: #fff;
    font-family: 'DM Mono', monospace;
  }

  .mp-prop-verified {
    background: rgba(46,196,160,0.15);
    border: 1.5px solid rgba(46,196,160,0.3);
    border-radius: 8px;
    padding: 3px 10px;
    font-size: 10px; font-weight: 700;
    color: #2EC4A0;
    display: flex; align-items: center; gap: 4px;
  }
  .mp-prop-verified .mi { font-size: 12px; }

  .mp-prop-body { padding: 1.25rem; }

  .mp-prop-row {
    display: flex; justify-content: space-between;
    padding: 0.58rem 0;
  }
  .mp-prop-row:not(:last-child) {
    border-bottom: 1px solid rgba(26,26,26,0.08);
  }

  .mp-prop-label {
    font-size: 0.74rem; color: rgba(26,26,26,0.45); font-weight: 500;
  }
  .mp-prop-value {
    font-size: 0.8rem; font-weight: 700; color: #1a1a1a;
  }
  .mp-prop-bold { font-weight: 800; }
  .mp-prop-badge {
    background: rgba(42,125,79,0.1);
    border: 1.5px solid rgba(42,125,79,0.25);
    border-radius: 6px; padding: 1px 8px;
    font-size: 10px; font-weight: 700; color: #2A7D4F;
  }

  .mp-prop-hash {
    margin-top: 1rem;
    padding: 0.65rem;
    background: #f8f8f8;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
  }
  .mp-prop-hash-lbl {
    font-size: 9px; font-weight: 800;
    letter-spacing: 0.1em; color: rgba(26,26,26,0.35);
    margin-bottom: 3px;
  }
  .mp-prop-hash-val {
    font-family: 'DM Mono', monospace;
    font-size: 0.64rem; color: #2A7D4F;
  }

  /* ════════════════════════════
     DASHBOARDS
  ════════════════════════════ */
  .mp-dashboards {
    background: #1a1a1a;
    padding: 5rem 2rem;
    position: relative; z-index: 2;
  }

  .mp-dash-header {
    text-align: center; margin-bottom: 2.5rem;
  }
  .mp-dash-title {
    font-size: clamp(1.8rem, 4.5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em; color: #fff; margin-top: 0.75rem;
  }
  .mp-dash-title span { color: #2A7D4F; }
  .mp-dash-sub {
    font-size: 0.9rem; color: rgba(255,255,255,0.4);
    margin-top: 0.5rem;
  }

  .mp-dash-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .mp-dash-card {
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 24px;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .mp-dash-card:hover { border-color: rgba(255,255,255,0.2); }

  .mp-dash-head {
    padding: 1.25rem 1.5rem;
    border-bottom: 1.5px solid rgba(255,255,255,0.08);
  }

  .mp-dash-head-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.7rem;
  }
  .mp-dash-head-icon .mi { font-size: 1.4rem; color: #fff; }

  .mp-dash-name {
    font-weight: 800; font-size: 1.2rem; color: #fff;
  }
  .mp-dash-sub-txt {
    font-size: 0.78rem; color: rgba(255,255,255,0.45);
    margin-top: 0.2rem;
  }

  .mp-dash-body { padding: 1.25rem 1.5rem; }

  .mp-dash-item {
    display: flex; gap: 0.7rem;
    padding: 0.5rem 0;
    align-items: center;
  }
  .mp-dash-item:not(:last-of-type) {
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .mp-dash-arrow { font-weight: 800; font-size: 0.75rem; flex-shrink: 0; }
  .mp-dash-item-text { font-size: 0.83rem; font-weight: 500; color: rgba(255,255,255,0.75); }

  .mp-dash-btn {
    margin-top: 1.1rem; width: 100%;
    padding: 0.7rem;
    border: none; border-radius: 13px;
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700;
    cursor: pointer; transition: opacity 0.18s;
  }
  .mp-dash-btn:hover { opacity: 0.88; }

  /* ════════════════════════════
     CTA
  ════════════════════════════ */
  .mp-cta {
    padding: 6rem 2rem 5rem;
    background: #dcdcdc;
    text-align: center;
    position: relative; overflow: hidden; z-index: 2;
  }

  .mp-cta-bg-text {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-size: 18vw; font-weight: 800;
    color: rgba(26,26,26,0.04);
    letter-spacing: -0.05em;
    white-space: nowrap; user-select: none; pointer-events: none;
  }

  .mp-cta-inner {
    position: relative; z-index: 1;
    max-width: 680px; margin: 0 auto;
  }

  .mp-cta-title {
    font-size: clamp(2.2rem, 6vw, 4rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.05; color: #1a1a1a;
    margin: 1.25rem 0 1rem;
  }
  .mp-cta-title span {
    background: #1a1a1a; color: #fff;
    border-radius: 14px; padding: 0 14px;
    display: inline-block;
  }

  .mp-cta-desc {
    font-size: 0.95rem;
    color: rgba(26,26,26,0.55);
    line-height: 1.72; margin-bottom: 2.25rem;
  }

  .mp-cta-actions {
    display: flex; gap: 12px;
    justify-content: center; flex-wrap: wrap;
  }

  .mp-cta-btn {
    padding: 0.85rem 2rem;
    border-radius: 13px; border: none;
    font-family: 'Poppins', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.18s;
  }
  .mp-cta-primary {
    background: #1a1a1a; color: #fff;
  }
  .mp-cta-primary:hover { background: #2c2c2c; }
  .mp-cta-secondary {
    background: #fff; color: #1a1a1a;
    border: 1.5px solid #d0d0d0;
  }
  .mp-cta-secondary:hover { border-color: #aaa; }

  /* ════════════════════════════
     FOOTER
  ════════════════════════════ */
  .mp-footer {
    background: #161616;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
    position: relative; z-index: 2;
  }

  .mp-footer-body {
    padding: 0 0 0;
    max-width: 100%; margin: 0 auto;
    display: flex; align-items: stretch; gap: 0;
  }

  .mp-footer-brand {
    display: none;
  }

  .mp-footer-logo-row {
    display: flex; align-items: center; gap: 8px; margin-bottom: 0.2rem;
  }

  .mp-footer-logo-icon {
    width: 32px; height: 32px;
  }

  .mp-footer-brand-name {
    font-size: 1.1rem; font-weight: 800; color: #fff;
    letter-spacing: -0.01em;
  }

  .mp-footer-tagline {
    font-size: 0.82rem; color: rgba(255,255,255,0.4);
    line-height: 1.65; max-width: 220px;
  }

  .mp-footer-copyright {
    font-size: 0.68rem; color: rgba(255,255,255,0.2);
    margin-top: auto; padding-top: 1.5rem;
    letter-spacing: 0.04em;
  }

  .mp-footer-cols {
    flex: 1;
    border: 1.5px solid rgba(255,255,255,0.18);
    display: flex;
    overflow: hidden;
    margin: 2rem 2rem 2rem;
    position: relative;
  }

  .mp-footer-cols-row {
    display: contents;
  }

  .mp-footer-col-border-bottom {
    border-bottom: 1.5px solid rgba(255,255,255,0.18);
  }

  .mp-footer-col {
    flex: 1;
    display: flex; flex-direction: column; gap: 0;
    padding: 3rem 2rem 2.5rem;
    align-self: flex-start;
  }
  .mp-footer-col:not(:last-child) {
    border-right: 1.5px solid rgba(255,255,255,0.18);
  }

  .mp-footer-social-icons {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-top: 0.5rem;
  }

  .mp-footer-social-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: rgba(255,255,255,0.5);
    transition: border-color 0.18s, background 0.18s, color 0.18s;
  }
  .mp-footer-social-btn:hover {
    border-color: #2EC4A0;
    background: rgba(46,196,160,0.08);
    color: #2EC4A0;
  }
  .mp-footer-col:not(:last-child) {
    border-right: 1.5px solid rgba(255,255,255,0.08);
  }

  .mp-footer-col-heading {
    font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.9);
    margin-bottom: 1.25rem;
  }

  .mp-footer-col-link {
    font-size: 0.82rem; color: rgba(255,255,255,0.4);
    cursor: pointer; padding: 0.4rem 0;
    display: flex; align-items: center; gap: 4px;
    transition: color 0.18s;
  }
  .mp-footer-col-link:hover { color: #8FD4A8; }


  .mp-footer-right-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: 1.5px solid rgba(255,255,255,0.18);
    align-self: stretch;
  }

  .mp-footer-col-connect {
    border-left: none !important;
    border-bottom: 1.5px solid rgba(255,255,255,0.18);
    align-self: auto !important;
    flex: 0 !important;
  }

  .mp-footer-col-legal {
    border-left: none !important;
    align-self: auto !important;
    flex: 1 !important;
    border-bottom: 1.5px solid rgba(255,255,255,0.18);
  }

  .mp-footer-bg {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    display: flex; align-items: center; gap: 0.25em;
    font-size: 9vw;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.03em;
    white-space: nowrap;
    user-select: none; pointer-events: none;
    line-height: 1;
    padding: 0 0 0.4rem 1.5rem;
    overflow: hidden;
    max-width: 100%;
  }

  .mp-footer-wm-logo {
    height: 0.8em;
    width: auto;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
  }

  .mp-footer-copyright-bottom {
    font-size: 0.68rem; color: rgba(255,255,255,0.7);
    letter-spacing: 0.04em;
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: 2rem;
  }

  /* ════════════════════════════
     RESPONSIVE
  ════════════════════════════ */
  @media (max-width: 1024px) {
    .mp-features-grid { grid-template-columns: repeat(2, 1fr); }
    .mp-how-grid      { grid-template-columns: 1fr; gap: 2.5rem; }
    .mp-verify-grid   { grid-template-columns: 1fr; gap: 2.5rem; }
    .mp-dash-grid     { grid-template-columns: 1fr 1fr; }

    /* Footer — tablet: 2-col wrap */
    .mp-footer-cols {
      flex-wrap: wrap;
      margin: 2rem 1rem 1rem;
      overflow: visible;
    }
    .mp-footer-cols-row {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .mp-footer-col {
      flex: 1 1 30%;
      min-width: 150px;
      padding: 2rem 1.25rem;
      align-self: auto;
    }
    .mp-footer-col:not(:last-child) { border-right: none; border-bottom: 1.5px solid rgba(255,255,255,0.1); }
    .mp-footer-col-border-bottom { border-bottom: 1.5px solid rgba(255,255,255,0.1); }
    .mp-footer-right-panel {
      width: 100%; flex: none;
      flex-direction: row; flex-wrap: wrap;
      border-left: none;
      border-top: 1.5px solid rgba(255,255,255,0.18);
      align-self: auto;
    }
    .mp-footer-col-connect {
      flex: 1 1 50% !important;
      border-bottom: none !important;
      border-right: 1.5px solid rgba(255,255,255,0.18) !important;
    }
    .mp-footer-col-legal { flex: 1 1 50% !important; border-bottom: none !important; }
    .mp-footer-bg {
      position: relative;
      bottom: auto; left: auto; right: auto;
      font-size: clamp(2rem, 6vw, 4rem);
      padding: 1.5rem 0 1rem 1.25rem;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
    }
  }

  @media (max-width: 768px) {
    .mp-hero          { padding: 100px 1.25rem 3rem; min-height: auto; }
    .mp-hero-float-1, .mp-hero-float-2, .mp-hero-float-3, .mp-hero-float-4 { display: none; }
    .mp-stats         { grid-template-columns: repeat(2, 1fr); }
    .mp-stat:nth-child(2)   { border-right: none; }
    .mp-stat:nth-child(-n+2){ border-bottom: 1.5px solid rgba(255,255,255,0.08); }
    .mp-features-grid { grid-template-columns: 1fr; }
    .mp-features, .mp-verify, .mp-how, .mp-dashboards, .mp-cta { padding: 3rem 1.25rem; }
    .mp-dash-grid     { grid-template-columns: 1fr; }
    .mp-verify-grid   { grid-template-columns: 1fr; }
    .mp-cta-actions   { flex-direction: column; align-items: center; }
    .mp-cta-btn       { width: 100%; max-width: 360px; }

    /* Footer — mobile landscape: 2-col grid */
    .mp-footer-body { flex-direction: column; }
    .mp-footer-cols {
      flex-direction: column;
      margin: 1rem 0.75rem;
      overflow: visible;
    }
    .mp-footer-cols-row {
      display: flex;
      flex-wrap: wrap;
    }
    .mp-footer-col {
      flex: 1 1 48%;
      min-width: 130px;
      padding: 1.5rem 1rem;
      align-self: auto;
      border-right: none !important;
      border-bottom: 1.5px solid rgba(255,255,255,0.1) !important;
    }
    .mp-footer-right-panel {
      width: 100%; flex: none;
      flex-direction: row; flex-wrap: wrap;
      border-left: none;
      border-top: 1.5px solid rgba(255,255,255,0.18);
      align-self: auto;
    }
    .mp-footer-col-connect {
      flex: 1 1 50% !important;
      border-bottom: none !important;
      border-right: 1.5px solid rgba(255,255,255,0.18) !important;
    }
    .mp-footer-col-legal {
      flex: 1 1 50% !important;
      border-bottom: none !important;
    }
    .mp-footer-copyright-bottom { margin-top: 1rem; white-space: normal; }

    /* Watermark — flow in document on mobile */
    .mp-footer-bg {
      position: relative;
      bottom: auto; left: auto; right: auto;
      font-size: clamp(1.8rem, 8vw, 3.5rem);
      padding: 1.25rem 0 1rem 1rem;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      border-top: 1.5px solid rgba(255,255,255,0.1);
    }
    .mp-footer-wm-logo { height: 0.75em; }
  }

  @media (max-width: 480px) {
    .mp-hero-h1 { font-size: clamp(2rem, 12vw, 3rem); }
    .mp-section-inner { padding: 0; }

    /* Footer — small mobile: single column */
    .mp-footer-cols { margin: 0.75rem 0.5rem; }
    .mp-footer-col {
      flex: 1 1 100% !important;
      min-width: 100%;
    }
    .mp-footer-right-panel { flex-direction: column; }
    .mp-footer-col-connect {
      flex: none !important;
      border-right: none !important;
      border-bottom: 1.5px solid rgba(255,255,255,0.18) !important;
    }
    .mp-footer-col-legal { flex: none !important; }
    .mp-footer-bg {
      font-size: clamp(1.5rem, 7vw, 2.5rem);
      padding: 1rem 0 0.75rem 0.75rem;
    }
    .mp-footer-wm-logo { height: 0.7em; }
  }
`;

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const MI = ({ name, style }) => (
  <span className="mi" style={style}>{name}</span>
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

      <div className="mp">

        {/* ══ HERO ══ */}
        <section className="mp-hero">

          {/* Floating chips */}
          <div className="mp-hero-float mp-hero-float-1">
            <div className="mp-float-chip">
              <div className="mp-float-icon" style={{ background: "#2A7D4F" }}>
                <MI name="link" />
              </div>
              Blockchain Verified
            </div>
          </div>
          <div className="mp-hero-float mp-hero-float-2">
            <div className="mp-float-chip">
              <div className="mp-float-icon" style={{ background: "#2EC4A0" }}>
                <MI name="verified" />
              </div>
              Survey #4521-B
            </div>
          </div>
          <div className="mp-hero-float mp-hero-float-3">
            <div className="mp-float-chip">
              <div className="mp-float-icon" style={{ background: "#e07a5f" }}>
                <MI name="gavel" />
              </div>
              Dispute Resolved
            </div>
          </div>
          <div className="mp-hero-float mp-hero-float-4">
            <div className="mp-float-chip" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10 }}>
              0x3f9a1b…c4e5
            </div>
          </div>

          {/* Hero content */}
          <div className="mp-hero-content">
            <div className="mp-hero-chip">
              <div className="mp-hero-chip-dot" />
              BLOCKCHAIN-READY LAND REGISTRY PLATFORM
            </div>

            <h1 className="mp-hero-h1">Land Records,</h1>
            <h1 className="mp-hero-h1">
              <span className="mp-hero-h1-accent">Transparent</span> & Trusted
            </h1>

            <p className="mp-hero-sub">
              BhoomiSetu digitizes India's land registry — every ownership transfer, mutation,
              and inheritance recorded on a tamper-proof, time-stamped ledger.
              Secure, transparent, and built for every citizen.
            </p>

            {/* Browser + search */}
            <div className="mp-browser">
              <div className="mp-browser-bar">
                <div className="mp-browser-dot" style={{ background: "#e07a5f" }} />
                <div className="mp-browser-dot" style={{ background: "#d4a84b" }} />
                <div className="mp-browser-dot" style={{ background: "#2EC4A0" }} />
                <div className="mp-browser-url">bhoomi-setu.gov.in</div>
              </div>
              <div className="mp-search-row">
                <input
                  className="mp-search-input"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Enter Property ID, Survey No. or Owner Name..."
                />
                <button className="mp-search-btn" onClick={() => navigate("/login")}>
                  Login →
                </button>
              </div>
            </div>

            {/* Live hash bar */}
            <div className="mp-hash-bar">
              <div className="mp-hash-dot" />
              <span className="mp-hash-label">LATEST BLOCK</span>
              <span className="mp-hash-value">{HASHES[hashIdx]}</span>
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <div className="mp-stats">
          {STATS.map((s, i) => (
            <div key={i} className="mp-stat">
              <div className="mp-stat-value" style={{ color: s.textColor }}>{s.value}</div>
              <div className="mp-stat-label">{s.label}</div>
              <div
                className="mp-stat-badge"
                style={{
                  background: s.textColor + "18",
                  color: s.textColor,
                }}
              >
                ↑ verified
              </div>
            </div>
          ))}
        </div>

        {/* ══ FEATURES ══ */}
        <section id="features" className="mp-features">
          <div className="section-inner">
            <div className="mp-features-header">
              <div className="mp-section-label">
                <MI name="auto_awesome" style={{ fontSize: 11, color: "#2A7D4F" }} />
                PLATFORM CAPABILITIES
              </div>
              <h2 className="mp-section-title">
                Everything land ownership<br />
                should have <span>always been.</span>
              </h2>
              <p className="mp-section-sub">
                From transfer workflows to dispute resolution — every step of land management
                tracked, verified, and secured on-chain.
              </p>
            </div>
            <div className="mp-features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="mp-feat-card">
                  <div className="mp-feat-icon" style={{ background: f.color }}>
                    <MI name={f.icon} />
                  </div>
                  <div className="mp-feat-tag" style={{ background: f.color + "22", color: f.color }}>
                    {f.tag}
                  </div>
                  <div className="mp-feat-title">{f.title}</div>
                  <div className="mp-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section id="how-it-works" className="mp-how">
          <div className="section-inner">
            <div className="mp-how-tag">
              <MI name="route" style={{ fontSize: 11 }} />
              WORKFLOW
            </div>
            <h2 className="mp-how-title">
              How <span>BhoomiSetu</span> works
            </h2>

            <div className="mp-how-grid">

              {/* Steps */}
              <div className="mp-steps-list">
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    className="mp-step-row"
                    style={{
                      borderColor: activeStep === i ? s.color + "55" : "rgba(255,255,255,0.07)",
                      background:  activeStep === i ? s.color + "0d" : "transparent",
                    }}
                    onClick={() => setActiveStep(i)}
                  >
                    <div
                      className="mp-step-num"
                      style={{
                        background: activeStep === i ? s.color : "rgba(255,255,255,0.08)",
                        color:      activeStep === i ? "#fff" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {s.num}
                    </div>
                    <div>
                      <div className="mp-step-title">{s.title}</div>
                      <div className="mp-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ledger */}
              <div className="mp-ledger">
                <div className="mp-ledger-topbar">
                  <div className="mp-browser-dot" style={{ background: "#e07a5f", width: 8, height: 8, borderRadius: "50%" }} />
                  <div className="mp-browser-dot" style={{ background: "#d4a84b", width: 8, height: 8, borderRadius: "50%", marginRight: 2 }} />
                  <div className="mp-browser-dot" style={{ background: "#2EC4A0", width: 8, height: 8, borderRadius: "50%", marginRight: 6 }} />
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono',monospace" }}>bhoomi-setu.gov.in/ledger</div>
                </div>
                <div className="mp-ledger-meta">IMMUTABLE LEDGER — PROPERTY #TN-4521-2019</div>
                <div className="mp-ledger-body">
                  {LEDGER_BLOCKS.map((b, i) => (
                    <div key={i}>
                      {i > 0 && (
                        <div className="mp-ledger-connector">
                          <div className="mp-ledger-conn-line" />
                          <span className="mp-ledger-conn-text">← prev_hash</span>
                        </div>
                      )}
                      <div className="mp-ledger-block">
                        <div className="mp-ledger-blk-top">
                          <span className="mp-ledger-blk-event">{b.event}</span>
                          <span className="mp-ledger-blk-badge" style={{ background: b.color }}>
                            {b.status}
                          </span>
                        </div>
                        <div className="mp-ledger-blk-sub">{b.sub} · {b.date}</div>
                        <div className="mp-ledger-blk-hash">{b.hash}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ VERIFY / PROPERTY DETAIL ══ */}
        <section id="verify" className="mp-verify">
          <div className="section-inner">
            <div className="mp-verify-grid">

              {/* Left: text */}
              <div>
                <div className="mp-section-label">
                  <MI name="home_work" style={{ fontSize: 11, color: "#2A7D4F" }} />
                  YOUR PROPERTY DASHBOARD
                </div>
                <h2 className="mp-verify-title">
                  Every detail.<br />
                  <span>One secure place.</span>
                </h2>
                <p className="mp-verify-desc">
                  Once logged in, every property you own is fully visible — complete with
                  ownership history, survey details, ongoing transfer status, and a
                  cryptographic hash tied to the blockchain ledger.
                </p>
                <div className="mp-verify-list">
                  {[
                    "Full ownership & transfer history",
                    "Live transfer & mutation status",
                    "Dispute tracking per property",
                    "Verified certificates on demand",
                    "Cryptographic hash on every record",
                  ].map((item, i) => (
                    <div key={i} className="mp-verify-item">
                      <div className="mp-verify-check">
                        <MI name="check" />
                      </div>
                      <span className="mp-verify-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: property card */}
              <div className="mp-prop-wrap">
                <div className="mp-prop-card">
                  <div className="mp-prop-header">
                    <span className="mp-prop-id">Property #TN-4521-CHN-2019</span>
                    <span className="mp-prop-verified">
                      <MI name="verified" /> VERIFIED
                    </span>
                  </div>
                  <div className="mp-prop-body">
                    {PROP_ROWS.map((row, i) => (
                      <div key={i} className="mp-prop-row">
                        <span className="mp-prop-label">{row.label}</span>
                        {row.badge
                          ? <span className="mp-prop-badge">{row.value}</span>
                          : <span className={`mp-prop-value ${row.bold ? "mp-prop-bold" : ""}`}>{row.value}</span>
                        }
                      </div>
                    ))}
                    <div className="mp-prop-hash">
                      <div className="mp-prop-hash-lbl">BLOCK HASH</div>
                      <div className="mp-prop-hash-val">0x3f9a1bc2d4e5f678a9b0c1d2e3f4a5b6</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ DASHBOARDS ══ */}
        <section className="mp-dashboards">
          <div className="section-inner">
            <div className="mp-dash-header">
              <div className="mp-how-tag" style={{ margin: "0 auto 0.75rem" }}>
                <MI name="dashboard" style={{ fontSize: 11 }} />
                ROLE-BASED ACCESS
              </div>
              <h2 className="mp-dash-title">Built for <span>every stakeholder</span></h2>
              <p className="mp-dash-sub">Two purpose-built dashboards for citizens and registrars.</p>
            </div>

            <div className="mp-dash-grid">

              {/* Citizen */}
              <div className="mp-dash-card">
                <div className="mp-dash-head">
                  <div className="mp-dash-head-icon" style={{ background: "rgba(224,122,95,0.2)" }}>
                    <MI name="person" style={{ color: "#e07a5f" }} />
                  </div>
                  <div className="mp-dash-name">Citizen Dashboard</div>
                  <div className="mp-dash-sub-txt">For property owners and buyers</div>
                </div>
                <div className="mp-dash-body">
                  {[
                    "View all owned properties",
                    "Initiate & track transfers",
                    "Submit mutation requests",
                    "Download encumbrance certs",
                    "Track dispute resolutions",
                  ].map((item, i) => (
                    <div key={i} className="mp-dash-item">
                      <span className="mp-dash-arrow" style={{ color: "#e07a5f" }}>→</span>
                      <span className="mp-dash-item-text">{item}</span>
                    </div>
                  ))}
                  <button
                    className="mp-dash-btn"
                    style={{ background: "#e07a5f", color: "#fff" }}
                    onClick={() => navigate("/signup")}
                  >
                    Register as Citizen →
                  </button>
                </div>
              </div>

              {/* Registrar */}
              <div className="mp-dash-card">
                <div className="mp-dash-head">
                  <div className="mp-dash-head-icon" style={{ background: "rgba(91,79,212,0.2)" }}>
                    <MI name="admin_panel_settings" style={{ color: "#7C6EF5" }} />
                  </div>
                  <div className="mp-dash-name">Registrar Dashboard</div>
                  <div className="mp-dash-sub-txt">For government officials</div>
                </div>
                <div className="mp-dash-body">
                  {[
                    "Review transfer requests",
                    "Approve or reject applications",
                    "Manage mutation queue",
                    "Audit blockchain records",
                    "Issue official certificates",
                  ].map((item, i) => (
                    <div key={i} className="mp-dash-item">
                      <span className="mp-dash-arrow" style={{ color: "#7C6EF5" }}>→</span>
                      <span className="mp-dash-item-text">{item}</span>
                    </div>
                  ))}
                  <button
                    className="mp-dash-btn"
                    style={{ background: "#5B4FD4", color: "#fff" }}
                    onClick={() => navigate("/login")}
                  >
                    Registrar Login →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="mp-cta">
          <div className="mp-cta-bg-text">BHOOMI</div>
          <div className="mp-cta-inner">
            <div className="mp-section-label">
              <MI name="rocket_launch" style={{ fontSize: 11, color: "#2A7D4F" }} />
              GET STARTED TODAY
            </div>
            <h2 className="mp-cta-title">
              Your land records deserve to be{" "}
              <span>secure</span>
            </h2>
            <p className="mp-cta-desc">
              Join thousands of property owners and government officials who have moved to
              verified, blockchain-ready land management.
            </p>
            <div className="mp-cta-actions">
              <button className="mp-cta-btn mp-cta-primary" onClick={() => navigate("/signup")}>
                Register as Citizen →
              </button>
              <button className="mp-cta-btn mp-cta-secondary" onClick={() => navigate("/login")}>
                Registrar Login →
              </button>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="mp-footer">
          <div className="mp-footer-body">

            {/* Brand */}
            <div className="mp-footer-brand">
              <div className="mp-footer-logo-row">
                <svg className="mp-footer-logo-icon" viewBox="0 0 22 22" fill="none">
                  <rect x="1" y="1" width="8" height="8" rx="1.5" fill="white" />
                  <rect x="13" y="1" width="8" height="8" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="1" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.6" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.3" />
                </svg>
                <span className="mp-footer-brand-name">BhoomiSetu</span>
              </div>
            </div>

            {/* Columns */}
            <div className="mp-footer-cols">
              <div className="mp-footer-cols-row">
              <div className="mp-footer-col mp-footer-col-border-bottom">
                <div className="mp-footer-col-heading">Features</div>
                {["Transfer Workflow","Dispute Management","Mutation & Inheritance","Registrar Suite","Audit Log"].map(l => (
                  <span key={l} className="mp-footer-col-link">{l}</span>
                ))}
              </div>
              <div className="mp-footer-col mp-footer-col-border-bottom">
                <div className="mp-footer-col-heading">Company</div>
                {["About Us","Contact Us","Help Center","GitHub","Blog"].map(l => (
                  <span key={l} className="mp-footer-col-link">{l}</span>
                ))}
              </div>
              <div className="mp-footer-col mp-footer-col-border-bottom">
                <div className="mp-footer-col-heading">Blockchain</div>
                <div className="mp-footer-col-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mi" style={{ fontSize: 13, color: "#2EC4A0" }}>link</span> Ledger Explorer
                </div>
                <div className="mp-footer-col-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mi" style={{ fontSize: 13, color: "#2EC4A0" }}>verified</span> Verify Hash
                </div>
                <div className="mp-footer-col-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mi" style={{ fontSize: 13, color: "#2EC4A0" }}>history</span> Block History
                </div>
                <div className="mp-footer-col-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mi" style={{ fontSize: 13, color: "#2EC4A0" }}>fingerprint</span> Audit Trail
                </div>
                <div className="mp-footer-col-link" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="mi" style={{ fontSize: 13, color: "#2EC4A0" }}>lock</span> Tamper Proof
                </div>
              </div>
              <div className="mp-footer-col mp-footer-col-border-bottom">
                <div className="mp-footer-col-heading">Resources</div>
                {["Documentation","API Reference","Land Act Guide","FAQs","Status Page"].map(l => (
                  <span key={l} className="mp-footer-col-link">{l}</span>
                ))}
              </div>
              <div className="mp-footer-right-panel">
                {/* Connect */}
                <div className="mp-footer-col mp-footer-col-connect">
                  <div className="mp-footer-col-heading">Connect</div>
                  <div className="mp-footer-social-icons">
                    {/* LinkedIn */}
                    <div className="mp-footer-social-btn" title="LinkedIn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </div>
                    {/* GitHub */}
                    <div className="mp-footer-social-btn" title="GitHub">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    </div>
                    {/* X (Twitter) */}
                    <div className="mp-footer-social-btn" title="X / Twitter">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                    </div>
                    {/* Web / Link */}
                    <div className="mp-footer-social-btn" title="Website">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </div>
                  </div>
                </div>
                {/* Legal — sits directly below Connect */}
                <div className="mp-footer-col mp-footer-col-legal">
                  <div className="mp-footer-col-heading">Legal</div>
                  {["Terms","Privacy Policy","Trust","Citizen Agreement","Cookie Policy"].map(l => (
                    <span key={l} className="mp-footer-col-link">{l}</span>
                  ))}
                  <div className="mp-footer-copyright-bottom">COPYRIGHT © 2026 | BHOOMISETU</div>
                </div>
              </div>
              </div>{/* end mp-footer-cols-row */}

              {/* Watermark — inside the bordered box at the bottom */}
              <div className="mp-footer-bg">
                <img src="/assets/logo.png" className="mp-footer-wm-logo" alt="" />
                BHOOMISETU
              </div>
            </div>{/* end mp-footer-cols */}

          </div>
        </footer>

      </div>
    </>
  );
}