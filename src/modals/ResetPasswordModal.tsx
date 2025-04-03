import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const ResetPasswordModal = ({ onNext }: { onNext: () => void }) => {
  const [otpInput, setOtpInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const correctOtp = '123456'; // Replace this with actual OTP logic

  const handleOtpVerify = () => {
    if (otpInput === correctOtp) {
      setIsOtpVerified(true);
      setErrorMsg('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 2) {
        setOtpSent(true);
        setErrorMsg('');
      } else {
        setErrorMsg(' * Incorrect password. Please try again.');
      }
    }
  };

  const handleSave = () => {
    // Final validation and proceed
    onNext();
  };

  return (
    <div className="forgot-overlay" onClick={onNext}>
      <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
        <h4 className="forgot-title">Password</h4>

        {/* OTP Field */}
        <div style={{ textAlign: 'left', marginBottom: '15px' }}>
          <label className='current-pwd'>Current Password</label>
          <input
            className="forgot-input"
            placeholder="Enter your one time password"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            disabled={isOtpVerified}
          />
          {errorMsg && <p style={{ color: 'red', fontSize: '10px', marginTop:'-8px' }}>{errorMsg}</p>}
          {otpSent && !isOtpVerified && (
            <p style={{ color: 'red', fontSize: '12px', marginTop:'-8px' }}>
              We've sent an OTP to your email. Please check and try again.
            </p>
          )}
          {isOtpVerified && (
            <p style={{ color: 'green', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginTop:'-8px' }}>
              <FaCheckCircle color="green" /> OTP verified successfully!
            </p>
          )}
          {!isOtpVerified && (
            <button className="verify-btn" onClick={handleOtpVerify}>Verify</button>
          )}
        </div>

        {/* New Password Fields */}
        <div style={{ opacity: isOtpVerified ? 1 : 0.5, pointerEvents: isOtpVerified ? 'auto' : 'none' }}>
          <label style={{ fontWeight: 'bold', color: '#04366D' }}>New Password</label>
          <input
            className="forgot-input"
            placeholder="Enter your new password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label style={{ fontWeight: 'bold', color: '#04366D' }}>Confirm Password</label>
          <input
            className="forgot-input"
            placeholder="Re-Enter your new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="forgot-btn"
          style={{ marginTop: '20px' }}
          onClick={handleSave}
          disabled={!isOtpVerified}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
