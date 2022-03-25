import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const guestLogin = (e) => {
    e.preventDefault();
    setEmail("guest@login.com");
    setPassword("12345");
  };
  const submitData = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setShowToast(true);
      setToastMsg("Please Enter Email and Password");
    }
    // console.log(email, password);
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    axios
      .post("/api/user/login", { email, password }, config)
      .then((res) => {
        // console.log(res);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        navigate("/chats");
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      {showToast ? (
        <h4 className="text-center text-danger mt-2 bg-warning py-2">
          {toastMsg}
        </h4>
      ) : (
        <div></div>
      )}
      <div className="container p-2">
        <form>
          <div className="mb-2">
            <label className="form-label mr-auto">
              Email address <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">
              Password <span className="text-danger">*</span>
            </label>
            <div className="input-group" style={{ border: "1px solid #DDD" }}>
              {show ? (
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              ) : (
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShow(!show);
                }}
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="d-grid gap-1 mt-1">
            <button
              type="submit"
              onClick={submitData}
              className="btn btn-info btn-block"
            >
              Submit
            </button>
            <button
              type="submit"
              onClick={guestLogin}
              className="btn btn-danger btn-block"
            >
              Get Guest User Credentials
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
