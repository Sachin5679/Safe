import React from 'react';

function PasswordDetail({ decryptedPassword }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-teal-400 p-4">
      <h2 className="text-xl font-semibold mb-2">Password Details:</h2>
      <p>{decryptedPassword}</p>
    </div>
  );
}

export default PasswordDetail;
