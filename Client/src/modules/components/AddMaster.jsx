import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './AddForm.css'; 

const AddMaster = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    beltColor: "",
    beltDegree: "",
    assignedDojoId: "",
  });

  const [dojos, setDojos] = useState([]); // Store fetched dojo data
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(()=>{
    setTimeout(() => {
      setMessage("")
    }, 1500);
  },[message])


  useEffect(() => {
    // Fetch available dojos from the backend
    const fetchDojos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/assignDojo`, {
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
      } catch (err) {
        setMessage("Error fetching dojos.");
        console.error(err);
      }
    };

    fetchDojos();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("number", formData.number);
    formDataToSend.append("belt[color]", formData.beltColor);
    formDataToSend.append("belt[degree]", formData.beltDegree);
    formDataToSend.append("assignedDojoId", formData.assignedDojoId);
    if (image) {
      formDataToSend.append("storeImage", image);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/addMaster`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Master added successfully!");
        setFormData({
          name: "",
          email: "",
          number: "",
          beltColor: "",
          beltDegree: "",
          assignedDojoId: "",
        });
        setImage(null);
      } else {
        setMessage(data.message || "Failed to add master.");
      }
    } catch (err) {
      setMessage("Error adding master.");
      console.error(err);
    }
  };

  // return (
  //   <div>
  //     <h2>Add Master</h2>
  //     {message && <p style={{ color: "red" }}>{message}</p>}
  //     <form onSubmit={handleSubmit} encType="multipart/form-data">
  //       <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /> <br />
  //       <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /> <br />
  //       <input type="text" name="number" placeholder="Contact Number" value={formData.number} onChange={handleChange} required /> <br />
  //       <input type="text" name="beltColor" placeholder="Belt Color" value={formData.beltColor} onChange={handleChange} /> <br />
  //       <input type="text" name="beltDegree" placeholder="Belt Degree" value={formData.beltDegree} onChange={handleChange} /> <br />

  //       <select name="assignedDojoId" value={formData.assignedDojoId} onChange={handleChange} required>
  //         <option value="">Select a Dojo</option>
  //         {dojos.map((dojo) => (
  //           <option key={dojo._id} value={dojo._id}>
  //             {dojo.address.place}
  //           </option>
  //         ))}
  //       </select> 
  //       <br />

  //       <input type="file" onChange={handleFileChange} accept="image/*" /> <br />

  //       <button type="submit">Create Master</button>
  //     </form>
  //     <br />
  //     <button onClick={() => navigate(`/admin-dashboard`)}>Back</button>
  //   </div>
  // );

  return (
  <div className="add-form-container">
    <h2>Add Master</h2>
    {message && <p>{message}</p>}
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="text" name="number" placeholder="Contact Number" value={formData.number} onChange={handleChange} required />
      <input type="text" name="beltColor" placeholder="Belt Color" value={formData.beltColor} onChange={handleChange} />
      <input type="text" name="beltDegree" placeholder="Belt Degree" value={formData.beltDegree} onChange={handleChange} />
      
      <select name="assignedDojoId" value={formData.assignedDojoId} onChange={handleChange} required>
        <option value="">Select a Dojo</option>
        {dojos.map((dojo) => (
          <option key={dojo._id} value={dojo._id}>
            {dojo.address.place}
          </option>
        ))}
      </select>

      <input type="file" onChange={handleFileChange} accept="image/*" />

      <button type="submit">Create Master</button>
    </form>
    <br />
    <button onClick={() => navigate(`/admin-dashboard`)}>Back</button>
  </div>
);
};

export default AddMaster;
