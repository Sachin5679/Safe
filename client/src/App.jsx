import { useState, useEffect } from 'react';
import Axios from 'axios'
import './App.css'
import PasswordDetail from './PasswordDetail';
import Login from './Login';
import Registration from './Registration';
import { Navigate } from 'react-router-dom'; // Import for protected routes


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
  
    
    if (user?.token) {
      const token = user.token;
      console.log(token);
  
      Axios.get('http://localhost:3003/showpasswords', {
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
  }, []);
  

  const addPassword = () => {
    const token = localStorage.getItem('token');
    Axios.post('http://localhost:3003/addpassword', {
      password: password,
      title: title,
    }, {headers: {
      Authorization: `Bearer ${token}`,
    }}).then(() => {
      setPassword('');
      setTitle('');

      
      Axios.get('http://localhost:3003/showpasswords', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setPasswords(response.data);
      });
    })
  };

  const decryptPassword = (encryption) => {
    return Axios.post("http://localhost:3003/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      return response.data; // Return decrypted password
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
    console.log(loginData.token);
    setUser({ ...loginData });
    if (loginData.token) { 
      localStorage.setItem('token', loginData.token);
      const response = await Axios.get('http://localhost:3003/showpasswords', {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      });
      setPasswords(response.data);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
  };

  return (
    <div className="p-5">
      {user ? ( 
        <>
          <div className="grid m-2 bg-slate-500">
            <input
              className='p-2'
              type="text"
              placeholder="Ex. password123"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              className='p-2'
              type="text"
              placeholder="Ex. Facebook"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <button className='bg-teal-300 text-white  p-2' onClick={addPassword}>
              Add Password
            </button>
          </div>

          <div className="pt-5 cursor-pointer">
            <h1 className='font-bold text-5xl pb-5'>Your Passwords</h1>
            {passwords.map((val, key) => {
              return (
                <div
                  className="outline hover:bg-teal-500 m-4 p-3 text-center rounded-xl"
                  onClick={(e) => {
                    handlePasswordClick(val);
                  }}
                  key={key}
                >
                  <h3>{val.title}</h3>
                </div>
              );
            })}
          </div>
          {selectedPassword && (
            <PasswordDetail decryptedPassword={decryptedPassword} />
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
          <Registration />
        </>
      )}
    </div>
  );
}

function ProtectedPasswords() {
  const isLoggedIn = user !== null;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <PasswordDetail passwords={passwords} />;
}

export default App;
