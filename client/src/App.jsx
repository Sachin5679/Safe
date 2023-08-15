import { useState, useEffect } from 'react';
import Axios from 'axios'
import './App.css'
import PasswordDetail from './PasswordDetail';

function App() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwords, setPasswords] = useState([])
  const [selectedPassword, setSelectedPassword] = useState(null);
  const [decryptedPassword, setDecryptedPassword] = useState(null);

  useEffect(() => {
    Axios.get('http://localhost:3003/showpasswords').then((response) => {
      setPasswords(response.data);
    })
  }, [])

  const addPassword = () => {
    Axios.post('http://localhost:3003/addpassword', {
      password: password,
      title: title,
    });
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
    setSelectedPassword(val); // Set the selected password
    decryptPassword({
      password: val.password,
      iv: val.iv,
      id: val.id,
    }).then((decrypted) => {
      setDecryptedPassword(decrypted); // Set decrypted password
    });
  };
  

  return (
    <div className="p-5">
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
        <button className='bg-teal-300 text-white  p-2' onClick={addPassword}> Add Password</button>
      </div>

      <div className="pt-5 cursor-pointer">
        <h1 className='font-bold text-5xl pb-5'>Your Passwords</h1>
        {passwords.map((val, key) => {
          return (
            <div
              className="outline hover:bg-teal-500 m-4 p-3 text-center rounded-xl"
              onClick={(e) => {
                handlePasswordClick(val)
              }}
              key={key}
            >
              <h3>{val.title}</h3>
            </div>
          );
        })}
      </div>
      {selectedPassword && ( // Render the PasswordDetail component when a password is selected
        <PasswordDetail decryptedPassword={decryptedPassword} />
      )}
    </div>
  )
}

export default App
