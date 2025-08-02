// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [dojos, setDojos] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);


//   const token = localStorage.getItem("authToken"); // Get auth token

//   // Fetch dojos when component mounts
//   useEffect(() => {
//     const fetchDojos = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/viewDojo`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setDojos(data.data);
//         } else {
//           setError(data.message || "Failed to fetch dojos");
//         }
//       } catch (err) {
//         setError("Error fetching dojos");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDojos();
//   }, []);

//   // Handle delete dojo
//   const handleDelete = async (dojoId) => {
//     if (!window.confirm("Are you sure you want to delete this dojo?")) return;

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deleteDojo/${dojoId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setDojos(dojos.filter((dojo) => dojo._id !== dojoId)); // Remove dojo from state
//         alert("Dojo deleted successfully.");
//       } else {
//         setError(data.message || "Failed to delete dojo");
//       }
//     } catch (err) {
//       setError("Error deleting dojo");
//       console.error(err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <div>
//       <div>
//         <h2>Admin Dashboard</h2>

//         {/* Navigation Buttons */}
//         <button onClick={() => navigate("/add-dojo")}>Add Dojo</button>
//         <button onClick={() => navigate("/masters")}>View Masters</button>
//         <button onClick={() => navigate("/add-master")}>Add Master</button>
//         <button onClick={() => navigate("/students")}>View Students</button>
//         <button onClick={() => navigate("/send-notification")}>Send Notification</button>
//         <button onClick={() => navigate("/notifications")}>View Notifications</button>



//         <h3>Your Dojos</h3>
//         {loading && <p>Loading...</p>}

//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {dojos.length > 0 ? (
//           <ul>
//             {dojos.map((dojo) => (
//               <li key={dojo._id}>
//                 <h4>{dojo.name}</h4>
//                 <p><strong>Name:</strong> {dojo.name}</p>
//                 <p><strong>Place:</strong> {dojo.address.place}</p>
//                 <p><strong>Number:</strong> {dojo.contact.phone}</p>
//                 <p><strong>Email:</strong> {dojo.contact.email}</p>

//                 <button onClick={() => navigate(`/dojo-details/${dojo._id}`)}>More About Dojo</button>
//                 <button onClick={() => handleDelete(dojo._id)} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Delete Dojo</button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           !loading && <p>No dojos available.</p>
//         )}
//       </div>

//       <button onClick={handleLogout}>Logout</button>
//       <button type="button" onClick={() => navigate('/change-password')}>Change Password</button>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [dojos, setDojos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
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
          setError(data.message || "Failed to fetch dojos");
        }
      } catch (err) {
        setError("Error fetching dojos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDojos();
  }, []);

  const handleDelete = async (dojoId) => {
    if (!window.confirm("Are you sure you want to delete this dojo?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/deleteDojo/${dojoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setDojos(dojos.filter((dojo) => dojo._id !== dojoId));
        alert("Dojo deleted successfully.");
      } else {
        setError(data.message || "Failed to delete dojo");
      }
    } catch (err) {
      setError("Error deleting dojo");
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <div>
          <button className="btn btn-outline-danger me-2" onClick={handleLogout}>Logout</button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/change-password')}>Change Password</button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={() => navigate("/add-dojo")}>Add Dojo</button>
        <button className="btn btn-info text-white" onClick={() => navigate("/masters")}>View Masters</button>
        <button className="btn btn-success" onClick={() => navigate("/add-master")}>Add Master</button>
        <button className="btn btn-warning" onClick={() => navigate("/students")}>View Students</button>
        <button className="btn btn-dark" onClick={() => navigate("/send-notification")}>Send Notification</button>
        <button className="btn btn-secondary" onClick={() => navigate("/notifications")}>View Notifications</button>
      </div>

      <h4>Your Dojos</h4>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && dojos.length === 0 && (
        <div className="alert alert-warning">No dojos available.</div>
      )}

      <div className="row">
        {dojos.map((dojo) => (
          <div className="col-md-6 col-lg-4 mb-4" key={dojo._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{dojo.name}</h5>
                <p className="card-text"><strong>Place:</strong> {dojo.address.place}</p>
                <p className="card-text"><strong>Phone:</strong> {dojo.contact.phone}</p>
                <p className="card-text"><strong>Email:</strong> {dojo.contact.email}</p>

                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/dojo-details/${dojo._id}`)}
                  >
                    More About Dojo
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(dojo._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

