import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { apiRequest } from '../utils/tokenUtils';

const AddDojo = () => {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken'); // Get auth token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate the form inputs
    if (!name || !place || !city || !state || !pincode || !phone || !email) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/addDojo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          address: { place, city, state, pincode },
          contact: { phone, email },
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // If dojo created successfully, navigate to the dashboard or dojo list
        alert('Dojo created successfully');
        navigate('/admin-dashboard'); // Redirect to Admin Dashboard or Dojo List page
      } else {
        setError(data.message || 'Failed to create dojo');
      }
    } catch (err) {
      setError('Error creating dojo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
      <h2>Add Dojo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Place:</label>
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} />
        </div>
        <div>
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <label>State:</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div>
          <label>Pincode:</label>
          <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Dojo...' : 'Create Dojo'}
        </button>
      </form>
    </div>
<br />
<button onClick={() => navigate(`/admin-dashboard`)}>Back</button>

    </div>
  );
};

export default AddDojo;
