import React from 'react'
import "./Footer.css"
import { IoLogoFacebook } from "react-icons/io5";
import { FaInstagramSquare, FaLinkedin} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='Footer-bg'>
      <div>
        <img src = "./assets/logo.png"  className = "footer-logo" alt = "logo"/>
        <h1 className='footer-heading'>Connect with us</h1>
        <div className='followus-container'>
          <IoLogoFacebook className='followus-icons'/>
          <FaInstagramSquare className='followus-icons'/>
          <FaSquareXTwitter className='followus-icons'/>
          <FaLinkedin className='followus-icons'/>
        </div>

      </div>

      <div>
        <h1 className='footer-heading'>Support</h1>
        <ul className='footer-list'>
          <li>Help</li>
          <li>Advisories</li>
          <li>Status</li>
          <li>Contact us</li>
        </ul>
      </div>
      
      <div>
        <h1 className='footer-heading'>Company</h1>
        <ul className='footer-list'>
          <li>About</li>
          <li>Blog</li>
          <li>Press</li>
          <li>Our Services</li>
        </ul>
      </div>

      <div>
        <h1 className='footer-heading'>Terms & Policies</h1>
        <ul className='footer-list'>
          <li>Policies</li>
          <li>Terms of Use</li>
          <li>Code of Contact</li>
          <li>Privacy</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
