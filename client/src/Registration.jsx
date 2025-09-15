import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Registration() {
  const [username, setUsername] = useState('');
  const [masterPwd, setMasterPwd] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegistration = async () => {
    try {
      const response = await axios.post('https://3.110.83.157:8080/auth/signup', {
        username,
        masterPwd,
      },      {
        withCredentials: true, 
      });

      if (response.status === 201) {
        setUsername('');
        setMasterPwd('');
        alert('Registration successful!');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 500) {
        setErrorMessage('An internal server error occurred. Please try again later.');
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Registration</h2>
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
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </span>
        </div>
        <button
          className="bg-teal-500 text-white font-semibold rounded-lg p-2 w-full hover:bg-teal-600"
          onClick={handleRegistration}
        >
          Register
        </button>
        <p className="text-center mt-4">
          Already have an account?
          <Link to="/" className="text-blue-500 hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
