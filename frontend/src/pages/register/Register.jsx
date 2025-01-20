import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, register } from "../../redux/slices/userSlice";
import { toast, ToastContainer } from "react-toastify";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import "./Register.css";

const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [resume, setResume] = useState("");

  const nichesArray = [
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

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegsiter = (e) => {
    e.preventDefault();
  
    if (!role) {
      toast.error("Please select a role.", { position: "bottom-right" });
      return;
    }
    if (!name) {
      toast.error("Please enter your name.", { position: "bottom-right" });
      return;
    }
    if (!email) {
      toast.error("Please enter your email address.", { position: "bottom-right" });
      return;
    }
    if (!password) {
      toast.error("Please enter a password.", { position: "bottom-right" });
      return;
    }
  
    const formData = new FormData();
    formData.append("role", role);
    formData.append("fullName", name);
    formData.append("email", email);
    formData.append("phoneNumber", phone);
    formData.append("address", address);
    formData.append("password", password);
  
    if (role === "Job Seeker") {
      if (!firstNiche || !secondNiche || !thirdNiche || !resume) {
        if (!firstNiche) toast.error("Please select your first niche.", { position: "bottom-right" });
        if (!secondNiche) toast.error("Please select your second niche.", { position: "bottom-right" });
        if (!thirdNiche) toast.error("Please select your third niche.", { position: "bottom-right" });
        if (!resume) toast.error("Please upload your resume.", { position: "bottom-right" });
        return;
      }
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("resume", resume);
    }
    dispatch(register(formData));
  };
  
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/"); 
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <div>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Create a new account</h3>
          </div>
          <form onSubmit={handleRegsiter}>
            <div className="registerCard">
              <div className="inputTag">
              <div className="logIn-style">
                <label className="register-label">Register As</label>
                <FaRegUser />
              </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="recruiter">recruiter</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
              </div>

              <div className="inputTag">
              <div className="logIn-style">
                <label className="register-label">Name</label>
                <FaPencilAlt />
              </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="inputTag">
              <div className="logIn-style">
                <label className="register-label">Email Address</label>
                <MdOutlineMailOutline />
              </div>
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="inputTag">
              <div className="logIn-style">
              <label className="register-label">Phone Number</label>
              <FaPhoneFlip />
              </div>
                <input
                  type="number"
                  placeholder="111-222-333"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="inputTag">
                <div className="logIn-style">
                  <label className="register-label">Address</label>
                  <FaAddressBook />
                </div>
                <input
                  type="text"
                  placeholder="Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                </div>

                <div className="wrapper">
                <div className="inputTag">
                  <label>Resume</label>
                  <div>
                    <input
                      type="file"
                      onChange={resumeHandler}
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              </div>

              {role === "Job Seeker" && (
                <div>
                  <div className="inputTag">
                    <label>Your First Niche</label>
                    <select
                      value={firstNiche}
                      onChange={(e) => setFirstNiche(e.target.value)}
                    >
                      <option value="">Your Niche</option>
                      {nichesArray.map((niche, index) => (
                        <option key={index} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="inputTag">
                    <label>Your Second Niche</label>
                    <select
                      value={secondNiche}
                      onChange={(e) => setSecondNiche(e.target.value)}
                    >
                      <option value="">Your Niche</option>
                      {nichesArray.map((niche, index) => (
                        <option key={index} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="inputTag">
                    <label>Your Third Niche</label>
                    <select
                      value={thirdNiche}
                      onChange={(e) => setThirdNiche(e.target.value)}
                    >
                      <option value="">Your Niche</option>
                      {nichesArray.map((niche, index) => (
                        <option key={index} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="inputTag">
                    <label>Resume</label>
                    <input
                      type="file"
                      onChange={resumeHandler}
                      style={{ border: "none" }}
                    />
                  </div>
                </div>
              )}
              <button type="submit" disabled={loading}>
                Register
              </button>
              <Link to="/login">Login Now</Link>
            </div>
          </form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Register;
