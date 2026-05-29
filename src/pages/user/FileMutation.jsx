import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosConfig";

// ─── Styles ──────────────────────────────────────────────────────────────────

const MUTATION_FORM_STYLES = `
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
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Page ── */
  .mf-page {
    font-family: 'Poppins', sans-serif;
    background: #dcdcdc;
    min-height: 100vh;
    color: #1a1a1a;
    padding-top: 60px;
  }
  .mf-main {
    display: flex; flex-direction: column; gap: 16px;
    padding: 16px 28px 56px;
    max-width: 900px; margin: 0 auto;
    overflow-x: hidden; min-width: 0;
  }

  /* ── Top bar ── */
  .mf-topbar {
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
    flex-wrap: wrap; gap: 10px;
  }
  .mf-heading { font-size: 19px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
  .mf-heading span { color: #e07a5f; }
  .mf-topbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .mf-meta-chip {
    display: flex; align-items: center; gap: 5px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 6px 13px; font-size: 10.5px; font-weight: 600; color: #888;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .mf-meta-chip .mi { font-size: 13px; color: #e07a5f; }

  .mf-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 7px 16px; font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.15s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .mf-back-btn:hover { background: #e07a5f; }
  .mf-back-btn .mi { font-size: 15px; }

  /* ── Step indicators ── */
  .mf-steps { display: flex; gap: 6px; }
  .mf-step {
    flex: 1; border-radius: 12px; padding: 10px 13px;
    display: flex; align-items: center; gap: 8px;
    background: #fff; border: 1.5px solid #e0e0e0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: all 0.2s;
  }
  .mf-step.active { background: #1a1a1a; border-color: #1a1a1a; }
  .mf-step.done   { background: #1a1a1a; border-color: rgba(224,122,95,0.5); }
  .mf-step-num {
    width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800;
    background: #f0f0f0; color: #aaa;
  }
  .mf-step.active .mf-step-num { background: rgba(224,122,95,0.2); color: #e07a5f; }
  .mf-step.done   .mf-step-num { background: rgba(224,122,95,0.2); color: #e07a5f; }
  .mf-step-label { font-size: 10.5px; font-weight: 600; color: #ccc; display: none; }
  .mf-step.active .mf-step-label, .mf-step.done .mf-step-label { display: block; }
  .mf-step.active .mf-step-label { color: #fff; }
  .mf-step.done   .mf-step-label { color: rgba(255,255,255,0.45); }

  /* ── Notice banner ── */
  .mf-notice {
    background: rgba(224,122,95,0.06); border: 1.5px solid rgba(224,122,95,0.2);
    border-radius: 14px; padding: 11px 16px;
    font-size: 11px; color: #7a4030; line-height: 1.6;
    display: flex; gap: 10px; align-items: flex-start;
    animation: fadeUp 0.3s ease both;
  }
  .mf-notice .mi { font-size: 17px; color: #e07a5f; flex-shrink: 0; margin-top: 1px; }

  /* ── Zone / section card ── */
  .mf-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.3s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mf-zone-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 20px; background: #1a1a1a;
  }
  .mf-zone-title {
    display: flex; align-items: center; gap: 10px;
    font-size: 13.5px; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  .mf-zone-title .mi { font-size: 17px; color: #e07a5f; }
  .mf-zone-title span { color: #e07a5f; }
  .mf-zone-pill {
    background: rgba(224,122,95,0.15); color: #e07a5f;
    border-radius: 8px; padding: 2px 9px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
    border: 1px solid rgba(224,122,95,0.25);
  }
  .mf-zone-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }

  /* ── Mutation type grid ── */
  .mr-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .mr-type-card {
    background: #f7f7f5; border: 1.5px solid #e0e0e0; border-radius: 16px;
    padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;
    cursor: pointer; font-family: 'Poppins', sans-serif; text-align: left;
    transition: all 0.15s;
  }
  .mr-type-card:hover { border-color: #e07a5f; background: #fff; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
  .mr-type-card.selected { background: #1a1a1a; border-color: #e07a5f; }
  .mr-type-icon-wrap {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(224,122,95,0.1);
  }
  .mr-type-icon-wrap .mi { font-size: 16px; color: #e07a5f; }
  .mr-type-card.selected .mr-type-icon-wrap { background: rgba(224,122,95,0.2); }
  .mr-type-label { font-size: 12.5px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
  .mr-type-card.selected .mr-type-label { color: #fff; }
  .mr-type-desc { font-size: 10px; color: #aaa; line-height: 1.5; }
  .mr-type-card.selected .mr-type-desc { color: rgba(255,255,255,0.4); }

  /* ── Property list ── */
  .mf-prop-list { display: flex; flex-direction: column; gap: 8px; }
  .mf-prop-row {
    background: #f7f7f5; border-radius: 14px; padding: 12px 14px;
    display: flex; align-items: center; gap: 12px;
    border: 1.5px solid #e0e0e0; cursor: pointer;
    transition: all 0.15s;
  }
  .mf-prop-row:hover { border-color: #e07a5f; transform: translateY(-1px); }
  .mf-prop-row.selected { background: #1a1a1a; border-color: #e07a5f; }
  .mf-prop-icon-wrap {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(224,122,95,0.1);
  }
  .mf-prop-icon-wrap .mi { font-size: 15px; color: #e07a5f; }
  .mf-prop-row.selected .mf-prop-icon-wrap { background: rgba(224,122,95,0.2); }
  .mf-prop-body { flex: 1; min-width: 0; }
  .mf-prop-id {
    font-family: 'DM Mono', monospace; font-size: 9px;
    font-weight: 500; color: #e07a5f; letter-spacing: 0.04em; margin-bottom: 1px;
  }
  .mf-prop-row.selected .mf-prop-id { color: rgba(224,122,95,0.7); }
  .mf-prop-title { font-size: 11.5px; font-weight: 700; color: #1a1a1a; }
  .mf-prop-row.selected .mf-prop-title { color: #fff; }
  .mf-prop-meta { font-size: 9.5px; color: #aaa; margin-top: 1px; }
  .mf-prop-row.selected .mf-prop-meta { color: rgba(255,255,255,0.4); }
  .mf-prop-check {
    width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0;
    border: 1.5px solid #e0e0e0; display: flex; align-items: center; justify-content: center;
  }
  .mf-prop-row.selected .mf-prop-check { background: rgba(224,122,95,0.2); border-color: #e07a5f; color: #e07a5f; }
  .mf-prop-check .mi { font-size: 12px; }

  /* ── Form fields ── */
  .mf-fields { display: flex; flex-direction: column; gap: 14px; }
  .mf-field  { display: flex; flex-direction: column; gap: 6px; }
  .mf-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #888;
  }
  .mf-input {
    padding: 10px 14px; border: 1.5px solid #e0e0e0; border-radius: 12px;
    background: #f7f7f5; font-size: 13px; font-family: 'Poppins', sans-serif;
    font-weight: 500; color: #1a1a1a; outline: none; transition: all 0.15s; width: 100%;
  }
  .mf-input:focus { border-color: #e07a5f; background: #fff; box-shadow: 0 0 0 3px rgba(224,122,95,0.08); }
  .mf-input.error { border-color: #dc2626; }
  .mf-textarea { resize: vertical; min-height: 88px; }
  .mf-error-msg {
    font-size: 10px; font-weight: 700; color: #b91c1c;
    display: flex; align-items: center; gap: 4px;
  }
  .mf-error-msg .mi { font-size: 12px; }

  /* ── Document list ── */
  .mf-doc-list { display: flex; flex-direction: column; gap: 8px; }
  .mf-doc-item {
    background: #f7f7f5; border-radius: 14px; padding: 11px 14px;
    display: flex; align-items: center; gap: 10px;
    border: 1.5px solid #e0e0e0; transition: border-color 0.15s;
  }
  .mf-doc-item .mi { font-size: 18px; color: #ccc; }
  .mf-doc-item.uploaded { border-color: #e07a5f; background: rgba(224,122,95,0.04); }
  .mf-doc-item.uploaded .mi { color: #e07a5f; }
  .mf-doc-label { font-size: 11.5px; font-weight: 600; flex: 1; color: #1a1a1a; }
  .mf-doc-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 9px;
    padding: 5px 12px; font-family: 'Poppins', sans-serif; font-size: 10.5px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 4px; margin-left: auto;
    transition: background 0.15s; flex-shrink: 0;
  }
  .mf-doc-btn:hover { background: #e07a5f; }
  .mf-doc-btn .mi { font-size: 13px; }
  .mf-doc-done {
    font-size: 10.5px; font-weight: 700; color: #e07a5f;
    margin-left: auto; display: flex; align-items: center; gap: 4px; flex-shrink: 0;
  }
  .mf-doc-done .mi { font-size: 14px; }

  /* ── Review rows ── */
  .mf-review-rows { display: flex; flex-direction: column; }
  .mf-review-row {
    display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #f0f0f0;
  }
  .mf-review-row:last-child { border-bottom: none; }
  .mf-review-key {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.07em; color: #aaa; flex-shrink: 0;
  }
  .mf-review-val {
    font-size: 12px; font-weight: 600; color: #1a1a1a;
    text-align: right; max-width: 65%;
    font-family: 'DM Mono', monospace;
  }

  /* ── Nav buttons ── */
  .mf-nav { display: flex; gap: 8px; align-items: center; }
  .mf-btn-back {
    background: #fff; color: #444; border: 1.5px solid #e0e0e0;
    border-radius: 100px; padding: 9px 18px;
    font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: all 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .mf-btn-back:hover { background: #f5f5f3; border-color: #ccc; }
  .mf-btn-back .mi { font-size: 15px; }
  .mf-btn-next {
    flex: 1; background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 11px 20px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .mf-btn-next:hover { background: #e07a5f; }
  .mf-btn-next .mi { font-size: 15px; }
  .mf-btn-submit {
    flex: 1; background: #e07a5f; color: #fff; border: none; border-radius: 100px;
    padding: 11px 20px; font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s; box-shadow: 0 2px 10px rgba(224,122,95,0.3);
  }
  .mf-btn-submit:hover { background: #c05030; }
  .mf-btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
  .mf-btn-submit .mi { font-size: 15px; }
  .spinner {
    width: 14px; height: 14px; border: 2px solid currentColor;
    border-top-color: transparent; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }

  /* ── Success state ── */
  .mf-success-zone {
    background: #fff; border: 1.5px solid #e0e0e0;
    border-radius: 20px; padding: 56px 32px;
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    text-align: center; animation: fadeUp 0.4s ease both;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mf-success-icon {
    width: 60px; height: 60px; border-radius: 18px; background: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
  }
  .mf-success-icon .mi { font-size: 28px; color: #e07a5f; }
  .mf-success-title { font-size: 19px; font-weight: 800; letter-spacing: -0.4px; }
  .mf-success-sub { font-size: 12px; color: #aaa; line-height: 1.7; max-width: 400px; }
  .mf-success-ref {
    font-family: 'DM Mono', monospace; font-size: 11px; color: #e07a5f;
    background: rgba(224,122,95,0.08); border: 1.5px solid rgba(224,122,95,0.2);
    border-radius: 9px; padding: 6px 14px;
  }
  .mf-success-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  .mf-suc-primary {
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px;
    padding: 10px 22px; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background 0.15s;
  }
  .mf-suc-primary:hover { background: #e07a5f; }
  .mf-suc-primary .mi { font-size: 14px; }
  .mf-suc-ghost {
    background: #fff; color: #444; border: 1.5px solid #e0e0e0; border-radius: 100px;
    padding: 10px 22px; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.15s;
  }
  .mf-suc-ghost:hover { background: #f5f5f3; border-color: #ccc; }

  /* ── Empty ── */
  .mf-empty {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 32px 20px; color: #bbb; font-size: 12.5px; font-weight: 500;
  }
  .mf-empty .mi { font-size: 36px; color: #ddd; }

  /* ── Loading ── */
  .mf-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 72px 20px;
    background: #fff; border: 1.5px solid #e0e0e0; border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .mf-spinner {
    width: 28px; height: 28px; border: 2.5px solid #e0e0e0;
    border-top-color: #e07a5f; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .mf-loading-text { font-size: 12px; font-weight: 600; color: #bbb; }

  @media (max-width: 700px) {
    .mf-main { padding: 12px 14px 48px; }
    .mf-nav  { flex-direction: column-reverse; }
    .mf-btn-back { width: 100%; justify-content: center; }
    .mr-type-grid { grid-template-columns: 1fr; }
    .mf-steps { flex-wrap: wrap; }
  }
`;

// ─── Mutation type definitions ────────────────────────────────────────────────

const MUTATION_TYPES = [
  {
    id: "inheritance",
    label: "Inheritance / Succession",
    shortLabel: "Inheritance",
    icon: "family_restroom",
    metaChip: "Succession · Form XXVII",
    desc: "Transfer ownership to legal heirs after the recorded owner's death.",
    fields: [
      { key: "deceasedName",   label: "Name of Deceased Owner",          required: true,  placeholder: "As per death certificate" },
      { key: "dateOfDeath",    label: "Date of Death",                   required: true,  type: "date" },
      { key: "heirName",       label: "Primary Legal Heir (New Owner)",  required: true,  placeholder: "Full name as per succession certificate" },
      { key: "relationship",   label: "Relationship to Deceased",        required: true,  placeholder: "e.g. Son, Daughter, Spouse" },
      { key: "additionalHeirs",label: "Other Heirs (if any)",            required: false, placeholder: "Names and relationships", multiline: true },
    ],
    docs: [
      { id: "death_cert",  label: "Death Certificate" },
      { id: "succession",  label: "Legal Heir / Succession Certificate" },
      { id: "will",        label: "Registered Will / Probate (if applicable)" },
    ],
    buildReason(fields, notes) {
      return [
        `Deceased: ${fields.deceasedName}`,
        `Date of death: ${fields.dateOfDeath}`,
        `Primary heir: ${fields.heirName} (${fields.relationship})`,
        fields.additionalHeirs ? `Other heirs: ${fields.additionalHeirs}` : null,
        notes ? `Notes: ${notes}` : null,
      ].filter(Boolean).join(" | ");
    },
    getNewOwnerName(fields) { return fields.heirName || ""; },
  },
  {
    id: "correction",
    label: "Survey Correction",
    shortLabel: "Survey Correction",
    icon: "straighten",
    metaChip: "Survey & FMB Correction",
    desc: "Correct survey number, extent, or boundary details in revenue records.",
    fields: [
      { key: "currentSurveyNo",  label: "Current Survey / Sub-Division No.", required: true,  placeholder: "As in existing patta" },
      { key: "correctSurveyNo",  label: "Correct Survey / Sub-Division No.", required: true,  placeholder: "As per latest survey" },
      { key: "currentArea",      label: "Area in Records",                   required: true,  placeholder: "e.g. 2.45 acres" },
      { key: "correctArea",      label: "Correct Area",                      required: true,  placeholder: "e.g. 2.50 acres" },
      { key: "correctionBasis",  label: "Basis for Correction",              required: true,  placeholder: "e.g. Resurvey 2023, FMB error", multiline: true },
    ],
    docs: [
      { id: "survey_report", label: "Licensed Surveyor Report" },
      { id: "fmb",           label: "FMB Sketch / Field Measurement Book" },
      { id: "patta",         label: "Existing Patta / Chitta Copy" },
    ],
    buildReason(fields, notes) {
      return [
        `Current: ${fields.currentSurveyNo}, ${fields.currentArea}`,
        `Correct: ${fields.correctSurveyNo}, ${fields.correctArea}`,
        `Basis: ${fields.correctionBasis}`,
        notes ? `Notes: ${notes}` : null,
      ].filter(Boolean).join(" | ");
    },
    getNewOwnerName(_fields, userName) { return userName || ""; },
  },
  {
    id: "partition",
    label: "Property Partition",
    shortLabel: "Partition",
    icon: "call_split",
    metaChip: "Partition · Sub-Division",
    desc: "Divide a single registered parcel into separate sub-plots for co-owners.",
    fields: [
      { key: "numberOfPlots", label: "Number of Sub-Plots After Partition", required: true,  placeholder: "e.g. 3" },
      { key: "shareholders",  label: "Names of Co-Owners / Shareholders",   required: true,  placeholder: "One per line or comma-separated", multiline: true },
      { key: "shareDetails",  label: "Share / Extent for Each Plot",         required: true,  placeholder: "e.g. Plot A — 0.8 acre to R. Kumar", multiline: true },
      { key: "partitionDate", label: "Date of Partition Deed",               required: false, type: "date" },
    ],
    docs: [
      { id: "partition_deed", label: "Registered Partition Deed" },
      { id: "survey_report",  label: "Sub-Division Survey Report" },
      { id: "noc",            label: "Co-Owner NOC (if applicable)" },
    ],
    buildReason(fields, notes) {
      return [
        `Sub-plots: ${fields.numberOfPlots}`,
        `Shareholders: ${fields.shareholders}`,
        `Allocation: ${fields.shareDetails}`,
        fields.partitionDate ? `Deed date: ${fields.partitionDate}` : null,
        notes ? `Notes: ${notes}` : null,
      ].filter(Boolean).join(" | ");
    },
    getNewOwnerName(_fields, userName) { return userName || ""; },
  },
  {
    id: "name_change",
    label: "Name Change",
    shortLabel: "Name Change",
    icon: "edit",
    metaChip: "Owner Name Correction",
    desc: "Update the owner's name on revenue records after a legal name change.",
    fields: [
      { key: "oldName",       label: "Name Currently on Record",          required: true,  placeholder: "As in patta / registry" },
      { key: "newName",       label: "Correct / New Legal Name",          required: true,  placeholder: "As per gazette or court order" },
      { key: "gazetteNo",     label: "Gazette Notification No. / Date",   required: false, placeholder: "e.g. TN/2024/12345, 12 Jan 2024" },
      { key: "changeReason",  label: "Reason for Name Change",            required: true,  placeholder: "e.g. Marriage, Gazette notification, Court decree", multiline: true },
    ],
    docs: [
      { id: "gazette",   label: "Gazette Notification (certified copy)" },
      { id: "affidavit", label: "Notarised Affidavit" },
      { id: "id_proof",  label: "Updated Aadhaar / ID Proof" },
    ],
    buildReason(fields, notes) {
      return [
        `Old name: ${fields.oldName}`,
        `New name: ${fields.newName}`,
        fields.gazetteNo ? `Gazette: ${fields.gazetteNo}` : null,
        `Reason: ${fields.changeReason}`,
        notes ? `Notes: ${notes}` : null,
      ].filter(Boolean).join(" | ");
    },
    getNewOwnerName(fields) { return fields.newName || ""; },
  },
];

function getMutationType(id) {
  return MUTATION_TYPES.find((t) => t.id === id) || null;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const MI = ({ name, style, size }) => (
  <span className="mi" style={{ fontSize: size, ...style }}>{name}</span>
);

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS_WITH_TYPE = ["Type", "Property", "Details", "Documents", "Review"];
const STEPS_FIXED     = ["Property", "Details", "Documents", "Review"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FileMutation({ fixedConfig = null }) {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const presetId       = fixedConfig?.id || searchParams.get("type");
  const initialConfig  = presetId ? getMutationType(presetId) : null;

  const { user }      = useAuth();
  const [config, setConfig]             = useState(initialConfig);
  const needsTypeStep                   = !initialConfig && !fixedConfig;

  const [step, setStep]                 = useState(1);
  const [loading, setLoading]           = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [errors, setErrors]             = useState({});
  const [selectedProp, setSelectedProp] = useState(null);
  const [fieldValues, setFieldValues]   = useState({});
  const [notes, setNotes]               = useState("");
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [properties, setProperties]     = useState([]);
  const [propsLoading, setPropsLoading] = useState(true);

  const steps      = needsTypeStep ? STEPS_WITH_TYPE : STEPS_FIXED;
  const totalSteps = steps.length;

  const stepKind = () => {
    if (!needsTypeStep) {
      if (step === 1) return "property";
      if (step === 2) return "details";
      if (step === 3) return "documents";
      return "review";
    }
    if (step === 1) return "type";
    if (step === 2) return "property";
    if (step === 3) return "details";
    if (step === 4) return "documents";
    return "review";
  };

  useEffect(() => {
    if (user) {
      api.get("/properties/my-properties")
        .then((res) => setProperties(res.data))
        .catch(console.error)
        .finally(() => setPropsLoading(false));
    }
  }, [user]);

  const setField = (key, value) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setErrors({});
  };

  const validate = () => {
    const e    = {};
    const kind = stepKind();
    if (kind === "type"     && !config)      e.type = "Please select a mutation type.";
    if (kind === "property" && !selectedProp) e.prop = "Please select a property.";
    if (kind === "details"  && config) {
      config.fields.forEach((f) => {
        if (f.required && !String(fieldValues[f.key] || "").trim())
          e[f.key] = `${f.label} is required.`;
      });
    }
    if (kind === "documents" && config) {
      const missing = (config.docs || []).filter((d) => !uploadedDocs[d.id]);
      if (missing.length) e.docs = `Please upload: ${missing.map((d) => d.label).join(", ")}`;
    }
    return e;
  };

  const next = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    if (step < totalSteps) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!config) return;
    const e = validate();
    if (Object.keys(e).length) return;

    setLoading(true);
    const reason       = `[${config.shortLabel}] ${config.buildReason(fieldValues, notes.trim())}`;
    const newOwnerName = config.getNewOwnerName(fieldValues, user?.name);
    const docCount     = Object.keys(uploadedDocs).filter((k) => uploadedDocs[k]).length;

    try {
      await api.post("/mutations", {
        propertyId: selectedProp,
        reason,
        newOwnerName,
        supportingDoc: `${docCount} document(s) attached (frontend reference)`,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.response?.data?.message || "Failed to submit mutation request." });
    } finally {
      setLoading(false);
    }
  };

  const prop = properties.find((p) => p.id === selectedProp);

  const reviewRows = config
    ? [
        { key: "Mutation type", val: config.label },
        { key: "Property",      val: prop?.title },
        { key: "Property ID",   val: prop?.id },
        { key: "District",      val: prop?.district },
        ...config.fields.map((f) => ({ key: f.label, val: fieldValues[f.key] || "—" })),
        ...(notes.trim() ? [{ key: "Additional notes", val: notes }] : []),
        { key: "Documents", val: `${Object.keys(uploadedDocs).filter((k) => uploadedDocs[k]).length} uploaded` },
      ]
    : [];

  return (
    <>
      <style>{MUTATION_FORM_STYLES}</style>
      <div className="mf-page">
        <div className="mf-main">

          {/* ══ TOP BAR ══ */}
          <div className="mf-topbar">
            <div className="mf-heading">
              {config ? (
                <>
                  {config.label.split(" / ")[0]}
                  {config.label.includes(" / ") && (
                    <> / <span>{config.label.split(" / ")[1]}</span></>
                  )}
                </>
              ) : (
                <>File <span>Mutation</span></>
              )}
            </div>
            <div className="mf-topbar-right">
              {config && (
                <div className="mf-meta-chip">
                  <MI name={config.icon} /> {config.metaChip}
                </div>
              )}
              <button type="button" className="mf-back-btn" onClick={() => navigate("/user/my-mutations")}>
                <MI name="arrow_back" /> My requests
              </button>
            </div>
          </div>

          {/* ══ NOTICE ══ */}
          {!submitted && (
            <div className="mf-notice">
              <MI name="info" />
              <span>
                Applications are reviewed by the Sub-Registrar. Ensure all particulars match your
                supporting certificates exactly.
              </span>
            </div>
          )}

          {/* ══ STEP INDICATORS ══ */}
          {!submitted && (
            <div className="mf-steps">
              {steps.map((label, i) => {
                const num = i + 1;
                return (
                  <div
                    key={label}
                    className={`mf-step${num === step ? " active" : ""}${num < step ? " done" : ""}`}
                  >
                    <div className="mf-step-num">
                      {num < step ? <MI name="check" size="11px" /> : num}
                    </div>
                    <div className="mf-step-label">{label}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══ SUCCESS ══ */}
          {submitted && config ? (
            <div className="mf-success-zone">
              <div className="mf-success-icon">
                <MI name="task_alt" />
              </div>
              <div className="mf-success-title">Mutation request submitted</div>
              <div className="mf-success-sub">
                Your {config.shortLabel.toLowerCase()} request is queued for Sub-Registrar review.
                You will be notified once the officer processes your application.
              </div>
              <div className="mf-success-ref">REF: MUT-{Date.now().toString().slice(-8)}</div>
              <div className="mf-success-actions">
                <button type="button" className="mf-suc-primary" onClick={() => navigate("/user/my-mutations")}>
                  <MI name="folder_open" /> My Mutation Requests
                </button>
                <button type="button" className="mf-suc-ghost" onClick={() => navigate("/user/dashboard")}>
                  <MI name="dashboard" /> Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ── STEP: Select Mutation Type ── */}
              {stepKind() === "type" && (
                <div className="mf-zone">
                  <div className="mf-zone-header">
                    <div className="mf-zone-title">
                      <MI name="category" />
                      Select <span>mutation type</span>
                    </div>
                    <span className="mf-zone-pill">Step {step} of {totalSteps}</span>
                  </div>
                  <div className="mf-zone-body">
                    <div className="mr-type-grid">
                      {MUTATION_TYPES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`mr-type-card${config?.id === t.id ? " selected" : ""}`}
                          onClick={() => { setConfig(t); setFieldValues({}); setErrors({}); }}
                        >
                          <div className="mr-type-icon-wrap">
                            <MI name={t.icon} />
                          </div>
                          <div className="mr-type-label">{t.label}</div>
                          <div className="mr-type-desc">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                    {errors.type && (
                      <div className="mf-error-msg">
                        <MI name="error_outline" /> {errors.type}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP: Select Property ── */}
              {stepKind() === "property" && (
                <div className="mf-zone">
                  <div className="mf-zone-header">
                    <div className="mf-zone-title">
                      <MI name="home_work" />
                      Select <span>property</span>
                    </div>
                    <span className="mf-zone-pill">Step {step} of {totalSteps}</span>
                  </div>
                  <div className="mf-zone-body">
                    {propsLoading ? (
                      <div className="mf-loading" style={{ padding: "32px 20px" }}>
                        <div className="mf-spinner" />
                        <div className="mf-loading-text">Loading your properties…</div>
                      </div>
                    ) : (
                      <div className="mf-prop-list">
                        {properties.length === 0 && (
                          <div className="mf-empty">
                            <MI name="home_work" />
                            No properties found. Register a property first.
                          </div>
                        )}
                        {properties.map((p) => (
                          <div
                            key={p.id}
                            className={`mf-prop-row${selectedProp === p.id ? " selected" : ""}`}
                            onClick={() => { setSelectedProp(p.id); setErrors({}); }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && setSelectedProp(p.id)}
                          >
                            <div className="mf-prop-icon-wrap">
                              <MI name="home" />
                            </div>
                            <div className="mf-prop-body">
                              <div className="mf-prop-id">{p.id}</div>
                              <div className="mf-prop-title">{p.title}</div>
                              <div className="mf-prop-meta">{p.area} · {p.district}</div>
                            </div>
                            <div className="mf-prop-check">
                              {selectedProp === p.id && <MI name="check" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.prop && (
                      <div className="mf-error-msg">
                        <MI name="error_outline" /> {errors.prop}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP: Details ── */}
              {stepKind() === "details" && config && (
                <div className="mf-zone">
                  <div className="mf-zone-header">
                    <div className="mf-zone-title">
                      <MI name="edit_note" />
                      {config.shortLabel} <span>particulars</span>
                    </div>
                    <span className="mf-zone-pill">Step {step} of {totalSteps}</span>
                  </div>
                  <div className="mf-zone-body">
                    <div className="mf-fields">
                      {config.fields.map((f) => (
                        <div className="mf-field" key={f.key}>
                          <label className="mf-label" htmlFor={f.key}>
                            {f.label}
                            {!f.required && (
                              <span style={{ fontWeight: 500, opacity: 0.5 }}> (optional)</span>
                            )}
                          </label>
                          {f.multiline ? (
                            <textarea
                              id={f.key}
                              className={`mf-input mf-textarea${errors[f.key] ? " error" : ""}`}
                              value={fieldValues[f.key] || ""}
                              onChange={(e) => setField(f.key, e.target.value)}
                              placeholder={f.placeholder}
                            />
                          ) : (
                            <input
                              id={f.key}
                              type={f.type || "text"}
                              className={`mf-input${errors[f.key] ? " error" : ""}`}
                              value={fieldValues[f.key] || ""}
                              onChange={(e) => setField(f.key, e.target.value)}
                              placeholder={f.placeholder}
                            />
                          )}
                          {errors[f.key] && (
                            <div className="mf-error-msg">
                              <MI name="error_outline" /> {errors[f.key]}
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="mf-field">
                        <label className="mf-label" htmlFor="notes">
                          Additional notes{" "}
                          <span style={{ fontWeight: 500, opacity: 0.5 }}>(optional)</span>
                        </label>
                        <textarea
                          id="notes"
                          className="mf-input mf-textarea"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Other information for the reviewing officer…"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP: Documents ── */}
              {stepKind() === "documents" && config && (
                <div className="mf-zone">
                  <div className="mf-zone-header">
                    <div className="mf-zone-title">
                      <MI name="folder_open" />
                      Supporting <span>documents</span>
                    </div>
                    <span className="mf-zone-pill">Step {step} of {totalSteps}</span>
                  </div>
                  <div className="mf-zone-body">
                    <div className="mf-doc-list">
                      {(config.docs || []).map((d) => (
                        <div key={d.id} className={`mf-doc-item${uploadedDocs[d.id] ? " uploaded" : ""}`}>
                          <MI name={uploadedDocs[d.id] ? "check_circle" : "insert_drive_file"} />
                          <span className="mf-doc-label">{d.label}</span>
                          {uploadedDocs[d.id] ? (
                            <span className="mf-doc-done">
                              <MI name="check" /> Uploaded
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="mf-doc-btn"
                              onClick={() => setUploadedDocs((dd) => ({ ...dd, [d.id]: true }))}
                            >
                              <MI name="upload" /> Upload
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors.docs && (
                      <div className="mf-error-msg">
                        <MI name="error_outline" /> {errors.docs}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── STEP: Review & Submit ── */}
              {stepKind() === "review" && config && prop && (
                <div className="mf-zone">
                  <div className="mf-zone-header">
                    <div className="mf-zone-title">
                      <MI name="fact_check" />
                      Review & <span>submit</span>
                    </div>
                    <span className="mf-zone-pill">Step {step} of {totalSteps}</span>
                  </div>
                  <div className="mf-zone-body">
                    <div className="mf-review-rows">
                      {reviewRows.map((r) => (
                        <div className="mf-review-row" key={r.key}>
                          <span className="mf-review-key">{r.key}</span>
                          <span className="mf-review-val">{r.val}</span>
                        </div>
                      ))}
                    </div>
                    {errors.submit && (
                      <div className="mf-error-msg">
                        <MI name="error_outline" /> {errors.submit}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── NAV BUTTONS ── */}
              <div className="mf-nav">
                {step > 1 && (
                  <button type="button" className="mf-btn-back" onClick={() => setStep((s) => s - 1)}>
                    <MI name="arrow_back" /> Back
                  </button>
                )}
                <button
                  type="button"
                  className={step < totalSteps ? "mf-btn-next" : "mf-btn-submit"}
                  onClick={next}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner" /> Submitting…</>
                  ) : step < totalSteps ? (
                    <>Continue <MI name="arrow_forward" /></>
                  ) : (
                    <>Submit to Sub-Registrar <MI name="send" /></>
                  )}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}