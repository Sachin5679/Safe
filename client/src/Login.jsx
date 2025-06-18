import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [masterPwd, setMasterPwd] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://safe-backend.up.railway.app/auth/login', {
        username,
        masterPwd,
      },      {
        withCredentials: true
      });

      if (response.data.success!==401 && response.data.success!==500) {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}
        <input
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="relative mb-4">
          <input
            className="border border-gray-300 rounded-lg p-2 w-full"
            name="password"
            type={passwordVisible ? 'text' : 'password'} 
            placeholder="Password"
            value={masterPwd}
            onChange={(e) => setMasterPwd(e.target.value)}
          />
          <span
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            <FontAwesomeIcon className='text-teal-500' icon={passwordVisible ? faEyeSlash : faEye} />
          </span>
        </div>
        <button
          className="bg-teal-500 text-white font-semibold rounded-lg p-2 w-full hover:bg-teal-600"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="text-center mt-4">
          Don't have an account?
          <Link to="/signup" className="text-blue-500 hover:underline ml-1">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
