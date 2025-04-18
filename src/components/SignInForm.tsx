import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import OtpSentModal from '../modals/OtpSentModal';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';

const SignInForm = ({ onClose }: { onClose: () => void }) => {
  const [showOtpSent, setShowOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = () => {
    setShowOtpSent(true);
  };

  const handleOtpSentNext = () => {
    setShowOtpSent(false);
    setShowOtpModal(true);
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    onClose(); // Close sign-in modal after verification
  };

  return (
    <>
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-card" onClick={(e) => e.stopPropagation()}>
          <img src="src/assets/logo.png" className="auth-logo" alt="Logo" />
          <h2 className="auth-title">GUARD SPIRE</h2>

          <input className="auth-input" type="email" placeholder="Enter your email" />

          <div className="auth-password-container">
            <input
              className="auth-input"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
            />
            <span className="auth-eye" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="auth-forgot">Forgot password?</div>

          <button className="auth-btn" onClick={handleSignIn}>Sign In</button>

          <div className="auth-link">Don't have an account? <span onClick={onClose}>Sign Up</span></div>

          <button className="google-btn">
            <img src="src/assets/search.png" className="google-icon" alt="google" /> Continue with Google
          </button>
        </div>
      </div>

      {showOtpSent && <OtpSentModal onNext={handleOtpSentNext} />}
      {showOtpModal && <UpdateOtpFlowModal skipOtp={false} showThankYou={false} onComplete={handleOtpVerified} />}
    </>
  );
};

export default SignInForm;
