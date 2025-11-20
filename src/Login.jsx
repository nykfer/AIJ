import React from 'react';
import { Link } from 'react-router-dom';
import './styles/auth.css';

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-form">
          <p className="auth-eyebrow">Secure Portal</p>
          <h3>Login</h3>
          <p className="auth-subtitle">
            Welcome back. Enter your credentials to continue exploring AIJ.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field" htmlFor="loginEmail">
              Email address
              <input type="email" id="loginEmail" name="email" required />
            </label>
            <label className="auth-field" htmlFor="loginPassword">
              Password
              <input type="password" id="loginPassword" name="password" required />
            </label>

          <div className="auth-form-footer">
            <button type="submit" className="auth-submit">
              Log in
            </button>
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>
          </form>
        </div>

        <div className="auth-card-aside">
          <div className="auth-quote">
            <p className="auth-quote-text">
              “Best investment I made in a long time. The insights are priceless.”
            </p>
            <p className="auth-quote-author">— Admin User</p>
          </div>
        </div>
      </div>

      <p className="auth-switch">
        Don&apos;t have an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}


