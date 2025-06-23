import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import data from "../data/pets&categories.json";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function ForumView({ pet, category }) {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(-1);
  const [formData, setFormData] = useState({
    pet: "",
    category: "",
    description: "",
    photo: "",
    vetOnly: false,
  });

  const [formData2, setFormData2] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [enlargedPhoto, setEnlargedPhoto] = useState(null);

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // if (!isAuthenticated) {
  //   return null; // Or a loading spinner
  // }

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://88.200.63.148:5006/forum/posts/${pet}/${category}?page=${page}&limit=${pageSize}`,
        { withCredentials: true }
      );

      const newPosts = res.data.posts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(page < res.data.totalPages);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    // Reset when pet/category changes
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
    setFormData((prev) => ({
      ...prev,
      pet: pet || "", // pre-fill from URL
      category: category || "", // pre-fill from URL
    }));
  }, [pet, category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChange2 = (e) => {
    setFormData2(e.target.value);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    if (!formData2.trim()) return;

    try {
      // Find the post to comment on (for demo, use the first post)
      const postId = showModal2;

      const res = await axios.post(
        `http://88.200.63.148:5006/forum/posts/${postId}`,
        { content: formData2 },
        { withCredentials: true }
      );

      setFormData2("");
      setShowModal2(-1);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("pet", formData.pet);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("vetOnly", formData.vetOnly);
    if (formData.photo) {
      form.append("photo", formData.photo);
    }

    try {
      const res = await axios.post("http://88.200.63.148:5006/forum", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create post");
      }
      const result = await res.json();
      console.log("Post created:", result);

      setPosts((prev) => [res.data, ...prev]);
      setFormData({
        pet: "",
        category: "",
        description: "",
        photo: "",
        vetOnly: false,
      });
      setShowModal(false);
      setShowModal2(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "70%" }}>
      {/* Enlarged photo overlay */}
      {enlargedPhoto && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            cursor: "zoom-out",
          }}
          onClick={() => setEnlargedPhoto(null)}
        >
          <img
            src={enlargedPhoto}
            alt="Enlarged"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: "12px",
              boxShadow: "0 0 24px #000",
            }}
          />
        </div>
      )}

      <div className="p-3 rounded shadow">
        <div className="d-flex align-items-center mb-4">
          <h2 className="ms-auto mb-0">Posts</h2>
          <button
            type="button"
            className="text-primary fw-bold fs-2 text-decoration-none ms-auto"
            style={{ background: "none", border: "none" }}
            onClick={() => setShowModal(true)}
          >
            +
          </button>
        </div>

        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<p className="text-center my-3">Loading more posts...</p>}
          endMessage={
            <p className="text-center my-3 text-muted">No more posts.</p>
          }
        >
          {posts.map((entry, index) => (
            <div className="forum-entry mb-4" key={entry.id || index}>
              <div className="d-flex justify-content-between">
                <span>
                  <strong>{entry.author?.username || "Anonymous"}</strong>
                </span>
                <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
              </div>

              <div className="d-flex">
                <div className="row w-100">
                  <div className="col-md-4">
                    <div className="forum-content-box">
                      <img
                        src={
                          entry.photo
                            ? `data:image/jpeg;base64,${entry.photo}`
                            : "/default-placeholder.png"
                        }
                        alt="Post"
                        className="w100"
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        onClick={() => {
                          if (entry.photo) {
                            setEnlargedPhoto(
                              `data:image/jpeg;base64,${entry.photo}`
                            );
                          }
                        }}
                      />
                      <p>{entry.description}</p>
                    </div>
                  </div>

                  <div
                    className="col-md-8 d-flex flex-column justify-content-start"
                    style={{ maxHeight: "180px", overflow: "auto" }}
                  >
                    <p style={{ display: "inline" }}>
                      <strong>Comments</strong>
                    </p>
                    <button
                      type="button"
                      className="text-primary fs-2 text-decoration-none ms-auto"
                      style={{
                        display: "inline",
                        background: "none",
                        border: "none",
                      }}
                      onClick={() => {
                        setShowModal2(entry.id);
                      }}
                    >
                      +
                    </button>
                    {entry.comments?.length > 0 ? (
                      entry.comments.map((comment) => (
                        <div key={comment.id} className="comment mb-2">
                          <small className="fw-bold">
                            {comment.username || "Anonymous"}
                          </small>
                          <small className="text-muted">
                            | {new Date(comment.timestamp).toLocaleString()}{" "}
                          </small>
                          <br />
                          {comment.content}
                        </div>
                      ))
                    ) : (
                      <p>No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>

      {/* Create Post Modal */}
      {showModal && (
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
                  onClick={() => setShowModal(false)}
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
                      <option value="" disabled selected>
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
                      <option value="" disabled selected>
                        select a category
                      </option>
                      {data.categories.map((CategoryOption) => (
                        <option
                          key={CategoryOption.id}
                          value={CategoryOption.id}
                        >
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

                <button
                  className="btn btn-secondary mt-4 w-100"
                  onClick={handleSubmit}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {Create Comment Modal} */}
      {showModal2 >= 0 && (
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
                <h5 className="ms-auto">Write a comment</h5>
                <button
                  type="button"
                  className="text-primary fw-bold fs-2 ms-auto"
                  style={{ background: "none", border: "none" }}
                  onClick={() => setShowModal2(-1)}
                >
                  &times;
                </button>
              </div>
              <hr className="my-1" />
              <div className="modal-body">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    name="comment"
                    value={formData2}
                    onChange={handleChange2}
                    placeholder="Write your comment..."
                  ></textarea>
                </div>

                <button
                  className="btn btn-secondary mt-4 w-100"
                  onClick={handleSubmit2}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
