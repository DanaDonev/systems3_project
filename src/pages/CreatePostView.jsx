//check the form!
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext"

export default function CreatePostView({ show, onClose, addPost }) {
  const [formData, setFormData] = useState({
    pet: "",
    category: "",
    description: "",
    photo: "",
    vetOnly: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     setFormData((prev) => ({
//       ...prev,
//       photo: file,
//     }));
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("pet", formData.pet);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("vetOnly", formData.vetOnly);
    if (formData.photo) data.append("photo", formData.photo);

   // const { token } = useAuth();

    try {
      const res = await axios.post(
        "http://88.200.63.148:5006/forum",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      addPost(res.data); 
      setFormData({
        pet: "",
        category: "",
        description: "",
        photo: "",
        vetOnly: false,
      });
      onClose();
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "500px" }}
        >
          <div className="modal-content p-3">
            <div className="d-flex align-items-center">
              <h5 className="ms-auto">Create New Post</h5>
              <button
                type="button"
                className="text-primary fw-bold fs-2 ms-auto"
                style={{ background: "none", border: "none" }}
                onClick={onClose}
              >
                &times;
              </button>
            </div>
            <hr className="my-1" />
            <div className="modal-body">
              <div className="d-flex gap-3 mb-3">
                <div className="flex-fill">
                  <label className="form-label">Pet</label>
                  <select
                    className="form-select"
                    name="pet"
                    value={formData.pet}
                    onChange={handleChange}
                  >
                    <option value="">Select Pet</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="parrot">Parrot</option>
                    <option value="snake">Snake</option>
                    <option value="spider">Spider</option>
                    <option value="lizard">Lizard</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="hamster">Hamster</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex-fill">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="Food">Food</option>
                    <option value="Health">Health</option>
                    <option value="Care">Care</option>
                    <option value="Training">Training</option>
                    <option value="Bath">Bath</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your post..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFormData((prev) => ({
                      ...prev,
                      photo: file,
                    }));
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label d-block">Type</label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vetOnly"
                    id="vetYes"
                    checked={formData.vetOnly === true}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, vetOnly: true }))
                    }
                  />
                  <label className="form-check-label" htmlFor="vetYes">
                    Vet Only
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vetOnly"
                    id="vetNo"
                    checked={formData.vetOnly === false}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, vetOnly: false }))
                    }
                  />
                  <label className="form-check-label" htmlFor="vetNo">
                    All
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-secondary mt-4 w-100"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 