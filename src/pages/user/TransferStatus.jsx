import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTransfersByUser, getIncomingTransfers } from "../../database/Transfers";
import Navbar1 from "../../components/Navbar1";

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
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
    from{transform: rotate(0);
    }to{transform: rotate(360deg);
    };
  }
  @keyframes slideIn {
    from{opacity: 0;
    transform: translateX(18px);
    }to{opacity: 1;
    transform: translateX(0);
    };
  }

  .ts-page {
    font-family: 'Poppins',sans-serif;
    background: #EFEFEB;
    color: #0D3D2B;
    min-height: 100vh;
  }
  /* grid-bg removed */

  /* ── Hero ── */
/* ── Slim page header ── */
  .ts-header {
    background: #fff;
    border-bottom: 2px solid rgba(13,61,43,0.1);
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .ts-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .ts-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .ts-page-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
  }
  .ts-page-title {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }
  .ts-page-sub {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    margin-top: 0.1rem;
  }

  /* ── Content ── */
  .ts-content {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 2.5rem 4rem;
  }

  /* ── Section labels ── */
  .ts-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.85rem;
  }
  .ts-section-lbl {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.45);
  }
  .ts-section-count {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(13,61,43,0.35);
  }

  /* ══════════════════════════════════
     HORIZONTAL CARD ROWS
  ══════════════════════════════════ */
  .ts-cards-row {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: thin;
  }
  .ts-cards-row::-webkit-scrollbar { height: 4px; }
  .ts-cards-row::-webkit-scrollbar-thumb {
    background: #0D3D2B;
    border-radius: 2px;
  }

  .ts-txn-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    cursor: pointer;
    transition:transform 0.18s,box-shadow 0.18s;
    flex-shrink: 0;
    width: 260px;
    animation: fadeUp 0.4s ease both;
  }
  .ts-txn-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(13,61,43,0.1);
  }
  .ts-txn-top { padding: 1rem 1.1rem; }
  .ts-txn-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .ts-txn-id {
    font-family: 'DM Mono',monospace;
    font-size: 0.6rem;
    color: rgba(13,61,43,0.35);
  }
  .ts-txn-badge {
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 0.62rem;
    font-weight: 800;
    border: 1.5px solid rgba(13,61,43,0.2);
  }
  .ts-txn-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #0D3D2B;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }
  .ts-txn-sub {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
  }
  .ts-mini-steps {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-top: 0.65rem;
  }
  .ts-mini-step {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: rgba(13,61,43,0.1);
  }
  .ts-mini-step-done { background: #2EC4A0; }
  .ts-mini-step-active { background: #C8F135; }
  .ts-txn-footer {
    border-top: 1.5px solid rgba(13,61,43,0.08);
    padding: 0.5rem 1.1rem;
    background: rgba(13,61,43,0.02);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ts-txn-date {
    font-size: 0.62rem;
    font-weight: 600;
    color: rgba(13,61,43,0.4);
  }
  .ts-txn-value {
    font-size: 0.72rem;
    font-weight: 800;
    color: #0D3D2B;
  }

  /* Incoming card — orange accent */
  .ts-inc-card {
    border: 2.5px solid #F0A030;
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(240,160,48,0.15);
    cursor: pointer;
    transition:transform 0.18s,box-shadow 0.18s;
    flex-shrink: 0;
    width: 260px;
    animation: fadeUp 0.4s ease both;
  }
  .ts-inc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(240,160,48,0.15);
  }
  .ts-inc-badge {
    background: rgba(240,160,48,0.15);
    color: #c07000;
    border: 1.5px solid rgba(240,160,48,0.4);
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 0.6rem;
    font-weight: 800;
  }
  .ts-inc-pulse {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #F0A030;
    box-shadow: 0 0 0 3px rgba(240,160,48,0.25);
    flex-shrink: 0;
  }

  /* New transfer button card */
  .ts-new-card {
    border: 2.5px dashed rgba(13,61,43,0.25);
    border-radius: 14px;
    background: transparent;
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
    width: 180px;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .ts-new-card:hover {
    border-color: #0D3D2B;
    background: rgba(200,241,53,0.08);
  }
  .ts-new-card-icon {
    font-size: 1.5rem;
    opacity: 0.4;
  }
  .ts-new-card-lbl {
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(13,61,43,0.5);
  }

  /* Section divider */
  .ts-divider {
    height: 1.5px;
    background: rgba(13,61,43,0.1);
    margin: 2rem 0;
    border-radius: 2px;
  }

  /* ══════════════════════════════════
     DETAIL VIEW (full-page overlay within content)
  ══════════════════════════════════ */
  .ts-detail-view { animation: slideIn 0.25s ease both; }

  .ts-detail-back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 1rem;
    border: 2px solid rgba(13,61,43,0.2);
    border-radius: 8px;
    background: #fff;
    color: #0D3D2B;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.18s;
    margin-bottom: 1.5rem;
    box-shadow:2px 2px 0 rgba(13,61,43,0.1);
  }
  .ts-detail-back:hover {
    background: #0D3D2B;
    color: #C8F135;
    border-color: #0D3D2B;
  }
  .ts-detail-back .material-icons-sharp { font-size: 16px; }

  .ts-detail-card {
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(13,61,43,0.08);
  }
  .ts-detail-chrome {
    border-bottom: 1px solid rgba(13,61,43,0.08);
    display: flex;
    align-items: flex-end;
    padding: 6px 12px 0;
    gap: 5px;
    background: #F0F0EC;
  }
  .ts-detail-tab {
    height: 26px;
    border-radius: 7px 7px 0 0;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-bottom: none;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 0.62rem;
    font-weight: 800;
  }
  .ts-detail-body { padding: 1.5rem; }

  /* Info cells */
  .ts-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .ts-info-cell {
    background: rgba(13,61,43,0.02);
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 8px;
    padding: 0.55rem 0.75rem;
  }
  .ts-info-lbl {
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.35);
    margin-bottom: 0.15rem;
  }
  .ts-info-val {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
  }

  /* Transfer timeline */
  .ts-tl-title {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
    margin-bottom: 1rem;
  }
  .ts-tl-list {
    display: flex;
    flex-direction: column;
  }
  .ts-tl-item {
    display: flex;
    gap: 0.85rem;
  }
  .ts-tl-spine {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }
  .ts-tl-dot {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 2.5px solid rgba(13,61,43,0.2);
    flex-shrink: 0;
    margin-top: 2px;
  }
  .ts-tl-dot-done {
    background: #2EC4A0;
    border-color: #2EC4A0;
  }
  .ts-tl-dot-active {
    background: #C8F135;
    border-color: #0D3D2B;
  }
  .ts-tl-dot-pending {
    background: transparent;
    border-color: rgba(13,61,43,0.15);
  }
  .ts-tl-line {
    flex: 1;
    width: 2px;
    background: rgba(13,61,43,0.1);
    margin: 2px 0;
    min-height: 18px;
  }
  .ts-tl-line-done { background: #2EC4A0; }
  .ts-tl-content {
    flex: 1;
    padding-bottom: 1rem;
  }
  .ts-tl-step {
    font-size: 0.88rem;
    font-weight: 700;
    color: #0D3D2B;
    margin-bottom: 0.2rem;
  }
  .ts-tl-step-pending {
    color: rgba(13,61,43,0.35);
    font-weight: 500;
  }
  .ts-tl-actor {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
  }
  .ts-tl-date {
    font-size: 0.68rem;
    font-weight: 600;
    color: rgba(13,61,43,0.35);
    margin-top: 0.1rem;
  }

  /* Ownership timeline (incoming) */
  .ts-own-title {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: rgba(13,61,43,0.4);
    margin: 1.5rem 0 1rem;
  }
  .ts-own-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .ts-own-item {
    display: flex;
    gap: 0.85rem;
  }
  .ts-own-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1.5px solid rgba(13,61,43,0.1);
    flex-shrink: 0;
    margin-top: 3px;
  }
  .ts-own-dot-genesis {
    background: #C8F135;
    border-color: #0D3D2B;
  }
  .ts-own-dot-confirmed {
    background: #2EC4A0;
    border-color: #2EC4A0;
  }
  .ts-own-dot-pending {
    background: #F0A030;
    border-color: #F0A030;
  }
  .ts-own-line {
    flex: 1;
    width: 2px;
    background: rgba(13,61,43,0.12);
    margin: 2px 0;
    min-height: 20px;
  }
  .ts-own-content {
    flex: 1;
    padding-bottom: 1rem;
  }
  .ts-own-event {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0D3D2B;
  }
  .ts-own-parties {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
    margin-top: 0.1rem;
  }
  .ts-own-date {
    font-size: 0.65rem;
    color: rgba(13,61,43,0.35);
    margin-top: 0.1rem;
  }
  .ts-own-hash {
    font-family: 'DM Mono',monospace;
    font-size: 0.6rem;
    color: rgba(91,79,212,0.6);
    margin-top: 0.15rem;
  }
  .ts-own-badge {
    display: inline-block;
    border-radius: 4px;
    padding: 1px 6px;
    font-size: 0.58rem;
    font-weight: 800;
    margin-top: 0.2rem;
  }
  .ts-own-badge-genesis {
    background: #C8F135;
    color: #0D3D2B;
    border: 1.5px solid rgba(13,61,43,0.1);
  }
  .ts-own-badge-confirmed {
    background: #2EC4A0;
    color: #fff;
  }
  .ts-own-badge-pending {
    background: #F0A030;
    color: #fff;
  }

  /* Notes box */
  .ts-notes {
    background: rgba(13,61,43,0.02);
    border: 2px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    margin-top: 1rem;
    font-size: 0.8rem;
    color: rgba(13,61,43,0.6);
    line-height: 1.55;
  }
  .ts-notes-label {
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: rgba(13,61,43,0.35);
    margin-bottom: 0.3rem;
  }

  /* ══════════════════════════════════
     CONFIRMATION MODAL
  ══════════════════════════════════ */
  .ts-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(13,61,43,0.5);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .ts-modal {
    background: #fff;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 18px;
    box-shadow: 6px 6px 0 #0D3D2B;
    width: 100%;
    max-width: 440px;
    animation: fadeUp 0.25s ease both;
    overflow: hidden;
    font-family:'Poppins',sans-serif;
  }
  .ts-modal-head {
    background: #0D3D2B;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .ts-modal-head-icon {
    width: 36px;
    height: 36px;
    background: #F0A030;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ts-modal-head-icon .material-icons-sharp {
    font-size: 20px;
    color: #fff;
  }
  .ts-modal-title {
    font-size: 1rem;
    font-weight: 800;
    color: #fff;
    font-family: 'Poppins',sans-serif;
  }
  .ts-modal-sub {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.5);
    margin-top: 0.15rem;
    font-family: 'Poppins',sans-serif;
  }
  .ts-modal-body { padding: 1.5rem; }

  /* Property summary in modal */
  .ts-modal-prop {
    background: rgba(13,61,43,0.02);
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    padding: 0.85rem 1rem;
    margin-bottom: 1.25rem;
  }
  .ts-modal-prop-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #0D3D2B;
  }
  .ts-modal-prop-meta {
    font-size: 0.72rem;
    color: rgba(13,61,43,0.5);
    margin-top: 0.15rem;
  }
  .ts-modal-prop-value {
    font-size: 0.82rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-top: 0.4rem;
  }

  /* Consent checkbox */
  .ts-modal-consent {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    margin-bottom: 1.25rem;
    cursor: pointer;
  }
  .ts-modal-check-box {
    width: 20px;
    height: 20px;
    min-width: 20px;
    border: 2px solid rgba(13,61,43,0.3);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    transition: all 0.15s;
    margin-top: 1px;
    background: #fff;
  }
  .ts-modal-check-box-checked {
    background: #C8F135;
    border-color: #0D3D2B;
    color: #0D3D2B;
  }
  .ts-modal-consent-text {
    font-size: 0.78rem;
    color: rgba(13,61,43,0.7);
    line-height: 1.55;
  }

  /* Password field */
  .ts-modal-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
  }
  .ts-modal-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #0D3D2B;
    letter-spacing: 0.02em;
  }
  .ts-modal-input {
    padding: 0.65rem 1rem;
    border: 2px solid rgba(13,61,43,0.2);
    border-radius: 9px;
    background: rgba(13,61,43,0.02);
    font-size: 0.88rem;
    font-family: 'Poppins',sans-serif;
    color: #0D3D2B;
    outline: none;
    transition: all 0.2s;
    width: 100%;
  }
  .ts-modal-input:focus {
    border-color: #0D3D2B;
    background: #fff;
  }
  .ts-modal-input::placeholder { color: rgba(13,61,43,0.32); }
  .ts-modal-input-error { border-color: #F07060; }
  .ts-modal-error {
    font-size: 0.7rem;
    font-weight: 700;
    color: #c0392b;
    margin-top: 0.25rem;
  }

  /* Modal actions */
  .ts-modal-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  .ts-modal-btn-cancel {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid rgba(13,61,43,0.2);
    border-radius: 10px;
    background: #fff;
    color: rgba(13,61,43,0.6);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Poppins',sans-serif;
    transition: all 0.18s;
  }
  .ts-modal-btn-cancel:hover {
    border-color: #0D3D2B;
    color: #0D3D2B;
  }
  .ts-modal-btn-confirm {
    flex: 1;
    padding: 0.75rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: 'Poppins',sans-serif;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
    transition: opacity 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .ts-modal-btn-confirm:hover { opacity: 0.88; }
  .ts-modal-btn-confirm:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .ts-modal-btn-decline {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #F07060;
    border-radius: 10px;
    background: #fff;
    color: #F07060;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Poppins',sans-serif;
    transition: all 0.18s;
  }
  .ts-modal-btn-decline:hover { background: rgba(240,112,96,0.06); }
  .spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }

  /* Confirmed/declined state */
  .ts-modal-done {
    text-align: center;
    padding: 1.5rem 1rem;
  }
  .ts-modal-done-icon {
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: center;
  }
  .ts-modal-done-title {
    font-size: 1rem;
    font-weight: 800;
    color: #0D3D2B;
    margin-bottom: 0.3rem;
  }
  .ts-modal-done-sub {
    font-size: 0.8rem;
    color: rgba(13,61,43,0.5);
    line-height: 1.55;
    margin-bottom: 1.25rem;
  }
  .ts-modal-done-btn {
    padding: 0.65rem 1.5rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  /* Empty state */
  .ts-empty {
    text-align: center;
    padding: 3rem 2rem;
    border: 2.5px dashed rgba(13,61,43,0.15);
    border-radius: 14px;
    background: #fff;
  }
  .ts-empty-icon {
    margin-bottom: 0.75rem;
    opacity: 0.3;
  }
  .ts-empty-title {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 0.3rem;
  }
  .ts-empty-sub {
    font-size: 0.82rem;
    color: rgba(13,61,43,0.45);
  }
  .ts-start-btn {
    margin-top: 1rem;
    padding: 0.65rem 1.5rem;
    border: 1.5px solid rgba(13,61,43,0.1);
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 0 2px 8px rgba(13,61,43,0.06);
  }

  /* Page container */
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
  @media(max-width:768px) {
    .page-container{margin: 1rem;
    border-radius: 12px;
    };
  }
  @media(max-width:480px) {
    .page-container{margin: 0.65rem;
    border-radius: 10px;
    };
  }

  @media(max-width:768px) {
    .ts-hero { padding: 1.5rem 1rem 1.5rem; }
    .ts-content { padding: 1.25rem 1rem 3rem; }
    .ts-info-grid { grid-template-columns: 1fr; }
    .ts-modal-actions { flex-direction: column; }
  }
`;

/* ══════════════════════════════════════════════════
   OWNERSHIP TIMELINE COMPONENT
══════════════════════════════════════════════════ */
function OwnershipTimeline({ timeline }) {
  const badgeClass = (status) =>
    status === "GENESIS"   ? "ts-own-badge ts-own-badge-genesis"   :
    status === "CONFIRMED" ? "ts-own-badge ts-own-badge-confirmed" :
                             "ts-own-badge ts-own-badge-pending";
  const dotClass = (status) =>
    status === "GENESIS"   ? "ts-own-dot ts-own-dot-genesis"   :
    status === "CONFIRMED" ? "ts-own-dot ts-own-dot-confirmed" :
                             "ts-own-dot ts-own-dot-pending";
  return (
    <div className="ts-own-list">
      {timeline.map((t, i) => (
        <div key={i} className="ts-own-item">
          <div className="ts-tl-spine">
            <div className={dotClass(t.status)} />
            {i < timeline.length - 1 && <div className="ts-own-line" />}
          </div>
          <div className="ts-own-content">
            <div className="ts-own-event">{t.event}</div>
            {(t.from || t.to) && (
              <div className="ts-own-parties">
                {t.from && t.to ? `${t.from} → ${t.to}` : t.from || t.to}
              </div>
            )}
            <div className="ts-own-date">{t.date}</div>
            <div className="ts-own-hash">{t.hash}</div>
            <span className={badgeClass(t.status)}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CONFIRMATION MODAL
══════════════════════════════════════════════════ */
function ConfirmModal({ transfer, onClose, onConfirm, onDecline }) {
  const [consent,   setConsent]  = useState(false);
  const [password,  setPassword] = useState("");
  const [pwError,   setPwError]  = useState("");
  const [loading,   setLoading]  = useState(null); // "confirm"|"decline"
  const [done,      setDone]     = useState(null);  // "confirmed"|"declined"

  const handleConfirm = async () => {
    if (!consent)        { setPwError("Please accept the declaration."); return; }
    if (!password.trim()){ setPwError("Please enter your account password."); return; }
    // Simulate password check — in production this hits an API
    if (password !== "user123") { setPwError("Incorrect password. Please try again."); return; }
    setPwError("");
    setLoading("confirm");
    await new Promise(r => setTimeout(r, 1200));
    setLoading(null);
    setDone("confirmed");
    onConfirm?.();
  };

  const handleDecline = async () => {
    setLoading("decline");
    await new Promise(r => setTimeout(r, 900));
    setLoading(null);
    setDone("declined");
    onDecline?.();
  };

  return (
    <div className="ts-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ts-modal">

        <div className="ts-modal-head">
          <div className="ts-modal-head-icon">
            <span className="material-icons-sharp">gavel</span>
          </div>
          <div>
            <div className="ts-modal-title">Confirm Transfer Request</div>
            <div className="ts-modal-sub">Your response will be recorded on the blockchain ledger</div>
          </div>
        </div>

        <div className="ts-modal-body">
          {done ? (
            <div className="ts-modal-done">
              <div className="ts-modal-done-icon">
                <span className="material-icons-sharp" style={{ fontSize:40, color: done === "confirmed" ? "#2EC4A0" : "#F07060" }}>
                  {done === "confirmed" ? "check_circle" : "cancel"}
                </span>
              </div>
              <div className="ts-modal-done-title">
                {done === "confirmed" ? "Transfer Confirmed!" : "Transfer Declined"}
              </div>
              <div className="ts-modal-done-sub">
                {done === "confirmed"
                  ? `You've confirmed the purchase of ${transfer.propertyTitle}. The transfer has moved to the registrar queue.`
                  : `You've declined the transfer request for ${transfer.propertyTitle}. The seller has been notified.`
                }
              </div>
              <button className="ts-modal-done-btn" onClick={onClose}>Close</button>
            </div>
          ) : (
            <>
              {/* Property summary */}
              <div className="ts-modal-prop">
                <div className="ts-modal-prop-title">{transfer.propertyTitle}</div>
                <div className="ts-modal-prop-meta">{transfer.propertyId} · {transfer.district}</div>
                <div className="ts-modal-prop-value">{transfer.saleValue} · Seller: {transfer.sellerName}</div>
              </div>

              {/* Consent */}
              <div className="ts-modal-consent" onClick={() => { setConsent(c => !c); setPwError(""); }}>
                <div className={`ts-modal-check-box ${consent ? "ts-modal-check-box-checked" : ""}`}>
                  {consent ? <span className="material-icons-sharp" style={{ fontSize:14 }}>check</span> : ""}
                </div>
                <span className="ts-modal-consent-text">
                  I confirm that I am the intended buyer of this property and agree to proceed with the ownership transfer as listed above. I understand this action is irreversible once approved by the registrar.
                </span>
              </div>

              {/* Password */}
              <div className="ts-modal-field">
                <label className="ts-modal-label">ACCOUNT PASSWORD</label>
                <input
                  type="password"
                  className={`ts-modal-input ${pwError ? "ts-modal-input-error" : ""}`}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPwError(""); }}
                  placeholder="Enter your account password to confirm"
                />
                {pwError && <span className="ts-modal-error"><span className="material-icons-sharp" style={{ fontSize:13, verticalAlign:"middle", marginRight:3 }}>warning</span>{pwError}</span>}
              </div>

              <div className="ts-modal-actions">
                <button className="ts-modal-btn-decline" onClick={handleDecline} disabled={!!loading}>
                  {loading === "decline" ? <><span className="spinner" />Declining...</> : <><span className="material-icons-sharp" style={{ fontSize:16, verticalAlign:"middle", marginRight:4 }}>close</span>Decline</>}
                </button>
                <button className="ts-modal-btn-confirm" onClick={handleConfirm} disabled={!!loading}>
                  {loading === "confirm" ? <><span className="spinner" />Confirming...</> : <><span className="material-icons-sharp" style={{ fontSize:16, verticalAlign:"middle", marginRight:4 }}>check</span>Confirm Transfer</>}
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
   TRANSFER STATUS PAGE
══════════════════════════════════════════════════ */
export default function TransferStatus() {
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  // Detail view state: { type: "outgoing"|"incoming", transfer }
  const [detailView,  setDetailView]  = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const outgoing = user ? getTransfersByUser(user.id).filter(t => t.sellerId === user.id) : [];
  const incoming = user ? getIncomingTransfers(user.id) : [];

  const completed = outgoing.filter(t => t.status === "Completed").length;
  const pending   = outgoing.filter(t => t.status !== "Completed").length;

  /* ── Transfer timeline renderer ── */
  const renderTimeline = (transfer) => (
    <div className="ts-tl-list">
      {transfer.timeline.map((s, i) => {
        const isDone  = s.done;
        const isNext  = !s.done && (i === 0 || transfer.timeline[i - 1]?.done);
        const dotCls  = isDone ? "ts-tl-dot-done" : isNext ? "ts-tl-dot-active" : "ts-tl-dot-pending";
        const lineDone = isDone && i < transfer.timeline.length - 1;
        return (
          <div key={i} className="ts-tl-item">
            <div className="ts-tl-spine">
              <div className={`ts-tl-dot ${dotCls}`} />
              {i < transfer.timeline.length - 1 && <div className={`ts-tl-line ${lineDone ? "ts-tl-line-done" : ""}`} />}
            </div>
            <div className="ts-tl-content">
              <div className={`ts-tl-step ${!isDone && !isNext ? "ts-tl-step-pending" : ""}`}>{s.step}</div>
              {s.actor && <div className="ts-tl-actor">by {s.actor}</div>}
              {s.date  && <div className="ts-tl-date">{s.date}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ts-page">
        <Navbar1 user={user} onLogout={logout} />

        <div className="page-container">

          {/* Hero */}
          <div className="ts-header">
          <div className="ts-header-left">
            <span className="ts-page-title">Transfer Status</span>
            <span className="ts-page-sub">Track your transfers and respond to incoming requests</span>
          </div>
        </div>

          {/* ── CONTENT ── */}
          <div className="ts-content">

            {detailView ? (
              /* ════════════════════════════════
                 DETAIL VIEW
              ════════════════════════════════ */
              <div className="ts-detail-view">
                <button className="ts-detail-back" onClick={() => setDetailView(null)}>
                  <span className="material-icons-sharp">arrow_back</span>
                  Back
                </button>

                <div className="ts-detail-card">
                  <div className="ts-detail-chrome">
                    <div className="ts-detail-tab" style={{ background: detailView.type === "incoming" ? "#F0A030" : "#5B4FD4", color:"#fff", minWidth:130 }}>
                      {detailView.transfer.id}
                    </div>
                    <div className="ts-detail-tab" style={{ background:"#C8F135", color:"#0D3D2B", minWidth:80 }}>
                      {detailView.type === "incoming" ? "INCOMING" : "DETAILS"}
                    </div>
                  </div>
                  <div className="ts-detail-body">

                    {/* Info grid */}
                    <div className="ts-info-grid">
                      {[
                        { label:"PROPERTY",   value: detailView.transfer.propertyTitle },
                        { label:"SALE VALUE", value: detailView.transfer.saleValue     },
                        { label:"SELLER",     value: detailView.transfer.sellerName    },
                        { label:"BUYER",      value: detailView.transfer.buyerName     },
                        { label:"INITIATED",  value: detailView.transfer.initiatedOn   },
                        { label:detailView.type === "incoming" ? "STATUS" : "COMPLETED",
                          value: detailView.type === "incoming" ? detailView.transfer.status : (detailView.transfer.completedOn || "In progress") },
                      ].map((r, i) => (
                        <div key={i} className="ts-info-cell">
                          <div className="ts-info-lbl">{r.label}</div>
                          <div className="ts-info-val">{r.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Transfer timeline — outgoing */}
                    {detailView.type === "outgoing" && (
                      <>
                        <div className="ts-tl-title">TRANSFER TIMELINE</div>
                        {renderTimeline(detailView.transfer)}
                        {detailView.transfer.notes && (
                          <div className="ts-notes">
                            <div className="ts-notes-label">REGISTRAR NOTES</div>
                            {detailView.transfer.notes}
                          </div>
                        )}
                      </>
                    )}

                    {/* Ownership timeline + confirm actions — incoming */}
                    {detailView.type === "incoming" && (
                      <>
                        <div className="ts-own-title">PROPERTY OWNERSHIP HISTORY</div>
                        <OwnershipTimeline timeline={detailView.transfer.ownershipTimeline} />

                        {detailView.transfer.notes && (
                          <div className="ts-notes" style={{ marginTop:"1.5rem" }}>
                            <div className="ts-notes-label">SELLER NOTE</div>
                            {detailView.transfer.notes}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:"0.75rem", marginTop:"1.5rem" }}>
                          <button
                            style={{ flex:1, padding:"0.82rem", border:"1.5px solid #C8F135", borderRadius:"11px", background:"#C8F135", color:"#0D3D2B", fontWeight:800, fontSize:"0.88rem", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 12px rgba(13,61,43,0.12)" }}
                            onClick={() => setShowConfirm(true)}
                          >
                            <span className="material-icons-sharp" style={{ fontSize:16, verticalAlign:"middle", marginRight:4 }}>how_to_vote</span>Confirm or Decline
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              </div>

            ) : (
              /* ════════════════════════════════
                 MAIN VIEW — horizontal card rows
              ════════════════════════════════ */
              <>
                {/* YOUR TRANSFERS */}
                <div className="ts-section-head">
                  <span className="ts-section-lbl">YOUR TRANSFERS</span>
                  <span className="ts-section-count">{outgoing.length} transfer{outgoing.length !== 1 ? "s" : ""}</span>
                </div>

                {outgoing.length === 0 ? (
                  <div className="ts-empty">
                    <div className="ts-empty-icon">
                      <span className="material-icons-sharp" style={{ fontSize:40, color:"rgba(13,61,43,0.25)" }}>swap_horiz</span>
                    </div>
                    <div className="ts-empty-title">No transfers yet</div>
                    <div className="ts-empty-sub">Start a transfer to see it here.</div>
                    <button className="ts-start-btn" onClick={() => navigate("/user/transfer")}>Start a Transfer <span className="material-icons-sharp" style={{ fontSize:15, verticalAlign:"middle" }}>arrow_forward</span></button>
                  </div>
                ) : (
                  <div className="ts-cards-row">
                    {outgoing.map((t, i) => {
                      const doneCount = t.timeline.filter(s => s.done).length;
                      return (
                        <div
                          key={t.id}
                          className="ts-txn-card"
                          style={{ animationDelay:`${i * 0.06}s` }}
                          onClick={() => setDetailView({ type:"outgoing", transfer: t })}
                        >
                          <div className="ts-txn-top">
                            <div className="ts-txn-meta">
                              <span className="ts-txn-id">{t.id}</span>
                              <span className="ts-txn-badge" style={{ background:t.statusColor, color:"#0D3D2B" }}>{t.status}</span>
                            </div>
                            <div className="ts-txn-title">{t.propertyTitle}</div>
                            <div className="ts-txn-sub">{t.sellerName} → {t.buyerName}</div>
                            <div className="ts-mini-steps">
                              {t.timeline.map((s, j) => (
                                <div key={j} className={`ts-mini-step ${s.done ? "ts-mini-step-done" : j === doneCount ? "ts-mini-step-active" : ""}`} />
                              ))}
                            </div>
                          </div>
                          <div className="ts-txn-footer">
                            <span className="ts-txn-date">Initiated {t.initiatedOn}</span>
                            <span className="ts-txn-value">{t.saleValue}</span>
                          </div>
                        </div>
                      );
                    })}

                    {/* New transfer card */}
                    <div className="ts-new-card" onClick={() => navigate("/user/transfer")}>
                      <div className="ts-new-card-icon">
                        <span className="material-icons-sharp" style={{ fontSize:32, color:"rgba(13,61,43,0.3)" }}>add_circle_outline</span>
                      </div>
                      <div className="ts-new-card-lbl">New Transfer</div>
                    </div>
                  </div>
                )}

                <div className="ts-divider" />

                {/* INCOMING REQUESTS */}
                <div className="ts-section-head">
                  <span className="ts-section-lbl">
                    INCOMING REQUESTS
                    {incoming.length > 0 && (
                      <span style={{ marginLeft:"0.5rem", background:"#F0A030", color:"#fff", borderRadius:"10px", padding:"1px 7px", fontSize:"0.6rem", fontWeight:800 }}>
                        {incoming.length} pending
                      </span>
                    )}
                  </span>
                  <span className="ts-section-count">Requires your confirmation</span>
                </div>

                {incoming.length === 0 ? (
                  <div className="ts-empty">
                    <div className="ts-empty-icon">
                      <span className="material-icons-sharp" style={{ fontSize:40, color:"rgba(13,61,43,0.2)" }}>inbox</span>
                    </div>
                    <div className="ts-empty-title">No incoming requests</div>
                    <div className="ts-empty-sub">Transfer requests from sellers will appear here.</div>
                  </div>
                ) : (
                  <div className="ts-cards-row">
                    {incoming.map((t, i) => (
                      <div
                        key={t.id}
                        className="ts-inc-card"
                        style={{ animationDelay:`${i * 0.06}s` }}
                        onClick={() => setDetailView({ type:"incoming", transfer: t })}
                      >
                        <div className="ts-txn-top">
                          <div className="ts-txn-meta">
                            <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                              <span className="ts-inc-pulse" />
                              <span className="ts-txn-id">{t.id}</span>
                            </div>
                            <span className="ts-inc-badge">Awaiting You</span>
                          </div>
                          <div className="ts-txn-title">{t.propertyTitle}</div>
                          <div className="ts-txn-sub">From {t.sellerName}</div>
                          <div style={{ marginTop:"0.5rem", fontSize:"0.72rem", fontWeight:700, color:"#0D3D2B" }}>{t.saleValue}</div>
                        </div>
                        <div className="ts-txn-footer" style={{ borderTopColor:"rgba(240,160,48,0.15)", background:"rgba(240,160,48,0.04)" }}>
                          <span className="ts-txn-date">Sent {t.initiatedOn}</span>
                          <span style={{ fontSize:"0.68rem", fontWeight:700, color:"#F0A030", display:"flex", alignItems:"center", gap:"3px" }}>Tap to review <span className="material-icons-sharp" style={{ fontSize:14 }}>arrow_forward</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </div>

      {/* Confirmation modal — rendered outside page-container */}
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
