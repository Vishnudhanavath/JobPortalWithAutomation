import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'
import { useState } from 'react'
const Navbar = () => {
    const[isShow] = useState(false);

  return (
    <div>
       <nav className='navbg-container'>
          <div>
            <Link to={"/"}><img src = "./assets/logo.png"  className = "logo" alt = "logo"/></Link>
          </div>
          <div>
          <ul className="header-list">
          <Link to = "/" className='linked-text'><li>HOME</li></Link>
          <Link to ="/jobs" className='linked-text'><li>JOBS</li></Link>
          {
            isShow ?
            (<Link to = "/deskboard" className='linked-text'> <li>DESKBOARD</li></Link>)
            :
            (<Link to = "/login" className='linked-text'><li>LOGIN</li></Link>)
          }
          <li><img src = "./assets/profileIcon.png" alt = "profileIcon" className="profileIcon"/></li>
          </ul>
        </div>
       </nav>
    </div>
  )
}

export default Navbar
