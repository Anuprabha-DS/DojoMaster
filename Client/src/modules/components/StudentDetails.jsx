import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './AdminDashboard.css';

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewStudent/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setStudent(data.data);
        } else {
          setMessage(data.message || "Student not found.");
        }
      } catch (err) {
        setMessage("Error fetching student.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (message) return <p style={{ color: "red" }}>{message}</p>;


return (
  <div className="details-box">  
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h2>Student Details</h2>
      <p><strong>Name:</strong> {student.Name}</p>
      <p><strong>Age:</strong> {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}</p>
      <p><strong>Gender:</strong> {student.gender}</p>
      <p><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</p>

      <p><strong>Height:</strong> {student.physicalInfo?.height} cm</p>
      <p><strong>Weight:</strong> {student.physicalInfo?.weight} kg</p>
      <p><i> <b>Dojo Name:</b>  {student.dojoId?.name} || <b>Dojo Place: </b>{student.dojoId?.address.place} </i></p>

      <h3>Contact Information</h3>
      <p><strong>Parent Name:</strong> {student.contact?.parentName}</p>
      <p><strong>Phone Number:</strong> {student.contact?.phone}</p>
      <p><strong>Email:</strong> {student.contact?.email}</p>
      <p><strong>Address:</strong> {student.contact?.address}</p>
    
      <h3>Belt Information</h3>
      <p><strong>Current Belt:</strong> {student.beltInfo?.currentBelt}</p>
      {/* <p><strong>Belt History:</strong> 
        {student.beltInfo?.beltHistory.length > 0 
            ? student.beltInfo.beltHistory.map(belt => `${belt.belt} (Awarded: ${new Date(belt.dateAwarded).toLocaleDateString()})`).join(", ") 
            : "No history available"}
        </p> */}
      <p><strong>Belt History:</strong></p>
      <ul>
        {student.beltInfo?.beltHistory && student.beltInfo.beltHistory.length > 0 ? (
          student.beltInfo.beltHistory.map((belt) => (
            <li key={belt._id}>
              {belt.belt} (Awarded: {belt.dateAwarded ? new Date(belt.dateAwarded).toLocaleDateString() : "N/A"})
            </li>
          ))
        ) : (
          <p>No history available</p>
        )}
      </ul>

      <h3>Achievements</h3>
      {student.achievements.length > 0 ? (
        <ul>
          {student.achievements.map((achievement) => (
            <li key={achievement._id}>
              <strong>{achievement.title}</strong> <br />
              <em>Date:</em> {new Date(achievement.date).toLocaleDateString()} <br />
              <em>Category:</em> {achievement.category.replace("-", " ")} <br />
              <em>Description:</em> {achievement.description} 
            </li>
          ))}
        </ul>
        ) : (
            <p>No achievements recorded.</p>
          )}
    </div>    <button onClick={() => navigate("/master-dashboard")} style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>Back</button>

    </div>
  );
};

export default StudentDetails;
