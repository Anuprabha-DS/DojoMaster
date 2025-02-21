import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <h2>Parent Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ParentDashboard;
