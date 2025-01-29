import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { clearAllJobErrors, fetchJobs} from "../../redux/slices/jobSlice";
import Spinner from "../../components/spinner/Spinner";

import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Jobs.css";
import { IoIosSearch } from "react-icons/io";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };
  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
  };

  const dispatch = useDispatch();

  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche]);

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  const cities = [
    "All",
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Mumbai",
    "Multan",
    "Hyderabad",
    "Quetta",
    "Peshawar",
    "Sialkot",
    "Gujranwala",
    "Sargodha",
    "Bahawalpur",
    "Sukkur",
    "Mardan",
    "Mingora",
    "Sheikhupura",
    "Mandi Bahauddin",
    "Larkana",
    "Nawabshah",
  ];

  const nichesArray = [
    "All",
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  return(
    <div className="job-bg-container">
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search for Job"
            />
            <button onClick={handleSearch} className="find-button">Find Job</button>
          </div>
          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City</h2>
                {cities.map((city) => (
                  <div key={city}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => handleCityChange(city)}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              <div className="cities">
                <h2>Filter Job By Niche</h2>
                {nichesArray.map((niche) => (
                  <div key={niche}>
                    <input
                      type="radio"
                      id={niche}
                      name="niche"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => handleNicheChange(niche)}
                    />
                    <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}                
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
              <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Filter By City</option>
              {cities.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>
            
            <select value={niche} onChange={(e) => setNiche(e.target.value)}>
              <option value="">Filter By Niche</option>
              {nichesArray.map((niche) => (
                <option value={niche} key={niche}>
                  {niche}
                </option>
              ))}
            </select>            
              </div>
              <div className="jobs_container">
              {jobs && jobs.length > 0 ? (
                jobs.map((element) => (
                  <div className="card" key={element._id}>
                    {element.hiringMultipleCandidates === "Yes" ? (
                      <p className="hiring-multiple">Hiring Multiple Candidates</p>
                    ) : (
                      <p className="hiring">Hiring</p>
                    )}
                    <p className="title">{element.title}</p>
                    <p className="job-item">
                      <span className="company">CompanyName: </span>
                      {element.companyName}
                    </p>
                    <p className="job-item">
                      <span className="location">Location: </span>
                      {element.location}
                    </p>
                    <p className="job-item">
                      <span className="salary">Salary: </span> Rs. {element.salary}
                    </p>
                    <p className="job-item">
                      <span className="posted">Posted On: </span>
                      {element.jobPostedOn.substring(0, 10)}
                    </p>
                    <div className="btn-wrapper">
                      <Link to={`/post/application/${element._id}`}>
                        <button className="btn">Apply Now</button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h1 className="not-found-heading">Not Found</h1>
                  <img
                    src="./assets/job_not_found.png"
                    alt="job-not-found"
                    style={{ width: "100%" }}
                  />
                </div>
              )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );


}

export default Jobs
