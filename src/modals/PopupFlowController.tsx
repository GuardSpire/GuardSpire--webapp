import { useState, useEffect } from 'react';
import axios from 'axios';

interface PopupFlowControllerProps {
  actionType: 'forgot';
  onClose: () => void;
}

const PopupFlowController: React.FC<PopupFlowControllerProps> = ({ actionType, onClose }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('[DEBUG] PopupFlowController mounted, actionType:', actionType, 'step:', step);
    if (actionType !== 'forgot') {
      console.error('[ERROR] Unsupported actionType:', actionType);
      setError('Invalid action type. Only forgot password is supported.');
    }
    return () => {
      console.log('[DEBUG] PopupFlowController unmounted');
    };
  }, [actionType, step]);

  const handleRequestOtp = async () => {
    if (actionType !== 'forgot') return;

    setError('');
    if (!email || !/[^@]+@[^@]+\.[^@]+/.test(email)) {
      console.error('[ERROR] Invalid email entered:', email);
      setError('Please enter a valid email.');
      return;
    }

    try {
      console.log('[DEBUG] Sending /api/auth/forgot-password/request for email:', email);
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password/request', { email });
      console.log('[DEBUG] Response from /api/forgot-password/request:', response.data);
      if (response.status === 200) {
        setStep('otp');
        setMessage('OTP sent to your email.');
      }
    } catch (err: any) {
      console.error('[ERROR] Failed to request OTP:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to request OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (actionType !== 'forgot') return;

    setError('');
    if (!otp) {
      console.error('[ERROR] OTP is empty');
      setError('Please enter the OTP.');
      return;
    }

    try {
      console.log('[DEBUG] Sending /api/auth/forgot-password/verify-otp for email:', email, 'otp:', otp);
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password/verify-otp', { email, otp });
      console.log('[DEBUG] Response from /api/auth/forgot-password/verify-otp:', response.data);
      if (response.status === 200) {
        setStep('reset');
        setMessage('OTP verified. Please enter your new password.');
      }
    } catch (err: any) {
      console.error('[ERROR] OTP verification failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (actionType !== 'forgot') return;

    setError('');
    if (!newPassword || !confirmPassword) {
      console.error('[ERROR] New password or confirm password missing');
      setError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      console.error('[ERROR] Passwords do not match');
      setError('Passwords do not match.');
      return;
    }

    try {
      console.log('[DEBUG] Sending /api/auth/forgot-password/reset for email:', email);
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password/reset', {
        email,
        newPassword,
        confirmPassword,
      });
      console.log('[DEBUG] Response from /api/auth/forgot-password/reset:', response.data);
      if (response.status === 200) {
        setMessage('Password reset successfully. Please log in.');
        setTimeout(() => {
          setStep('email');
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error('[ERROR] Password reset failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
    }
  };

  if (actionType !== 'forgot') {
    return (
      <div className="forgot-overlay" onClick={onClose}>
        <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
          <h4 className="forgot-title">Error</h4>
          <p className="forgot-info">Invalid action type. Please try again.</p>
          <button className="forgot-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-overlay" onClick={onClose}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        {step === 'email' && (
          <>
            <h4 className="forgot-title">Forgot Password</h4>
            <input
              className="forgot-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="forgot-error">{error}</p>}
            {message && <p className="forgot-message">{message}</p>}
            <button className="forgot-btn" onClick={handleRequestOtp}>
              Request OTP
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h4 className="forgot-title">Enter OTP</h4>
            <input
              className="forgot-input"
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && <p className="forgot-error">{error}</p>}
            {message && <p className="forgot-message">{message}</p>}
            <button className="forgot-btn" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <h4 className="forgot-title">Reset Password</h4>
            <input
              className="forgot-input"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="forgot-input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="forgot-error">{error}</p>}
            {message && <p className="forgot-message">{message}</p>}
            <button className="forgot-btn" onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupFlowController;