//not done
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import InfiniteScroll from "react-infinite-scroll-component";

export default function ForumView({ pet, category }) {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pet: "",
    category: "",
    description: "",
    photo: "",
    vetOnly: false,
  });

  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 
  const pageSize = 5; 

  const fetchPosts = () => {
    axios
      .get("http://88.200.63.148:5006/forum/posts"+ (pet ? `/${pet}` : "") + (category ? `/${category}` : "") + `?page=${page}&limit=${pageSize}`, {
        withCredentials: true,
      })
      .then((res) => {
        const newPosts = res.data.posts || res.data; 
        setPosts((prev) => [...prev, ...newPosts]);
        setHasMore(newPosts.length === pageSize); 
        setPage((prev) => prev + 1);
      })
      .catch((err) => console.error("Failed to load posts:", err));
  };

   useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
  }, [pet, category]);

  const handleChange = (e) => {
    const { name, value, photo, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://88.200.63.148:5006/forum", formData, {
        withCredentials: true,
      })
      .then((res) => {
        setPosts((prevPosts) => [...prevPosts, res.data]);
        setFormData({
          pet: "",
          category: "",
          description: "",
          photo: "",
          vetOnly: false,
        });
        setShowModal(false);
        // refetch posts to ensure the new post is included
      })
      .catch((err) => console.error("Failed to create post:", err));
  };

  return (
    <>
      <div className="container my-5" style={{ maxWidth: "70%" }}>
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
            <div className="forum-entry" key={index}>
              <div className="d-flex justify-content-between">
                <span>
                  <strong>{entry.UserId || "Anonymous"}</strong>
                </span>
                <span>{new Date(entry.Timestamp).toLocaleDateString()}</span>
              </div>

              <div className="d-flex">
                <div className="row w-100">
                  <div className="col-md-4">
                    <div className="forum-content-box">
                      <img
                        src={entry.Photo || "https://via.placeholder.com/100"}
                        alt="Post Image"
                      />
                      {entry.QDescription || "Sample post content goes here..."}
                    </div>
                  </div>

                  <div
                    className="col-md-8 d-flex flex-column justify-content-start"
                    style={{ maxHeight: "180px", overflow: "hidden" }}
                  >
                    <p>
                      <strong>Comments</strong>
                    </p>
                    <div className="comments-box">
                      {(entry.comments || []).map((comment, i) => (
                        <p key={i}>
                          <strong>{comment.username}</strong>
                          <br />
                          {comment.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="likes">Likes: {entry.likes || 0}</div>
            </div>
          ))}
          </InfiniteScroll>

        </div>
      </div> 

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
            {/* <div className="d-flex align-items-center mb-4">
              <h2 className="ms-auto mb-0">Posts</h2>
              
            </div> */}

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
                      <option value="">Select Pet</option>
                      <option value="cat">Cat</option>
                      <option value="dog">Dog</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="bird">Bird</option>
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
                    {/* take from the data folder */}
                      <option value="">Select Category</option>
                      <option value="Food">Food</option>
                      <option value="Health Care">Health Care</option>
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

                <button className="btn btn-secondary mt-4 w-100" onClick={handleSubmit}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
