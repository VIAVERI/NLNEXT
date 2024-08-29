import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import "./dashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardOverview = () => {
  const history = useHistory();
  const [data, setData] = useState({
    partners: [],
    articles: [],
    partnerAccounts: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      const partners = await fetch("/api/partners").then((res) => res.json());
      const articles = await fetch("/api/articles").then((res) => res.json());
      const partnerAccounts = await fetch("/api/partners_acc").then((res) =>
        res.json()
      );

      setData({ partners, articles, partnerAccounts });
    };

    fetchData();
  }, []);

  const totalPartners = data.partners.length;
  const totalArticles = data.articles.length;
  const averageRating =
    data.articles.reduce((sum, article) => sum + article.rating, 0) /
      totalArticles || 0;

  const doughnutData = {
    labels: ["Partners", "Articles", "Ratings"],
    datasets: [
      {
        data: [totalPartners, totalArticles, averageRating.toFixed(1)],
        backgroundColor: ["#FF6384", "#279f8d", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#279f8d", "#FFCE56"],
      },
    ],
  };

  const barData = {
    labels: data.partners.slice(0, 5).map((partner) => partner.name),
    datasets: [
      {
        label: "Articles per Partner",
        data: data.partners
          .slice(0, 5)
          .map(
            (partner) =>
              data.articles.filter((article) => article.author === partner.name)
                .length
          ),
        backgroundColor: "#279f8d",
      },
    ],
  };

  const handlePartnerClick = (partnerId) => {
    history.push(`/partner/${partnerId}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPartners = data.partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="chart-section">
            <div className="card overview-card">
              <h3>Overview</h3>
              <div className="chart-container">
                <Doughnut
                  data={doughnutData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>

            <div className="card bar-card">
              <h3>Top 5 Partners by Articles</h3>
              <div className="chart-container">
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <div className="stats-section">
            <div className="card stat-card">
              <h3>Total Partners</h3>
              <p className="stat-value">{totalPartners}</p>
            </div>

            <div className="card stat-card">
              <h3>Total Articles</h3>
              <p className="stat-value">{totalArticles}</p>
            </div>

            <div className="card stat-card">
              <h3>Average Rating</h3>
              <p className="stat-value">{averageRating.toFixed(2)}</p>
            </div>
          </div>

          <div className="card partner-list">
            <h3>Partner Accounts</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <ul className="partner-grid">
              {filteredPartners.map((partner) => (
                <li
                  key={partner.partner_id}
                  className="partner-item"
                  onClick={() => handlePartnerClick(partner.partner_id)}
                >
                  <div className="partner-avatar">
                    <img
                      src={
                        partner.profile_image_url || "/api/placeholder/48/48"
                      }
                      alt={partner.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/48/48";
                      }}
                    />
                  </div>
                  <span>{partner.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
