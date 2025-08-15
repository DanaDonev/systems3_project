import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function HeaderView() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar bg-body-secondary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="/logo.png"
              alt="Logo"
              height="35px"
              className="d-inline-block align-text-bottom"
            />
            Petsitter
          </Link>

          <ul className="nav nav-pills justify-content-end">
            <li className="nav-item">
              <Link className="nav-link text-black" to="/forum">
                Forum
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-black" to="/aboutus">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-black" to="/howitworks">
                How it works?
              </Link>
            </li>
            {isAuthenticated ? (
              <li className="nav-item">
                <Link className="nav-link text-black" to="/profile">
                  My Profile
                </Link>
              </li>
            ) : null}
            <li className="nav-item">
              {isAuthenticated ? (
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    await navigate("/");
                    logout();
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link className="btn btn-secondary" to="/signin">
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
