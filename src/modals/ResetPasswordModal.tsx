import { useState } from 'react';
import axios from 'axios';

interface ResetPasswordModalProps {
  onNext: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onNext }) => {
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem('forgotPasswordEmail');

  const handleOtpVerify = async () => {
    if (otpInput.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/forgot-password/verify-otp', {
        email,
        otp: otpInput,
      });
      setIsOtpVerified(true);
      setErrorMsg('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/forgot-password/reset', {
        email,
        otp: otpInput,
        newPassword,
        confirmPassword,
      });
      localStorage.removeItem('forgotPasswordEmail');
      onNext();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h4 className="modal-title">Reset Password</h4>
        {!isOtpVerified ? (
          <>
            <input
              className="modal-input"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />
            {errorMsg && <p style={{ color: 'red', fontSize: '12px' }}>{errorMsg}</p>}
            <button className="modal-btn" onClick={handleOtpVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              className="modal-input"
              placeholder="Enter new password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="modal-input"
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMsg && <p style={{ color: 'red', fontSize: '12px' }}>{errorMsg}</p>}
            <button className="modal-btn" onClick={handleSavePassword} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;