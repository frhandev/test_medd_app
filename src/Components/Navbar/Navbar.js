import "./Navbar.css";
import docIcon from "../../Assets/Doc_Icon.png";

export default function Navbar() {
  const handleClick = () => {};

  return (
    <>
      <nav>
        <div className="nav__logo">
          <a href="/">
            StayHealthy
            <img src={docIcon} />
          </a>
        </div>
        <div className="nav__icon" onClick={handleClick}>
          <i className="fa fa-times fa fa-bars"></i>
        </div>

        <ul className="nav__links active">
          <li className="link">
            <a className="nav_link" href="../Landing_Page/LandingPage.html">
              Home
            </a>
          </li>
          <li className="link">
            <a className="nav_link" href="#">
              Appointments
            </a>
          </li>
          <li className="link">
            <a className="btn1" href="../Sign_Up//Sign_Up.html">
              Sign Up
            </a>
          </li>
          <li className="link">
            <a className="btn1" href="../Login/Login.html">
              Login
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
