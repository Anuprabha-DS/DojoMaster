import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MasterStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  // Toggle states for forms
  const [showBeltForm, setShowBeltForm] = useState(false);
  const [showAchievementForm, setShowAchievementForm] = useState(false);

  // Form states
  const [newBelt, setNewBelt] = useState("");
  const [beltDate, setBeltDate] = useState("");

  const [achievementTitle, setAchievementTitle] = useState("");
  const [achievementDate, setAchievementDate] = useState("");
  const [achievementDescription, setAchievementDescription] = useState("");
  const [achievementCategory, setAchievementCategory] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/viewStudent/${id}`, {
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
          setError(data.message || "Failed to fetch student details.");
        }
      } catch (err) {
        setError("Error fetching student details.");
        console.error(err);
      }
    };

    fetchStudent();
  }, [id, token]);

  // Update Belt
  const handleUpdateBelt = async () => {
    if (!newBelt || !beltDate) {
      alert("Please enter both belt color and award date.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/updateBelt/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentBelt: newBelt,
          dateAwarded: beltDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Belt updated successfully!");
        setStudent(data.data);
        setShowBeltForm(false);
      } else {
        alert(data.message || "Failed to update belt.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating belt.");
    }
  };

  // Add Achievement
  const handleAddAchievement = async () => {
    if (!achievementTitle || !achievementDate || !achievementDescription || !achievementCategory) {
      alert("Please fill in all achievement details.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/Achievements/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: achievementTitle,
          date: achievementDate,
          description: achievementDescription,
          category: achievementCategory,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Achievement added successfully!");
        setStudent(data.data);
        setShowAchievementForm(false);
      } else {
        alert(data.message || "Failed to add achievement.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding achievement.");
    }
  };

  return (
    <div>
      <h2>Student Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {student ? (
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
          <p><strong>Name:</strong> {student.Name}</p>
          <p><strong>Age:</strong> {student.age} years</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Height:</strong> {student.physicalInfo.height} cm</p>
          <p><strong>Weight:</strong> {student.physicalInfo.weight} kg</p>

          <h3>Contact Information</h3>
          <p><strong>Parent Name:</strong> {student.contact?.parentName}</p>
          <p><strong>Phone Number:</strong> {student.contact?.phone}</p>
          <p><strong>Email:</strong> {student.contact?.email}</p>
          <p><strong>Address:</strong> {student.contact?.address}</p>

          <h3>Belt Information</h3>
          <p><strong>Current Belt:</strong> {student.beltInfo?.currentBelt}</p>
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


          <button onClick={() => setShowBeltForm(!showBeltForm)}>
            {showBeltForm ? "Cancel" : "Update Belt"}
          </button>
          <button onClick={() => setShowAchievementForm(!showAchievementForm)}>
            {showAchievementForm ? "Cancel" : "Add Achievement"}
          </button>

          {showBeltForm && (
            <div>
              <h4>Update Belt Details</h4>
              <input 
                type="text" 
                placeholder="Enter new belt color" 
                value={newBelt} 
                onChange={(e) => setNewBelt(e.target.value)} 
              />
              <input 
                type="date" 
                value={beltDate} 
                onChange={(e) => setBeltDate(e.target.value)} 
              />
              <button onClick={handleUpdateBelt}>Submit</button>
            </div>
          )}

          {showAchievementForm && (
            <div>
              <h4>Add Achievement</h4>
              <input 
                type="text" 
                placeholder="Title" 
                value={achievementTitle} 
                onChange={(e) => setAchievementTitle(e.target.value)} 
              />
              <input 
                type="date" 
                value={achievementDate} 
                onChange={(e) => setAchievementDate(e.target.value)} 
              />
              <select 
                value={achievementCategory} 
                onChange={(e) => setAchievementCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="tournament">Tournament</option>
                <option value="belt-test">Belt Test</option>
                <option value="other">Other</option>
              </select>
              
              <textarea 
                placeholder="Description" 
                value={achievementDescription} 
                onChange={(e) => setAchievementDescription(e.target.value)} 
              />
              <button onClick={handleAddAchievement}>Submit</button>
            </div>
          )}

          <button onClick={() => navigate(`/master-dashboard`)}>Back</button>
        </div>
      ) : (
        <p>Loading student details...</p>
      )}
    </div>
  );
};

export default MasterStudent;
