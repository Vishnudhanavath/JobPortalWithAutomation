import React from 'react'
import "./App.css"; 
import {BrowserRouter as Router , Route, Routes} from "react-router-dom";
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
// import Deskboard from "./pages/deskboard/Deskboard";
// import Login from "./pages/login/Login";
// import Register from "./pages/register/Register";
import Jobs from "./pages/jobs/Jobs";  
// import NotFound from "./pages/notfound/NotFound";
// import Footer from "./components/footer/Footer";

const App = () => {
  return (
    <div>
        <Router>
            <Navbar />
            <Routes>
              <Route  path='/' element = {<Home />}/>
              <Route  path='/jobs' element = {<Jobs/>}/>
            </Routes>
            <Footer/>
        </Router>
    </div>
  )
}

export default App
