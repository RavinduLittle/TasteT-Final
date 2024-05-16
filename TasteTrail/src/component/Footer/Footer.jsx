import React from 'react';
import './Footer.css';
import { assets } from '../../../public/assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <h1>TasteTrial</h1>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
          <div className="footer-social-icon">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
          </div>
        </div>    

        <div className="footer-content-center">
          <h2>Link</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Service</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>Contact Us</h2>
          <ul>
            <li>+94 0761902805</li>
            <li>tasteT@gmail.com</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default Footer;
