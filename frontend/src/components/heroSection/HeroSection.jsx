import React from 'react';
import "./HeroSection.css";
const HeroSection = () => {
  return (
    <section className = "heroBgContainer">
      <div>
          <h1 className='heroHeading'>Kickstart Your Career with the Perfect Job</h1>
          <div className='HeroDescription'>
            Discover countless job opportunities across various industries. Whether you're an experienced expert or taking the first steps in your career journey, uncover the ideal role that matches your ambitions. Our platform simplifies your job search, connecting you with opportunities that bring you closer to achieving your professional goals.
          </div>
      </div>
      <img src = "/assets/website-development.png"  className='heroImage'/>
    </section>
  );
};

export default HeroSection;
