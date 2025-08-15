import { Link } from "react-router-dom";

export default function FooterView() {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/howitworks", label: "How It Works" },
    { to: "/register", label: "Create an account" },
    { to: "/createlisting", label: "Create a listing" },
  ];
  const connectLinks = [
    { to: "mailto:info.petsitter.si@gmail.com", label: "envelope" },
    { to: "#", label: "facebook" },
    { to: "#", label: "instagram" },
    { to: "#", label: "youtube" },
    { to: "#", label: "twitter" },
  ];

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
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-black text-decoration-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-4 mb-3">
              <h5>Connect with Us</h5>
              <div className="d-flex align-items-center gap-3">
                {connectLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-black"
                  >
                   <i className={`bi bi-${link.label.toLowerCase().replace(" ", "-")}`}></i>
                  </Link>
                ))}
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
