import React from 'react';
import{Link} from "react-router-dom";
import "./NotFound.css"
const NotFound = () => {
  return (
    <div className='not-found-container'>
      <img src = "./assets/not_found.jpg" className='not-found-img'/>
      <Link to = "/"><button className='btn'>GO BACK TO HOME</button></Link>
    </div>
  )
}

export default NotFound
