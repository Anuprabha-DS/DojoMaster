
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { apiRequest } from '../utils/tokenUtils';


const ViewMasters = () => {
  const [masters, setMasters] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewMasters`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMasters(data.data);
        } else {
          setError(data.message || "Failed to fetch masters.");
        }
      } catch (err) {
        setError("Error fetching masters.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasters();
  }, []);

  const handleDelete = async (MasterId) => {
    if (!window.confirm("Are you sure you want to delete this master?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deleteMaster/${MasterId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMasters((prevMasters) => prevMasters.filter((master) => master._id !== MasterId));
        alert("Master deleted successfully.");
      } else {
        setError(data.message || "Failed to delete Master");
      }
    } catch (err) {
      setError("Error deleting Master");
      console.error(err);
    }
  }; 

  return (
    <div>
    <div>
      <h2>Masters List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {masters.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {masters.map((master) => (
            <div key={master._id} style={{ border: "1px solid #ddd", padding: "15px", width: "250px", borderRadius: "10px" }}>
              <h4>{master.name}</h4>
              <p>Email: {master.email}</p>
              <p>Phone: {master.number}</p>
              <p>Belt: {master.belt.color} </p>
              {master.image ? (
                <img src={master.image} alt={master.name} width="100" style={{ borderRadius: "5px" }} />
              ) : (
                <p>No Image Available</p>
              )}
              <button onClick={() => navigate(`/admin/master/${master._id}`)}>View Details</button>
              <button onClick={() => handleDelete(master._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Delete</button>

            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No masters available.</p>
      )}
    </div>
    <button onClick={() => navigate(`/admin-dashboard`)}>Back</button>

    </div>

  );
};

export default ViewMasters;
