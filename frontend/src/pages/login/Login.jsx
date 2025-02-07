import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../../redux/slices/userSlice";
import { toast, ToastContainer } from "react-toastify";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select your role.", {
        position: "bottom-right",
      });
      return;
    }
    if (!email || !password) {
      toast.error("Please fill in both email and password.", {
        position: "bottom-right",
      });
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-right",
      });
      return;
    }
    dispatch(login({ role, email, password }));
  };

  useEffect(() => {
    if (error) {
      const userFriendlyError =
      error === "Unauthorized"
        ? "Invalid email or password. Please try again."
        : error;
        toast.error(userFriendlyError, {
          position: "bottom-right",
        });
        
      dispatch(clearAllUserErrors()); 
    }

    if (isAuthenticated) {
      navigateTo("/"); 
    }
  }, [dispatch, error, isAuthenticated, navigateTo]);

  return (
    <div className="login__authPage">
      <section className="login__container">
        <div className="login__header">
          <h3>Login to your account</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="login__inputTag">
            <label className="login-label">Login As</label>
            <div className="login__inputWithIcon">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Recruiter">Recruiter</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>
              <FaRegUser />
            </div>
          </div>

          <div className="login__inputTag">
            <label>Email</label>
            <div className="login__inputWithIcon">
              <input
                type="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MdOutlineMailOutline />
            </div>
          </div>

          <div className="login__inputTag">
            <label>Password</label>
            <div className="login__inputWithIcon">
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <RiLock2Fill />
            </div>
          </div>

          <button type="submit" className="login__button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link to={"/register"} className="login__registerLink">
            Register Now
          </Link>
        </form>
      </section>

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
