import React from 'react'
import "./ServiceSection.css";


const ServiceSection = () => {
    const services = [
        {
            id: 1,
            service: "Software Development",
            description:
                "Innovative software development services to build, maintain, and upgrade applications, ensuring they meet the highest quality standards.",
        },
        {
            id: 2,
            service: "Web Development",
            description:
                "Comprehensive web development solutions from front-end design to back-end integration, delivering responsive and user-friendly websites.",
        },
        {
            id: 3,
            service: "Data Science",
            description:
                "Advanced data science services to analyze and interpret complex data, providing actionable insights and data-driven solutions.",
        },
        {
            id: 4,
            service: "Cloud Computing",
            description:
                "Reliable cloud computing services to manage, store, and process data efficiently, offering scalable and flexible cloud solutions.",
        },
        {
            id: 5,
            service: "DevOps",
            description:
                "DevOps services to streamline software development and operations, enhancing deployment efficiency and reducing time to market.",
        },
        {
            id: 6,
            service: "Mobile App Development",
            description:
                "Expert mobile app development for iOS and Android platforms, creating intuitive and engaging mobile experiences for your users.",
        },
        {
            id: 7,
            service: "Cybersecurity",
            description:
                "Comprehensive cybersecurity solutions to protect your systems, networks, and data from digital threats.",
        },
        {
            id: 8,
            service: "UI/UX Design",
            description:
                "Creative and intuitive UI/UX design services to deliver user-friendly and visually appealing applications and websites.",
        },
        {
            id: 9,
            service: "Artificial Intelligence",
            description:
                "Cutting-edge AI services to automate processes, enhance decision-making, and improve operational efficiency.",
        },
        {
            id: 10,
            service: "Blockchain Development",
            description:
                "Specialized blockchain solutions for secure, transparent, and decentralized applications in various industries.",
        },
        {
            id: 11,
            service: "Game Development",
            description:
                "High-quality game development services for mobile, desktop, and console platforms, delivering immersive gaming experiences.",
        },
        {
            id: 12,
            service: "Internet of Things (IoT)",
            description:
                "IoT services to connect and manage smart devices, enabling seamless automation and data collection.",
        }
    ];
    
    
  return (
    <div className="service-container">
    <h1 className="service-title">Browse Job Category</h1>
    <p className="service-description">Explore diverse job opportunities tailored to your skills. Start your career <br className='service-description-spacing'/> journey today!</p>
    <div className="card-container">
      {services.map((element) => (
        <div className="card" key={element.id}>
          <h3 className="card-title">{element.service}</h3>
          <p className="card-description">{element.description}</p>
        </div>
      ))}
    </div>
  </div>
  
  )
}
export default ServiceSection





