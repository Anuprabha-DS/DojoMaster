import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // const handleMarkAttendance = async (id) => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/StudAttendance`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ studId: id }),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       alert(data.message);
  //     } else {
  //       setError(data.message || "Failed to mark attendance.");
  //     }
  //   } catch (err) {
  //     setError("Error marking attendance.");
  //     console.error(err);
  //   }
  // };

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
    <div>
      <h2>Master Dashboard</h2>

      {/* Navigation Buttons */}
      <div>
        <button onClick={() => navigate("/add-students")}>Add Students</button>
        <button onClick={() => navigate("/student-attendance")}>Student Attendance</button>
        <button onClick={() => navigate("/notifications")}>View Notifications</button>
      </div>

      {/* Student List */}
      <div>
        
        <h3>Students</h3>
        {loading && <p>Loading...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}
        {students.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
            {students.map((student) => (
              <div key={student._id} style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
                <h4>{student.Name}</h4>
                <p>Age: {student.age} years</p>
                <p>Phone: {student.contact.phone} </p>
                <p>Email: {student.contact.email} </p>
                <p>Belt: {student.beltInfo.currentBelt}</p>

                {student.image ? (
                  <img src={student.image} alt={student.Name} width="150" style={{ borderRadius: "5px" }} />
                ) : (
                  <p>No Image Available</p>
                )}
                <button onClick={() => navigate(`/MasterStudent/${student._id}`)} style={{ marginTop: "10px" }}>
                View Details
              </button>

              <button onClick={() => handleDelete(student._id)} style={{ marginTop: "10px", marginLeft: "10px", backgroundColor: "red", color: "white" }}>
                  Delete
                </button>

                {/* <button onClick={() => handleMarkAttendance(student._id)} style={{ marginLeft: "10px", backgroundColor: "green", color: "white" }}>Mark Attendance</button> */}
                <button
                  onClick={() => handleMarkAttendance(student._id)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: markedAttendance[student._id] ? "gray" : "green",
                    color: "white",
                    cursor: markedAttendance[student._id] ? "not-allowed" : "pointer",
                  }}
                  disabled={markedAttendance[student._id]}
                >
                  {markedAttendance[student._id] ? "Marked" : "Mark Attendance"}
                </button>
              </div>
            ))}
            
          </div>
        ) : (
          !loading && <p>No students found.</p>
        )}
      </div>

      {/* Account Actions */}
      <div>
        <button type="button" onClick={() => navigate("/change-password")}>
          Change Password
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default MasterDashboard;
