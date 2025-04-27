import { useState } from 'react';
import axios from 'axios';

const ConfirmPasswordModal = ({ onSuccess, onFail }: { onSuccess: () => void; onFail: () => void }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      await axios.post('http://localhost:5000/api/delete/confirm-password', {
        password: password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ If no error → success
      onSuccess();

    } catch (error: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        onFail();
      } else {
        setErrorMessage('Incorrect password. Please try again.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h4 className="modal-title">Enter Your Password</h4>
        <input
          className="modal-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage}</p>}

        <button className="modal-btn" onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmPasswordModal;
