import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUpView() {
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
    city: ""
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
            // Optionally redirect or clear for another registration
            
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
              {/* {["petsitter", "petowner"].map((user) =>(
                            <div key={user}>
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
                        </div>
                        ))}  */}
              <input
                type="radio"
                className="btn-check"
                name="userType"
                id="petsitter"
                autoComplete="off"
                checked={userType === "petsitter"}
                onChange={() => setUserType("petsitter")}
              />
              <label className="btn btn-outline-secondary" htmlFor="petsitter">
                Petsitter User
              </label>

              <input
                type="radio"
                className="btn-check"
                name="userType"
                id="petowner"
                autoComplete="off"
                checked={userType === "petowner"}
                onChange={() => setUserType("petowner")}
              />
              <label className="btn btn-outline-secondary" htmlFor="petowner">
                Pet Owner
              </label>
            </div>
          </div>

          <form className="row g-3">
            <div className="col-md-6">
              <label htmlFor="inputName" className="form-label mb-0">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="inputName"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputSurname" className="form-label mb-0">
                Surname
              </label>
              <input
                type="text"
                className="form-control"
                id="inputSurname"
                name="surname"
                value={form.surname}
                onChange={handleChange}
              />
            </div>
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
            <div className="col-6">
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
            </div>
            <div className="col-6">
              <label htmlFor="inputConfirmPassword" className="form-label mb-0">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputConfirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputEmail" className="form-label mb-0">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputPhone" className="form-label mb-0">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="inputPhone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-12">
              <label htmlFor="inputDOB" className="form-label mb-0">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="inputDOB"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputAddress" className="form-label mb-0">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputCity" className="form-label mb-0">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="inputCity"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            {userType === "petowner" && (
              <div id="petInfoSection" className="mt-4">
                <h5 className="text-center mb-3">Pet Info</h5>

                <div className="col-12">
                  <label htmlFor="petName" className="form-label mb-0">
                    Pet Name
                  </label>
                  <input type="text" className="form-control" id="petName" />
                </div>

                <div className="row">
                  <div className="col-md-6 mt-3">
                    <label htmlFor="petType" className="form-label mb-0">
                      Type
                    </label>
                    <input type="text" className="form-control" id="petType" />
                  </div>
                  <div className="col-md-6 mt-3">
                    <label htmlFor="petBreed" className="form-label mb-0">
                      Breed
                    </label>
                    <input type="text" className="form-control" id="petBreed" />
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <label htmlFor="petDescription" className="form-label mb-0">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="petDescription"
                    rows="2"
                  ></textarea>
                </div>

                <div className="col-12 mt-3">
                  <label htmlFor="petDOB" className="form-label mb-0">
                    Pet Date of Birth
                  </label>
                  <input type="date" className="form-control" id="petDOB" />
                </div>
              </div>
            )}

            <div className="col-12 text-center">
              <button type="submit" className="btn btn-secondary mt-4" onClick={handleSubmit}>
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center mb-0">Already have an account?</p>
        </div>
      </section>
    </>
  );
}
