import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";

export default function SignInView() {
  const [errors, setErrors] = useState({});
  const [showForgot, setShowForgot] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const res = await axios.post(
        "http://88.200.63.148:5006/users/signin",
        form,
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      if (res.status === 200 && res.data.success) {
        const token = res.data.token;
        login(token); // Store token in context state
        navigate("/forum");
      }
    } catch (err) {
      alert("Invalid username or password");
      console.log(err);
    }
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
                className={`form-control${
                  errors.username ? " is-invalid" : ""
                }`}
                id="inputUsername"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>
            <div className="col-12">
              <label htmlFor="inputPassword" className="form-label mb-0">
                Password
              </label>
              <input
                type="password"
                className={`form-control${
                  errors.password ? " is-invalid" : ""
                }`}
                id="inputPassword"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
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
