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

  useEffect(()=>{
    setTimeout(() => {
        setError("")
    }, 1500);
  },[error])

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
    <div>
      <h2>Student Attendance</h2>

      {/* Filters */}
      <div>
        <input
          type="number"
          placeholder="Day"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min="1"
          max="31"
        />
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button onClick={fetchAttendance}>Filter</button>
      </div>

      {/* Attendance Table */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {attendance.length > 0 ? (
        <table border="1" cellPadding="10" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Student Name</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td>{record.date}</td>
                <td>{record.time}</td>
                <td>{record.Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading .....</p>
      )}

      {/* Back Button */}
      <button onClick={() => navigate("/master-dashboard")} style={{ marginTop: "10px" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default StudentAttendance;
