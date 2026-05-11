import { useState } from "react";

function LoginPage({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setCurrentPage("feed");
  };

  return (
    <div className="page-container">
      <div className="card login-card">
        <h1>RideLink</h1>
        <p className="subtitle">
          A campus ride and carpool platform for the Five College community
        </p>

        <form onSubmit={handleLogin} className="form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="yourname@umass.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

          <button type="submit" className="primary-btn">
            Log In
          </button>
        </form>

        <p className="note">
        Demo note: login is simplified for the final prototype.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;