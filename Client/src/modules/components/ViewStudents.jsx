import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewStudents`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setStudents(data.data);
        } else {
          setMessage(data.message || "Failed to fetch students.");
        }
      } catch (err) {
        setMessage("Error fetching students.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (message) return <p style={{ color: "red" }}>{message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Students List</h2>
      <button onClick={() => navigate("/filter-students")}>Filter by Dojo</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {students.map((student) => (
          <div
            key={student._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {student.image ? (
                <img src={student.image} alt={student.name} width="100" style={{ borderRadius: "5px" }} />
              ) : (
                <p>No Image Available</p>
              )}

            <h3>{student.Name}</h3>
            <p><strong>Age:</strong> {student.age}</p>
            <p><strong>Phone :</strong> {student.contact.phone}</p>
            <p><strong>Email :</strong> {student.contact.email}</p>
            <p><strong>Dojo:</strong> {student.dojoName}</p>
            <button onClick={() => navigate(`/student/${student._id}`)} style={{ marginTop: "10px" }}>
              View Details
            </button>
          </div>
        ))}
      </div>

      <br />
      <button onClick={() => navigate("/admin-dashboard")}>Back</button>
    </div>
  );
};

export default ViewStudents;
