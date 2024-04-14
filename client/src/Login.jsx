import React, { useState } from 'react';
import Axios from 'axios'; // Import Axios correctly

function Login({ onLogin }) { // Pass onLogin function as a prop

  const [username, setUsername] = useState('');
  const [masterPwd, setMasterPwd] = useState('');
  const [errorMessage, setErrorMessage] = useState(null); 

  const handleLogin = async () => {
    try {
      const response = await Axios.post('http://localhost:3003/auth/login', {
        username,
        masterPwd,
      });
      
      if (response.data.success!=401 && response.data.success!=500) {
        const token = response.data.token;
        onLogin({ user: response.data.user, token });
      } else {
        setErrorMessage(response.data.message); 
      }
    } catch (error) {
      console.error('Login error:', error); 
      setErrorMessage('An error occurred. Please try again.'); 
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} 
      <input
        name='username'
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        name='password'
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
