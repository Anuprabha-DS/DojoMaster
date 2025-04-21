// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { apiRequest } from '../utils/tokenUtils';


// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   // Clear any existing auth data
//   //   localStorage.removeItem('authToken');
//   //   localStorage.removeItem('user');
    
//   //   // Clear form fields and errors
//   //   setEmail('');
//   //   setPassword('');
//   //   setError('');
//   // }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate input
//     if (!email || !password) {
//       setError('Please fill in both fields');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     // Send POST request to the backend API
//     try {
//       const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.status === 200) {
//         if (data.requirePasswordChange) {
//           console.log("change password at first login");
          
//           // If password change is required, navigate to the change password page
//           localStorage.setItem('authToken', data.token);
          
//           navigate('/change-password');
//         } else {
//           const { token, user } = data;

//         localStorage.setItem('authToken', token);
//         localStorage.setItem('user', JSON.stringify(user));

//         // Redirect user based on role
//         switch (user.role) {
//           case 'Admin':
//             console.log(user.role,"admin");
            
//             navigate('/admin-dashboard');
//             break;
//           case 'Master':
//             console.log(user.role,"master");

//             navigate('/master-dashboard');
//             break;
//           case 'Parent':
//             console.log(user.role,"parent");

//             navigate('/parent-dashboard');
//             break;
//           default:
//             navigate('/home'); // Default fallback
//         }

//         }
//       } else {
//         // Handle errors (invalid credentials or other)
//         setError(data.error || 'An error occurred');
//       }
//     } catch (error) {
//       setError('An error occurred while logging in');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div >
//       <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email:</label>
//           <input type="text" value={email}
//             onChange={(e) => setEmail(e.target.value)}/>
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         {error && <div style={{ color: 'red' }}>{error}</div>}
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//       </div>
//       <button onClick={() => navigate("/register")}>Register</button>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        if (data.requirePasswordChange) {
          localStorage.setItem("authToken", data.token);
          navigate("/change-password");
        } else {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          switch (data.user.role) {
            case "Admin":
              navigate("/admin-dashboard");
              break;
            case "Master":
              navigate("/master-dashboard");
              break;
            case "Parent":
              navigate("/parent-dashboard");
              break;
            default:
              navigate("/home");
          }
        }
      } else {
        setError(data.error || "Invalid credentials.");
      }
    } catch (error) {
      setError("An error occurred while logging in.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
      <h2>Welcome DojoMaster</h2>

        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Do not have an account?{" "}
          <button className="link-button" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
