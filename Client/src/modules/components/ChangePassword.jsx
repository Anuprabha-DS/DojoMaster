import { useState } from 'react';
import { useNavigate } from "react-router-dom";
// import { apiRequest } from '../utils/tokenUtils';


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const token = localStorage.getItem('authToken'); // Get the token from localStorage


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
  
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        alert('Password successfully updated. Please log in again.');
  
        // Clear stored token (force re-login)
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
  
        // Redirect to login page
        navigate('/');
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred while updating password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  
return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isLoading}>
          {isLoading ? "Updating..." : "Change Password"}
        </button>
      </form>

      <button className="btn btn-secondary w-100" onClick={() => navigate("/")}>
        Back to Login
      </button>
    </div>
  );
};

export default ChangePassword;
