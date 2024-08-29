import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import axios from "axios";
import "./Overview.css";

const PartnerOverview = () => {
  const [partnerData, setPartnerData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPartnerOrganization(user);
      } else {
        setLoading(false);
        setError("User not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPartnerOrganization = async (user) => {
    try {
      const db = getFirestore();
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const partnerOrg = userSnap.data().partner_organization;
        await Promise.all([
          fetchPartnerData(user, partnerOrg),
          fetchArticles(user, partnerOrg),
          fetchUsers(user, partnerOrg),
        ]);
      } else {
        setError("User data not found in Firestore");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching partner organization:", error);
      setError("Failed to fetch partner organization");
      setLoading(false);
    }
  };

  const fetchPartnerData = async (user, partnerOrg) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/partners/${partnerOrg}`);
      setPartnerData(response.data);
    } catch (error) {
      console.error("Error fetching partner data:", error);
      setError("Failed to fetch partner data");
    }
  };

  const fetchArticles = async (user, partnerOrg) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/articles/${partnerOrg}`);
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles");
    }
  };

  const fetchUsers = async (user, partnerOrg) => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`/api/users/${partnerOrg}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="partner-overview">
      <header className="partner-header">
        <h1>Overview</h1>
        {partnerData && (
          <img
            src={partnerData.logo}
            alt={`${partnerData.name} logo`}
            className="partner-logo"
          />
        )}
      </header>

      <div className="overview-content">
        <section className="overview-section">
          <h2>Partner Information</h2>
          {partnerData && (
            <>
              <p>
                <strong>Name:</strong> {partnerData.name}
              </p>
              <p>
                <strong>Email:</strong> {partnerData.email}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {new Date(partnerData.joinDate).toLocaleDateString()}
              </p>
            </>
          )}
        </section>

        <section className="overview-section">
          <h2>Content Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>Total Articles</h3>
              <p>{articles.length}</p>
            </div>
            <div className="stat-item">
              <h3>Published Articles</h3>
              <p>
                {
                  articles.filter((article) => article.status === "published")
                    .length
                }
              </p>
            </div>
            <div className="stat-item">
              <h3>Pending Articles</h3>
              <p>
                {
                  articles.filter((article) => article.status === "pending")
                    .length
                }
              </p>
            </div>
          </div>
        </section>

        <section className="overview-section">
          <h2>Recent Articles</h2>
          <ul className="article-list">
            {articles.slice(0, 5).map((article) => (
              <li key={article.id} className="article-item">
                <span className="article-title">{article.title}</span>
                <span className={`article-status status-${article.status}`}>
                  {article.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="overview-section">
          <h2>Team Members</h2>
          <div className="user-grid">
            {users.map((user) => (
              <div key={user.id} className="user-item">
                <img
                  src={
                    user.profile_image_url || "https://via.placeholder.com/40"
                  }
                  alt={user.name}
                  className="user-avatar"
                />
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PartnerOverview;
