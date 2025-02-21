// The PrivateRoute component is used to protect routes so that only authenticated users with the correct role can access them.
//  Without it, anyone could manually enter /admin-dashboard in the browser and access the page—even if they are not an admin.
// PrivateRoute checks:
// If the user is logged in → It looks for user data in localStorage.
// If the user has the correct role → It compares the user’s role with the allowed roles.
// If unauthorized, it redirects to login (/).


// import PropTypes from 'prop-types';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = ({ allowedRoles }) => {
//   const user = JSON.parse(localStorage.getItem('user'));

//   if (!user || !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" />;
//   }
//   return <Outlet />;
// };

// PrivateRoute.propTypes = {
//   allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
// };

// export default PrivateRoute;


import PropTypes from 'prop-types';

import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired } from '../utils/tokenUtils';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || isTokenExpired(token) || !user || !allowedRoles.includes(user.role)) {
    // Clear storage if token is expired
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
