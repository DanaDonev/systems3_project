import { useEffect, useState } from "react";
import axios from "axios";
import cities from "../data/cities.json";
import pets from "../data/pets&categories.json";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function ListingView() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeal, setShowDeal] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    petTypes: [],
    periodFrom: "",
    periodTo: "",
    minPrice: "",
    maxPrice: "",
  });
  const [search, setSearch] = useState("");
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const filteredListings = listings.filter((listing) => {
    if (filters.city && listing.City !== filters.city) return false;
    if (
      filters.petTypes.length > 0 &&
      !filters.petTypes.includes(listing.PetType)
    )
      return false;
    if (filters.periodFrom && listing.PeriodFrom < filters.periodFrom)
      return false;
    if (filters.periodTo && listing.PeriodTo > filters.periodTo) return false;
    if (filters.minPrice && Number(listing.Price) < Number(filters.minPrice))
      return false;
    if (filters.maxPrice && Number(listing.Price) > Number(filters.maxPrice))
      return false;
    if (
      search &&
      !(
        listing.Username &&
        listing.Username.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  // Fetch listings from backend (similar to ForumView)
  const fetchListings = async () => {
    try {
      const res = await axios.get("http://88.200.63.148:5006/listings/all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      setListings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
    console.log("isAuthenticated:", token);
  }, [token, navigate]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      await axios.delete("http://88.200.63.148:5006/listings/delete", {
        data: { id: listingId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchListings(); 
    } catch (err) {
      alert("Failed to delete listing. Please try again.");
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="p-3 rounded shadow">
          <div className="row">
            <div className="col-md-3 bg-light p-3 filter-scrollable">
              <h5>Filter</h5>

              <div className="mb-3">
                <label className="form-label fw-semibold">City</label>
                <select
                  className="form-select"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, city: e.target.value }))
                  }
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Pet Type</label>
                {pets.pets.map((type) => (
                  <div className="form-check" key={type.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={type.id}
                      checked={filters.petTypes.includes(type.id)}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          petTypes: e.target.checked
                            ? [...f.petTypes, type.id]
                            : f.petTypes.filter((t) => t !== type.id),
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor={type.id}>
                      {type.id}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Time Period</label>
                <div className="mb-2">
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={filters.periodFrom}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, periodFrom: e.target.value }))
                    }
                  />
                  <input
                    type="date"
                    className="form-control"
                    value={filters.periodTo}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, periodTo: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Rating</label>
                {[2, 3, 4, 5].map((rating) => (
                  <div className="form-check" key={rating}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`rating-${rating}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`rating-${rating}`}
                    >
                      {rating}+
                    </label>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Price</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, minPrice: e.target.value }))
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <button className="btn btn-light">Sort by</button>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {console.log("role:", role)}
                  {role === "petsitter" ? (
                    <button
                      className="btn btn-success"
                      onClick={() => navigate("/createlisting")}
                    >
                      Make a Listing
                    </button>
                  ) : (
                    <>
                      <label className="form-label mb-0 fw-semibold">
                        Search
                      </label>
                      <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by user or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="row row-cols-1 row-cols-md-3 g-3">
                {loading ? (
                  <div className="col-12 text-center">Loading...</div>
                ) : filteredListings.length === 0 ? (
                  <div className="col-12 text-center text-muted">
                    No listings found.
                  </div>
                ) : (
                  filteredListings.map((listing, index) => (
                    <div className="col" key={listing.id || index}>
                      <div className="card bg-light card-height p-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-person me-2"></i>
                          <h5>{listing.Username || "Unknown user"}</h5>
                        </div>
                        <span>{listing.PetType}</span>
                        <div>
                          <strong>City:</strong> {listing.City || "N/A"}
                        </div>
                        <div>
                          <strong>Period:</strong>{" "}
                          {listing.PeriodFrom?.slice(0, 10)} -{" "}
                          {listing.PeriodTo?.slice(0, 10)}
                        </div>
                        <div>
                          <strong>Price:</strong>{" "}
                          {Number(listing.Price).toFixed(2)} €
                        </div>
                        <div>
                          <strong>Description:</strong>
                          <div>{listing.Description}</div>
                        </div>

                        <div className="mt-2">
                          {role === "admin" ? (
                            <button
                              className="btn btn-danger w-100"
                              onClick={() => handleDeleteListing(listing.Id)}
                            >
                              Delete Listing
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => setShowDeal(true)}
                            >
                              Select Petsitter
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {Create Comment Modal} */}
      {showDeal && (
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
                  onClick={() => setShowDeal(false)}
                >
                  &times;
                </button>
              </div>
              <hr className="my-1" />
              <div className="modal-body">
                <button
                  className="btn btn-secondary mt-4 w-100"
                  onClick={() => setShowDeal(false)}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
