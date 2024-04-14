import React, { useState } from 'react';
import Axios from 'axios'; // Import Axios correctly

function Login({ onLogin }) { // Pass onLogin function as a prop

  const [username, setUsername] = useState('');
  const [masterPwd, setMasterPwd] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // Add state for error messages

  const handleLogin = async () => {
    try {
      const response = await Axios.post('http://localhost:3003/auth/login', {
        username,
        password: masterPwd,
      });
  
      if (response.data.success) {
        // Extract the token from the response data (assuming it's in a 'token' property)
        const token = response.data.token; 
        
        // Call the onLogin prop with user data and token
        onLogin({ user: response.data.user, token });
      } else {
        setErrorMessage(response.data.message); // Set error message
      }
    } catch (error) {
      console.error('Login error:', error); // Log errors for debugging
      setErrorMessage('An error occurred. Please try again.'); // Generic error message
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={masterPwd}
        onChange={(e) => setMasterPwd(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
