import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className='container'>
          <div className='box logo'>
            <img src='../images/logo.png' alt='Logo' />
            <p>Empowering connections and content management for a vibrant marketplace.</p>
            <i className='fa fa-envelope'></i>
            <span> contact@huisrijk.nl </span> <br />
            <i className='fa fa-headphones'></i>
            <span> 013-8228697</span>
          </div>
          <div className='box'>
            <h3>Snel navigeren</h3>
            <ul>
              <li>Startpagina</li>
              <li>Ons verhaal</li>
              <li>Nieuws</li>
              <li>Portfolio</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className='box'>
            <h3>Meer info</h3>
            <ul>
              <li>Veelgestelde vragen</li>
              <li>Privacy policy</li>
            </ul>
          </div>
          <div className='box'>
            <h3>Socials</h3>
            <ul>
              <li>
                <a href="https://www.facebook.com/Huisrijk/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/huisrijk/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://nl.linkedin.com/company/huisrijk" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCd7ABXnNenqdPPHrokrNCmA" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className='legal'>
        <div className='container flexSB'>
          <p>© all rights reserved</p>
          <p>By Bluemill Studio</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
