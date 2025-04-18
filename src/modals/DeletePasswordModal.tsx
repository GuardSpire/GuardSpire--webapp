import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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

  const correctPassword = '123456'; // mock for frontend demo

  const handleConfirm = () => {
    if (password === correctPassword) {
      onNext(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        onNext(false);
      } else {
        setError('Incorrect password. Please try again.');
      }
    }
  };

  // Show OTP flow
  if (step === 'forgot') return <ForgotPasswordModal onNext={() => setStep('otp')} />;
  if (step === 'otp') return <OtpSentModal onNext={() => setStep('reset')} />;
  if (step === 'reset') return <ResetPasswordModal onNext={() => setStep('success')} />;
  if (step === 'success') return <SuccessModal onClose={() => setStep('main')} />;

  // Default password modal
  return (
    <div className="forgot-overlay" onClick={() => {}}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="forgot-title">Enter Your Password</h4>

        <div style={{ position: 'relative' }}>
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
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#04366D'
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div
          onClick={() => setStep('forgot')}
          style={{
            textAlign: 'right',
            fontSize: '12px',
            color: '#04366D',
            fontWeight: 'bold',
            marginTop: '6px',
            cursor: 'pointer'
          }}
        >
          Forgot password?
        </div>

        {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}

        <button className="forgot-btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeletePasswordModal;
