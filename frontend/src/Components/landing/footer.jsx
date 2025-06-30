import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>EducateSync</h2>
          <p>Empowering students to learn smarter every day.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">🏠 Home</a></li>
            <li><a href="#courses">📚 Courses</a></li>
            <li><a href="#contact">📬 Contact</a></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><span>🌐</span></a>
            <a href="#"><span>📘</span></a>
            <a href="#"><span>🐦</span></a>
            <a href="#"><span>📸</span></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EducateSync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
