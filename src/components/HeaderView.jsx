import { Link } from "react-router-dom";

export default function HeaderView() {
  return (
    <>
      {/* <nav className="navbar bg-body-tertiary" style="margin-right: auto"> */}
      <nav className="navbar bg-body-secondary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            {/* <img src="../Frontend/Images/logo.png" alt="Logo" className="d-inline-block align-text-bottom" /> */}
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
            <li className="nav-item">
              <Link className="btn btn-secondary" to="/signin">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}