import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../AuthContext';
import data from "../data/registerFields.json";

const API_URL = process.env.REACT_APP_API_URL;

export default function ProfileView() {
  const {token} = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState({
    profile: false,
    pets: false,
  });

  const [profileForm, setProfileForm] = useState({
    Name: '',
    Surname: '',
    Username: '',
    Email: '',
    PhoneNo: '',
    DOB: '',
    Address: '',
    City: '',
    Role: '',
  });

  const [petsForm, setPetsForm] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile with token:', token);
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
      setProfileForm({
        Name: res.data.Name || '',
        Surname: res.data.Surname || '',
        Username: res.data.Username || '',
        Email: res.data.Email || '',
        PhoneNo: res.data.PhoneNo || '',
        DOB: res.data.DOB.split('T')[0] || '',
        Address: res.data.Address || '',
        City: res.data.City || '',
        Role: res.data.Role || '',
      });
      setReviews(res.data.reviews || []);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ProfileView mounted, token:', token);
    fetchProfile();
  }, [token]);

  if (loading) return <div className="container my-5">Loading...</div>;
  if (!user) return <div className="container my-5">User not found.</div>;
  console.log('User data:', user);

  const handleProfileChange = e => {
    setProfileForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  

  const handleProfileSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/me`, profileForm, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      setEditMode(prev => ({...prev, profile: false}));
      fetchProfile();
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const handlePetChange = (index, e) => {
    const {name, value} = e.target;
    setPetsForm(prev => prev.map((pet, i) => (i === index ? {...pet, [name]: value} : pet)));
  };

  const handlePetsSave = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/me/pets`, petsForm, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });
      setEditMode(prev => ({...prev, pets: false}));
      fetchProfile();
    } catch (err) {
      alert('Failed to update pets.');
    }
  };

  const handlePetsCancel = () => {
    setPetsForm(user.pets ? user.pets.map(pet => ({...pet})) : []);
    setEditMode(prev => ({...prev, pets: false}));
  };

  return (
    <section className="container my-5" style={{maxWidth: '600px'}}>
      <div className="p-4 rounded shadow">
        {/* Profile Section */}
        <details>
          <summary
            className="mb-2 fw-bold d-flex align-items-center"
            style={{cursor: 'pointer'}}
            title="Click to expand/collapse"
          >
        
            <i className="bi bi-chevron-right me-2" style={{fontSize: '1.1em'}}></i>
            <span className="flex-grow-1">User Info</span>
            <button
              type="button"
              className="btn btn-link p-0 ms-2"
              title="Edit User Info"
              onClick={e => {
                e.preventDefault();
                setEditMode(prev => ({...prev, profile: !prev.profile}));
              }}
              style={{color: '#0d6efd'}}
            >
              <i className="bi bi-pencil"></i>
            </button>
          </summary>
        
          {!editMode.profile ? (
            <ul className="list-group mb-3">

              <li className="list-group-item">
                <strong>Name:</strong> {user.Name}
              </li>
              <li className="list-group-item">
                <strong>Surname:</strong> {user.Surname}
              </li>
              <li className="list-group-item">
                <strong>Username:</strong> {user.Username}
              </li>
              <li className="list-group-item">
                <strong>Email:</strong> {user.Email}
              </li>
              <li className="list-group-item">
                <strong>Phone:</strong> {user.PhoneNo}
              </li>
              <li className="list-group-item">
                <strong>Date of Birth:</strong> {user.DOB.split('T')[0]}
              </li>
              <li className="list-group-item">
                <strong>Address:</strong> {user.Address}
              </li>
              <li className="list-group-item">
                <strong>City:</strong> {user.City}
              </li>
              <li className="list-group-item">
                <strong>Role:</strong> {user.Role}
              </li>
            </ul>
          ) : (
            <form onSubmit={handleProfileSave} className="mb-3">
              <div className="mb-2">
                <input
                  className="form-control mb-2"
                  name="Name"
                  value={profileForm.Name}
                  placeholder="Name"
                  disabled
                />
                <input
                  className="form-control mb-2"
                  name="Surname"
                  value={profileForm.Surname}
                  placeholder="Surname"
                  disabled
                />
                <input
                  className="form-control mb-2"
                  name="Username"
                  value={profileForm.Username}
                  onChange={handleProfileChange}
                  placeholder="Username"
                />
                <input
                  className="form-control mb-2"
                  name="Email"
                  value={profileForm.Email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                />
                <input
                  className="form-control mb-2"
                  name="PhoneNo"
                  value={profileForm.PhoneNo}
                  onChange={handleProfileChange}
                  placeholder="Phone"
                />
                <input
                  className="form-control mb-2"
                  name="DOB"
                  value={profileForm.DOB}
                  placeholder="Date of Birth"
                  disabled
                />
                <input
                  className="form-control mb-2"
                  name="Address"
                  value={profileForm.Address}
                  onChange={handleProfileChange}
                  placeholder="Address"
                />
                <input
                  className="form-control mb-2"
                  name="City"
                  value={profileForm.City}
                  onChange={handleProfileChange}
                  placeholder="City"
                />
                <input
                  className="form-control mb-2"
                  name="Role"
                  value={profileForm.Role}
                  placeholder="Role"
                  disabled
                />
              </div>
              <button className="btn btn-primary btn-sm me-2" type="submit">
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={() => setEditMode(prev => ({...prev, profile: false}))}
              >
                Cancel
              </button>
            </form>
          )}
        </details>

        {/* Pets Section */}
        {user.Role === 'petowner' && (
          <details open>
            <summary
              className="mb-2 fw-bold d-flex align-items-center"
              style={{cursor: 'pointer'}}
              title="Click to expand/collapse"
            >
              <i className="bi bi-chevron-right me-2" style={{fontSize: '1.1em'}}></i>
              <span className="flex-grow-1">My Pets</span>
              <button
                type="button"
                className="btn btn-link p-0 ms-2"
                title="Edit Pets"
                onClick={e => {
                  e.preventDefault();
                  setEditMode(prev => ({...prev, pets: !prev.pets}));
                  setPetsForm(user.pets ? user.pets.map(pet => ({...pet})) : []);
                }}
                style={{color: '#0d6efd'}}
              >
                <i className="bi bi-pencil"></i>
              </button>
            </summary>
            {!editMode.pets ? (
              user.pets && user.pets.length > 0 ? (
                <ul className="list-group mb-3">
                  {user.pets.map(pet => (
                    <li key={pet.Id} className="list-group-item">
                      <strong>{pet.Name}</strong> ({pet.Type}, {pet.Breed})<br />
                      Date of Birth: {pet.DOB.split('T')[0]}
                      <br />
                      {pet.Description && <span>Description: {pet.Description}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-3">No pets registered.</p>
              )
            ) : (
              <form onSubmit={handlePetsSave} className="mb-3">
                {petsForm.length > 0 ? (
                  petsForm.map((pet, idx) => (
                    <div key={pet.Id} className="border rounded p-2 mb-2">
                      <input
                        className="form-control mb-1"
                        name="Name"
                        value={pet.Name}
                        onChange={e => handlePetChange(idx, e)}
                        placeholder="Name"
                      />
                      <input
                        className="form-control mb-1"
                        name="Type"
                        value={pet.Type}
                        onChange={e => handlePetChange(idx, e)}
                        placeholder="Type"
                      />
                      <input
                        className="form-control mb-1"
                        name="Breed"
                        value={pet.Breed}
                        onChange={e => handlePetChange(idx, e)}
                        placeholder="Breed"
                      />
                      <input
                        className="form-control mb-1"
                        name="DOB"
                        value={pet.DOB}
                        onChange={e => handlePetChange(idx, e)}
                        placeholder="Date of Birth"
                      />
                      <input
                        className="form-control mb-1"
                        name="Description"
                        value={pet.Description || ''}
                        onChange={e => handlePetChange(idx, e)}
                        placeholder="Description"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-muted mb-3">No pets registered.</p>
                )}
                <button className="btn btn-primary btn-sm me-2" type="submit">
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" type="button" onClick={handlePetsCancel}>
                  Cancel
                </button>
              </form>
            )}
          </details>
        )}

        {user.Role === 'petsitter' && (
          <details>
            <summary
              className="mb-2 fw-bold d-flex align-items-center"
              style={{cursor: 'pointer'}}
              title="Click to expand/collapse"
            >
              <i className="bi bi-chevron-right me-2" style={{fontSize: '1.1em'}}></i>
              <span className="flex-grow-1">Reviews</span>
            </summary>
            <div className="mb-3" style={{maxHeight: '30vw', overflowY: 'auto'}}>
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="border-bottom py-2">
                    <p className="mb-1">{review.Description}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <small className="text-muted">Rating: {review.Rate.toString()}</small>
                      <small className="text-muted">Date: {review.Date.split('T')[0]}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-3">No reviews available.</p>
              )}
              <strong className="d-block mb-3">
                Average Rate:{' '}
                {reviews.length > 0
                  ? (reviews.reduce((acc, review) => acc + review.Rate, 0) / reviews.length).toFixed(1)
                  : 0}⭐
              </strong>
            </div>
          </details>
        )}

        {/* Notifications Section */}
        <details open>
          <summary
            className="mb-2 fw-bold d-flex align-items-center"
            style={{cursor: 'pointer'}}
            title="Click to expand/collapse"
          >
            <i className="bi bi-chevron-right me-2" style={{fontSize: '1.1em'}}></i>
            <span className="flex-grow-1">Notifications</span>
          </summary>
          <div className="mb-3">
            <p className="text-muted">Please check your email for all notifications. Check your spam as well.</p>
          </div>
        </details>

        {/* Delete Profile Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-secondary" // btn-danger"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
                try {
                  await axios.delete(`${API_URL}/users/me`, {
                    headers: {
                      'Content-Type': 'application/json',
                      authorization: `Bearer ${token}`,
                    },
                  });
                  window.location.href = '/';
                  alert('Profile deleted successfully.');
                } catch (err) {
                  //print the error message
                  //res.status(400).json({ message: "User has active deals and cannot be deleted" });

                  alert('Failed to delete profile:', err.message || 'An error occurred');
                  //alert("Failed to delete profile:", err.response?.data?.message || err.message);
                }
              }
            }}
          >
            Delete Profile
          </button>
        </div>
      </div>
    </section>
  );
}
