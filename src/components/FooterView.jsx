import { Link } from "react-router-dom";

export default function FooterView() {
  return (
    <>
      <nav className="pt-4 text-black bg-body-secondary">
        <div className="container text-center text-md-start">
          <div className="row">
            <div className="col-md-4 mb-3">
              <h5>PetSitter</h5>
              <p>
                Your trusted platform to find the perfect sitter for your furry
                friend.
              </p>
            </div>

            <div className="col-md-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/" className="text-black text-decoration-none">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/howitworks" className="text-black text-decoration-none">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-black text-decoration-none">
                    Create an account
                  </Link>
                </li>
                <li>
                  <Link to="/createlisting" className="text-black text-decoration-none">
                    Create a listing
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Connect with Us</h5>
              <div className="d-flex align-items-center gap-3">
                <Link to="info.petsitter.si@gmail.com" className="text-black">
                  <i className="bi bi-envelope"></i>
                </Link>
                <Link to="#" className="text-black">
                  <i className="bi bi-facebook"></i>
                </Link>
                <Link to="#" className="text-black">
                  <i className="bi bi-instagram"></i>
                </Link>
                <Link to="#" className="text-black">
                  <i className="bi bi-youtube"></i>
                </Link>
                <Link to="#" className="text-black">
                  <i className="bi bi-twitter"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center p-3 mt-3 border-top">
          © 2025 PetSitter. All rights reserved.
        </div>
      </nav>
    </>
  );
}