import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function RateDealView() {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { dealId } = useParams();

  const validate = () => {
    const newErrors = {};
    if (rating < 1 || rating > 5)
      newErrors.rating = "Please select a rating between 1 and 5.";
    if (!description.trim())
      newErrors.description = "Please enter a description.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${API_URL}/deals/${dealId}/rate`, {
        rating,
        description,
      });
      navigate("/thankyou"); // redirect after successful submission
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
      console.error(err);
    }
  };

  const Star = ({ starValue }) => (
    <span
      style={{
        fontSize: "2rem",
        color: starValue <= rating ? "#ffc107" : "#e4e5e9",
        cursor: "pointer",
      }}
      onClick={() => setRating(starValue)}
      aria-label={`${starValue} Star`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setRating(starValue);
      }}
    >
      ★
    </span>
  );

  return (
    <section className="container my-5">
      <div
        className="p-3 rounded shadow"
        style={{ maxWidth: "600px", margin: "0 auto" }}
      >
        <h2 className="text-center mb-4">Rate Your Petsitter Experience</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} starValue={star} />
            ))}
            {errors.rating && (
              <div className="text-danger mt-2">{errors.rating}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="feedbackDescription" className="form-label">
              Your Feedback
            </label>
            <textarea
              id="feedbackDescription"
              className={`form-control${
                errors.description ? " is-invalid" : ""
              }`}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your feedback here..."
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-secondary mt-3">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
