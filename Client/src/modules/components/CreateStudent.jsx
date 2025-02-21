



import { useState } from "react";
import { useNavigate } from "react-router-dom";


const CreateStudent = () => {
    const [studentData, setStudentData] = useState({
        Name: "",
        dateOfBirth: "",
        gender: "",
        parentName: "",
        phone: "",
        email: "",
        address: "",
        height: "",
        weight: "",
        currentBelt: "White",
        beltHistory: [],
        achievements: [],
        image: null,
    });

    const token = localStorage.getItem("authToken");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setStudentData((prev) => ({ ...prev, image: file }));
    };
    

    const addBeltHistory = () => {
        setStudentData((prev) => ({
            ...prev,
            beltHistory: [
                ...prev.beltHistory,
                { belt: "", dateAwarded: "" }
            ]
        }));
    };

    const handleBeltHistoryChange = (index, field, value) => {
        const updatedBeltHistory = [...studentData.beltHistory];
        updatedBeltHistory[index][field] = value;
        setStudentData((prev) => ({ ...prev, beltHistory: updatedBeltHistory }));
    };

    const addAchievement = () => {
        setStudentData((prev) => ({
            ...prev,
            achievements: [
                ...prev.achievements,
                { title: "", date: "", description: "", category: "other" }
            ]
        }));
    };

    const handleAchievementChange = (index, field, value) => {
        const updatedAchievements = [...studentData.achievements];
        updatedAchievements[index][field] = value;
        setStudentData((prev) => ({ ...prev, achievements: updatedAchievements }));
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Name", studentData.Name);
        formData.append("dateOfBirth", studentData.dateOfBirth);
        formData.append("gender", studentData.gender);
        formData.append("contact[parentName]", studentData.parentName);
        formData.append("contact[phone]", studentData.phone);
        formData.append("contact[email]", studentData.email);
        formData.append("contact[address]", studentData.address);
        formData.append("physicalInfo[height]", studentData.height);
        formData.append("physicalInfo[weight]", studentData.weight);
        formData.append("beltInfo[currentBelt]", studentData.currentBelt);

        studentData.beltHistory.forEach((belt, index) => {
            formData.append(`beltInfo[beltHistory][${index}][belt]`, belt.belt);
            formData.append(`beltInfo[beltHistory][${index}][dateAwarded]`, belt.dateAwarded);
        });

        studentData.achievements.forEach((achievement, index) => {
            formData.append(`achievements[${index}][title]`, achievement.title);
            formData.append(`achievements[${index}][date]`, achievement.date);
            formData.append(`achievements[${index}][description]`, achievement.description);
            formData.append(`achievements[${index}][category]`, achievement.category);
        });

        if (studentData.image) {
            formData.append("storeImage", studentData.image);
        }

        

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/master/addStudent`, {
                method: "POST",
                body: formData,
                credentials: "include", 
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add student");
            }

            alert("Student added successfully!");
        } catch (error) {
            console.error("Error:", error.message);
            alert(error.message);
        }
    };

    

    return (
        <div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="Name" placeholder="Name" onChange={handleChange} required /> <br />
            <input type="date" name="dateOfBirth" onChange={handleChange} required /><br />
            <select name="gender" onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select> <br />
            <input type="text" name="parentName" placeholder="Parent Name" onChange={handleChange} required /> <br />
            <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required /><br />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} /><br />
            <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} required /><br />
            <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} required /><br />
            <input type="file" name="storeImage" accept="image/*" onChange={handleFileChange} /><br /><br />

            <label>Current Belt:</label> 
            <select name="currentBelt" onChange={handleChange}>
                <option value="White">White</option>
                <option value="Yellow">Yellow</option>
                <option value="Orange">Orange</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Brown">Brown</option>
                <option value="Black">Black</option>
            </select> 
            <h5>Belt History</h5>
            {studentData.beltHistory.map((belt, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Belt"
                        value={belt.belt}
                        onChange={(e) => handleBeltHistoryChange(index, "belt", e.target.value)}
                    />
                    <input
                        type="date"
                        value={belt.dateAwarded}
                        onChange={(e) => handleBeltHistoryChange(index, "dateAwarded", e.target.value)}
                    />
                </div>
            ))}
            <button type="button" onClick={addBeltHistory}>+ Add Belt</button>

            <h4>Achievements</h4>
            {studentData.achievements.map((achievement, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={achievement.title}
                        onChange={(e) => handleAchievementChange(index, "title", e.target.value)}
                    />
                    <input
                        type="date"
                        value={achievement.date}
                        onChange={(e) => handleAchievementChange(index, "date", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={achievement.description}
                        onChange={(e) => handleAchievementChange(index, "description", e.target.value)}
                    />
                    <select
                        value={achievement.category}
                        onChange={(e) => handleAchievementChange(index, "category", e.target.value)}
                    >
                        <option value="tournament">Tournament</option>
                        <option value="belt-test">Belt Test</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            ))}
            <button type="button" onClick={addAchievement}>+ Add Achievement</button><br />
            <br />

            <button type="submit">Add Student</button><br />
        </form>

        <button onClick={() => navigate(`/master-dashboard`)}>Back</button>

        </div>
    );
};

export default CreateStudent;
