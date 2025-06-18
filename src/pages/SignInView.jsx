import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { useAuth } from "../AuthContext";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";

export default function SignInView() {

  const [showForgot, setShowForgot] = useState(false);

  const [form, setForm] = useState({ username: "", password: "" });

  //const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://88.200.63.148:5006/users/signin",
        form,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        //const profileRes = await axios.get("http://88.200.63.148:5006/profile", {
        //  withCredentials: true,
        //});
        //const profile = profileRes.data;
        //setUser(profile); // Uncomment if using AuthContext
        navigate("/forum");
      }
    } catch (err) {
      alert("Invalid username or password");
    }

    // const res = await fetch("http://localhost:3000/signin", {
    //   method: "POST",
    //   credentials: "include",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ username, password }),
    // });

    // if (res.ok) {
    //   const profileRes = await fetch("http://localhost:3000/profile", {
    //     credentials: "include",
    //   });
    //   const profile = await profileRes.json();
    //   setUser(profile);
    //   navigate("/forum");
    // } else {
    //   alert("Invalid username or password");
    // }
  };

  return (
    <>
      <section className="container my-5">
        <div
          className="p-3 rounded shadow"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2 className="text-center mb-4">Sign in</h2>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label htmlFor="inputUsername" className="form-label mb-0">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputPassword" className="form-label mb-0">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <Link
                to="#"
                className="text-secondary small d-block text-end"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(true);
                }}
              >
                Forgot your password?
              </Link>
            </div>

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-secondary mt-4">
                Sign In
              </button>
            </div>
          </form>

          <p className="text-center mb-0">
            <Link to="/register" className="text-danger fw-bold small">
              Don't have an account yet?
            </Link>
          </p>
        </div>
      </section>

      <ForgotPassword show={showForgot} onClose={() => setShowForgot(false)} /> 
    </>
  );
}
