import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Dojo Details</h2>

      {/* Show error if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display dojo details if available */}
      {dojo ? (
        <div>
          <h3>{dojo.name}</h3>

          {isEditing ? (
            <>
              <label>
                <strong>Place:</strong> 
                <input type="text" name="place" value={updatedFields.place} onChange={handleChange} />
              </label>
              <br />
              <label>
                <strong>Phone:</strong> 
                <input type="text" name="phone" value={updatedFields.phone} onChange={handleChange} />
              </label>
              <br />
              <label>
                <strong>Email:</strong> 
                <input type="email" name="email" value={updatedFields.email} onChange={handleChange} />
              </label>
              <br />
              <button onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Place:</strong> {dojo.address.place}</p>
              <p><strong>City:</strong> {dojo.address.city}</p>
              <p><strong>State:</strong> {dojo.address.state}</p>
              <p><strong>Pincode:</strong> {dojo.address.pincode}</p>
              <p><strong>Contact:</strong> {dojo.contact.phone}</p>
              <p><strong>Email:</strong> {dojo.contact.email}</p>
              
              <button onClick={() => navigate('/admin-dashboard')}>Back to Dojos</button>
              <button onClick={() => setIsEditing(true)} style={{ marginLeft: '10px', backgroundColor: 'blue', color: 'white' }}>Update Dojo</button>
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
