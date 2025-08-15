import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import data from "../data/pets&categories.json";

export default function ForumInitialView() {
  const { pets, categories } = data;

  const [pet, setPet] = useState("");
  const [category, setCategory] = useState("");

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      alert("Please first sign in.");
    }
    console.log("isAuthenticated:", token);
  }, [token, navigate]);

  const handlePetChange = (e) => {
    setPet(e.target.id);
    console.log(pet);
  };

  const handleCategoryChange = (e) => {
    if (category === e.target.id) {
      setCategory("");
      return;
    }
    setCategory(e.target.id);
    console.log(category);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pet) {
      alert("Please select a pet");
      return;
    }
    console.log("Selected pet:", pet, "Selected category:", category);

    if (!category) {
      navigate(`/forum/${pet}`);
    } else {
      navigate(`/forum/${pet}/${category}`);
    }
  };

  return (
    <>
      <section
        className="container text-center my-5"
        style={{ maxWidth: "70%" }}
      >
        <div className="p-3 rounded shadow">
          <h2 className="text-center mb-4">Forum</h2>

          <h5 className="mt-4">Choose pet *</h5>
          <div className="d-flex justify-content-center flex-wrap">
            {pets.map((pet) => (
              <div key={pet.id} className="d-inline-block text-center mx-1">
                <input
                  type="radio"
                  name="pet"
                  id={pet.id}
                  className="image-radio"
                  onChange={handlePetChange}
                />
                <label htmlFor={pet.id} className="image-label">
                  <img src={pet.img} alt={pet.id} />
                </label>
              </div>
            ))}
          </div>

          <h5 className="mt-4">Choose category</h5>
          <div className="d-flex justify-content-center flex-wrap">
            {categories.map((category) => (
              <div key={category.id} className="category-radio-container">
                <input
                  type="radio"
                  name="category"
                  id={category.id}
                  className="image-radio"
                  onChange={handleCategoryChange}
                  value={category.id}
                />
                <label htmlFor={category.id} className="image-label">
                  <img src={category.img} alt={category.id} />
                </label>
              </div>
            ))}
          </div>

          <button className="btn btn-secondary mt-4" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </section>
    </>
  );
}
