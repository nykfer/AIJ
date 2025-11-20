import React from 'react';
import { Link } from 'react-router-dom';
import './styles/auth.css';

export default function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-form">
          <p className="auth-eyebrow">Join AIJ</p>
          <h3>Sign up</h3>
          <p className="auth-subtitle">
            Create your account and start receiving curated AI intelligence.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field" htmlFor="signupName">
              Full name
              <input type="text" id="signupName" name="name" required />
            </label>
            <label className="auth-field" htmlFor="signupEmail">
              Email address
              <input type="email" id="signupEmail" name="email" required />
            </label>
            <label className="auth-field" htmlFor="signupPassword">
              Password
              <input type="password" id="signupPassword" name="password" required />
            </label>
            <label className="auth-field" htmlFor="signupConfirm">
              Confirm password
              <input type="password" id="signupConfirm" name="confirmPassword" required />
            </label>
            <div className="auth-form-footer">
              <button type="submit" className="auth-submit">
                Create account
              </button>
              <Link to="/login" className="auth-link">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>

        <div className="auth-card-aside">
          <div className="auth-quote">
            <p className="auth-quote-text">
              “A polished, modern layout to get every AI update on your radar.”
            </p>
            <p className="auth-quote-author">— Admin User</p>
          </div>
        </div>
      </div>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}


