import React, { useState, useEffect } from "react";
import axios from "axios";
import "./services.css"; // You'll need to create this CSS file

const ServiceCard = ({ service }) => (
  <div className="service-card">
    <img src={service.icon} alt={service.name} className="service-icon" />
    <h3 className="service-name">{service.name}</h3>
    <p className="service-description">{service.description}</p>
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to fetch services. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="services-page">
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard key={service.service_id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default Services;
