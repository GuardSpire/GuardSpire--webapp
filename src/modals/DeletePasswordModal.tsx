import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import ForgotPasswordModal from './ForgotPasswordModal';
import OtpSentModal from './OtpSentModal';
import ResetPasswordModal from './ResetPasswordModal';
import SuccessModal from './SuccessModal';

interface Props {
  onNext: (isCorrect: boolean) => void;
}

const DeletePasswordModal: React.FC<Props> = ({ onNext }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'main' | 'forgot' | 'otp' | 'reset' | 'success'>('main');

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/delete/confirm-password', 
        { password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        onNext(true);
      }
    } catch (err: any) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        onNext(false);
      } else {
        setError('Incorrect password. Please try again.');
      }
    }
  };

  if (step === 'forgot') return <ForgotPasswordModal onNext={() => setStep('otp')} />;
  if (step === 'otp') return <OtpSentModal onNext={() => setStep('reset')} />;
  if (step === 'reset') return <ResetPasswordModal onNext={() => setStep('success')} />;
  if (step === 'success') return <SuccessModal onClose={() => setStep('main')} />;

  return (
    <div className="modal-overlay">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h4 className="modal-title">Enter Your Password</h4>

        <div style={{ position: 'relative' }}>
          <input
            className="modal-input"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
          />
          <span
            onClick={() => setShowPassword(prev => !prev)}
            className="auth-eye"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div
          onClick={() => setStep('forgot')}
          style={{ textAlign: 'right', fontSize: '12px', fontWeight: 'bold', color: '#04366D', marginTop: '5px', cursor: 'pointer' }}
        >
          Forgot password?
        </div>

        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

        <button className="modal-btn" onClick={handleConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default DeletePasswordModal;
