import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import data from "../data/registerFields.json";
import allowedCities from "../data/cities.json";
const API_URL = process.env.REACT_APP_API_URL;

export default function SignUpView() {
  const { formFields, petFields } = data;
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
    isVeterinarian: false,
    vetClinic: "",
    vetProof: null,
    userType: "petsitter",
  });
  const [errors, setErrors] = useState({});
  const [pets, setPets] = useState([{}]);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    formFields.forEach((field) => {
      if (!form[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    if (form.userType === "petowner") {
      pets.forEach((pet, idx) => {
        petFields.forEach((field) => {
          if (!pet[field.name]) {
            newErrors[`pet_${idx}_${field.name}`] = `${
              field.label
            } is required for pet #${idx + 1}`;
          }
        });
      });
    }
    if (form.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (form.password && form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (
      form.password &&
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)
    ) {
      newErrors.password =
        "Password must contain a digit, a lowercase and an uppercase letter";
    }
    if (form.phone && !/^\d{9}$/.test(form.phone)) {
      newErrors.phone = "Phone number must be exactly 9 digits";
    }
    if (form.dob) {
      const dobDate = new Date(form.dob);
      const today = new Date();
      if (dobDate >= today) {
        newErrors.dob = "Date of birth must be in the past";
      } else {
        const minAge = 16;
        const ageDifMs = today - dobDate;
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age < minAge) {
          newErrors.dob = `You must be at least ${minAge} years old`;
        }
      }
    }
    if (form.isVeterinarian && !form.vetProof) {
      newErrors.vetProof = "Veterinarian proof is required";
    }
    if (form.isVeterinarian && !form.vetClinic) {
      newErrors.vetClinic = "Vet clinic/workplace is required";
    }
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
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          payload.append(key, value);
        }
      });
      payload.append("pets", JSON.stringify(pets));
      for (let pair of payload.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      console.log(payload);
      const res = await axios.post(`${API_URL}/users/register`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(payload);
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
      <section className="container my-4">
        <div
          className="p-3 rounded shadow"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <h2 className="text-center">Register</h2>

          <div className="d-flex justify-content-center mb-4">
            <div className="btn-group" role="group" aria-label="User type">
              {["petsitter", "petowner"].map((user) => (
                <div key={user} className="btn-group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="userType"
                    id={user}
                    autoComplete="off"
                    checked={form.userType === user}
                    onChange={() => {
                      setForm((prev) => ({
                        ...prev,
                        userType: user,
                      }));
                      console.log(user);
                    }}
                  />
                  <label
                    key={user}
                    className="btn btn-outline-secondary"
                    htmlFor={user}
                  >
                    {user === "petsitter" ? "Petsitter User" : "Pet Owner"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <form className="row g-3" onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className={field.col}>
                <label htmlFor={field.name} className="form-label mb-0">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <>
                    <select
                      className={`form-select${
                        errors[field.name] ? " is-invalid" : ""
                      }`}
                      id={field.name}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select City</option>
                      {allowedCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Please select the closest city. You can specify your exact
                      location in the address field below.
                    </small>
                  </>
                ) : (
                  <input
                    type={field.type}
                    className={`form-control${
                      errors[field.name] ? " is-invalid" : ""
                    }`}
                    id={field.name}
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                  />
                )}
                {errors[field.name] && (
                  <div className="invalid-feedback">{errors[field.name]}</div>
                )}
              </div>
            ))}
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isVeterinarian"
                  name="isVeterinarian"
                  checked={form.isVeterinarian}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      isVeterinarian: e.target.checked,
                      vetProof: e.target.checked ? prev.vetProof : null, // clear proof if unchecked
                    }));
                    console.log(e.target.checked);
                  }}
                />
                <label className="form-check-label" htmlFor="isVeterinarian">
                  I am a veterinarian
                </label>
              </div>
            </div>

            {form.isVeterinarian && (
              <>
                <div className="col-12">
                  <label htmlFor="vetClinic" className="form-label mb-0">
                    Vet Clinic / Place of Work
                  </label>
                  <input
                    type="text"
                    className={`form-control${
                      errors.vetClinic ? " is-invalid" : ""
                    }`}
                    id="vetClinic"
                    name="vetClinic"
                    value={form.vetClinic}
                    onChange={handleChange}
                    placeholder="Enter the name of your clinic or workplace"
                  />
                  {errors.vetClinic && (
                    <div className="invalid-feedback">{errors.vetClinic}</div>
                  )}
                </div>
                <div className="col-12">
                  <label htmlFor="vetProof" className="form-label mb-0">
                    Upload proof of veterinarian status
                  </label>
                  <input
                    type="file"
                    className={`form-control${
                      errors.vetProof ? " is-invalid" : ""
                    }`}
                    id="vetProof"
                    name="vetProof"
                    accept="image/*,application/pdf"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        vetProof: e.target.files[0],
                      }))
                    }
                  />
                  {errors.vetProof && (
                    <div className="invalid-feedback">{errors.vetProof}</div>
                  )}
                </div>
              </>
            )}

            {form.userType === "petowner" && (
              <div id="petInfoSection" className="mt-4 ">
                <h5 className="text-center mb-3">Pet Info</h5>
                {pets.map((pet, idx) => (
                  <div key={idx} className="row g-3">
                    <hr className="my-3" />
                    {petFields.map((field) => (
                      <div key={field.name + idx} className={field.col}>
                        <label
                          htmlFor={field.name + idx}
                          className="form-label mb-0"
                        >
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          className={`form-control${
                            errors[`pet_${idx}_${field.name}`]
                              ? " is-invalid"
                              : ""
                          }`}
                          id={field.name + idx}
                          name={field.name}
                          value={pet[field.name] || ""}
                          onChange={(e) => {
                            const newPets = [...pets];
                            newPets[idx] = {
                              ...newPets[idx],
                              [field.name]: e.target.value,
                            };
                            setPets(newPets);
                          }}
                        />
                        {errors[`pet_${idx}_${field.name}`] && (
                          <div className="invalid-feedback">
                            {errors[`pet_${idx}_${field.name}`]}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="col-12 mt-3 mb-3">
                      <label
                        htmlFor={"petDescription" + idx}
                        className="form-label mb-0"
                      >
                        Description
                      </label>
                      <textarea
                        className={`form-control${
                          errors.petDescription ? " is-invalid" : ""
                        }`}
                        id={"petDescription" + idx}
                        name="petDescription"
                        rows="2"
                        value={pet.petDescription || ""}
                        onChange={(e) => {
                          const newPets = [...pets];
                          newPets[idx] = {
                            ...newPets[idx],
                            petDescription: e.target.value,
                          };
                          setPets(newPets);
                        }}
                      ></textarea>
                      {errors.petDescription && (
                        <div className="invalid-feedback">
                          {errors.petDescription}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="col-12 text-center">
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-2 me-2"
                    onClick={() => setPets([...pets, {}])}
                    disabled={pets.length >= 5}
                  >
                    Add Another Pet
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger mt-2"
                    onClick={() => setPets(pets.slice(0, -1))}
                    disabled={pets.length === 1}
                  >
                    Remove Last Pet
                  </button>
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
