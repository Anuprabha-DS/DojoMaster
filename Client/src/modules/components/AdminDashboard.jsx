import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [dojos, setDojos] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken"); // Get auth token

  // Fetch dojos when component mounts
  useEffect(() => {
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
          setError(data.message || "Failed to fetch dojos");
        }
      } catch (err) {
        setError("Error fetching dojos");
        console.error(err);
      }
    };

    fetchDojos();
  }, []);

  // Handle delete dojo
  const handleDelete = async (dojoId) => {
    if (!window.confirm("Are you sure you want to delete this dojo?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deleteDojo/${dojoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setDojos(dojos.filter((dojo) => dojo._id !== dojoId)); // Remove dojo from state
        alert("Dojo deleted successfully.");
      } else {
        setError(data.message || "Failed to delete dojo");
      }
    } catch (err) {
      setError("Error deleting dojo");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <div>
        <h2>Admin Dashboard</h2>

        {/* Navigation Buttons */}
        <button onClick={() => navigate("/add-dojo")}>Add Dojo</button>
        <button onClick={() => navigate("/masters")}>View Masters</button>
        <button onClick={() => navigate("/add-master")}>Add Master</button>
        <button onClick={() => navigate("/students")}>View Students</button>
        <button onClick={() => navigate("/send-notification")}>Send Notification</button>


        <h3>Your Dojos</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {dojos.length > 0 ? (
          <ul>
            {dojos.map((dojo) => (
              <li key={dojo._id}>
                <h4>{dojo.name}</h4>
                <p><strong>Name:</strong> {dojo.name}</p>
                <p><strong>Place:</strong> {dojo.address.place}</p>
                <p><strong>Number:</strong> {dojo.contact.phone}</p>
                <p><strong>Email:</strong> {dojo.contact.email}</p>

                <button onClick={() => navigate(`/dojo-details/${dojo._id}`)}>More About Dojo</button>
                <button onClick={() => handleDelete(dojo._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Delete Dojo</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No dojos available.</p>
        )}
      </div>

      <button onClick={handleLogout}>Logout</button>
      <button type="button" onClick={() => navigate('/change-password')}>Change Password</button>
    </div>
  );
};

export default AdminDashboard;
