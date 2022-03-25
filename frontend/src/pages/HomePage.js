import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";

const HomePage = () => {
  const [page, setPage] = useState("Login");
  const LoginClick = (e) => {
    setPage("Login");
  };

  const SignupClick = (e) => {
    setPage("Signup");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <div className="home">
      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 col-sm-8 mt-5 mx-auto text-center">
          <div className="shadow-sm p-3 bg-body rounded h4">Bubble Chat</div>
        </div>
      </div>

      <div className="row justify-content-md-center mt-2">
        <div className="col-lg-4 col-md-6 col-sm-8 mx-auto">
          <div className="shadow-sm p-3 mb-5 bg-body rounded">
            <div className="row text-center">
              <nav className="nav nav-pills nav-justified h5">
                {page === "Login" ? (
                  <div
                    className="nav-link bg-primary text-white"
                    onClick={LoginClick}
                  >
                    Login
                  </div>
                ) : (
                  <div className="nav-link" onClick={LoginClick}>
                    Login
                  </div>
                )}
                {page === "Signup" ? (
                  <div
                    className="nav-link bg-primary text-white"
                    onClick={SignupClick}
                  >
                    Signup
                  </div>
                ) : (
                  <div className="nav-link" onClick={SignupClick}>
                    Signup
                  </div>
                )}
              </nav>
            </div>
            <div className="row">
              {page === "Signup" ? <Signup /> : <Login />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
