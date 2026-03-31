import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  /* ── Page ── */
  .login-page {
    font-family: 'Bricolage Grotesque', sans-serif;
    min-height: 100vh;
    background: #EFEFEB;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 2rem 3rem;
    position: relative;
    overflow: hidden;
  }

  /* ── Grid background ── */
  .login-grid-bg {
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
  .float-deco {
    position: fixed;
    z-index: 1;
  }

  .float-deco-1 {
    top: 10%;
    left: 6%;
    width: 76px;
    height: 76px;
    background: #fff;
    border: 2.5px solid #0D3D2B;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 3px 3px 0 #0D3D2B;
    animation: float1 4.5s ease-in-out infinite;
  }

  .float-deco-2 {
    top: 15%;
    right: 7%;
    animation: float2 5s ease-in-out infinite;
  }

  .float-deco-3 {
    bottom: 18%;
    left: 5%;
    padding: 7px 13px;
    border: 2.5px solid #0D3D2B;
    border-radius: 8px;
    background: #C8F135;
    font-size: 0.68rem;
    font-weight: 800;
    color: #0D3D2B;
    box-shadow: 3px 3px 0 #0D3D2B;
    animation: float2 6s ease-in-out infinite;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .float-deco-4 {
    bottom: 25%;
    right: 6%;
    animation: float1 5.5s ease-in-out infinite;
  }

  /* ── Star decorations ── */
  .star-deco {
    position: fixed;
    z-index: 1;
  }

  .star-1 {
    top: 45%;
    left: 10%;
    color: #5B4FD4;
    opacity: 0.5;
  }

  .star-2 {
    top: 30%;
    right: 12%;
    color: #F07060;
    opacity: 0.45;
  }

  .star-3 {
    bottom: 12%;
    right: 20%;
    color: #2EC4A0;
    opacity: 0.4;
  }

  /* ── Card wrapper ── */
  .login-card-wrapper {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 520px;
    animation: fadeUp 0.55s ease both;
  }

  /* ── Card ── */
  .login-card {
    border: 2.5px solid #0D3D2B;
    border-radius: 20px;
    overflow: hidden;
    background: #fff;
    box-shadow: 6px 6px 0 #0D3D2B;
  }

  /* ── Role toggle ── */
  .role-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 2.5px solid #0D3D2B;
  }

  .role-btn {
    padding: 1rem;
    background: #F8F8F4;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-weight: 800;
    font-size: 0.875rem;
    color: #0D3D2B;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s, color 0.2s;
  }

  .role-btn:first-child {
    border-right: 2.5px solid #0D3D2B;
  }

  .role-btn:hover {
    opacity: 0.85;
  }

  .role-btn-active-user {
    background: #F07060;
    color: #fff;
  }

  .role-btn-active-registrar {
    background: #5B4FD4;
    color: #fff;
  }

  /* ── Form body ── */
  .form-body {
    padding: 1.5rem 1.75rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── Heading ── */
  .form-heading {
    margin-bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .heading-tag {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #0D3D2B;
  }

  /* ── Selection box ── */
  .selection-box {
    position: relative;
    display: inline-block;
  }

  .selection-box-inner {
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

  /* ── Form fields ── */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .field-label {
    font-size: 0.78rem;
    font-weight: 800;
    color: #0D3D2B;
    letter-spacing: 0.04em;
  }

  .field-input {
    box-sizing: border-box;
    width: 100%;
    padding: 0.7rem 1rem;
    border: 2px solid rgba(13,61,43,0.25);
    border-radius: 10px;
    background: #F8F8F4;
    font-size: 0.9rem;
    font-family: inherit;
    font-weight: 500;
    color: #0D3D2B;
    transition: border-color 0.2s, background 0.2s;
    outline: none;
  }

  .field-input:focus {
    border-color: #0D3D2B;
    background: #fff;
  }

  .field-input::placeholder {
    color: rgba(13,61,43,0.35);
  }

  /* ── Password wrapper ── */
  .password-wrap {
    position: relative;
    width: 100%;
  }

  .password-wrap .field-input {
    padding-right: 3rem;
  }

  .pass-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(13,61,43,0.4);
    transition: color 0.2s;
    padding: 0;
    line-height: 1;
  }

  .pass-toggle:hover {
    color: #0D3D2B;
  }

  /* ── Error & hint ── */
  .error-box {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.65rem 0.9rem;
    background: rgba(240,112,96,0.1);
    border: 2px solid #F07060;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #C0392B;
  }

  .hint-box {
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(13,61,43,0.55);
    font-family: 'DM Mono', monospace;
  }

  .hint-user {
    background: rgba(240,112,96,0.1);
    border: 1.5px dashed #F07060;
  }

  .hint-registrar {
    background: rgba(91,79,212,0.08);
    border: 1.5px dashed #5B4FD4;
  }

  /* ── Submit button ── */
  .submit-btn {
    width: 100%;
    padding: 0.85rem;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 800;
    font-family: inherit;
    box-shadow: 3px 3px 0 #0D3D2B;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.25rem;
    transition: opacity 0.18s, transform 0.1s;
  }

  .submit-btn:hover {
    opacity: 0.88;
  }

  .submit-btn:active {
    transform: translateY(1px);
  }

  .submit-btn-user {
    background: #F07060;
    color: #fff;
  }

  .submit-btn-registrar {
    background: #5B4FD4;
    color: #fff;
  }

  /* ── Divider ── */
  .divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1rem 0 0.75rem;
  }

  .divider-line {
    flex: 1;
    height: 1.5px;
    background: rgba(13,61,43,0.1);
    display: block;
  }

  .divider-text {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(13,61,43,0.35);
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  /* ── Signup button ── */
  .signup-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 2.5px solid #0D3D2B;
    border-radius: 10px;
    color: #0D3D2B;
    font-size: 0.875rem;
    font-weight: 800;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.18s;
  }

  .signup-btn:hover {
    background: #F0F0EC;
  }

  /* ── Registrar admin note ── */
  .reg-note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 0.9rem;
    margin-top: 1rem;
    background: rgba(91,79,212,0.06);
    border: 1.5px solid rgba(91,79,212,0.2);
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(13,61,43,0.6);
    line-height: 1.5;
  }

  /* ── Back to Home ── */
  .back-home-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin-top: 0.85rem;
    padding-top: 0.85rem;
    border-top: 1.5px solid rgba(13,61,43,0.08);
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(13,61,43,0.42);
    cursor: pointer;
    border-radius: 0 0 8px 8px;
    transition: color 0.18s;
  }

  .back-home-inner:hover {
    color: #0D3D2B;
  }

  /* ── Hash text ── */
  .hash-text {
    font-size: 0.68rem;
    font-weight: 800;
    color: #0D3D2B;
    font-family: monospace;
  }

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

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .login-page {
      padding: 1.5rem 1rem 3rem;
    }
    .login-card-wrapper {
      max-width: 100%;
    }
    .float-deco-1,
    .float-deco-2,
    .float-deco-3,
    .float-deco-4 {
      display: none;
    }
    .star-deco {
      display: none;
    }
    .form-body {
      padding: 1.25rem 1.5rem;
    }
  }
  @media (max-width: 480px) {
    .login-page { padding: 1rem 1rem 2rem; }
    .login-card { border-radius: 16px; box-shadow: 4px 4px 0 #0D3D2B; }
    .role-btn   { font-size: 0.78rem; padding: 0.85rem 0.5rem; }
    .form-body  { padding: 1.25rem; }
  }
`;

const SelectionBox = ({ children, color = "#5B4FD4" }) => (
  <div className="selection-box" style={{ "--sel-color": color }}>
    <div className="selection-box-inner">{children}</div>
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

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role,     setRole]     = useState("user");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");

  const isUser = role === "user";

  const switchRole = (newRole) => {
    setRole(newRole);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = login(email, password);

    if (!result.success) {
      setError(
        isUser
          ? "Invalid credentials."
          : "Invalid credentials."
      );
      return;
    }

    if (result.user.role !== role) {
      setError(
        role === "registrar"
          ? "This account is a Citizen account. Please switch to Citizen tab."
          : "This account is a Registrar account. Please switch to Registrar tab."
      );
      return;
    }

    navigate(result.user.role === "registrar" ? "/registrar/dashboard" : "/user/dashboard");
  };

  return (
    <>
      <style>{styles}</style>

      <div className="login-page">
        <div className="login-grid-bg" />

        {/* Floating decorations */}
        <div className="float-deco float-deco-1">
          <span className="material-icons-sharp" style={{fontSize:"2rem",color:"#0D3D2B"}}>account_balance</span>
        </div>
        <div className="float-deco float-deco-2">
          <SelectionBox color="#F07060">
            <span className="hash-text">0xa1b2...ef01</span>
          </SelectionBox>
        </div>
        <div className="float-deco float-deco-3">
          <span className="material-icons-sharp" style={{fontSize:14}}>verified</span>
          Tamper-Proof
        </div>
        <div className="float-deco float-deco-4"><Cursor /></div>
        <span className="star-deco star-1 material-icons-sharp" style={{fontSize:"1.4rem"}}>auto_awesome</span>
        <span className="star-deco star-2 material-icons-sharp" style={{fontSize:"1rem"}}>auto_awesome</span>
        <span className="star-deco star-3 material-icons-sharp" style={{fontSize:"1.2rem"}}>auto_awesome</span>

        <div className="login-card-wrapper">
          <div className="login-card">

            {/* Role toggle */}
            <div className="role-toggle">
              <button
                className={`role-btn ${isUser ? "role-btn-active-user" : ""}`}
                onClick={() => switchRole("user")}
              >
                <span className="material-icons-sharp" style={{fontSize:17}}>person</span>
                User Login
              </button>
              <button
                className={`role-btn ${!isUser ? "role-btn-active-registrar" : ""}`}
                onClick={() => switchRole("registrar")}
              >
                <span className="material-icons-sharp" style={{fontSize:17}}>account_balance</span>
                Registrar Login
              </button>
            </div>

            {/* Form body */}
            <div className="form-body">

              <div className="form-heading">
                <SelectionBox color={isUser ? "#F07060" : "#5B4FD4"}>
                  <span className="heading-tag">
                    {isUser ? "CITIZEN / PROPERTY OWNER" : "GOVERNMENT OFFICIAL"}
                  </span>
                </SelectionBox>
              </div>

              <form onSubmit={handleSubmit} className="login-form">

                <div className="field-group">
                  <label className="field-label">EMAIL ADDRESS</label>
                  <input
                    className="field-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder= "Enter your email id "
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">PASSWORD</label>
                  <div className="password-wrap">
                    <input
                      className="field-input"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(s => !s)}>
                      <span className="material-icons-sharp" style={{fontSize:19}}>
                        {showPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="error-box">
                    <span className="material-icons-sharp" style={{fontSize:15}}>warning</span>
                    {error}
                  </div>
                )}

                <button type="submit" className={`submit-btn ${isUser ? "submit-btn-user" : "submit-btn-registrar"}`}>
                  {isUser ? "Log In as User →" : "Log In as Registrar →"}
                </button>

              </form>

              {/* Signup / Registrar note */}
              {isUser ? (
                <>
                  <div className="divider">
                    <span className="divider-line" />
                    <span className="divider-text">NEW HERE?</span>
                    <span className="divider-line" />
                  </div>
                  <button className="signup-btn" onClick={() => navigate("/signup")}>
                    Create an Account
                  </button>
                </>
              ) : (
                <div className="reg-note">
                  <span className="material-icons-sharp" style={{fontSize:16,flexShrink:0,color:"#5B4FD4",marginTop:"0.05rem"}}>lock</span>
                  <span>Registrar accounts are created by the administration. Contact your district office for access.</span>
                </div>
              )}

              {/* Back to Home — inside card */}
              <div className="back-home-inner" onClick={() => navigate("/")}>
                <span className="material-icons-sharp" style={{fontSize:15}}>arrow_back</span>
                Back to Home
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}
