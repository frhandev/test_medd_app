import React, { useState } from "react";
import "./Sign_Up.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config"; // Ensure your API_URL is defined properly in the config file

const Sign_Up = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!/^\d{11}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Store auth token and redirect
          sessionStorage.setItem("auth-token", data.authtoken);
          sessionStorage.setItem("user", data.name); // Save user data
          alert("Sign-Up Successful!");
          navigate("/"); // Redirect to home page
        } else {
          setErrors({ api: data.error || "Sign-Up failed. Please try again." });
        }
      } catch (error) {
        setErrors({ api: "Server error. Please try again later." });
      }
    }
  };

  // Reset form inputs
  const handleReset = () => {
    setFormData({ name: "", phone: "", email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="container" style={{ marginTop: "5%" }}>
      <div className="signup-grid">
        <div className="signup-text">
          <h1>Sign Up</h1>
        </div>
        <div className="signup-text1">
          Are you a new member?{" "}
          <span>
            <a href="/Login" style={{ color: "#2190FF;" }}>
              {" "}
              Login Here
            </a>
          </span>
        </div>
        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your name"
              />
              {errors.name && <small className="error">{errors.name}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your phone number"
              />
              {errors.phone && <small className="error">{errors.phone}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your email"
              />
              {errors.email && <small className="error">{errors.email}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your password"
              />
              {errors.password && (
                <small className="error">{errors.password}</small>
              )}
            </div>
            {errors.api && <div className="error">{errors.api}</div>}
            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-danger"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sign_Up;
