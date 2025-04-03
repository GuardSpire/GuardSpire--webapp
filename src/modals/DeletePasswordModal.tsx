import React, { useState } from 'react';

interface Props {
  onNext: (isCorrect: boolean) => void;
}

const DeletePasswordModal: React.FC<Props> = ({ onNext }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const correctPassword = '123456'; // For now, hardcoded frontend only

  const handleConfirm = () => {
    if (password === correctPassword) {
      onNext(true); // ✅ Password correct → delete account
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 2) {
        onNext(false); // ❌ 2 wrong attempts → go to confirm email
      } else {
        setError('Incorrect password. Please try again.');
      }
    }
  };

  return (
    <div className="forgot-overlay" onClick={() => {}}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="forgot-title">Enter Your Password</h4>
        <input
          className="forgot-input"
          placeholder="Enter your password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
          <span
            style={{ color: '#04366D', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'} Password
          </span>
        </div>

        {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

        <button className="forgot-btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeletePasswordModal;
