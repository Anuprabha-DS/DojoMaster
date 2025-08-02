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
    <div className="container">
  <h2>Students List</h2>
  <button className="button" onClick={() => navigate("/filter-students")}>Filter by Dojo</button>

  <div className="flex-wrap" style={{ marginTop: "20px" }}>
    {students.map((student) => (
      <div key={student._id} className="card" style={{ width: "250px" }}>
        {student.image ? (
          <img src={student.image} alt={student.name} />
        ) : (
          <p>No Image Available</p>
        )}
        <h4>{student.Name}</h4>
        <p><strong>Age:</strong> {student.age}</p>
        <p><strong>Phone:</strong> {student.contact.phone}</p>
        <p><strong>Email:</strong> {student.contact.email}</p>
        <p><strong>Dojo:</strong> {student.dojoName}</p>
        <button className="button" onClick={() => navigate(`/student/${student._id}`)}>View Details</button>
      </div>
    ))}
  </div>

  <br />
  <button className="button grey" onClick={() => navigate("/admin-dashboard")}>Back</button>
</div>
  );
};

export default ViewStudents;
