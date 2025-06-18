import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import data from "../data/registerFields.json";

export default function SignUpView() {
  const { formFields, petFields } = data;

  const [userType, setUserType] = useState("petsitter");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
  });

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
        "http://88.200.63.148:5006/users/register",
        form,
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        alert("Registration successful!");
        navigate("/signin");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (err) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <section className="container mt-4">
        <div
          className="p-3 rounded shadow"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2 className="text-center">Register</h2>

          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group" role="group" aria-label="User type">
              {["petsitter", "petowner"].map((user) => (
                <>
                  <input
                    type="radio"
                    className="btn-check"
                    name="userType"
                    id={user}
                    autoComplete="off"
                    checked={userType === user}
                    onChange={() => setUserType(user)}
                  />
                  <label className="btn btn-outline-secondary" htmlFor={user}>
                    {user === "petsitter" ? "Petsitter User" : "Pet Owner"}
                  </label>
                </>
              ))}
            </div>
          </div>

          <form className="row g-3" onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className={field.col}>
                <label htmlFor={field.name} className="form-label mb-0">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}

            {userType === "petowner" && (
              <div id="petInfoSection" className="mt-4">
                <h5 className="text-center mb-3">Pet Info</h5>
                {petFields.map((field) => (
                  <div key={field.name} className={field.col}>
                    <label htmlFor={field.name} className="form-label mb-0">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      className="form-control"
                      id={field.name}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <div className="col-12 mt-3">
                  <label htmlFor="petDescription" className="form-label mb-0">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="petDescription"
                    name="petDescription"
                    rows="2"
                    value={form.petDescription || ""}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            )}

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-secondary mt-4">
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center mb-0">
            <Link to="/signin" className="text-danger fw-bold small">
              Already have an account?
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
