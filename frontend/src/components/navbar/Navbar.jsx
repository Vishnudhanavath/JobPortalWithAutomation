import React from 'react'
import "./Navbar.css"
const Navbar = () => {
  return (
    <div className='navbg-container'>
       <nav>
          <div>
              <img src = "./assets/logo.png"  className = "logo" alt = "logo"/>
          </div>
             <ul>
                <li>Home</li>
                <li>Jobs</li>
                <li>Deskboard</li>
             </ul>
       </nav>
    </div>
  )
}

export default Navbar
