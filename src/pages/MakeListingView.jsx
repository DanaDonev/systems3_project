import { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import pets from "../data/pets&categories.json";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function MakeListingView() {
  const [form, setForm] = useState({
    periodFrom: "",
    periodTo: "",
    petType: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on change
  };

  const validateForm = () => {
    if (!form.periodFrom || !form.periodTo || !form.petType || !form.description || !form.price) {
      setError("All fields are required.");
      return false;
    }
    if (new Date(form.periodFrom) > new Date(form.periodTo)) {
      setError("Period From must be before Period To.");
      return false;
    }
    if (Number(form.price) < 0) {
      setError("Price must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.post(
        "http://88.200.63.148:5006/listings",
        {
          PeriodFrom: form.periodFrom,
          PeriodTo: form.periodTo,
          PetType: form.petType,
          Description: form.description,
          Price: form.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Listing created!");
      navigate("/listing");
    } catch (err) {
      setError("Failed to create listing.");
      console.error(err);
    }
  };

// Import pet types from data file

return (
    <section className="container my-4">
        <div className="p-3 rounded shadow" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 className="text-center">Create a Listing</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label htmlFor="periodFrom" className="form-label mb-0">Period From</label>
                    <input
                        type="date"
                        className="form-control"
                        id="periodFrom"
                        name="periodFrom"
                        value={form.periodFrom}
                        onChange={handleChange}
                        min={getToday()}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="periodTo" className="form-label mb-0">Period To</label>
                    <input
                        type="date"
                        className="form-control"
                        id="periodTo"
                        name="periodTo"
                        value={form.periodTo}
                        onChange={handleChange}
                        min={form.periodFrom ? form.periodFrom : getToday()}
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="petType" className="form-label mb-0">Pet Type</label>
                    <select
                        className="form-select"
                        id="petType"
                        name="petType"
                        value={form.petType}
                        onChange={handleChange}
                        required
                    >
                        <option value="default">Select Pet Type</option>
                        {pets.pets.map((type) => (
                            <option key={type.id} value={type.id}>{type.id}</option>
                        ))}
                        
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="price" className="form-label mb-0">Price (€) <span className="text-muted">per day</span></label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <div className="col-12">
                    <label htmlFor="description" className="form-label mb-0">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={form.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                {error && (
                    <div className="col-12">
                        <div className="alert alert-danger py-2">{error}</div>
                    </div>
                )}
                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-secondary mt-4">
                        Create Listing
                    </button>
                </div>
            </form>
        </div>
    </section>
);
}