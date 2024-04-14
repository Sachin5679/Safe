import React, { useState } from 'react';
import Axios from 'axios';

function Registration() {
  const [username, setUsername] = useState('');
  const [masterPwd, setMasterPwd] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); // Add state for error messages

  const handleRegistration = async () => {
    try {
      const response = await Axios.post('http://localhost:3003/auth/signup', {
        username,
        password: masterPwd,
      });
  
      if (response.status === 201) { // Check for successful response (201 Created)
        setUsername('');
        setMasterPwd('');
        alert('Registration successful!');
      } else {
        setErrorMessage('Registration failed. Please try again.'); // Generic error message for now
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 500) { // Check for specific backend error
        setErrorMessage('An internal server error occurred. Please try again later.');
      } else {
        setErrorMessage('Registration failed. Please try again.'); // Generic error message
      }
    }
  };
  

  return (
    <div>
      <h2>Registration</h2>
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
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
}

export default Registration;
