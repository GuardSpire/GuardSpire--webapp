import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ForgotPasswordModal from '../modals/ForgotPasswordModal';
import OtpSentModal from '../modals/OtpSentModal';
import ResetPasswordModal from '../modals/ResetPasswordModal';
import SuccessModal from '../modals/SuccessModal';


const SignInForm = ({ onClose }: { onClose: () => void }) => {
  const [showForgot, setShowForgot] = useState(false);
  const [showOtpSent, setShowOtpSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleForgotConfirm = () => {
    setShowForgot(false);
    setShowOtpSent(true);
  };

  const handleOtpOk = () => {
    setShowOtpSent(false);
    setShowReset(true);
  };

  const handleResetDone = () => {
    setShowReset(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
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

          <div className="auth-forgot" onClick={() => setShowForgot(true)}>Forgot password?</div>

          <button className="auth-btn">Sign In</button>
          <div className="auth-link">Don't have an account? <span onClick={onClose}>Sign Up</span></div>

          <button className="google-btn">
            <img src="src/assets/search.png" className="google-icon" /> Continue with Google
          </button>
        </div>
      </div>

      {showForgot && <ForgotPasswordModal onNext={handleForgotConfirm} />}
      {showOtpSent && <OtpSentModal onNext={handleOtpOk} />}
      {showReset && <ResetPasswordModal onNext={handleResetDone} />}
      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}

    </>
  );
};

export default SignInForm;
