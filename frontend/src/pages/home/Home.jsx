import React from 'react'
import "./Home.css";  
import HeroSection from '../../components/heroSection/HeroSection'
import ServiceSection from '../../components/serviceSection/ServiceSection';
// import Footer from '../../components/footer/Footer';
import HowItWorks from '../../components/howItWorks/HowItWorks.jsx';
import FeedbackSection from '../../components/feedbackSection/FeedbackSection.jsx';



const Home = () => {
  return (
    <div>
        <HeroSection />
        <ServiceSection/>
        <HowItWorks/>
    </div>
  )
}

export default Home

