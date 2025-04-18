import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import OtpSentModal from '../modals/OtpSentModal';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showOtpSent, setShowOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSignUp = () => {
    setShowOtpSent(true); // First show the OTP sent popup
  };

  const handleOtpSentOk = () => {
    setShowOtpSent(false);     // Hide OTP sent message
    setShowOtpModal(true);     // Show OTP verification modal
  };

  return (
    <>
      <div className="signupfrm-overlay" onClick={onClose}>
        <div className="signupfrm-card" onClick={(e) => e.stopPropagation()}>
          <img src="src/assets/logo.png" alt="Guard Spire Logo" className="signupfrm-logo" />
          <h2 className="signupfrm-title">GUARD SPIRE</h2>

          <input
            type="text"
            placeholder='Username (e.g., "Joe Fernando")'
            className="signupfrm-input"
          />

          <input
            type="email"
            placeholder='Email (e.g., "joe12@example.com")'
            className="signupfrm-input"
          />

          <div className="signupfrm-password-group">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              className="signupfrm-password"
            />
            <span onClick={() => setPasswordVisible(!passwordVisible)} className="signupfrm-eye-icon">
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="signupfrm-password-group">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="signupfrm-password"
            />
            <span onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="signupfrm-eye-icon">
              {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button className="signupfrm-btn" onClick={handleSignUp}>
            Sign Up
          </button>

          <div className="signupfrm-link">
            Already have an account? <span onClick={onClose}>Sign In</span>
          </div>
        </div>
      </div>

      {/* Step 1 - OTP sent info */}
      {showOtpSent && <OtpSentModal onNext={handleOtpSentOk} />}

      {/* Step 2 - OTP verification */}
      {showOtpModal && (
        <UpdateOtpFlowModal
          skipOtp={false}
          showThankYou={true}
          onComplete={() => setShowOtpModal(false)}
        />
      )}
    </>
  );
};

export default SignUpForm;
