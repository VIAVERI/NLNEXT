import React, { useState, useEffect } from "react";
import { X, Upload, User } from "lucide-react";
import { Store } from "react-notifications-component";
import "./partnerAcc.css";
import axios from "axios";

const CreateAccount = ({ onClose, onCreateAccount }) => {
  const [isPartner, setIsPartner] = useState(true);
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    external_system_id: "",
    login_credentials: "",
    password: "",
    notes: "",
    partner_organization: "",
    status: "Pending",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!isPartner) {
      fetchPartners();
    }
  }, [isPartner]);

  const fetchPartners = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/partners");
      setPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      showNotification(
        "Error",
        "Failed to fetch partners. Please try again.",
        "danger"
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.substr(0, 5) === "image") {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setProfileImage(null);
      setPreviewUrl("");
      showNotification(
        "Invalid File",
        "Please select an image file.",
        "warning"
      );
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showNotification("Error", "Name is required.", "warning");
      return false;
    }
    if (!isValidEmail(formData.email)) {
      showNotification(
        "Error",
        "Please enter a valid email address.",
        "warning"
      );
      return false;
    }
    if (isPartner && !formData.login_credentials) {
      showNotification("Error", "Password is required.", "warning");
      return false;
    }
    if (!isPartner && !formData.password) {
      showNotification("Error", "Password is required.", "warning");
      return false;
    }
    if (!isPartner && !formData.partner_organization) {
      showNotification(
        "Error",
        "Please select a partner organization.",
        "warning"
      );
      return false;
    }
    return true;
  };

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const showNotification = (title, message, type) => {
    Store.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: { duration: 5000, onScreen: true },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    const fieldsToInclude = isPartner
      ? ["name", "email", "external_system_id", "login_credentials", "notes"]
      : [
          "name",
          "email",
          "partner_organization",
          "password",
          "notes",
          "status",
        ];

    fieldsToInclude.forEach((key) => {
      data.append(key, formData[key] || "");
    });

    if (profileImage) {
      data.append("profile_image", profileImage);
    }

    try {
      const endpoint = isPartner
        ? "http://localhost:5000/api/partners_acc/create_partner"
        : "http://localhost:5000/api/users/create_user";
      const response = await axios.post(endpoint, data);

      console.log("Response received:", response.data);

      if (typeof onCreateAccount === "function") {
        onCreateAccount(response.data);
      }

      onClose();
      showNotification(
        "Success",
        `${isPartner ? "Partner" : "User"} account created successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error creating account:", error);
      let errorMessage = "An unknown error occurred.";
      if (error.response) {
        console.error("Response data:", error.response.data);
        errorMessage =
          error.response.data.error || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = "No response received from server.";
      } else {
        errorMessage = error.message;
      }
      showNotification(
        "Error",
        `Failed to create account. ${errorMessage}`,
        "danger"
      );
    }
  };

  return (
    <div className="partner-modal-overlay">
      <div className="partner-modal-content">
        <div className="partner-modal-header">
          <h2>Create {isPartner ? "Partner" : "User"} Account</h2>
          <button onClick={onClose} className="partner-close-button">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="partner-form">
          <div className="partner-toggle">
            <button
              type="button"
              className={`toggle-button ${isPartner ? "active" : ""}`}
              onClick={() => setIsPartner(true)}
            >
              Partner
            </button>
            <button
              type="button"
              className={`toggle-button ${!isPartner ? "active" : ""}`}
              onClick={() => setIsPartner(false)}
            >
              User
            </button>
          </div>
          <div className="partner-image-upload">
            <input
              type="file"
              id="profile_image"
              name="profile_image"
              accept="image/*"
              onChange={handleImageChange}
              className="partner-hidden"
            />
            <label
              htmlFor="profile_image"
              className="partner-image-upload-label"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="partner-profile-preview"
                />
              ) : (
                <div className="partner-profile-placeholder">
                  <User size={48} />
                </div>
              )}
              <div className="partner-upload-icon">
                <Upload size={16} />
              </div>
            </label>
          </div>
          <div className="partner-form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={`Enter ${isPartner ? "partner's" : "user's"} name`}
            />
          </div>
          <div className="partner-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={`Enter ${isPartner ? "partner's" : "user's"} email`}
            />
          </div>
          {isPartner && (
            <div className="partner-form-group">
              <label htmlFor="external_system_id">External System ID</label>
              <input
                type="text"
                id="external_system_id"
                name="external_system_id"
                value={formData.external_system_id}
                onChange={handleChange}
                placeholder="Enter external system ID (optional)"
              />
            </div>
          )}
          {!isPartner && (
            <div className="partner-form-group">
              <label htmlFor="partner_organization">Partner/Organization</label>
              <select
                id="partner_organization"
                name="partner_organization"
                value={formData.partner_organization}
                onChange={handleChange}
                required
              >
                <option value="">Select a partner</option>
                {partners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="partner-form-group">
            <label htmlFor={isPartner ? "login_credentials" : "password"}>
              Password
            </label>
            <input
              type="password"
              id={isPartner ? "login_credentials" : "password"}
              name={isPartner ? "login_credentials" : "password"}
              value={isPartner ? formData.login_credentials : formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>
          <div className="partner-form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Enter any additional notes (optional)"
            ></textarea>
          </div>
          <button type="submit" className="partner-submit-button">
            Create {isPartner ? "Partner" : "User"} Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
