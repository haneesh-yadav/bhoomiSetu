import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ══════════════════════════════════════════════════
   CSS STYLES
══════════════════════════════════════════════════ */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Mono:wght@400;500&display=swap');

  /* ── Animations ── */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float1 {
    0%, 100% { transform: translateY(0) rotate(-6deg); }
    50%       { transform: translateY(-12px) rotate(-6deg); }
  }

  @keyframes float2 {
    0%, 100% { transform: translateY(0) rotate(10deg); }
    50%       { transform: translateY(-9px) rotate(10deg); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Page ── */
  .signup-page {
    font-family: 'Bricolage Grotesque', sans-serif;
    min-height: 100vh;
    background: #EFEFEB;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    position: relative;
    overflow: hidden;
  }

  /* ── Grid background ── */
  .signup-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(13,61,43,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(13,61,43,0.07) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── Floating decorations ── */
  .su-float {
    position: fixed;
    z-index: 1;
  }

  .su-float-1 {
    top: 8%;
    left: 6%;
    width: 76px;
    height: 76px;
    background: #fff;
    border: 2.5px solid #0D3D2B;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    box-shadow: 3px 3px 0 #0D3D2B;
    animation: float1 4.5s ease-in-out infinite;
  }

  .su-float-2 {
    top: 12%;
    right: 7%;
    animation: float2 5s ease-in-out infinite;
  }

  .su-float-3 {
    bottom: 15%;
    left: 5%;
    padding: 7px 13px;
    border: 2.5px solid #0D3D2B;
    border-radius: 8px;
    background: #F07060;
    font-size: 0.68rem;
    font-weight: 800;
    color: #fff;
    box-shadow: 3px 3px 0 #0D3D2B;
    animation: float2 6s ease-in-out infinite;
  }

  .su-float-4 {
    bottom: 20%;
    right: 6%;
    animation: float1 5.5s ease-in-out infinite;
  }

  /* ── Star decorations ── */
  .su-star-1 {
    position: fixed;
    z-index: 1;
    top: 40%;
    left: 10%;
    color: #C8F135;
    font-size: 1.4rem;
    opacity: 0.6;
  }

  .su-star-2 {
    position: fixed;
    z-index: 1;
    top: 28%;
    right: 13%;
    color: #5B4FD4;
    font-size: 1rem;
    opacity: 0.5;
  }

  .su-star-3 {
    position: fixed;
    z-index: 1;
    bottom: 10%;
    right: 22%;
    color: #2EC4A0;
    font-size: 1.2rem;
    opacity: 0.45;
  }

  /* ── Card wrapper ── */
  .signup-card-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 640px;
    animation: fadeUp 0.55s ease both;
  }

  /* ── Card ── */
  .signup-card {
    border: 2.5px solid #0D3D2B;
    border-radius: 20px;
    overflow: hidden;
    background: #fff;
    box-shadow: 6px 6px 0 #0D3D2B;
  }

  /* ── Card header banner ── */
  .signup-banner {
    background: #C8F135;
    border-bottom: 2.5px solid #0D3D2B;
    padding: 1.25rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .signup-banner-left {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .signup-banner-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #0D3D2B;
    border-radius: 5px;
    padding: 2px 10px;
    width: fit-content;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #C8F135;
  }

  .signup-banner-title {
    font-size: 1.4rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
  }

  .signup-banner-sub {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(13,61,43,0.6);
  }

  .signup-banner-icon {
    font-size: 2.5rem;
  }

  /* ── Progress steps ── */
  .signup-progress {
    border-bottom: 2.5px solid #0D3D2B;
    background: #F8F8F4;
    padding: 0.9rem 2rem;
    display: flex;
    align-items: center;
    gap: 0;
  }

  .progress-step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .progress-num {
    width: 26px;
    height: 26px;
    border: 2px solid #0D3D2B;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: 800;
    font-family: 'DM Mono', monospace;
    flex-shrink: 0;
    transition: background 0.2s, color 0.2s;
  }

  .progress-num-active {
    background: #0D3D2B;
    color: #C8F135;
  }

  .progress-num-done {
    background: #2EC4A0;
    color: #fff;
    border-color: #2EC4A0;
  }

  .progress-num-inactive {
    background: transparent;
    color: rgba(13,61,43,0.35);
    border-color: rgba(13,61,43,0.2);
  }

  .progress-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    transition: color 0.2s;
  }

  .progress-label-active {
    color: #0D3D2B;
  }

  .progress-label-done {
    color: #2EC4A0;
  }

  .progress-label-inactive {
    color: rgba(13,61,43,0.35);
  }

  .progress-line {
    flex: 1;
    height: 2px;
    background: rgba(13,61,43,0.12);
    margin: 0 0.5rem;
    border-radius: 2px;
  }

  .progress-line-done {
    background: #2EC4A0;
  }

  /* ── Form body ── */
  .signup-body {
    padding: 1.75rem 2.25rem 2.25rem;
  }

  /* ── Step heading ── */
  .step-heading {
    margin-bottom: 1.25rem;
  }

  .step-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .step-subtitle {
    font-size: 0.82rem;
    color: rgba(13,61,43,0.5);
    font-weight: 500;
    line-height: 1.5;
  }

  /* ── Form grid ── */
  .form-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-grid-1 {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  /* ── Field ── */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field-label {
    font-size: 0.75rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: 0.06em;
  }

  .field-input {
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid rgba(13,61,43,0.2);
    border-radius: 10px;
    background: #fff;
    font-size: 0.9rem;
    font-family: inherit;
    font-weight: 500;
    color: #0D3D2B;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    box-shadow: inset 0 1px 3px rgba(13,61,43,0.04);
  }

  .field-input:focus {
    border-color: #0D3D2B;
    box-shadow: inset 0 1px 3px rgba(13,61,43,0.06), 0 0 0 3px rgba(13,61,43,0.06);
    background: #fff;
  }

  .field-input::placeholder {
    color: rgba(13,61,43,0.3);
  }

  .field-input-error {
    border-color: #F07060;
    box-shadow: inset 0 1px 3px rgba(240,112,96,0.06);
    background: #fff;
  }

  .field-input-valid {
    border-color: #2EC4A0;
  }

  .field-error {
    font-size: 0.7rem;
    font-weight: 700;
    color: #C0392B;
    margin-top: 0.15rem;
  }

  .field-hint {
    font-size: 0.7rem;
    color: rgba(13,61,43,0.45);
    font-weight: 500;
    margin-top: 0.15rem;
  }

  /* ── Password wrapper ── */
  .pass-wrap {
    position: relative;
    width: 100%;
  }

  .pass-wrap .field-input {
    padding-right: 3rem;
    box-sizing: border-box;
  }

  .pass-eye {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: rgba(13,61,43,0.4);
    transition: color 0.2s;
    padding: 0;
  }

  .pass-eye:hover {
    color: #0D3D2B;
  }

  /* ── Password strength ── */
  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 0.5rem;
  }

  .strength-seg {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background: rgba(13,61,43,0.1);
    transition: background 0.3s;
  }

  .strength-weak   { background: #F07060; }
  .strength-fair   { background: #F0A030; }
  .strength-good   { background: #C8F135; }
  .strength-strong { background: #2EC4A0; }

  .strength-label {
    font-size: 0.68rem;
    font-weight: 700;
    margin-top: 0.3rem;
  }

  .sl-weak   { color: #F07060; }
  .sl-fair   { color: #F0A030; }
  .sl-good   { color: #C8F135; }
  .sl-strong { color: #2EC4A0; }

  /* ── Checkbox ── */
  .checkbox-row {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    cursor: pointer;
  }

  .checkbox-box {
    width: 20px;
    height: 20px;
    min-width: 20px;
    border: 2px solid rgba(13,61,43,0.3);
    border-radius: 5px;
    background: #F8F8F4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 1px;
  }

  .checkbox-box-checked {
    background: #C8F135;
    border-color: #0D3D2B;
  }

  .checkbox-text {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(13,61,43,0.7);
    line-height: 1.55;
  }

  .checkbox-link {
    font-weight: 700;
    color: #0D3D2B;
    text-decoration: underline;
    cursor: pointer;
  }

  /* ── Review box ── */
  .review-box {
    border: 2.5px solid #0D3D2B;
    border-radius: 14px;
    overflow: hidden;
  }

  .review-header {
    background: #C8F135;
    border-bottom: 2.5px solid #0D3D2B;
    padding: 0.75rem 1.25rem;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #0D3D2B;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .review-rows {
    padding: 0.5rem 0;
  }

  .review-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 1.25rem;
  }

  .review-row:not(:last-child) {
    border-bottom: 1px solid rgba(13,61,43,0.07);
  }

  .review-label {
    font-size: 0.73rem;
    color: rgba(13,61,43,0.45);
    font-weight: 600;
  }

  .review-value {
    font-size: 0.82rem;
    font-weight: 700;
    color: #0D3D2B;
  }

  .review-edit {
    font-size: 0.65rem;
    font-weight: 800;
    color: #5B4FD4;
    cursor: pointer;
    letter-spacing: 0.04em;
    padding: 2px 8px;
    border: 1.5px solid #5B4FD4;
    border-radius: 4px;
    transition: all 0.15s;
  }

  .review-edit:hover {
    background: #5B4FD4;
    color: #fff;
  }

  /* ── Error banner ── */
  .error-banner {
    padding: 0.65rem 0.9rem;
    background: rgba(240,112,96,0.1);
    border: 2px solid #F07060;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #C0392B;
    margin-bottom: 1rem;
  }

  /* ── Nav buttons ── */
  .form-nav {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-back {
    padding: 0.8rem 1.4rem;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    background: transparent;
    color: #0D3D2B;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.18s;
    white-space: nowrap;
  }

  .btn-back:hover {
    background: #F0F0EC;
  }

  .btn-next {
    flex: 1;
    padding: 0.85rem;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    background: #C8F135;
    color: #0D3D2B;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    box-shadow: 3px 3px 0 #0D3D2B;
    transition: opacity 0.18s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-next:hover {
    opacity: 0.88;
  }

  .btn-next:active {
    transform: translateY(1px);
  }

  .btn-next:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn-submit {
    background: #0D3D2B;
    color: #C8F135;
    box-shadow: 3px 3px 0 rgba(13,61,43,0.3);
  }

  /* ── Spinner ── */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2.5px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.7s linear infinite;
  }

  /* ── Card footer ── */
  .signup-footer {
    border-top: 2.5px solid #0D3D2B;
    padding: 0.85rem 2rem;
    background: #F8F8F4;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .footer-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #2EC4A0;
    box-shadow: 0 0 6px #2EC4A0;
    display: inline-block;
    flex-shrink: 0;
  }

  .footer-text {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(13,61,43,0.45);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.04em;
  }

  /* ── Back to login ── */
  .back-to-login {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin-top: 0.85rem;
    padding-top: 0.85rem;
    border-top: 1.5px solid rgba(13,61,43,0.08);
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(13,61,43,0.45);
    cursor: default;
  }

  .back-link {
    font-weight: 800;
    color: #0D3D2B;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.18s;
  }

  .back-link:hover {
    color: #F07060;
  }

  /* ── Selection box ── */
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

  /* ── Scrollbar ── */
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

  /* ══════════════════════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════════════════════ */

  /* Tablet — ≤ 768px */
  @media (max-width: 768px) {
    .signup-page {
      padding: 2rem 1rem;
      padding-top: 5rem;
      align-items: flex-start;
    }
    .signup-card-wrapper {
      max-width: 100%;
    }
    .su-float-1,
    .su-float-2,
    .su-float-3,
    .su-float-4 {
      display: none;
    }
    .su-star-1,
    .su-star-2,
    .su-star-3 {
      display: none;
    }
    .signup-banner {
      padding: 1rem 1.25rem;
    }
    .signup-banner-title {
      font-size: 1.2rem;
    }
    .signup-progress {
      padding: 0.75rem 1.25rem;
      gap: 0;
      overflow-x: auto;
    }
    .progress-label {
      display: none;
    }
    .signup-body {
      padding: 1.5rem 1.25rem;
    }
    .signup-footer {
      padding: 0.85rem 1.25rem;
    }
  }

  /* Small mobile — ≤ 600px */
  @media (max-width: 600px) {
    .form-grid-2 {
      grid-template-columns: 1fr;
    }
    .signup-card {
      border-radius: 16px;
      box-shadow: 4px 4px 0 #0D3D2B;
    }
    .signup-banner-icon {
      display: none;
    }
    .form-nav {
      flex-direction: column-reverse;
    }
    .btn-back {
      width: 100%;
      text-align: center;
    }
    .review-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
    }
    .review-header {
      flex-wrap: wrap;
    }
  }

  /* Small mobile — ≤ 480px */
  @media (max-width: 480px) {
    .signup-page {
      padding: 1rem;
      padding-top: 4.5rem;
    }
    .signup-banner-title {
      font-size: 1.1rem;
    }
    .step-title {
      font-size: 1.1rem;
    }
    .footer-text {
      font-size: 0.6rem;
    }
  }
`;

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry",
];

const STEPS_META = [
  { num: "01", label: "Personal Info"  },
  { num: "02", label: "Address"        },
  { num: "03", label: "Account Setup"  },
  { num: "04", label: "Review"         },
];

/* ══════════════════════════════════════════════════
   REUSABLE COMPONENTS
══════════════════════════════════════════════════ */
const SelectionBox = ({ children, color = "#5B4FD4" }) => (
  <div className="sel-box" style={{ "--sel-color": color }}>
    <div className="sel-box-inner">{children}</div>
    <span className="sel-handle sel-tl" />
    <span className="sel-handle sel-tr" />
    <span className="sel-handle sel-bl" />
    <span className="sel-handle sel-br" />
  </div>
);

const Cursor = () => (
  <svg width="26" height="30" viewBox="0 0 28 32" fill="none">
    <path d="M4 2L4 24L10 18L14 28L17 27L13 17L22 17L4 2Z" fill="white" stroke="#0D3D2B" strokeWidth="2.5" strokeLinejoin="round"/>
  </svg>
);

/* ══════════════════════════════════════════════════
   SIGNUP PAGE COMPONENT
══════════════════════════════════════════════════ */
export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    firstName:   "",
    lastName:    "",
    dob:         "",
    phone:       "",
    aadhaar:     "",
    address1:    "",
    address2:    "",
    city:        "",
    state:       "",
    pincode:     "",
    email:       "",
    password:    "",
    confirmPass: "",
    agreed:      false,
  });

  /* ── Field change handler ── */
  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  /* ── Password strength ── */
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)              score++;
    if (/[A-Z]/.test(pw))            score++;
    if (/[0-9]/.test(pw))            score++;
    if (/[^A-Za-z0-9]/.test(pw))     score++;
    return score;
  };
  const strengthScore = getStrength(form.password);
  const strengthMap   = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthClass = ["", "strength-weak", "strength-fair", "strength-good", "strength-strong"];
  const strengthLabelClass = ["", "sl-weak", "sl-fair", "sl-good", "sl-strong"];

  /* ── Validation per step ── */
  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = "First name is required.";
      if (!form.lastName.trim())  e.lastName  = "Last name is required.";
      if (!form.dob)              e.dob       = "Date of birth is required.";
      if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter a valid 10-digit mobile number.";
      if (!form.aadhaar.match(/^\d{12}$/))   e.aadhaar = "Aadhaar must be exactly 12 digits.";
    }
    if (s === 2) {
      if (!form.address1.trim()) e.address1 = "Address line 1 is required.";
      if (!form.city.trim())     e.city     = "City is required.";
      if (!form.state)           e.state    = "Please select your state.";
      if (!form.pincode.match(/^\d{6}$/)) e.pincode = "PIN code must be 6 digits.";
    }
    if (s === 3) {
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address.";
      if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
      if (form.password !== form.confirmPass) e.confirmPass = "Passwords do not match.";
      if (!form.agreed) e.agreed = "You must accept the terms to continue.";
    }
    return e;
  };

  /* ── Next step ── */
  const handleNext = () => {
    const e = validate(step);
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Final submit ── */
  const handleSubmit = async () => {
    setSubmitError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);

    const result = signup(form);
    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    navigate("/user/dashboard");
  };

  /* ── Helpers ── */
  const fieldClass = (key) =>
    `field-input ${errors[key] ? "field-input-error" : ""}`;

  const maskAadhaar = (v) => v.replace(/\D/g, "").slice(0, 12);
  const maskPhone   = (v) => v.replace(/\D/g, "").slice(0, 10);
  const maskPincode = (v) => v.replace(/\D/g, "").slice(0, 6);

  return (
    <>
      <style>{styles}</style>

      <div className="signup-page">
        <div className="signup-grid-bg" />

        {/* Floating decorations */}
        <div className="su-float su-float-1"><span className="material-icons-sharp" style={{fontSize:"2rem",color:"#0D3D2B"}}>assignment</span></div>
        <div className="su-float su-float-2">
          <SelectionBox color="#2EC4A0">
            <span style={{ fontSize:"0.65rem", fontWeight:800, color:"#0D3D2B" }}>CITIZEN REGISTRY</span>
          </SelectionBox>
        </div>
        <div className="su-float su-float-3"><span className="material-icons-sharp" style={{fontSize:13,verticalAlign:"middle",marginRight:"0.3rem"}}>shield</span>Secure Registration</div>
        <div className="su-float su-float-4"><Cursor /></div>
        <span className="su-star-1 material-icons-sharp" style={{fontSize:"1.4rem"}}>auto_awesome</span>
        <span className="su-star-2 material-icons-sharp" style={{fontSize:"1rem"}}>auto_awesome</span>
        <span className="su-star-3 material-icons-sharp" style={{fontSize:"1.2rem"}}>auto_awesome</span>

        {/* ── CARD WRAPPER ── */}
        <div className="signup-card-wrapper">

          {/* ── CARD ── */}
          <div className="signup-card">

            {/* Banner */}
            <div className="signup-banner">
              <div className="signup-banner-left">
                <div className="signup-banner-badge"><span className="material-icons-sharp" style={{fontSize:12,verticalAlign:"middle",marginRight:"0.25rem"}}>person</span>CITIZEN REGISTRATION</div>
                <div className="signup-banner-title">Create your account</div>
                <div className="signup-banner-sub">Property owners, buyers & legal heirs</div>
              </div>
              <div className="signup-banner-icon"><span className="material-icons-sharp" style={{fontSize:"2.2rem",color:"#0D3D2B"}}>home</span></div>
            </div>

            {/* Progress */}
            <div className="signup-progress">
              {STEPS_META.map((s, i) => {
                const n = i + 1;
                const isDone   = step > n;
                const isActive = step === n;
                return (
                  <div key={i} className="progress-step">
                    {i > 0 && <div className={`progress-line ${isDone ? "progress-line-done" : ""}`} />}
                    <div className={`progress-num ${isDone ? "progress-num-done" : isActive ? "progress-num-active" : "progress-num-inactive"}`}>
                      {isDone ? <span className="material-icons-sharp" style={{fontSize:13}}>check</span> : s.num}
                    </div>
                    <span className={`progress-label ${isDone ? "progress-label-done" : isActive ? "progress-label-active" : "progress-label-inactive"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Form body */}
            <div className="signup-body">

              {/* ── STEP 1: Personal Info ── */}
              {step === 1 && (
                <>
                  <div className="step-heading">
                    <div className="step-title">Personal Information</div>
                    <div className="step-subtitle">Enter your legal details as they appear on your Aadhaar card.</div>
                  </div>

                  <div className="form-grid-1">
                    <div className="form-grid-2">
                      <div className="field-group">
                        <label className="field-label">FIRST NAME</label>
                        <input className={fieldClass("firstName")} value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Haneesh" />
                        {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                      </div>
                      <div className="field-group">
                        <label className="field-label">LAST NAME</label>
                        <input className={fieldClass("lastName")} value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Yadav" />
                        {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">DATE OF BIRTH</label>
                      <input className={fieldClass("dob")} type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
                      {errors.dob && <span className="field-error">{errors.dob}</span>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">MOBILE NUMBER</label>
                      <input className={fieldClass("phone")} value={form.phone} onChange={e => set("phone", maskPhone(e.target.value))} placeholder="9123456789" />
                      <span className="field-hint">10-digit Indian mobile number</span>
                      {errors.phone && <span className="field-error">{errors.phone}</span>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">AADHAAR NUMBER</label>
                      <input className={fieldClass("aadhaar")} value={form.aadhaar} onChange={e => set("aadhaar", maskAadhaar(e.target.value))} placeholder="XXXX XXXX XXXX" />
                      <span className="field-hint">12-digit Aadhaar number for identity verification</span>
                      {errors.aadhaar && <span className="field-error">{errors.aadhaar}</span>}
                    </div>
                  </div>

                  <div className="form-nav">
                    <button className="btn-next" onClick={handleNext}>Personal Info Done →</button>
                  </div>
                </>
              )}

              {/* ── STEP 2: Address ── */}
              {step === 2 && (
                <>
                  <div className="step-heading">
                    <div className="step-title">Residential Address</div>
                    <div className="step-subtitle">Your permanent address as registered with the government.</div>
                  </div>

                  <div className="form-grid-1">
                    <div className="field-group">
                      <label className="field-label">ADDRESS LINE 1</label>
                      <input className={fieldClass("address1")} value={form.address1} onChange={e => set("address1", e.target.value)} placeholder="Door No., Street Name" />
                      {errors.address1 && <span className="field-error">{errors.address1}</span>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">ADDRESS LINE 2 <span style={{ fontWeight:500, opacity:0.5 }}>(optional)</span></label>
                      <input className="field-input" value={form.address2} onChange={e => set("address2", e.target.value)} placeholder="Landmark, Area" />
                    </div>

                    <div className="form-grid-2">
                      <div className="field-group">
                        <label className="field-label">CITY / TOWN</label>
                        <input className={fieldClass("city")} value={form.city} onChange={e => set("city", e.target.value)} placeholder="Gurgaon" />
                        {errors.city && <span className="field-error">{errors.city}</span>}
                      </div>
                      <div className="field-group">
                        <label className="field-label">PIN CODE</label>
                        <input className={fieldClass("pincode")} value={form.pincode} onChange={e => set("pincode", maskPincode(e.target.value))} placeholder="122003" />
                        {errors.pincode && <span className="field-error">{errors.pincode}</span>}
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">STATE</label>
                      <select
                        className={fieldClass("state")}
                        value={form.state}
                        onChange={e => set("state", e.target.value)}
                        style={{ appearance:"none", cursor:"pointer" }}
                      >
                        <option value="">Select State / UT</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <span className="field-error">{errors.state}</span>}
                    </div>
                  </div>

                  <div className="form-nav">
                    <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn-next" onClick={handleNext}>Address Done →</button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Account Setup ── */}
              {step === 3 && (
                <>
                  <div className="step-heading">
                    <div className="step-title">Account Credentials</div>
                    <div className="step-subtitle">Set up your email and a strong password to secure your account.</div>
                  </div>

                  <div className="form-grid-1">
                    <div className="field-group">
                      <label className="field-label">EMAIL ADDRESS</label>
                      <input className={fieldClass("email")} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="haneesh@bhoomi.in" />
                      <span className="field-hint">This will be your login ID</span>
                      {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">PASSWORD</label>
                      <div className="pass-wrap">
                        <input
                          className={fieldClass("password")}
                          type={showPass ? "text" : "password"}
                          value={form.password}
                          onChange={e => set("password", e.target.value)}
                          placeholder="Min. 8 characters"
                        />
                        <button type="button" className="pass-eye" onClick={() => setShowPass(s => !s)}>
                          <span className="material-icons-sharp" style={{fontSize:19,display:"block"}}>{showPass ? "visibility_off" : "visibility"}</span>
                        </button>
                      </div>
                      {form.password && (
                        <>
                          <div className="strength-bar">
                            {[1,2,3,4].map(i => (
                              <div key={i} className={`strength-seg ${i <= strengthScore ? strengthClass[strengthScore] : ""}`} />
                            ))}
                          </div>
                          <span className={`strength-label ${strengthLabelClass[strengthScore]}`}>
                            Strength: {strengthMap[strengthScore]}
                          </span>
                        </>
                      )}
                      {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">CONFIRM PASSWORD</label>
                      <div className="pass-wrap">
                        <input
                          className={`${fieldClass("confirmPass")} ${form.confirmPass && form.confirmPass === form.password ? "field-input-valid" : ""}`}
                          type={showConfirm ? "text" : "password"}
                          value={form.confirmPass}
                          onChange={e => set("confirmPass", e.target.value)}
                          placeholder="Re-enter your password"
                        />
                        <button type="button" className="pass-eye" onClick={() => setShowConfirm(s => !s)}>
                          <span className="material-icons-sharp" style={{fontSize:19,display:"block"}}>{showConfirm ? "visibility_off" : "visibility"}</span>
                        </button>
                      </div>
                      {errors.confirmPass && <span className="field-error">{errors.confirmPass}</span>}
                    </div>

                    <div className="checkbox-row" onClick={() => set("agreed", !form.agreed)}>
                      <div className={`checkbox-box ${form.agreed ? "checkbox-box-checked" : ""}`}>
                        {form.agreed && <span className="material-icons-sharp" style={{fontSize:13}}>check</span>}
                      </div>
                      <span className="checkbox-text">
                        I agree to the{" "}
                        <span className="checkbox-link">Terms of Service</span>{" "}
                        and{" "}
                        <span className="checkbox-link">Privacy Policy</span>.
                        I confirm that the information provided is accurate.
                      </span>
                    </div>
                    {errors.agreed && <span className="field-error">{errors.agreed}</span>}
                  </div>

                  <div className="form-nav">
                    <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn-next" onClick={handleNext}>Review Details →</button>
                  </div>
                </>
              )}

              {/* ── STEP 4: Review & Submit ── */}
              {step === 4 && (
                <>
                  <div className="step-heading">
                    <div className="step-title">Review & Confirm</div>
                    <div className="step-subtitle">Double-check your details before submitting. You can go back and edit any section.</div>
                  </div>

                  <div className="form-grid-1">

                    {/* Personal info review */}
                    <div className="review-box">
                      <div className="review-header">
                        <span className="material-icons-sharp" style={{fontSize:15,verticalAlign:"middle",marginRight:"0.4rem"}}>person</span>PERSONAL INFO
                        <button className="review-edit" onClick={() => setStep(1)}>EDIT</button>
                      </div>
                      <div className="review-rows">
                        {[
                          { label: "Full Name",    value: `${form.firstName} ${form.lastName}` },
                          { label: "Date of Birth",value: form.dob || "—" },
                          { label: "Mobile",       value: form.phone || "—" },
                          { label: "Aadhaar",      value: form.aadhaar ? `XXXX XXXX ${form.aadhaar.slice(-4)}` : "—" },
                        ].map((r, i) => (
                          <div key={i} className="review-row">
                            <span className="review-label">{r.label}</span>
                            <span className="review-value">{r.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address review */}
                    <div className="review-box">
                      <div className="review-header">
                        <span className="material-icons-sharp" style={{fontSize:15,verticalAlign:"middle",marginRight:"0.4rem"}}>location_on</span>ADDRESS
                        <button className="review-edit" onClick={() => setStep(2)}>EDIT</button>
                      </div>
                      <div className="review-rows">
                        {[
                          { label: "Address",  value: [form.address1, form.address2].filter(Boolean).join(", ") || "—" },
                          { label: "City",     value: form.city || "—" },
                          { label: "State",    value: form.state || "—" },
                          { label: "PIN Code", value: form.pincode || "—" },
                        ].map((r, i) => (
                          <div key={i} className="review-row">
                            <span className="review-label">{r.label}</span>
                            <span className="review-value">{r.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account review */}
                    <div className="review-box">
                      <div className="review-header">
                        <span className="material-icons-sharp" style={{fontSize:15,verticalAlign:"middle",marginRight:"0.4rem"}}>lock</span>ACCOUNT
                        <button className="review-edit" onClick={() => setStep(3)}>EDIT</button>
                      </div>
                      <div className="review-rows">
                        {[
                          { label: "Email",    value: form.email || "—" },
                          { label: "Password", value: "••••••••" },
                        ].map((r, i) => (
                          <div key={i} className="review-row">
                            <span className="review-label">{r.label}</span>
                            <span className="review-value">{r.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {submitError && <div className="error-banner"><span className="material-icons-sharp" style={{fontSize:15,verticalAlign:"middle",marginRight:"0.35rem"}}>warning</span>{submitError}</div>}

                  <div className="form-nav">
                    <button className="btn-back" onClick={() => setStep(3)}>← Back</button>
                    <button
                      className="btn-next btn-submit"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner" /> Registering...</>
                        : "Create Account →"
                      }
                    </button>
                  </div>
                </>
              )}


              {/* Already have an account */}
              <p className="back-to-login">
                Already have an account?{" "}
                <span className="back-link" onClick={() => navigate("/login")}>Log In</span>
              </p>

            </div>{/* end signup-body */}

          </div>{/* end signup-card */}

        </div>{/* end signup-card-wrapper */}

      </div>
    </>
  );
}
