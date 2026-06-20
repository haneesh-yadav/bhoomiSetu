import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ══════════════════════════════════════════════════
   ILLUSTRATION — same as Login
══════════════════════════════════════════════════ */
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

function IllustrationBlocks() {
  return (
    <img 
      src="/assets/signIn-Join.jpg" 
      alt="BhoomiSetu Portal Illustration"
      style={{ 
        width: "100%", 
        height: "100%", 
        objectFit: "cover", 
        display: "block" 
      }} 
    />
  );
}

/* ══════════════════════════════════════════════════
   INPUT MASKS
══════════════════════════════════════════════════ */
const maskPhone   = (val) => val.replace(/\D/g, "").slice(0, 10);
const maskAadhaar = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})/g, "$1 ").trim();
};
const maskPincode = (val) => val.replace(/\D/g, "").slice(0, 6);

const EyeIcon = ({ visible, onClick }) => (
  <button type="button" onClick={onClick} style={{
    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
    background: "none", border: "none", cursor: "pointer", color: "#888",
    display: "flex", alignItems: "center", padding: "4px",
  }}>
    {visible ? (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    )}
  </button>
);

/* ══════════════════════════════════════════════════
   CSS — matches Login design tokens exactly
══════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sg-page {
    font-family: 'Poppins', sans-serif;
    display: flex;
    height: 100vh;
    padding-top: 60px;
    background: #f0ede4;
    overflow: hidden;
  }

  /* ── Left panel ── */
  .sg-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 40px 64px 32px;
    background: #f0ede4;
    overflow-y: auto;
    animation: fadeUp 0.35s ease both;
  }

  /* ── Headline ── */
  .sg-headline {
    font-size: 34px; font-weight: 800;
    color: #1a1a1a; letter-spacing: -0.04em;
    line-height: 1.12; margin-bottom: 28px;
  }
  .sg-headline span { color: #2A7D4F; }

  /* ── Step progress bar ── */
  .sg-steps {
    display: flex; align-items: center;
    gap: 6px; margin-bottom: 28px;
  }
  .sg-step-bar {
    flex: 1; height: 4px; border-radius: 2px;
    transition: background 0.3s ease;
  }
  .sg-step-bar.active   { background: #1a1a1a; }
  .sg-step-bar.inactive { background: #d1cdc2; }

  /* ── Error ── */
  .sg-error {
    padding: 11px 14px;
    background: rgba(232,83,58,0.1);
    color: #c0392b;
    border-left: 3px solid #e8533a;
    border-radius: 0 8px 8px 0;
    font-size: 12px; font-weight: 600;
    margin-bottom: 18px;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Label ── */
  .sg-label {
    display: block;
    font-size: 11.5px; font-weight: 700;
    color: #666; margin-bottom: 7px;
    letter-spacing: 0.03em;
    font-family: 'Poppins', sans-serif;
  }

  /* ── Input ── */
  .sg-input {
    width: 100%;
    min-width: 0;
    padding: 14px 18px;
    border-radius: 12px;
    border: 1.5px solid #c8c8c8;
    background: #f0f0f0;
    font-size: 13.5px;
    font-family: 'Poppins', sans-serif;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
  }
  .sg-input::placeholder { color: #aaa; }
  .sg-input:focus {
    border-color: #2A7D4F;
    box-shadow: 0 0 0 3px rgba(42,125,79,0.12);
    background: #fff;
  }

  /* ── Input group (two-col row) ── */
  .sg-row {
    display: flex; gap: 14px;
    margin-bottom: 16px;
  }
  .sg-row > div { flex: 1; min-width: 0; }

  /* ── Primary button ── */
  .sg-btn-primary {
    flex: 1;
    padding: 15px 20px;
    border-radius: 12px;
    background: #1a1a1a;
    color: #fff;
    font-size: 12px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.1em;
    border: none; cursor: pointer;
    transition: background 0.15s, transform 0.1s;
  }
  .sg-btn-primary:hover { background: #2a2a2a; }
  .sg-btn-primary:active { transform: scale(0.99); }

  /* ── Secondary button ── */
  .sg-btn-secondary {
    padding: 15px 20px;
    border-radius: 12px;
    background: transparent;
    color: #1a1a1a;
    font-size: 12px; font-weight: 700;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.08em;
    border: 1.5px solid #c0bdb5;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    flex: 0 0 auto;
  }
  .sg-btn-secondary:hover { background: #e6e3da; }
  .sg-btn-secondary:active { transform: scale(0.99); }

  /* ── Review card ── */
  .sg-review-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px 24px;
    border: 1.5px solid #e0ddd6;
    margin-bottom: 20px;
  }
  .sg-review-section-title {
    font-size: 12px; font-weight: 800;
    color: #1a1a1a; letter-spacing: 0.04em;
    margin-bottom: 12px;
  }
  .sg-review-row {
    display: flex; justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    font-size: 13px;
  }
  .sg-review-row:last-child { border-bottom: none; }
  .sg-review-label { color: #888; font-weight: 500; }
  .sg-review-value { color: #1a1a1a; font-weight: 700; text-align: right; }

  /* ── Checkbox row ── */
  .sg-checkbox-row {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 16px;
    background: rgba(42,125,79,0.04);
    border: 1px solid rgba(42,125,79,0.12);
    border-radius: 12px;
    margin-bottom: 20px;
  }
  .sg-checkbox-row label {
    font-size: 12.5px; color: #555;
    cursor: pointer; user-select: none;
  }

  /* ── Log in link row ── */
  .sg-login-row {
    text-align: center;
    margin-top: 20px;
    font-size: 12px; color: #888;
  }
  .sg-login-link {
    background: none; border: none;
    font-family: 'Poppins', sans-serif;
    font-size: 12px; font-weight: 700;
    color: #1a1a1a; cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .sg-login-link:hover { color: #1a1a1a; }

  /* ── Right panel ── */
  .sg-right {
    width: 50%;
    background: #e8e4d8;
    overflow: hidden;
    display: flex; flex-direction: column;
  }
  .sg-right-inner { flex: 1; min-height: 0; overflow: hidden; }

  /* ════════════════════════════════════════
     MOBILE RESPONSIVE — ≤ 768px
  ════════════════════════════════════════ */
  @media (max-width: 768px) {
    .sg-page {
      flex-direction: column;
      height: auto;
      min-height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* Illustration strip at top */
    .sg-right {
      width: 100%;
      height: 180px;
      flex-shrink: 0;
      order: -1;
    }
    .sg-right-inner {
      flex: 1;
      height: 100%;
    }

    /* Full-width form panel */
    .sg-left {
      width: 100%;
      padding: 24px 20px 36px;
      overflow-y: visible;
      min-height: 0;
    }

    /* Shrink headline */
    .sg-headline {
      font-size: 24px;
      margin-bottom: 20px;
      letter-spacing: -0.03em;
    }

    /* Step bars thinner but visible */
    .sg-steps {
      margin-bottom: 20px;
      gap: 5px;
    }
    .sg-step-bar {
      height: 5px;
      border-radius: 3px;
    }

    /* Date input fix — native date picker overflows without this */
    input[type="date"].sg-input {
      width: 100%;
      min-width: 0;
      appearance: none;
      -webkit-appearance: none;
    }

    /* Two-col rows → single column on mobile */
    .sg-row {
      flex-direction: column;
      gap: 12px;
      margin-bottom: 12px;
    }

    /* Inputs: font-size 16px prevents iOS zoom on focus */
    .sg-input {
      padding: 14px 16px;
      font-size: 16px;
      border-radius: 10px;
    }

    /* Buttons */
    .sg-btn-primary {
      padding: 15px 16px;
      font-size: 12px;
    }
    .sg-btn-secondary {
      padding: 15px 14px;
      font-size: 12px;
    }

    /* Review card */
    .sg-review-card {
      padding: 16px 16px;
      border-radius: 12px;
    }
    .sg-review-row {
      font-size: 12px;
      padding: 8px 0;
    }

    /* Checkbox label text smaller */
    .sg-checkbox-row label {
      font-size: 12px;
    }

    /* Login link */
    .sg-login-row {
      margin-top: 16px;
      font-size: 13px;
    }

    /* Action buttons row */
    .sg-btn-row {
      padding-top: 12px !important;
    }
  }

  /* ── Very small phones (≤ 360px) ── */
  @media (max-width: 360px) {
    .sg-left {
      padding: 18px 14px 28px;
    }
    .sg-headline {
      font-size: 20px;
    }
    .sg-right {
      height: 150px;
    }
    .sg-input {
      padding: 13px 14px;
    }
  }
`;

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function JoinUs() {
  const navigate = useNavigate();
  const { joinus } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", dob: "", phone: "", aadhaar: "",
    address: "", state: "", city: "", pincode: "",
    email: "", password: "", confirmPassword: "", agree: false,
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const nextStep = (e) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.dob || !form.phone || !form.aadhaar)
        return setError("Please fill in all personal info fields.");
      if (form.phone.length < 10) return setError("Please enter a valid 10-digit mobile number.");
      if (form.aadhaar.length < 14) return setError("Please enter a valid 12-digit Aadhaar number.");
    } else if (step === 2) {
      if (!form.address || !form.state || !form.city || !form.pincode)
        return setError("Please fill in all address fields.");
    } else if (step === 3) {
      if (!form.email || !form.password || !form.confirmPassword)
        return setError("Please fill in all account fields.");
      if (form.password !== form.confirmPassword)
        return setError("Passwords do not match.");
      if (!form.agree)
        return setError("You must agree to the terms to continue.");
    }
    setStep(step + 1);
  };

  const prevStep = () => { setError(""); setStep(step - 1); };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const result = await signup({ ...form, address1: form.address });
    if (result.success) navigate("/user/dashboard");
    else setError(result.error || "Signup failed. Email may already be in use.");
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="sg-page">

        {/* ── LEFT ── */}
        <div className="sg-left">

          {/* Headline */}
          <h1 className="sg-headline">
            Create your account.<br />
            Join <span>BhoomiSetu</span> today.
          </h1>

          {/* Step progress bars */}
          <div className="sg-steps">
            {[1, 2, 3, 4].map(s => (
              <div key={s}
                className={`sg-step-bar ${s <= step ? "active" : "inactive"}`} />
            ))}
          </div>

          {/* Error */}
          {error && <div className="sg-error">{error}</div>}

          {/* Form */}
          <form onSubmit={step === 4 ? handleSignup : nextStep}
            style={{ display: "flex", flexDirection: "column", flex: 1 }}>

            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">First Name</label>
                    <input className="sg-input" value={form.firstName}
                      onChange={e => set("firstName", e.target.value)} placeholder="Haneesh" />
                  </div>
                  <div>
                    <label className="sg-label">Last Name</label>
                    <input className="sg-input" value={form.lastName}
                      onChange={e => set("lastName", e.target.value)} placeholder="Yadav" />
                  </div>
                </div>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">Date of Birth</label>
                    <input className="sg-input" type="date" value={form.dob}
                      onChange={e => set("dob", e.target.value)}
                      style={{ color: form.dob ? "#1a1a1a" : "#aaa" }} />
                  </div>
                  <div>
                    <label className="sg-label">Mobile Number</label>
                    <input className="sg-input" value={form.phone}
                      onChange={e => set("phone", maskPhone(e.target.value))}
                      placeholder="9XXXX XXXXX" />
                  </div>
                </div>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">Aadhaar Number</label>
                    <input className="sg-input" value={form.aadhaar}
                      onChange={e => set("aadhaar", maskAadhaar(e.target.value))}
                      placeholder="XXXX XXXX XXXX" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">Street Address</label>
                    <input className="sg-input" value={form.address}
                      onChange={e => set("address", e.target.value)}
                      placeholder="Door No, Street Name, Area" />
                  </div>
                </div>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">State</label>
                    <select 
                      className="sg-input" 
                      value={form.state}
                      onChange={e => set("state", e.target.value)}
                    >
                      <option value="" disabled>Choose State</option>
                      {INDIAN_STATES.map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="sg-label">City</label>
                    <input className="sg-input" value={form.city}
                      onChange={e => set("city", e.target.value)} placeholder="E.g. Delhi" />
                  </div>
                </div>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">Pincode</label>
                    <input className="sg-input" value={form.pincode}
                      onChange={e => set("pincode", maskPincode(e.target.value))}
                      placeholder="XXXXXX" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Account Setup */}
            {step === 3 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="sg-row">
                  <div>
                    <label className="sg-label">Email Address</label>
                    <input className="sg-input" type="email" value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="name@example.com" />
                  </div>
                </div>
                <div className="sg-row">
                  <div style={{ position: "relative" }}>
                    <label className="sg-label">Password</label>
                    <input className="sg-input"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                      placeholder="Minimum 8 characters"
                      style={{ paddingRight: "44px" }} />
                    <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                  </div>
                </div>
                <div className="sg-row">
                  <div style={{ position: "relative" }}>
                    <label className="sg-label">Confirm Password</label>
                    <input className="sg-input"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={e => set("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      style={{ paddingRight: "44px" }} />
                    <EyeIcon visible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                  </div>
                </div>
                <div className="sg-checkbox-row">
                  <input type="checkbox" id="agree" checked={form.agree}
                    onChange={e => set("agree", e.target.checked)}
                    style={{ width: "17px", height: "17px", accentColor: "#2A7D4F", cursor: "pointer", flexShrink: 0 }} />
                  <label htmlFor="agree">
                    I agree to the BhoomiSetu Terms of Service and Privacy Policy.
                  </label>
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
            {step === 4 && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                <div className="sg-review-card">
                  <div className="sg-review-section-title">Personal Info</div>
                  <div className="sg-review-row"><span className="sg-review-label">Name</span><span className="sg-review-value">{form.firstName} {form.lastName}</span></div>
                  <div className="sg-review-row"><span className="sg-review-label">DOB</span><span className="sg-review-value">{form.dob}</span></div>
                  <div className="sg-review-row"><span className="sg-review-label">Mobile</span><span className="sg-review-value">+91 {form.phone}</span></div>
                  <div className="sg-review-row"><span className="sg-review-label">Aadhaar</span><span className="sg-review-value">{form.aadhaar}</span></div>

                  <div style={{ marginTop: "18px" }} />
                  <div className="sg-review-section-title">Address</div>
                  <div className="sg-review-row"><span className="sg-review-label">Street</span><span className="sg-review-value">{form.address}</span></div>
                  <div className="sg-review-row"><span className="sg-review-label">Location</span><span className="sg-review-value">{form.city}, {form.state} {form.pincode}</span></div>

                  <div style={{ marginTop: "18px" }} />
                  <div className="sg-review-section-title">Account</div>
                  <div className="sg-review-row" style={{ borderBottom: "none" }}><span className="sg-review-label">Email</span><span className="sg-review-value">{form.email}</span></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="sg-btn-row" style={{ display: "flex", gap: "12px", marginTop: "auto", paddingTop: "8px" }}>
              {step > 1 && (
                <button type="button" onClick={prevStep} className="sg-btn-secondary">
                  ← Back
                </button>
              )}
              <button type="submit" className="sg-btn-primary">
                {step < 4 ? "Next Step →" : "Finalize & Sign up"}
              </button>
            </div>
          </form>

          {/* Log in link */}
          <div className="sg-login-row">
            Already have an account?{" "}
            <Link to="/login" className="sg-login-link">Log in</Link>
          </div>

        </div>

        {/* ── RIGHT — Illustration ── */}
        <div className="sg-right">
          <div className="sg-right-inner">
            <IllustrationBlocks />
          </div>
        </div>

      </div>
    </>
  );
}