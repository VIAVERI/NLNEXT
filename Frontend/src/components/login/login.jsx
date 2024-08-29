import React, { useState } from "react";
import "./login.css";
import { registerUser, signInUser } from "../../firebase";
import { Store } from "react-notifications-component";
import { useHistory } from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const db = getFirestore();

const SignInSignUp = ({ onSuccessfulLogin }) => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const checkUserRole = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === "admin") {
          history.push("/admin-dashboard");
          onSuccessfulLogin();
        } else if (userData.role === "partner") {
          if (userData.profile_completed) {
            history.push("/");
          } else {
            history.push("/partner-profile-creation");
          }
          onSuccessfulLogin();
        } else {
          onSuccessfulLogin();
        }
      } else {
        console.log("No such user document!");
        onSuccessfulLogin(); // Treat as non-admin if document doesn't exist
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      onSuccessfulLogin(); // Fallback to non-admin in case of error
    }
  };

  const handleToggle = () => {
    setIsSignUpActive((prev) => !prev);
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(email, password, name);
      // Set initial user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "partner", // Assuming all sign-ups are partners
        profile_completed: false
      });
      Store.addNotification({
        title: "Wonderful!",
        message: "User registered successfully!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 4000,
          onScreen: true,
        },
      });
      checkUserRole(user);
    } catch (error) {
      setError(error.message);
      Store.addNotification({
        title: "Error!",
        message: error.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 4000,
          onScreen: true,
        },
      });
      setEmail("");
      setPassword("");
      setName("");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInUser(email, password);
      const user = userCredential.user;

      Store.addNotification({
        title: "Welcome Back!",
        message: "Signed in successfully!",
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 4000,
          onScreen: true,
        },
      });

      setEmail("");
      setPassword("");
      checkUserRole(user);
    } catch (error) {
      Store.addNotification({
        title: "Error!",
        message: "Invalid email or password",
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 4000,
          onScreen: true,
        },
      });
      setEmail("");
      setPassword("");
    }
  };


  return (
    <div className="auth-body">
      <div
        className={`auth-container ${isSignUpActive ? "auth-right-panel-active" : ""
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
    </div>
  );
};

export default SignInSignUp;
