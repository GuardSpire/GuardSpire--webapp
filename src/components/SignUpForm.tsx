import { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';

const SignUpForm = ({ onClose }: { onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSignUp = async () => {
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        localStorage.setItem('signupEmail', email);
        setShowOtpModal(true);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Sign-up failed. Try again.';
      setError(msg);
    }
  };

  return (
    <>
      <div className="signupfrm-overlay" onClick={onClose}>
        <div className="signupfrm-card" onClick={(e) => e.stopPropagation()}>
          <img src="src/assets/logo.png" alt="Guard Spire Logo" className="signupfrm-logo" />
          <h2 className="signupfrm-title">GUARD SPIRE</h2>

          <input
            type="text"
            placeholder="Username (e.g., Joe Fernando)"
            className="signupfrm-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email (e.g., joe12@example.com)"
            className="signupfrm-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="signupfrm-password-group">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Enter your password"
              className="signupfrm-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="signupfrm-eye-icon"
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="signupfrm-password-group">
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="signupfrm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="signupfrm-eye-icon"
            >
              {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error && <div className="signupfrm-error">{error}</div>}

          <button className="signupfrm-btn" onClick={handleSignUp}>
            Sign Up
          </button>

          <div className="signupfrm-link">
            Already have an account? <span onClick={onClose}>Sign In</span>
          </div>
        </div>
      </div>

      {showOtpModal && (
        <UpdateOtpFlowModal
          type="signup"
          skipOtp={false}
          showThankYou={true}
          onComplete={() => {
            setShowOtpModal(false);
            onClose(); // Close form after OTP verification
          }}
        />
      )}
    </>
  );
};

export default SignUpForm;