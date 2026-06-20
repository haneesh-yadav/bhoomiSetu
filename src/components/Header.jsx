import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ══════════════════════════════════════════════════
   NAV ITEMS
══════════════════════════════════════════════════ */
const USER_NAV = [
  {
    label: "Home",
    path: "/user/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Properties",
    path: "/user/properties",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    children: {
      brand: { title: "Properties & Transfers", desc: "View registered land and manage ownership transfers." },
      sections: [
        {
          heading: "Land records",
          items: [
            { label: "My Properties", path: "/user/properties", desc: "View and manage all your registered properties" },
            { label: "Transfers", path: "/user/transfers", desc: "Initiate transfers, track status, and respond to incoming requests" },
          ],
        },
      ],
    },
  },
  {
    label: "Mutation",
    path: "/user/my-mutations",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    children: {
      brand: { title: "Mutation", desc: "Official revenue record updates reviewed by the Sub-Registrar." },
      sections: [
        {
          heading: "Mutation",
          items: [
            { label: "My Mutation Requests", path: "/user/my-mutations", desc: "Track submitted mutation applications and officer remarks" },
            { label: "File Mutation Request", path: "/user/file-mutation", desc: "Apply for inheritance, survey correction, partition, or name change" },
          ],
        },
      ],
    },
  },
  {
    label: "Disputes",
    path: "/user/my-disputes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    children: {
      brand: { title: "Disputes", desc: "File and manage property disputes through the official registry." },
      sections: [
        {
          heading: "Disputes",
          items: [
            { label: "My Disputes", path: "/user/my-disputes", desc: "View disputes under investigation or resolved" },
            { label: "File a Dispute", path: "/user/file-dispute", desc: "Report ownership, boundary, or fraudulent record issues" },
          ],
        },
      ],
    },
  },
  {
    label: "Account",
    path: "/user/account",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    children: {
      brand: { title: "Account", desc: "Manage your profile, security settings and preferences." },
      sections: [
        {
          heading: "Settings",
          items: [
            { label: "Profile",         path: "/user/account"         },
            { label: "Change Password", path: "/user/change-password" },
          ],
        },
      ],
    },
  },
];

const REGISTRAR_NAV = [
  {
    label: "Home",
    path: "/registrar/dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Approvals",
    path: "/registrar/approvals",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    children: {
      brand: { title: "Land Approvals", desc: "Manage pending property records and transaction updates." },
      sections: [
        {
          heading: "Approvals Queue",
          items: [
            { label: "Approvals Queue", path: "/registrar/approvals", desc: "Manage pending land registry approvals" },
            { label: "Transfer Review", path: "/registrar/review", desc: "Perform deep review on property transactions" },
          ],
        },
      ],
    },
  },
  {
    label: "Registry Requests",
    path: "/registrar/mutations",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    children: {
      brand: { title: "Registry Updates", desc: "Correct records and review ongoing legal disputes." },
      sections: [
        {
          heading: "Registry Requests",
          items: [
            { label: "Mutations Review", path: "/registrar/mutations", desc: "Verify and approve revenue record mutations" },
            { label: "Dispute Management", path: "/registrar/disputes", desc: "Investigate and resolve land disputes" },
          ],
        },
      ],
    },
  },
  {
    label: "Audit",
    path: "/registrar/audit",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: "Account",
    path: "/registrar/account",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    children: {
      brand: { title: "Officer Account", desc: "Manage your registrar profile details and settings." },
      sections: [
        {
          heading: "Settings",
          items: [
            { label: "Profile", path: "/registrar/account", desc: "Registrar officer profile details" },
            { label: "Change Password", path: "/registrar/change-password", desc: "Update your account security details" },
          ],
        },
      ],
    },
  },
];

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  @keyframes mobileMenuDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Dropdown — floating matching card ── */
  .bh-dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-15px);
    width: 360px;
    background: linear-gradient(90deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.6), 
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.02);
    z-index: 1999;
    padding: 10px;
    opacity: 0;
    visibility: hidden;
    transition: 
      opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
      transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
      visibility 0.3s;
    pointer-events: none;
  }
  .bh-wrap:hover .bh-dropdown,
  .bh-wrap.open  .bh-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }
  .bh-dropdown::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 8px;
    background: rgba(255, 255, 255, 0.15);
    z-index: 2001;
  }
  .bh-ham-icon { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; }
  .bh-ham-icon span { display: block; height: 2px; background: #fff; border-radius: 2px; transition: all 0.25s ease; }
  .bh-ham-icon span:nth-child(1) { width: 22px; }
  .bh-ham-icon span:nth-child(2) { width: 15px; }
  .bh-ham-icon span:nth-child(3) { width: 19px; }
  .bh-ham-open span:nth-child(1) { width: 20px; transform: translateY(7px) rotate(45deg); }
  .bh-ham-open span:nth-child(2) { opacity: 0; width: 0; }
  .bh-ham-open span:nth-child(3) { width: 20px; transform: translateY(-7px) rotate(-45deg); }

  /* ── Guest buttons ── */
  .bh-guest-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-right: 1.2rem;
    margin-left: auto;
  }
  .bh-back-home-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 100px;
    padding: 8px 16px;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .rh-btn-outline {
    padding: 8px 16px; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.35); background: transparent;
    color: #fff; font-size: 14px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .rh-btn-outline:hover { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }
  .rh-btn-filled {
    padding: 8px 16px; border-radius: 100px; background: #fff; color: #111;
    font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    border: none; cursor: pointer; transition: opacity 0.2s, transform 0.1s; white-space: nowrap;
  }
  .rh-btn-filled:hover  { opacity: 0.9; }
  .rh-btn-filled:active { transform: scale(0.98); }

  /* ── Nav bar ── */
  .bh-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 2000;
    height: 60px; display: flex; align-items: center;
    justify-content: space-between; box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
  }

  /* ── Logo ── */
  .bh-header-content {
    padding-left: 10px; display: flex; align-items: center;
    gap: 10px; height: 100%; cursor: default; flex-shrink: 0;
  }
  .bh-logo-text {
    color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 20px; font-weight: 800; letter-spacing: 0.5px; line-height: 1;
  }

  /* ── Centre nav (desktop) ── */
  .bh-nav-center {
    display: flex; align-items: center; gap: 0;
    flex: 1; justify-content: center;
  }

  .bh-wrap {
    position: relative; display: inline-flex;
    align-items: center; height: 60px;
  }

  /* ── Nav button — identical to original navBtn ── */
  .bh-link {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 0 1.2rem; height: 60px;
    font-family: 'Poppins', sans-serif; font-size: 0.78rem;
    font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: #ffffff; background: none; border: none;
    cursor: pointer; white-space: nowrap;
    transition: color 0.2s ease; position: relative;
  }
  .bh-link svg { transition: stroke 0.2s ease; flex-shrink: 0; }
  .bh-link:hover        { color: var(--bh-accent, #e07a5f); }
  .bh-link:hover svg    { stroke: var(--bh-accent, #e07a5f); }
  .bh-link-active       { color: var(--bh-accent, #e07a5f) !important; }
  .bh-link-active svg   { stroke: var(--bh-accent, #e07a5f) !important; }

  /* chevron for dropdown tabs */
  .bh-chevron {
    font-size: 11px; color: inherit; display: inline-block;
    transition: transform 0.22s ease; font-style: normal; line-height: 1; margin-left: -2px;
  }
  .bh-wrap:hover .bh-chevron,
  .bh-wrap.open .bh-chevron { transform: rotate(180deg); }

  /* brand details header */
  .bh-drop-brand {
    padding: 8px 12px 6px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    margin-bottom: 6px;
  }
  .bh-drop-brand-title {
    font-family: 'Poppins', sans-serif;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--bh-accent, #e07a5f);
  }
  .bh-drop-brand-desc {
    display: none;
  }

  /* vertical menu list */
  .bh-drop-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* individual card list item */
  .bh-drop-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: transparent;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
    transition: background 0.2s ease, transform 0.2s ease;
    position: relative;
    color: #fff;
  }
  .bh-drop-item:hover {
    background: rgba(255, 255, 255, 0.04);
  }
  .bh-drop-item:active {
    transform: scale(0.98);
  }

  /* small preview illustration */
  .bh-drop-item-icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.6);
  }
  .bh-drop-item:hover .bh-drop-item-icon-wrapper {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: var(--bh-accent, #e07a5f);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
  }
  .bh-drop-item-icon-wrapper .material-icons-sharp {
    font-family: 'Material Icons Sharp';
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    transition: transform 0.2s;
  }
  .bh-drop-item:hover .bh-drop-item-icon-wrapper .material-icons-sharp {
    transform: scale(1.1);
  }

  /* item body */
  .bh-drop-item-details {
    flex: 1;
    min-width: 0;
  }
  .bh-drop-item-title {
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.2;
    transition: color 0.2s;
  }
  .bh-active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--bh-accent, #e07a5f);
    display: inline-block;
    box-shadow: 0 0 8px var(--bh-accent, #e07a5f);
  }
  .bh-drop-item-desc {
    font-family: 'Poppins', sans-serif;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.4;
    margin-top: 3px;
    white-space: normal;
  }

  /* arrow chevron indicator */
  .bh-drop-item-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.2);
    transition: transform 0.2s ease, color 0.2s ease;
    flex-shrink: 0;
  }
  .bh-drop-item:hover .bh-drop-item-arrow {
    color: var(--bh-accent, #e07a5f);
    transform: translateX(4px);
  }

  /* active item highlighting styles */
  .bh-drop-item.bh-card-active {
    background: rgba(224, 122, 95, 0.06);
  }
  .bh-drop-item.bh-card-active .bh-drop-item-icon-wrapper {
    background: rgba(224, 122, 95, 0.1);
    border-color: rgba(224, 122, 95, 0.25);
    box-shadow: 0 0 10px rgba(224, 122, 95, 0.15);
  }
  .bh-drop-item.bh-card-active .bh-drop-item-title {
    color: #e07a5f;
  }

  /* active states for registrar role */
  .bh-nav-registrar .bh-drop-item.bh-card-active {
    background: rgba(124, 110, 245, 0.06);
  }
  .bh-nav-registrar .bh-drop-item.bh-card-active .bh-drop-item-icon-wrapper {
    background: rgba(124, 110, 245, 0.1);
    border-color: rgba(124, 110, 245, 0.25);
    box-shadow: 0 0 10px rgba(124, 110, 245, 0.15);
  }
  .bh-nav-registrar .bh-drop-item.bh-card-active .bh-drop-item-title {
    color: #7C6EF5;
  }

  /* section heading (hidden, keep for compat) */
  .bh-drop-section { display: contents; }
  .bh-drop-heading { display: none; }

  /* view all footer row */
  .bh-drop-footer { display: none; }

  /* ── Right side — only logout button ── */
  .bh-right-section {
    display: flex; align-items: center; height: 100%;
    padding-right: 1.2rem; margin-left: auto; flex-shrink: 0;
  }

  /* Logout — pill outline style */
  .bh-logout-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.2); background: none;
    font-family: 'Poppins', sans-serif; font-size: 0.78rem;
    font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: rgba(255,255,255,0.7); cursor: pointer;
    white-space: nowrap; transition: all 0.2s ease;
  }
  .bh-logout-btn svg   { transition: stroke 0.2s ease; flex-shrink: 0; stroke: rgba(255,255,255,0.7); }
  .bh-logout-btn:hover {
    color: var(--bh-accent, #e07a5f); border-color: var(--bh-accent, #e07a5f);
    background: var(--bh-logout-hover-bg, rgba(224,122,95,0.06));
  }
  .bh-logout-btn:hover svg { stroke: var(--bh-accent, #e07a5f); }

  /* ── Hamburger (mobile) ── */
  .bh-hamburger {
    display: none; background: none; border: none;
    cursor: pointer; padding: 0 20px; height: 100%;
    align-items: center; justify-content: center; margin-left: auto;
  }
  .bh-mobile-menu {
    position: absolute; top: 60px; right: 0; width: 240px;
    background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    border-radius: 0 0 8px 8px; z-index: 9999; overflow: hidden;
    animation: mobileMenuDown 0.2s ease forwards;
    border-top: 2px solid var(--bh-accent, #e07a5f);
  }
  .bh-mobile-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; background: none; border: none;
    padding: 13px 16px; font-family: 'Poppins', sans-serif;
    font-size: 0.82rem; font-weight: 600; color: #1a1a1a;
    cursor: pointer; text-align: left;
    border-bottom: 1px solid #f2ede9; letter-spacing: 0.03em;
    box-sizing: border-box; transition: background 0.15s, color 0.15s;
  }
  .bh-mobile-item:hover  { background: var(--bh-mobile-hover-bg, #fdf3f0); color: var(--bh-accent, #e07a5f); }
  .bh-mobile-item.active { color: var(--bh-accent, #e07a5f); }
  .bh-mobile-sub { overflow: hidden; max-height: 0; transition: max-height 0.22s ease; background: #f9f9f9; }
  .bh-mobile-sub.open { max-height: 400px; }
  .bh-mobile-subitem {
    display: block; width: 100%; background: none; border: none;
    padding: 10px 16px 10px 32px; font-family: 'Poppins', sans-serif;
    font-size: 0.76rem; font-weight: 500; color: #555;
    cursor: pointer; text-align: left;
    border-bottom: 1px solid #f0eeec; transition: color 0.15s;
  }
  .bh-mobile-subitem:hover { color: var(--bh-accent, #e07a5f); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .bh-nav-center    { display: none !important; }
    .bh-right-section { display: none !important; }
    .bh-hamburger     { display: flex !important; }
  }
  @media (max-width: 640px) {
    .bh-header-content { padding-left: 16px !important; gap: 8px !important; }
    .bh-logo-text      { font-size: 17px !important; }
    .bh-logo-img       { height: 28px !important; }
  }
`;

/* ══════════════════════════════════════════════════
   CARD HELPERS
══════════════════════════════════════════════════ */
const cardDescMap = {
  "My Properties":         "View and manage all your registered properties",
  "Transfers":             "Initiate transfers, track status, and respond as buyer",
  "My Mutation Requests":  "Track mutation applications submitted to the Sub-Registrar",
  "File Mutation Request": "Apply for inheritance, survey correction, partition, or name change",
  "My Disputes":           "View disputes under investigation or resolved",
  "File a Dispute":        "Report ownership, boundary, or fraudulent record issues",
  "Profile":               "Update your personal details and preferences",
  "Change Password":       "Keep your account secure with a new password",
};

function DefaultCardIcon({ label }) {
  const size = 18;
  switch (label) {
    case "My Properties":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
    case "Approvals Queue":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      );
    case "Transfer Review":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      );
    case "Mutations Review":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      );
    case "Dispute Management":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    case "Audit Log":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      );
    case "Transfers":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="17 1 21 5 17 9"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <polyline points="7 23 3 19 7 15"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
      );
    case "My Mutation Requests":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      );
    case "File Mutation Request":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      );
    case "My Disputes":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      );
    case "File a Dispute":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      );
    case "Profile":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      );
    case "Change Password":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
}



/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub,  setMobileSub]  = useState(null);
  const menuRef = useRef(null);
  const navRef  = useRef(null);

  const path        = location.pathname;
  const isMain      = path === "/";
  const isDashboard = path.startsWith("/user/") || path.startsWith("/registrar/") || path.startsWith("/property/");
  const transparent = isMain;
  const isRegistrar = path.startsWith("/registrar/");

  const accent     = isRegistrar ? "#7C6EF5" : "#e07a5f";
  const accentDark = isRegistrar ? "#5B4FD4" : "#c96444";
  const logoutHoverBg = isRegistrar ? "rgba(124,110,245,0.08)" : "rgba(224,122,95,0.06)";
  const mobileHoverBg = isRegistrar ? "#f0eeff" : "#fdf3f0";

  const loggedUser = user;
  const initials   = loggedUser?.name
    ? loggedUser.name.split(" ").filter(w => w).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";
  const userId = loggedUser?.id || loggedUser?.registrarId || "USR-001";

  const handleLogout = () => {
    setMobileOpen(false);
    if (onLogout) onLogout();
    else navigate("/login");
  };

  const isActive = (tab) => {
    if (!tab.children) {
      return tab.path && (location.pathname === tab.path || location.pathname.startsWith(tab.path + "/"));
    }
    // for tabs with dropdowns: highlight if any child path matches
    const childPaths = tab.children.sections.flatMap(s => s.items.map(i => i.path));
    return childPaths.some(p => location.pathname === p || location.pathname.startsWith(p + "/"));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navBg =
    transparent && !scrolled && !isDashboard
      ? "transparent"
      : "linear-gradient(90deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)";

  const AvatarContent = () =>
    loggedUser?.avatar ? (
      <img src={loggedUser.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      <span>{initials}</span>
    );

  /* promo card label per section */
  const cardTag = {
    Mutation: "BHOOMISETU PORTAL",
    Disputes: "BHOOMISETU PORTAL",
    Account:  "BHOOMISETU PORTAL",
  };
  const cardCta = {
    Mutation: "Manage your land records today",
    Disputes: "Resolve disputes with ease",
    Account:  "Your account, fully in control",
  };

  return (
    <>
      <style>{CSS}</style>

      <nav
        ref={navRef}
        className={`bh-nav${isRegistrar ? " bh-nav-registrar" : ""}`}
        style={{
          background: navBg,
          backdropFilter: scrolled || !transparent || isDashboard ? "blur(14px)" : "none",
          "--bh-accent": accent,
          "--bh-accent-dark": accentDark,
          "--bh-logout-hover-bg": logoutHoverBg,
          "--bh-mobile-hover-bg": mobileHoverBg,
        }}
      >
        {/* ── Logo ── */}
        <div className="bh-header-content">
          <img
            src="/assets/logo.png"
            alt="BhoomiSetu Logo"
            className="bh-logo-img"
            style={{ height: "36px", width: "auto", objectFit: "contain", display: "block", flexShrink: 0 }}
          />
          <span className="bh-logo-text">BhoomiSetu</span>
        </div>

        {/* ── Centre nav (desktop) ── */}
        {loggedUser && (
          <div className="bh-nav-center">
            {(loggedUser?.role?.toLowerCase() === "registrar" ? REGISTRAR_NAV : USER_NAV).map((tab) => {
              const hasDrop = Boolean(tab.children);
              const active  = isActive(tab);

              return (
                <div key={tab.label} className="bh-wrap">
                  <button
                    className={`bh-link${active ? " bh-link-active" : ""}${hasDrop ? " bh-link-nodrop" : ""}`}
                    onClick={() => { if (!hasDrop) navigate(tab.path); }}
                    style={hasDrop ? { cursor: "default" } : {}}
                  >
                    {tab.icon}
                    {tab.label}
                    {hasDrop && <span className="bh-chevron">▾</span>}
                  </button>

                  {hasDrop && (
                    <div className="bh-dropdown">
                      {tab.children.brand && (
                        <div className="bh-drop-brand">
                          <div className="bh-drop-brand-title">{tab.children.brand.title}</div>
                        </div>
                      )}
                      
                      <div className="bh-drop-list">
                        {tab.children.sections.flatMap(sec => sec.items).map((item) => {
                          const itemActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                          return (
                            <button
                              key={item.path}
                              className={`bh-drop-item${itemActive ? " bh-card-active" : ""}`}
                              onClick={() => navigate(item.path)}
                            >
                              <div className="bh-drop-item-icon-wrapper">
                                {item.img || <DefaultCardIcon label={item.label} />}
                              </div>
                              <div className="bh-drop-item-details">
                                <div className="bh-drop-item-title">
                                  {item.label}
                                  {itemActive && <span className="bh-active-dot" />}
                                </div>
                                <div className="bh-drop-item-desc">
                                  {item.desc || cardDescMap[item.label] || "Manage and track records"}
                                </div>
                              </div>
                              <div className="bh-drop-item-arrow">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Right side ── */}
        {loggedUser ? (
          <>
            {/* Desktop: only Logout, styled same as nav buttons */}
            <div className="bh-right-section">
              <button className="bh-logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                LOGOUT
              </button>
            </div>

            {/* Mobile hamburger */}
            <div ref={menuRef}>
              <button
                className="bh-hamburger"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle menu"
              >
                <div className={`bh-ham-icon${mobileOpen ? " bh-ham-open" : ""}`}>
                  <span /><span /><span />
                </div>
              </button>

              {mobileOpen && (
                <div className="bh-mobile-menu" style={{ borderTopColor: accent }}>
                  {(loggedUser?.role?.toLowerCase() === "registrar" ? REGISTRAR_NAV : USER_NAV).map((tab) => {
                    const hasDrop = Boolean(tab.children);
                    const active  = isActive(tab);
                    const subOpen = mobileSub === tab.label;

                    return (
                      <div key={tab.label}>
                        <button
                          className={`bh-mobile-item${active ? " active" : ""}`}
                          onClick={() => {
                            if (hasDrop) setMobileSub(subOpen ? null : tab.label);
                            else { navigate(tab.path); setMobileOpen(false); }
                          }}
                          style={{ justifyContent: "space-between" }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {tab.icon}
                            {tab.label}
                          </span>
                          {hasDrop && (
                            <span style={{
                              fontSize: "10px", opacity: 0.4,
                              transform: subOpen ? "rotate(180deg)" : "none",
                              transition: "transform 0.2s", display: "inline-block",
                            }}>▾</span>
                          )}
                        </button>

                        {hasDrop && (
                          <div className={`bh-mobile-sub${subOpen ? " open" : ""}`}>
                            {tab.children.sections.flatMap(s => s.items).map((item) => (
                              <button
                                key={item.path}
                                className="bh-mobile-subitem"
                                onClick={() => { navigate(item.path); setMobileOpen(false); setMobileSub(null); }}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Logout */}
                  <button
                    className="bh-mobile-item"
                    onClick={handleLogout}
                    style={{ color: accent, borderBottom: "none" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Guest */
          <>
            {/* Desktop Guest Buttons */}
            <div className="bh-right-section" style={{ gap: "12px", marginLeft: "auto", marginRight: "1.2rem" }}>
              {(path === "/signin" || path === "joinus") && (
                <button
                  className="bh-back-home-btn"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "none"; }}
                  onClick={() => navigate("/")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Back to Home
                </button>
              )}
              <button className="rh-btn-outline" onClick={() => navigate("/signin")}>Sign in</button>
              <button className="rh-btn-filled" onClick={() => navigate("joinus")}>Join Us</button>
            </div>

            {/* Mobile Guest Hamburger */}
            <div ref={menuRef}>
              <button
                className="bh-hamburger"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle menu"
              >
                <div className={`bh-ham-icon${mobileOpen ? " bh-ham-open" : ""}`}>
                  <span /><span /><span />
                </div>
              </button>

              {mobileOpen && (
                <div className="bh-mobile-menu" style={{ borderTopColor: accent }}>
                  {(path === "/signin" || path === "joinus") && (
                    <button
                      className="bh-mobile-item"
                      onClick={() => { navigate("/"); setMobileOpen(false); }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                      Back to Home
                    </button>
                  )}
                  <button
                    className="bh-mobile-item"
                    onClick={() => { navigate("/signin"); setMobileOpen(false); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Sign in
                  </button>
                  <button
                    className="bh-mobile-item"
                    onClick={() => { navigate("joinus"); setMobileOpen(false); }}
                    style={{ borderBottom: "none" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                    Join Us
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
}