import { useState, useRef, useEffect } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export default function ForgotPassword({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${API_URL}/users/forgotpassword`, { email });
      setSent(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  useEffect(() => {
    if (show && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "500px" }}
      >
        <div className="modal-content p-3">
          <div className="d-flex align-items-center">
            <h5 className="ms-auto">Reset Password</h5>
            <button
              type="button"
              className="text-primary fw-bold fs-2 ms-auto"
              style={{ background: "none", border: "none" }}
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <hr className="my-1" />
          <div className="modal-body">
            {sent ? (
              <div className="alert alert-success">
                If an account with that email exists, a reset link has been
                sent.
              </div>
            ) : (
              <>
                <label htmlFor="forgotEmail" className="form-label">
                  Enter your email address:
                </label>
                <input
                  ref={emailInputRef}
                  type="email"
                  className="form-control"
                  id="forgotEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {error && (
                  <div className="alert alert-danger mt-2">{error}</div>
                )}
              </>
            )}
            {!sent && (
              <button
                type="button"
                onClick={handleSend}
                className="btn btn-secondary mt-4 w-100"
              >
                Send Reset Email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
