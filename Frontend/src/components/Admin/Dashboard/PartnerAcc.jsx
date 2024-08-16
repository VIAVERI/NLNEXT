import React, { useState } from "react";
import { X, Upload, User } from "lucide-react";
import "./partnerAcc.css";

const CreatePartnerAccount = ({ onClose, onCreatePartner }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    external_system_id: "",
    login_credentials: "",
    notes: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (profileImage) {
      data.append("profile_image", profileImage);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/partners_acc/create_partner",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create partner account");
      }

      const result = await response.json();
      onCreatePartner(result);
      onClose();
    } catch (error) {
      console.error("Error creating partner account:", error);
      // TODO: Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="partner-modal-overlay">
      <div className="partner-modal-content">
        <div className="partner-modal-header">
          <h2>Create Partner Account</h2>
          <button onClick={onClose} className="partner-close-button">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="partner-form">
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
              placeholder="Enter partner's name"
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
              placeholder="Enter partner's email"
            />
          </div>
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
          <div className="partner-form-group">
            <label htmlFor="login_credentials">Password</label>
            <input
              type="text"
              id="login_credentials"
              name="login_credentials"
              value={formData.login_credentials}
              onChange={handleChange}
              placeholder="Enter login credentials (optional)"
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
            Create Partner Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePartnerAccount;
