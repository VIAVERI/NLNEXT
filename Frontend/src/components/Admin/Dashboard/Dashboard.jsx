import React, { useState, useEffect } from "react";
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
  const [data, setData] = useState({
    partners: [],
    articles: [],
    partnerAccounts: [],
  });

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      // Replace these with actual API calls
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
    labels: data.partnerAccounts
      .slice(0, 5)
      .map((partnerAccount) => partnerAccount.name),
    datasets: [
      {
        label: "Articles per Partner",
        data: data.partnerAccounts
          .slice(0, 5)
          .map(
            (partnerAccount) =>
              data.articles.filter(
                (article) => article.author === partnerAccount.name
              ).length
          ),
        backgroundColor: "#279f8d",
      },
    ],
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="nav-buttons">
          <button className="nav-button active">Dashboard</button>
          <button className="nav-button">Leads</button>
          <button className="nav-button">Trends</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-grid">
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

          <div className="card partner-list">
            <h3>Partner Accounts</h3>
            <ul>
              {data.partnerAccounts.slice(0, 5).map((partnerAccount) => (
                <li key={partnerAccount.id}>{partnerAccount.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
