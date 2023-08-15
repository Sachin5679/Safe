import { useState, useEffect } from 'react';
import Axios from 'axios'
import './App.css'

function App() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwords, setPasswords] = useState([])

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

  // const decryptPassword = (encryption) => {
  //   Axios.post("http://localhost:3003/decryptpassword", {
  //     password: encryption.password,
  //     iv: encryption.iv,
  //   }).then((response) => {
  //     setPasswords(
  //       passwords.map((val) => {
  //         return val.id == encryption.id
  //           ? {
  //               id: val.id,
  //               password: val.password,
  //               title: response.data,
  //               iv: val.iv,
  //             }
  //           : val;
  //       })
  //     );
  //   });
  // };

  const decryptPassword = async (encryption) => {
    try {
      const response = await Axios.post("http://localhost:3003/decryptpassword", {
        password: encryption.password,
        iv: encryption.iv,
      });
  
      const decryptedTitle = response.data;
  
      setPasswords((prevPasswords) =>
        prevPasswords.map((val) => {
          if (val.id === encryption.id) {
            return {
              ...val,
              title: decryptedTitle,
            };
          } else {
            return val;
          }
        })
      );
    } catch (error) {
      console.error('Error decrypting password:', error);
      // Handle the error gracefully (display an error message, etc.)
    }
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

      <div className="pt-5">
        <h1 className='font-bold text-5xl pb-5'>Your Passwords</h1>
        {passwords.map((val, key) => {
          return (
            <div
              className="bg-teal-500 w-1/2 m-4 p-3 text-center rounded-xl"
              onClick={() => {
                decryptPassword({
                  password: val.password,
                  iv: val.iv,
                  id: val.id,
                });
              }}
              key={key}
            >
              <h3 className='text-white '>{val.title}</h3>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default App
