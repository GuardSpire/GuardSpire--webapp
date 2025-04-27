import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

interface Props {
  type?: 'email' | 'password' | 'login' | 'signup'; 
  skipOtp?: boolean;
  showThankYou?: boolean;
  onComplete: () => void;
  onClose?: () => void;
}

const UpdateOtpFlowModal: React.FC<Props> = ({
  type,
  skipOtp = false,
  showThankYou = true,
  onComplete,
  onClose,
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(skipOtp);
  const [showSentPopup, setShowSentPopup] = useState(!skipOtp);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const email = localStorage.getItem('email');
  const currentEmail = localStorage.getItem('currentEmail');
  const newEmail = localStorage.getItem('newEmail');
  const currentPassword = localStorage.getItem('currentPassword');
  const newPassword = localStorage.getItem('newPassword');

  const handleVerify = async () => {
    try {
      if (type === 'login' || type === 'signup') {
        // SignUp / Login OTP Verify
        const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
          email,
          otp: otpInput,
          purpose: type,
        });

        if (response.status === 200 && response.data.token) {
          localStorage.setItem('token', response.data.token);
          setIsOtpVerified(true);
          if (showThankYou) {
            setShowThankYouModal(true);
          } else {
            onComplete();
          }
        }
      } else if (type === 'email' || type === 'password') {
        // Email/Password Update OTP Verify
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/account/verify-update-otp', {
          otp: otpInput,
          type: type,
          ...(type === 'email' ? { currentEmail, newEmail } : {}),
          ...(type === 'password' ? { currentPassword, newPassword } : {}),
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          setIsOtpVerified(true);
          if (showThankYou) {
            setShowThankYouModal(true);
          } else {
            onComplete();
          }
        }
      }
    } catch (err: any) {
      setAttempts((prev) => prev + 1);
      const msg = err?.response?.data?.error || 'Incorrect OTP. Please try again.';
      setErrorMsg(msg);
    }
  };

  const handleCloseThankYou = () => {
    setShowThankYouModal(false);
    onComplete();
  };

  const handleSentOk = () => {
    setShowSentPopup(false);
  };

  return (
    <>
      {showSentPopup && (
        <div className="modal-overlay" onClick={handleSentOk}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <p className="modal-text">
              We have sent a one-time password to your email. Enter it below to verify your {type}.
            </p>
            <button className="modal-btn" onClick={handleSentOk}>Ok</button>
          </div>
        </div>
      )}

      {!isOtpVerified && !showSentPopup && (
        <div className="modal-overlay" onClick={onClose || onComplete}>
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

      {showThankYouModal && (
        <div className="modal-overlay" onClick={handleCloseThankYou}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <FaCheckCircle size={40} color="green" style={{ marginBottom: '10px' }} />
            <p className="modal-success">Thank You!</p>
            <p className="modal-subtext">Your changes have been verified successfully.</p>
            <button className="modal-btn" onClick={handleCloseThankYou}>Ok</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateOtpFlowModal;
