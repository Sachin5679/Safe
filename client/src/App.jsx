import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import PasswordDetail from './PasswordDetail';
import Login from './Login';
import Registration from './Registration';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Run only once on component mount
  
  useEffect(() => {
    if (user?.token) {
      const token = user.token;
      // console.log(token);
  
      axios.get('https://3.110.83.157:8080/showpasswords', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPasswords(response.data);
      })
      .catch((error) => {
        console.error('Error fetching passwords:', error);
      });
    }
  }, [user]); // This effect will only run when `user` state changes
  

  const addPassword = () => {
    const token = localStorage.getItem('token');
    axios.post('https://3.110.83.157:8080/addpassword', {
      password: password,
      title: title,
    }, {headers: {
      Authorization: `Bearer ${token}`,
    }}).then(() => {
      setPassword('');
      setTitle('');

      axios.get('https://3.110.83.157:8080/showpasswords', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setPasswords(response.data);
      });
    });
  };

  const decryptPassword = (encryption) => {
    return axios.post("https://3.110.83.157:8080/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      return response.data; 
    });
  };

  const handlePasswordClick = (val) => {
    setSelectedPassword(val);
    decryptPassword({
      password: val.password,
      iv: val.iv,
      id: val.id,
    }).then((decrypted) => {
      setDecryptedPassword(decrypted);
    });
  };

  const handleLogin = async (loginData) => {
    // console.log(loginData.token);
    setUser({ ...loginData });
    if (loginData.token) { 
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(loginData)); // Store user info as well

      const response = await axios.get('https://3.110.83.157:8080/showpasswords', {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });
      setPasswords(response.data);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
  };

  const handleClosePasswordDetail = () => {
    setSelectedPassword(null); 
    setDecryptedPassword(null); 
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {user ? (
          <>
            <nav className="w-full bg-teal-500 text-white py-4 px-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Safe</h1>
              <button
                className="text-white hover:text-red-500 transition-all"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              </button>
            </nav>
  
            <div className="max-w-7xl mx-auto py-10 flex flex-col md:flex-row md:space-x-8">
              <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3 mb-4 md:mb-0">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add a New Password</h2>
                <div className="space-y-4">
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
                    type="text"
                    placeholder="Enter title (e.g., Facebook)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <input
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="w-full py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:ring-2 focus:ring-teal-300 transition-all"
                    onClick={addPassword}
                  >
                    Add Password
                  </button>
                </div>
              </div>
  
              <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-2/3 h-96 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Passwords</h2>
                {passwords.length > 0 ? (
                  passwords.map((val, key) => (
                    <div
                      key={key}
                      className="bg-gray-100 hover:bg-teal-500 p-4 m-2 rounded-lg cursor-pointer shadow transition-all"
                      onClick={() => handlePasswordClick(val)}
                    >
                      <h3 className="text-lg font-medium text-gray-700 hover:text-white">{val.title}</h3>
                    </div>
                  ))
                ) : (
                  <p>No passwords available. Add one!</p>
                )}
              </div>
            </div>
  
            {selectedPassword && (
              <PasswordDetail
                decryptedPassword={decryptedPassword}
                onClose={handleClosePasswordDetail}
              />
            )}
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect to /login if not logged in */}
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
