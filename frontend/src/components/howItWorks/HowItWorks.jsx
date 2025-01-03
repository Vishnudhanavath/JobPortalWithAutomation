import React from 'react'
import "./HowItWorks.css"
const HowItWorks = () => {
  return (
    <div className='howitWorks-bgcontainer'>
        <div >
            <h1 className='howitWorksHeading'>How It Works</h1>
            <p className='service-description'>Your career path made easy - find the right job with just a few clicks.</p>
        </div>
        <div className='howitWorks-steps-container'>
            <img src = "/assets/working-boy.png"  alt = "working-boy" className='working-boy-image'/>
            <ul className="steps-container">
                <li><span className='step-roundup'> 1. Register </span>&nbsp; Sign up as a job seeker or employer.</li>
                <li><span className='step-roundup'>2. Create Your Profile</span>&nbsp;Fill in your details, upload your resume, or post job listings.</li>
                <li><span className='step-roundup'>3. Search & Apply</span>&nbsp;Browse jobs or candidates using advanced filters and apply or connect instantly.</li>
                <li><span className='step-roundup'>4. Track Applications </span> &nbsp;Stay updated on the status of your applications in real-time.</li>
                <li><span className='step-roundup'>5. Get Hired </span> Land your dream job or find the perfect candidate.</li>
            </ul>
        </div>
    </div>
  )
}

export default HowItWorks
