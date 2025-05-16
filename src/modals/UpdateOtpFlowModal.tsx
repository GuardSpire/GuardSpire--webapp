import { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

interface UpdateOtpFlowModalProps {
  type: 'login' | 'signup' | 'email' | 'password';
  onComplete: () => void;
  onClose?: () => void;
  skipOtp?: boolean;
  showThankYou?: boolean;
}

const UpdateOtpFlowModal: React.FC<UpdateOtpFlowModalProps> = ({
  type,
  onComplete,
  onClose,
  skipOtp = false,
  showThankYou = true,
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(skipOtp);
  const [showSentPopup, setShowSentPopup] = useState(!skipOtp);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async () => {
    if (skipOtp) {
      setIsOtpVerified(true);
      if (showThankYou) {
        setShowThankYouModal(true);
      } else {
        onComplete();
      }
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let response;
      let email;

      if (type === 'login' || type === 'signup') {
        const emailKey = type === 'login' ? 'loginEmail' : 'signupEmail';
        email = localStorage.getItem(emailKey);
        if (!email) {
          setErrorMsg('Email not found. Please try again.');
          return;
        }

        // ✅ Ensure lowercase purpose
        response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
          email,
          otp: otpInput,
          purpose: type.toLowerCase(),
        });
      } else if (type === 'email' || type === 'password') {
        if (!token) {
          setErrorMsg('Authentication required. Please log in again.');
          return;
        }

        const currentEmail = localStorage.getItem('currentEmail');
        const newEmail = localStorage.getItem('newEmail');
        const currentPassword = localStorage.getItem('currentPassword');
        const newPassword = localStorage.getItem('newPassword');

        const payload = {
          otp: otpInput,
          type,
          ...(type === 'email' ? { currentEmail, newEmail } : {}),
          ...(type === 'password' ? { currentPassword, newPassword } : {}),
        };

        response = await axios.post('http://localhost:5000/api/account/verify-update-otp', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response?.status === 200) {
        if ((type === 'login' || type === 'signup') && response.data.token) {
          const jwt = response.data.token;
          localStorage.setItem('token', jwt);

          // ✅ Send token to extension with Bearer prefix
          const bearerToken = jwt.startsWith("Bearer ") ? jwt : `Bearer ${jwt}`;
          window.postMessage({
            type: "STORE_JWT_TOKEN",
            token: bearerToken
          }, "*");

          console.log("📨 Token posted to extension:", bearerToken);
        }

        if (type === 'email' || type === 'password') {
          localStorage.removeItem('currentEmail');
          localStorage.removeItem('newEmail');
          localStorage.removeItem('currentPassword');
          localStorage.removeItem('newPassword');
        }

        if (type === 'login') localStorage.removeItem('loginEmail');
        if (type === 'signup') localStorage.removeItem('signupEmail');

        setIsOtpVerified(true);
        if (showThankYou) {
          setShowThankYouModal(true);
        } else {
          onComplete();
        }
      }
    } catch (err: any) {
      setAttempts(prev => prev + 1);
      setErrorMsg(err.response?.data?.error || 'Failed to verify OTP. Please try again.');
    }
  };

  const handleCloseThankYou = () => {
    setShowThankYouModal(false);
    onComplete();
  };

  const handleSentOk = () => {
    setShowSentPopup(false);
  };

  const handleOverlayClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {showSentPopup && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <p className="modal-text">
              We have sent a one-time password to your email. Enter it below to verify your {type}.
            </p>
            <button className="modal-btn" onClick={handleSentOk}>Ok</button>
          </div>
        </div>
      )}

      {!isOtpVerified && !showSentPopup && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">Enter One-Time Password</h4>
            <input
              className="modal-input"
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />
            {attempts > 0 && errorMsg && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errorMsg}</p>
            )}
            <button className="modal-btn" onClick={handleVerify}>Verify</button>
          </div>
        </div>
      )}

      {showThankYouModal && showThankYou && (
        <div className="modal-overlay" onClick={handleCloseThankYou}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <FaCheckCircle size={40} color="green" style={{ marginBottom: '10px' }} />
            <p className="modal-success">Thank You!</p>
            <p className="modal-subtext">Your {type} has been verified successfully.</p>
            <button className="modal-btn" onClick={handleCloseThankYou}>Ok</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateOtpFlowModal;
