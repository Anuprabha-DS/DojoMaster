import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AddForm.css'; 

const SendNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [forRoles, setForRoles] = useState([]);
  const [dojoId, setDojoId] = useState("");
  const [dojos, setDojos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 2000);
  }, [error, success]);

  useEffect(() => {
    // Fetch dojos for selection
    const fetchDojos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewDojo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDojos(data.data);
        } else {
          setError(data.message || "Failed to fetch dojos.");
        }
      } catch (err) {
        setError("Error fetching dojos.");
        console.error(err);
      }
    };

    fetchDojos();
  }, []);

  const handleRoleChange = (role) => {
    setForRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role) // Remove role if already selected
        : [...prevRoles, role] // Add role if not selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !message || forRoles.length === 0) {
      return setError("Please fill in all required fields.");
    }

    const payload = { title, message, type, forRoles, dojoId: dojoId || null };

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/addNotify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Notification sent successfully!");
        setTitle("");
        setMessage("");
        setType("");
        setForRoles([]);
        setDojoId("");
      } else {
        setError(data.message || "Failed to send notification.");
      }
    } catch (error) {
      setError("Error sending notification.");
      console.error(error);
    }
  };

  return (
  <div className="add-form-container">
  <h2>Send Notification</h2>
  {error && <p style={{ color: "red" }}>{error}</p>}
  {success && <p style={{ color: "green" }}>{success}</p>}
  
  <form onSubmit={handleSubmit}>
    <div className="label-input">
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
    </div>

    <div className="label-input">
      <label>Message:</label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
    </div>

    <div className="label-input">
      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)} required>
        <option value="">Select one</option>
        <option value="belt-test">Belt Test</option>
        <option value="tournament">Tournament</option>
        <option value="general">General</option>
        <option value="fees">Fees</option>
      </select>
    </div>

    <div className="label-input">
      <label>For Roles:</label>
      <label><input type="checkbox" value="Master" checked={forRoles.includes("Master")} onChange={() => handleRoleChange("Master")} /> Master</label>
      <label><input type="checkbox" value="Parent" checked={forRoles.includes("Parent")} onChange={() => handleRoleChange("Parent")} /> Parent</label>
    </div>

    <div className="label-input">
      <label>Dojo (Optional):</label>
      <select value={dojoId} onChange={(e) => setDojoId(e.target.value)}>
        <option value="">System-wide</option>
        {dojos.map((dojo) => (
          <option key={dojo._id} value={dojo._id}>
            {dojo.name} - {dojo.address.place}
          </option>
        ))}
      </select>
    </div>

    <button className="button" type="submit">Send Notification</button>
  </form>

  <button className="button grey" onClick={() => navigate("/admin-dashboard")}>Back</button>
</div>
  );
};

export default SendNotification;
