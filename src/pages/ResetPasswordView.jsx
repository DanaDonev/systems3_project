import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPasswordView() {
  const { token } = useParams();
  //console.log("Reset token:", token);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!password || !confirm) {
      setMessage("Please fill in both fields.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/users/resetpassword`, {
        token,
        password,
      });
      setSuccess(true);
      setMessage(
        res.data.message || "Password reset successful! You can now sign in."
      );
      setTimeout(() => navigate("/signin"), 3000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to reset password. The link may have expired."
      );
    }
  };

  return (
    <section className="container my-5">
      <div
        className="p-3 rounded shadow"
        style={{ maxWidth: 400, margin: "0 auto" }}
      >
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {message && (
            <div
              className={`alert ${success ? "alert-success" : "alert-danger"}`}
            >
              {message}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-secondary w-100"
            disabled={success}
          >
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
}
