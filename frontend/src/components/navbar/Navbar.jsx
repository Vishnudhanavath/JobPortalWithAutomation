import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GiHamburgerMenu } from 'react-icons/gi';
import './Navbar.css';

const Navbar = () => {
  const [show, setShow] = useState(false); 
  const { isAuthenticated } = useSelector((state) => state.user); 

  return (
    <div>
      <nav className="navbg-container">
        <div>
          <Link to={'/'}>
            <img src="./assets/logo.png" className="logo" alt="logo" />
          </Link>
        </div>
        <div>
          <ul className={`header-list ${show ? 'show' : ''}`}>
            <Link to="/" className="linked-text" onClick={() => setShow(false)}>
              <li>HOME</li>
            </Link>
            <Link to="/jobs" className="linked-text" onClick={() => setShow(false)}>
              <li>JOBS</li>
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="linked-text" onClick={() => setShow(false)}>
                <li>DASHBOARD</li>
              </Link>
            ) : (
              <Link to="/login" className="linked-text" onClick={() => setShow(false)}>
                <li>LOGIN</li>
              </Link>
            )}
            <li onClick={() => setShow(false)}>
              <img src="./assets/profileIcon.png" alt="profileIcon" className="profileIcon" />
            </li>
          </ul>
        </div>
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </nav>
    </div>
  );
};

export default Navbar;
