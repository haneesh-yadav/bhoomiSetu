import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Sharp');

  :root {
    --color-primary: #c96444;
    --color-danger: #FF0060;
    --color-success: #1B9C85;
    --color-warning: #F7D060;
    --color-white: #fff;
    --color-info-dark: #7d8da1;
    --color-dark: #363949;
    --color-light: rgba(132, 139, 200, 0.18);
    --color-dark-variant: #677483;
    --color-background: #f6f6f9;
    --card-border-radius: 2rem;
    --border-radius-1: 0.4rem;
    --border-radius-2: 1.2rem;
    --card-padding: 1.8rem;
    --padding-1: 1.2rem;
    --box-shadow: 0 2rem 3rem var(--color-light);
  }

  .cp-body {
    width: 100%;
    min-height: 100vh;
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
    user-select: none;
    overflow-x: hidden;
    color: var(--color-dark);
    background-color: var(--color-background);
  }

  .cp-body a { color: var(--color-dark); }
  .cp-body img { display: block; width: 100%; object-fit: cover; }
  .cp-body h1 { font-weight: 800; font-size: 1.8rem; }
  .cp-body h2 { font-weight: 600; font-size: 1.4rem; }
  .cp-body h3 { font-weight: 500; font-size: 0.87rem; }
  .cp-body small { font-size: 0.76rem; }
  .cp-body p { color: var(--color-dark-variant); }
  .cp-body b { color: var(--color-dark); }

  .cp-body .text-muted { color: var(--color-info-dark); }
  .cp-body .primary  { color: var(--color-primary); }
  .cp-body .danger   { color: var(--color-danger); }
  .cp-body .success  { color: var(--color-success); }
  .cp-body .warning  { color: var(--color-warning); }

  .cp-container {
    display: grid;
    width: 77%;
    margin: 0 auto;
    gap: 1.8rem;
    grid-template-columns: 1fr;
    margin-top: 2rem;
  }

  .cp-container main { margin-top: 0.2rem; }

  /* Input rows — warm orange tint instead of yellow */
  .profile-form-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fdf0ea;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    border: 1px solid #f5cdb8;
  }

  .profile-form-box label {
    font-weight: 700;
    color: #333;
    font-size: 0.9rem;
    text-transform: uppercase;
    white-space: nowrap;
    margin-right: 1rem;
  }

  .profile-form-box input {
    background: transparent;
    border: none;
    text-align: right;
    font-size: 1rem;
    color: #333;
    outline: none;
    flex-grow: 1;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }

  .profile-form-box input::placeholder {
    color: #aaa;
    font-weight: 400;
    font-size: 0.9rem;
  }

  .password-update-container {
    padding: var(--card-padding);
    width: 55%;
    background: var(--color-white);
    box-shadow: var(--box-shadow);
    margin-top: 1rem;
    margin-bottom: 2rem;
    margin-left: auto;
    margin-right: auto;
    transition: all 0.3s ease;
    border-top: 5px solid #c96444;
  }

  .password-header {
    color: #c96444;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    font-weight: 600;
  }

  .password-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
  }

  .show-password-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: -0.5rem;
    color: var(--color-dark);
  }

  .show-password-container input[type="checkbox"] {
    width: auto;
    cursor: pointer;
    accent-color: #c96444;
  }

  .submit-btn {
    background: linear-gradient(90deg, #a84e35 0%, #c96444 100%);
    color: white;
    padding: 0.6rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-end;
    transition: filter 0.2s, transform 0.15s;
    font-weight: 600;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 4px 10px rgba(201,100,68,0.3);
  }

  .submit-btn:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  .password-note { margin-top: 1rem; }

  .note-label {
    color: #dc3545;
    font-weight: bold;
    display: block;
    margin-bottom: 0.8rem;
    font-size: 0.95rem;
  }

  .password-note ul {
    list-style-position: inside;
    padding-left: 1rem;
  }

  .password-note li {
    color: #c96444;
    font-style: italic;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    list-style-type: disc;
  }
`;

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password change request submitted! (Simulation)");
  }

  const inputType = showPassword ? "text" : "password";

  return (
    <>
      <style>{styles}</style>
      <div className="cp-body">
        <div id="navbar-placeholder"></div>
        <div className="cp-container">
          <main>
            <div className="password-update-container">
              <h2 className="password-header">CHANGE PASSWORD SCREEN</h2>
              <div className="password-form">

                <div className="profile-form-box">
                  <label>CURRENT PASSWORD</label>
                  <input
                    type={inputType}
                    placeholder="ENTER CURRENT PASSWORD"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="profile-form-box">
                  <label>NEW PASSWORD</label>
                  <input
                    type={inputType}
                    placeholder="ENTER NEW PASSWORD"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="profile-form-box">
                  <label>CONFIRM PASSWORD</label>
                  <input
                    type={inputType}
                    placeholder="RE-ENTER PASSWORD"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="show-password-container">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label htmlFor="showPassword">SHOW PASSWORD</label>
                </div>

                <button type="button" className="submit-btn" onClick={handleSubmit}>
                  SUBMIT
                </button>

                <div className="password-note">
                  <span className="note-label">NOTE :</span>
                  <ul>
                    <li>PASSWORD SHOULD BE MORE THAN 10 AND LESS THAN 30 CHARACTERS IN LENGTH.</li>
                    <li>PASSWORD SHOULD HAVE AT LEAST 1 UPPERCASE, 1 LOWERCASE, 1 NUMBER AND 1 SPECIAL CHARACTER.</li>
                    <li>PASSWORD SHOULD NOT CONTAIN YOUR NAME OR EMAIL ID EITHER PARTIALLY OR FULLY.</li>
                    <li>PASSWORD SHOULD NOT BE SAME AS YOUR PREVIOUS 3 PASSWORDS.</li>
                  </ul>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
