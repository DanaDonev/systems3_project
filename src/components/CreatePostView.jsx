import data from "../data/pets&categories.json";

export default function CreatePostModal({
  show,
  onClose,
  formData,
  setFormData,
  handleChange,
  handleSubmit,
}) {
  if (!show) return null;

  return (
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
          <form onSubmit={handleSubmit}>
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
                    <option value="" disabled>
                      select a pet
                    </option>
                    {data.pets.map((petOption) => (
                      <option key={petOption.id} value={petOption.id}>
                        {petOption.id}
                      </option>
                    ))}
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
                    <option value="" disabled>
                      select a category
                    </option>
                    {data.categories.map((CategoryOption) => (
                      <option key={CategoryOption.id} value={CategoryOption.id}>
                        {CategoryOption.id}
                      </option>
                    ))}
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
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      photo: e.target.files[0],
                    }))
                  }
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
              <button type="submit" className="btn btn-secondary mt-4 w-100">
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
