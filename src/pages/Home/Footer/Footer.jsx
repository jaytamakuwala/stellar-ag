import "./Footer.css";
import {
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

import logoImg from "@/assets/Images/logo-dark.png";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <hr className="footer-line" />

      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logoImg} alt="Stellar Trade Logo" />
          </div>
          <p className="footer-disclaimer">
            All the analysis information is for reference only and doesn’t
            constitute an investment recommendation.
          </p>
          <p className="footer-copy">
            © 2025 Stellar Trade. All Rights Reserved.
          </p>
        </div>

        {/* Navigation Section */}
        <div className="footer-nav">
          {/* Product */}
          <div className="footer-column">
            <h4 className="footer-title">Product</h4>
            <div className="footer-subcolumns">
              <ul>
                <NavLink to="/feature">
                  <li>Features</li>
                </NavLink>

                <NavLink to="/pricing">
                  <li>Pricing</li>
                </NavLink>

                <li>Blog</li>
              </ul>
              <ul>
                <li>Affiliates</li>
                <li>Help Desk</li>
              </ul>
            </div>
          </div>

          {/* Legal */}
          <div className="footer-column">
            <h4 className="footer-title">Legal</h4>
            <ul>
              <NavLink to="/refund-policy">
                <li>Refund Policy</li>
              </NavLink>
              <NavLink to="/term-service">
                <li>Terms of Services</li>
              </NavLink>
              <NavLink to="/privacy-policy">
                <li>Privacy Policy</li>
              </NavLink>
            </ul>
          </div>

          {/* Follow */}
          <div className="footer-column">
            <h4 className="footer-title">Follow</h4>
            <div className="footer-socials">
              <a href="#">
                <FaFacebook />
              </a>
              <a href="#">
                <FaTwitter />
              </a>
              <a href="#">
                <FaYoutube />
              </a>
              <a href="#">
                <FaInstagram />
              </a>
              <a href="#">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
