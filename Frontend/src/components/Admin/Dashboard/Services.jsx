import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./services.css";

const CategoryTag = ({ category }) => (
  <span className="category-tag">{category}</span>
);

const ServiceCard = ({ service }) => (
  <div className="service-card">
    <img src={service.icon} alt={service.name} className="service-icon" />
    <h3 className="service-name">{service.name}</h3>
    <p className="service-description">{service.description}</p>
    <div className="category-tags">
      {service.categories && typeof service.categories === "string" && (
        <div className="category-tags">
          {service.categories.split(",").map((category, index) => (
            <CategoryTag key={index} category={category.trim()} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const PartnerServices = ({ partnerName, services }) => (
  <div className="partner-services">
    <h2 className="partner-name">{partnerName}</h2>
    <div className="services-grid">
      {services.map((service) => (
        <ServiceCard key={service.service_id} service={service} />
      ))}
    </div>
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);
  const [partnerServices, setPartnerServices] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, partnerServicesRes, partnersRes] =
          await Promise.all([
            axios.get("http://localhost:5000/api/services"),
            axios.get("http://localhost:5000/api/partner-services"),
            axios.get("http://localhost:5000/api/partners"),
          ]);

        setServices(servicesRes.data);
        setPartnerServices(partnerServicesRes.data);
        setPartners(partnersRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedServices = useMemo(() => {
    const serviceMap = new Map(
      services.map((service) => [service.service_id, service])
    );
    const partnerMap = new Map(
      partners.map((partner) => [partner.partner_id, partner])
    );

    const grouped = partnerServices.reduce(
      (acc, { partner_id, service_id }) => {
        const partner = partnerMap.get(partner_id);
        const service = serviceMap.get(service_id);

        if (partner && service) {
          if (!acc[partner.name]) {
            acc[partner.name] = [];
          }
          acc[partner.name].push(service);
        }
        return acc;
      },
      {}
    );

    return grouped;
  }, [services, partnerServices, partners]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services-page">
      {Object.entries(groupedServices).map(([partnerName, partnerServices]) => (
        <PartnerServices
          key={partnerName}
          partnerName={partnerName}
          services={partnerServices}
        />
      ))}
    </div>
  );
};

export default Services;
