


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      let url = `${import.meta.env.VITE_BASE_URL}/master/getAttendance`;

      const queryParams = [];
      if (date) queryParams.push(`date=${date}`);
      if (month) queryParams.push(`month=${month}`);
      if (year) queryParams.push(`year=${year}`);

      if (queryParams.length) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAttendance(data.data);
      } else {
        setAttendance([]);
        setError(data.message || "No attendance records found.");
      }
    } catch (err) {
      setError("Error fetching attendance records.");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Student Attendance</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <input
          type="number"
          placeholder="Day"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min="1"
          max="31"
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchAttendance} style={styles.button}>
          Filter
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Attendance Table */}
      {attendance.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Student Name</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td style={styles.td}>{record.date}</td>
                <td style={styles.td}>{record.time}</td>
                <td style={styles.td}>{record.Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "1rem", color: "#666" }}>Loading...</p>
      )}

      {/* Back Button */}
      <button onClick={() => navigate("/master-dashboard")} style={{ ...styles.button, marginTop: "20px" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "1.5rem",
    color: "#333",
    textAlign: "center",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
    justifyContent: "center",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "120px",
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    borderBottom: "2px solid #007bff",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#e6f0ff",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
};

export default StudentAttendance;
