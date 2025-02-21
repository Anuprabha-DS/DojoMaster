import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FilterStudentsByDojo = () => {
  const [dojos, setDojos] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available dojos
    const fetchDojos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewDojo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDojos(data.data);
        } else {
          setMessage(data.message || "Failed to fetch dojos.");
        }
      } catch (error) {
        setMessage("Error fetching dojos.");
        console.error(error);
      }
    };

    fetchDojos();
  }, []);

  const handleFilter = async () => {
    if (!selectedPlace) {
      setMessage("Please select a dojo place.");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/StudentsDojoFilter?place=${encodeURIComponent(selectedPlace)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
 
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        setStudents(data.data);
      } else {
        setMessage(data.message || "No students found.");
        setStudents([]); // Clear previous results
      }
    } catch (error) {
      setMessage("Error filtering students.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
        <div>
      <h2>Filter Students by Dojo</h2>

      <label>Select Dojo Place:</label>
      <select value={selectedPlace} onChange={(e) => setSelectedPlace(e.target.value)}>
        <option value="">-- Select Place --</option>
        {dojos.map((dojo) => (
          <option key={dojo._id} value={dojo.address.place}>
            {dojo.address.place}
          </option>
        ))}
      </select>

      <button onClick={handleFilter} disabled={loading}>
        {loading ? "Filtering..." : "Filter"}
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {students.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Belt</th>
              <th>Number</th>
              <th>Dojo Place</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.Name}</td>
                <td>{student.age}</td>
                <td>{student.beltInfo.currentBelt}</td>
                <td>{student.contact.phone}</td>
                <td>{student.dojoPlace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <br />
    <button onClick={() => navigate("/students")}>Back</button>
    </div>
  );
};

export default FilterStudentsByDojo;
