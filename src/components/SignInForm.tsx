import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';
import PopupFlowController from '../modals/PopupFlowController';

const SignInForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotFlow, setShowForgotFlow] = useState(false);

  const handleSignIn = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('email', email);
        setShowOtpModal(true); // ✅ show OTP modal after password success
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Sign-in failed. Please try again.';
      setError(msg);
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    onClose(); // ✅ close after OTP verified
  };

  return (
    <>
      <div className="auth-overlay" onClick={onClose}>
        <div className="auth-card" onClick={(e) => e.stopPropagation()}>
          <img src="src/assets/logo.png" className="auth-logo" alt="Logo" />
          <h2 className="auth-title">GUARD SPIRE</h2>

          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="auth-password-container">
            <input
              className="auth-input"
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="auth-eye" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="auth-forgot" onClick={() => setShowForgotFlow(true)}>
            Forgot password?
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn" onClick={handleSignIn}>Sign In</button>

          <div className="auth-link">
            Don't have an account? <span onClick={onClose}>Sign Up</span>
          </div>

          <button className="google-btn">
            <img src="src/assets/search.png" className="google-icon" alt="google" /> Continue with Google
          </button>
        </div>
      </div>

      {/* OTP Modal after Sign In */}
      {showOtpModal && (
        <UpdateOtpFlowModal
          type="login"   // ✅ purpose "login"
          skipOtp={false}
          showThankYou={false}
          onComplete={handleOtpVerified}
        />
      )}

      {/* Forgot Password flow */}
      {showForgotFlow && (
        <PopupFlowController actionType="forgot" />
      )}
    </>
  );
};

export default SignInForm;
