import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';


const DojoDetails = () => {
  const { id } = useParams(); // Get the dojo ID from the URL params
  const [dojo, setDojo] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [updatedFields, setUpdatedFields] = useState({
    phone: '',
    place: '',
    email: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); // Get auth token

  useEffect(()=>{
    setTimeout(() => {
        setError("")
    }, 1500);
  },[error])


  useEffect(() => {
    const fetchDojoDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/getDojos/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          setDojo(data.data);
          setUpdatedFields({
            phone: data.data.contact.phone,
            place: data.data.address.place,
            email: data.data.contact.email
          });
        } else {
          setError(data.message || 'Failed to fetch dojo details');
        }
      } catch (err) {
        setError('Error fetching dojo details');
        console.error(err);
      }
    };

    fetchDojoDetails();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Update Request
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/updateDojo/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();

      if (response.ok) {
        setDojo((prevDojo) => ({
          ...prevDojo,
          contact: { ...prevDojo.contact, phone: updatedFields.phone, email: updatedFields.email },
          address: { ...prevDojo.address, place: updatedFields.place }
        }));
        alert('Dojo details updated successfully.');
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update dojo details');
      }
    } catch (err) {
      setError('Error updating dojo details');
      console.error(err);
    }
  };


  return (
    <div className="container">
      <h2>Dojo Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dojo ? (
        <div className="card">
          <h3>{dojo.name}</h3>
          {isEditing ? (
            <>
              <div className="label-input">
                <label>Place:</label>
                <input type="text" name="place" value={updatedFields.place} onChange={handleChange} />
              </div>
              <div className="label-input">
                <label>Phone:</label>
                <input type="text" name="phone" value={updatedFields.phone} onChange={handleChange} />
              </div>
              <div className="label-input">
                <label>Email:</label>
                <input type="email" name="email" value={updatedFields.email} onChange={handleChange} />
              </div>
              <button className="button" onClick={handleUpdate}>Save Changes</button>
              <button className="button grey" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Place:</strong> {dojo.address.place}</p>
              <p><strong>City:</strong> {dojo.address.city}</p>
              <p><strong>State:</strong> {dojo.address.state}</p>
              <p><strong>Pincode:</strong> {dojo.address.pincode}</p>
              <p><strong>Contact:</strong> {dojo.contact.phone}</p>
              <p><strong>Email:</strong> {dojo.contact.email}</p>
              <button className="button grey" onClick={() => navigate('/admin-dashboard')}>Back</button>
              <button className="button" onClick={() => setIsEditing(true)}>Update Dojo</button>
            </>
          )}
        </div>
      ) : (
        <p>Loading dojo details...</p>
      )}
    </div>
  );
};

export default DojoDetails;
