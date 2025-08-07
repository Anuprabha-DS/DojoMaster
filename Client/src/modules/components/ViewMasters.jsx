
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css';

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
    <div className="container">
      <h2>Masters List</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {masters.length > 0 ? (
        <div className="flex-wrap">
          {masters.map((master) => (
            <div className="card" key={master._id}>
              <h4>{master.name}</h4>
              <p>Email: {master.email}</p>
              <p>Phone: {master.number}</p>
              <p>Assigned Dojo Name: {master.assignedDojoId.name}</p>

              <p>Belt: {master.belt?.color || 'N/A'}</p>
              {master.image ? (
                <img src={master.image} alt={master.name} />
              ) : (
                <p>No Image Available</p>
              )}
              <button className="button" onClick={() => navigate(`/admin/master/${master._id}`)}>View Details</button>
              <button className="button red" onClick={() => handleDelete(master._id)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No masters available.</p>
      )}
      <button className="button grey" onClick={() => navigate(`/admin-dashboard`)}>Back</button>
    </div>
  );
};

export default ViewMasters;


