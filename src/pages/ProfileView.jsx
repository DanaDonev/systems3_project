import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function ProfileView() {
  const { token } = useAuth();
  // if (!token) {
  //   alert("You must be logged in to view your profile.");
  //   window.location.href = "/signin"; // Redirect to sign-in page
  //   return null; // Prevent rendering the component
  // }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      console.log("Fetching profile with token:", token);
      const res = await axios.get("http://88.200.63.148:5006/users/me", {
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("ProfileView mounted, token:", token);
    fetchProfile();
  }, [token]);

  if (loading) return <div className="container my-5">Loading...</div>;
  //if (!user) return <div className="container my-5">User not found.</div>;
  console.log("User data:", user);

  return (
    <section className="container my-5" style={{ maxWidth: "600px" }}>
      <div className="p-4 rounded shadow">
        <h2 className="mb-4 text-center">Profile</h2>
        <ul className="list-group mb-3">
          <li className="list-group-item"><strong>Name:</strong> {user.Name}</li>
          <li className="list-group-item"><strong>Surname:</strong> {user.Surname}</li>
          <li className="list-group-item"><strong>Username:</strong> {user.Username}</li>
          <li className="list-group-item"><strong>Email:</strong> {user.Email}</li>
          <li className="list-group-item"><strong>Phone:</strong> {user.PhoneNo}</li>
          <li className="list-group-item"><strong>Date of Birth:</strong> {user.DOB}</li>
          <li className="list-group-item"><strong>Address:</strong> {user.Address}</li>
          <li className="list-group-item"><strong>City:</strong> {user.City}</li>
          <li className="list-group-item"><strong>Role:</strong> {user.Role}</li>
          {/* <li className="list-group-item">
            <strong>Veterinarian:</strong> {user.isVeterinarian ? "Yes" : "No"}
          </li>
          {user.isVeterinarian && user.vetProof && (
            <li className="list-group-item">
              <strong>Veterinarian Proof:</strong><br />
              <a href={`http://88.200.63.148:5006/${user.vetProof}`} target="_blank" rel="noopener noreferrer">
                View Proof
              </a>
            </li>
          )} */}
        </ul>

        
        {/* Pets Section */}
        <h4 className="mt-4 mb-2">My Pets</h4>
        {user.pets && user.pets.length > 0 ? (
          <ul className="list-group">
            {user.pets.map((pet) => (
              // if there is no pet, do not render the list item
                <li key={pet.Id} className="list-group-item">
                  <strong>{pet.Name}</strong> ({pet.Type}, {pet.Breed})<br />
                  Age: {pet.Age}<br />
                  {pet.Description && <span>Description: {pet.Description}</span>}
                </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No pets registered.</p>
        )}
      </div>
    </section>
  );
}