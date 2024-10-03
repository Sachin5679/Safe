import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function PasswordDetail({ decryptedPassword, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-teal-400 p-6 rounded-lg shadow-lg relative max-w-lg w-full">
        <button
          className="absolute top-2 right-2 text-white hover:text-red-500"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Password Details</h2>
        <p className="text-lg">{decryptedPassword}</p>
      </div>
    </div>
  );
}

export default PasswordDetail;
