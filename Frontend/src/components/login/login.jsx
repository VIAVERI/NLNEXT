import React, { useState } from "react";
import "./login.css";
import { registerUser, signInUser } from "../../firebase";

const SignInSignUp = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleToggle = () => {
    setIsSignUpActive((prev) => !prev);
    // Clear form fields and errors when toggling
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password, name);
      setError("User registered successfully!");
      // Optionally, you can redirect the user or update the UI here
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInUser(email, password);
      setError("Signed in successfully!");
      // Optionally, you can redirect the user or update the UI here
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-body">
      <div
        className={`auth-container ${
          isSignUpActive ? "auth-right-panel-active" : ""
        }`}
        id="auth-container"
      >
        <div className="auth-form-container auth-sign-up-container">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <div className="auth-infield">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Name</label>
            </div>
            <div className="auth-infield">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="auth-infield">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>
        </div>

        <div className="auth-form-container auth-sign-in-container">
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            <div className="auth-infield">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="auth-infield">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>
        </div>

        {/* Overlay container remains the same */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button onClick={handleToggle} className="auth-button ghost">
                Sign In
              </button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start the journey with us</p>
              <button onClick={handleToggle} className="auth-button ghost">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default SignInSignUp;
