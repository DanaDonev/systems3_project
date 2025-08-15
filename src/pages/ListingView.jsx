import { useEffect, useState } from "react";
import axios from "axios";
import cities from "../data/cities.json";
import pets from "../data/pets&categories.json";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

export default function ListingView() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeal, setShowDeal] = useState(false);
  const [sortBy, setSortBy] = useState("timePeriod");

  const [filters, setFilters] = useState({
    city: "",
    petTypes: [],
    periodFrom: "",
    periodTo: "",
    minPrice: "",
    maxPrice: "",
  });
  const [search, setSearch] = useState("");
  const { token, role, username } = useAuth();
  const navigate = useNavigate();

  const [dealForm, setDealForm] = useState({
    timeFrom: "",
    timeTo: "",
    price: 0,
    food: "",
    description: "",
    pet: "",
    serverId: 0,
    serverEmail: "",
  });
  const filteredListings = listings.filter((listing) => {
    if (filters.city && listing.City !== filters.city) return false;
    if (
      filters.petTypes.length > 0 &&
      !filters.petTypes.includes(listing.PetType)
    )
      return false;
    if (filters.periodFrom && listing.PeriodFrom > filters.periodFrom)
      return false;
    if (filters.periodTo && listing.PeriodTo < filters.periodTo) return false;
    if (filters.rating && listing.Rating < filters.rating) return false;
    if (filters.minPrice && Number(listing.Price) < Number(filters.minPrice))
      return false;
    if (filters.maxPrice && Number(listing.Price) > Number(filters.maxPrice))
      return false;
    if (
      search &&
      !(
        (listing.Username &&
          listing.Username.toLowerCase().includes(search.toLowerCase())) ||
        (listing.Description &&
          listing.Description.toLowerCase().includes(search.toLowerCase()))
      )
    ) {
      return false;
    }
    return true;
  });
  const [dealError, setDealError] = useState("");
  const [userPets, setUserPets] = useState([]);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_URL}/listings/all?sortBy=${sortBy}`, {
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
  }, [sortBy]);

  const fetchUserPets = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/pets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User Pets:", res.data);
      setUserPets(res.data || []);
    } catch (err) {
      console.error("Failed to fetch user pets:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      alert("Please first sign in.");
    }
    console.log("isAuthenticated:", token);
    fetchUserPets();
  }, [token, navigate]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      await axios.delete(`${API_URL}/listings/delete`, {
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
  const handleDealSubmit = async (e) => {
    e.preventDefault();
    setDealError("");
    const diffTime = dealForm.timeTo - dealForm.timeFrom;
    console.log("Deal duration (days):", diffTime);

    if (diffTime > 14 * 24 * 60 * 60 * 1000) {
      alert("The maximum duration for a deal is 14 days.");
      return;
    }
    try {
      await axios.post(`${API_URL}/deals/create`, dealForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeal(false);
      setDealForm({
        timeFrom: "",
        timeTo: "",
        price: "",
        food: "",
        description: "",
        pet: "",
        serverId: 0,
        serverEmail: "",
      });
    } catch (err) {
      setDealError("Failed to save deal. Please try again.");
    }
  };

  return (
    <>
      <div className="container my-4">
        <div
          className="p-3 rounded shadow"
          style={{ maxHeight: "85vh", overflowY: "hidden" }}
        >
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
                      {type.name}
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
                <div>
                  <label className="form-label fw-semibold">Rating</label>
                </div>
                {[3, 3.5, 4, 4.5].map((rating) => (
                  <div className="form-check form-check-inline" key={rating}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rating"
                      id={`rating-${rating}`}
                      checked={filters.rating === rating}
                      onChange={() => setFilters((f) => ({ ...f, rating }))}
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

              <div className="mb-5">
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
                  <select
                    className="form-select"
                    style={{ width: "150px" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="timePeriod" selected>
                      Time Period
                    </option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div className="d-flex align-items-center gap-2">
                  {console.log("role:", role)}
                  {role === "petsitter" ? (
                    <button
                      className="btn btn-secondary"
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
                        className="form-control w-70"
                        placeholder="user or description"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </>
                  )}
                </div>
              </div>

              <div
                className="row row-cols-1 row-cols-md-4 g-3 filter-scrollable"
                style={{ height: "77vh" }}
              >
                {loading ? (
                  <div className="col-12 text-center ">Loading...</div>
                ) : filteredListings.length === 0 ? (
                  <div className="col-12 text-center text-muted">
                    No listings found.
                  </div>
                ) : (
                  filteredListings.map((listing, index) => (
                    <div className="col mt-2" key={listing.id || index}>
                      <div
                        className="card bg-light p-3 d-flex flex-column h-100"
                        style={{
                          height: "320px",
                          minHeight: "320px",
                          maxHeight: "320px",
                        }}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-person me-2"></i>
                          <h7 className="mb-0">
                            {listing.Username || "Unknown user"}
                          </h7>
                        </div>
                        <div style={{ alignContent: "center" }}>
                          <span>
                            {listing.PetType} pet sitter{" "}
                            {listing.Rating
                              ? listing.Rating.slice(0, 3) + "⭐"
                              : ""}
                          </span>
                        </div>

                        <div style={{ fontSize: "small", overflow: "auto" }}>
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
                          {console.log("role:", username)}
                          <div
                            style={{
                              overflowY: "auto",
                            }}
                            className="d-flex flex-grow-1 justify-content-start"
                          >
                            {listing.Description}
                          </div>
                        </div>
                        <div className="mt-auto">
                          {role === "admin" && (
                            <button
                              className="btn btn-danger w-100 pt-1"
                              onClick={() => handleDeleteListing(listing.Id)}
                            >
                              Delete Listing
                            </button>
                          )}
                          {role === "petowner" && (
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => {
                                setDealForm({
                                  ...dealForm,
                                  timeFrom: listing.PeriodFrom,
                                  timeTo: listing.PeriodTo,
                                  price: listing.Price || "",
                                  serverId: listing.UserId,
                                  serverEmail: listing.Email,
                                });
                                setShowDeal(true);
                              }}
                            >
                              Select Petsitter
                            </button>
                          )}
                          {role === "petsitter" && (
                            <div>
                              {listing.Username === username ? (
                                <button
                                  className="btn btn-danger w-100"
                                  onClick={() =>
                                    handleDeleteListing(listing.Id)
                                  }
                                >
                                  Delete Listing
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary w-100"
                                  onClick={() => {
                                    setDealForm({
                                      ...dealForm,
                                      timeFrom: listing.PeriodFrom,
                                      timeTo: listing.PeriodTo,
                                      price: listing.Price || "",
                                      serverId: listing.UserId,
                                      serverEmail: listing.Email,
                                    });
                                    setShowDeal(true);
                                  }}
                                >
                                  Select Petsitter
                                </button>
                              )}
                            </div>
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

      {/* {Create Deal Modal} */}
      {showDeal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="p-3 rounded shadow bg-white"
            style={{ maxWidth: "600px", width: "100%", position: "relative" }}
          >
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              aria-label="Close"
              onClick={() => setShowDeal(false)}
            ></button>
            <h2 className="text-center">Deal Details</h2>
            <form className="row g-3" onSubmit={handleDealSubmit}>
              <div className="col-md-6">
                <label htmlFor="timeFrom" className="form-label mb-0">
                  Time From
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="timeFrom"
                  name="timeFrom"
                  value={dealForm.timeFrom.slice(0, 10)}
                  min={dealForm.timeFrom.slice(0, 10)}
                  max={dealForm.timeTo.slice(0, 10)}
                  onChange={(e) =>
                    setDealForm({ ...dealForm, timeFrom: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="timeTo" className="form-label mb-0">
                  Time To
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="timeTo"
                  name="timeTo"
                  value={dealForm.timeTo.slice(0, 10)}
                  min={dealForm.timeFrom.slice(0, 10)}
                  max={dealForm.timeTo.slice(0, 10)}
                  onChange={(e) =>
                    setDealForm({ ...dealForm, timeTo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="price" className="form-label mb-0">
                  Price per day (€)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={dealForm.price}
                  onChange={(e) =>
                    setDealForm({ ...dealForm, price: e.target.value })
                  }
                  min="0"
                  required
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="totalPrice" className="form-label mb-0">
                  Total price (€)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="totalPrice"
                  name="totalPrice"
                  value={
                    dealForm.price *
                    ((new Date(dealForm.timeTo) - new Date(dealForm.timeFrom)) /
                      (1000 * 60 * 60 * 24))
                  } //i think the difference should be parsed to integer
                  onChange={(e) =>
                    setDealForm({ ...dealForm, price: e.target.value })
                  }
                  min="0"
                  required
                  readOnly
                />
              </div>

              <div className="col-12">
                <label htmlFor="description" className="form-label mb-0">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={dealForm.description}
                  onChange={(e) =>
                    setDealForm({ ...dealForm, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="pet" className="form-label mb-0">
                  Pet
                </label>
                <select
                  className="form-select"
                  id="pet"
                  name="pet"
                  value={dealForm.pet}
                  onChange={(e) =>
                    setDealForm({ ...dealForm, pet: e.target.value })
                  }
                  required
                >
                  <option value="">Select Pet</option>
                  {userPets.map((pet) => (
                    <option key={pet.Id} value={pet.Name}>
                      {pet.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="food" className="form-label mb-0">
                  Food
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="food"
                  name="food"
                  value={dealForm.food}
                  onChange={(e) =>
                    setDealForm({ ...dealForm, food: e.target.value })
                  }
                  required
                />
              </div>
              {dealError && (
                <div className="col-12">
                  <div className="alert alert-danger py-2">{dealError}</div>
                </div>
              )}
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-secondary mt-4">
                  Send Deal Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
