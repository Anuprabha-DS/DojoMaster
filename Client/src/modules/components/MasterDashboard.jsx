import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './MasterDashboard.css';


const MasterDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [markedAttendance, setMarkedAttendance] = useState({});

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/viewStudents`, {
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
          setError(data.message || "Failed to fetch students.");
        }
      } catch (err) {
        setError("Error fetching students.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };


  const handleMarkAttendance = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/StudAttendance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studId: id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setMarkedAttendance((prev) => ({ ...prev, [id]: true }));
      } else {
        setError(data.message || "Failed to mark attendance.");
      }
    } catch (err) {
      setError("Error marking attendance.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dojo?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/deleteStud/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
         setStudents(students.filter(student => student._id !== id));
      alert("Student deleted successfully.");
      } else {
        setError(data.message || "Failed to delete Student");
      }
    } catch (err) {
      setError("Error deleting dojo");
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Master Dashboard</h2>

      <div className="top-buttons">
        <button onClick={() => navigate("/add-students")}>Add Students</button>
        <button onClick={() => navigate("/student-attendance")}>Student Attendance</button>
        <button onClick={() => navigate("/master-notifications")}>View Notifications</button>
      </div>

      {/* Student List */}
      <div>
        
        <h3>Students</h3>
        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {students.length > 0 ? (
          <div className="student-grid">
        {students.map(student => (
          <div className="student-card" key={student._id}>
  <div className="student-image">
    {student.image ? (
      <img src={student.image} alt={student.Name} />
    ) : (
      <p className="no-image">No Image Available</p>
    )}
  </div>
        <div className="student-info">
          <h4>{student.Name}</h4>
          <p><strong>Age:</strong> {student.age} years</p>
          <p><strong>Phone:</strong> {student.contact.phone}</p>
          <p><strong>Email:</strong> {student.contact.email}</p>
          <p><strong>Belt:</strong> {student.beltInfo.currentBelt}</p>

          <div className="action-buttons">
            <button className="view-btn" onClick={() => navigate(`/MasterStudent/${student._id}`)}>View Details</button>

            <button className="delete-btn" onClick={() => handleDelete(student._id)}>Delete</button>

            <button
              className="attendance-btn"
              onClick={() => handleMarkAttendance(student._id)}
              disabled={markedAttendance[student._id]}
            >
              {markedAttendance[student._id] ? "Marked" : "Mark Attendance"}
            </button>
          </div>
        </div>
      </div>

          // <div className="student-card" key={student._id}>
          //       <h4>{student.Name}</h4>
          //       <p>Age: {student.age} years</p>
          //       <p>Phone: {student.contact.phone} </p>
          //       <p>Email: {student.contact.email} </p>
          //       <p>Belt: {student.beltInfo.currentBelt}</p>

          //       {student.image ? (
          //         <img src={student.image} alt={student.Name} width="150" style={{ borderRadius: "5px" }} />
          //       ) : (
          //         <p>No Image Available</p>
          //       )}
          //     <button className="view-btn" onClick={() => navigate(`/MasterStudent/${student._id}`)} style={{ marginTop: "10px" }}>
          //       View Details
          //     </button>

          //     <button className="delete-btn" onClick={() => handleDelete(student._id)} style={{ marginTop: "10px", marginLeft: "10px", backgroundColor: "red", color: "white" }}>
          //         Delete
          //       </button>

          //       {/* <button onClick={() => handleMarkAttendance(student._id)} style={{ marginLeft: "10px", backgroundColor: "green", color: "white" }}>Mark Attendance</button> */}
          //       <button className="attendance-btn"
          //         onClick={() => handleMarkAttendance(student._id)}
          //         style={{
          //           marginLeft: "10px",
          //           backgroundColor: markedAttendance[student._id] ? "gray" : "green",
          //           color: "white",
          //           cursor: markedAttendance[student._id] ? "not-allowed" : "pointer",
          //         }}
          //         disabled={markedAttendance[student._id]}
          //       >
          //         {markedAttendance[student._id] ? "Marked" : "Mark Attendance"}
          //       </button>
          //     </div>
            ))}
            
          </div>
        ) : (
          !loading && <p className="error-message">No students found.</p>
        )}
      </div>

      {/* Account Actions */}
      <div className="footer-buttons">
        <button onClick={() => navigate("/change-password")}>Change Password</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default MasterDashboard;
