import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { apiRequest } from '../utils/tokenUtils';


const MasterDetails = () => {
  const { id } = useParams();
  const [master, setMaster] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchMasterDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getMaster/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMaster(data.data);
        } else {
          setError(data.message || "Failed to fetch master details.");
        }
      } catch (err) {
        setError("Error fetching master details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterDetails();
  }, [id]);

  return (
    <div>
      <h2>Master Details</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {master ? (
        <div>
          <h3>{master.name}</h3>
          <p>Email: {master.email}</p>
          <p>Phone: {master.number}</p>
          <p>Belt Color: {master.belt.color} </p>
          <p>Belt Degree: {master.belt.degree}</p>
          <p>Assigned Dojo Name: {master.assignedDojoId.name}</p>
          <p>Assigned Dojo Place: {master.assignedDojoId.address.place}</p>


          {master.image ? (
            <img src={master.image} alt={master.name} width="150" style={{ borderRadius: "5px" }} />
          ) : (
            <p>No Image Available</p>
          )}
          <button onClick={() => navigate("/masters")}>Back to Masters</button>
        </div>
      ) : (
        !loading && <p>No master details available.</p>
      )}
    </div>
  );
};

export default MasterDetails;
