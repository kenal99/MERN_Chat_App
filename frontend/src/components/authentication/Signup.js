import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [pic, setPic] = useState("");
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const postPics = (pics) => {
    if (pics === undefined) {
      setShowToast(true);
      setToastMsg("Please Select the Image file");
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "bubble-chat");
      data.append("cloud_name", "kenal");
      // console.log(data);
      axios
        .post("https://api.cloudinary.com/v1_1/kenal/image/upload", data)
        .then((res) => {
          // console.log(res);
          setPic(res.data.url.toString());
        })
        .catch((e) => {
          // console.log(e);
        });
    } else {
      setShowToast(true);
      setToastMsg("Please Select the Image file");
      return;
    }
  };
  const submitData = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !cpassword) {
      setShowToast(true);
      setToastMsg("Please Enter all the Required(*) details");
      return;
    }

    if (password !== cpassword) {
      setShowToast(true);
      setToastMsg("Password and Confirm Password Not Matching");
      return;
    }
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    axios
      .post("/api/user", { name, email, password, pic }, config)
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
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="name"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">
              Confirm Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              id="cpassword"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Upload Picture</label>
            <br />
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={(e) => postPics(e.target.files[0])}
            />
          </div>
          <div className="d-grid gap-1">
            <button
              type="submit"
              className="btn btn-info btn-block"
              onClick={submitData}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
