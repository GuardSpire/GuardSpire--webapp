import { useState } from 'react';

const ConfirmPasswordModal = ({ onSuccess, onFail }: { onSuccess: () => void; onFail: () => void }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const correctPassword = 'pass123'; // replace with real check

  const handleConfirm = () => {
    if (password === correctPassword) {
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        onFail();
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h4 className="modal-title">Confirm Your Password</h4>
        <input
          className="modal-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="modal-btn" onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmPasswordModal;
