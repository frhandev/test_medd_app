import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const [user, setUser] = useState({
    isLoggedIn: false,
    username: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const handleLogout = () => {
    sessionStorage.clear();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("reviewFormData_")) {
        localStorage.removeItem(key);
      }
    });
    setUser({ isLoggedIn: false, username: "", email: "" });
    navigate("/login");
  };

  useEffect(() => {
    const storedemail = sessionStorage.getItem("email");
    if (storedemail) {
      setUser({
        isLoggedIn: true,
        username: storedemail.split("@")[0],
        email: storedemail,
      });
    }
  }, []);

  const authButtons = user.isLoggedIn ? (
    <li className="link">
      <button className="btn2" onClick={handleLogout}>
        Logout
      </button>
    </li>
  ) : (
    <>
      <li className="link">
        <Link to="/Sign_Up">
          <button className="btn1">Sign Up</button>
        </Link>
      </li>
      <li className="link">
        <Link to="/Login">
          <button className="btn1">Login</button>
        </Link>
      </li>
    </>
  );

  return (
    <nav>
      <div className="nav__logo">
        <Link to="/">
          StayHealthy{" "}
          <i style={{ color: "#2190FF" }} className="fa fa-user-md"></i>
        </Link>
      </div>
      <div className="nav__icon" onClick={handleClick}>
        <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
      </div>
      <ul className={click ? "nav__links active" : "nav__links"}>
        <li className="link">
          <Link to="/">Home</Link>
        </li>
        <li className="link">
          <Link to="/search/doctors">Appointments</Link>
        </li>
        <li className="link">
          <Link to="/healthblog">Health Blog</Link>
        </li>
        <li className="link">
          <Link to="/reviews">Reviews</Link>
        </li>
        {authButtons}
      </ul>
    </nav>
  );
};

export default Navbar;
