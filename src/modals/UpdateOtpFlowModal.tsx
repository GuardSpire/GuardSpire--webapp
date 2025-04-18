import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface Props {
  type?: 'email' | 'password'; // ✅ Existing prop
  skipOtp?: boolean;
  showThankYou?: boolean;
  onComplete: () => void;
  onClose?: () => void; // ✅ Newly added prop for settings
}

const UpdateOtpFlowModal: React.FC<Props> = ({
  type,
  skipOtp = false,
  showThankYou = true,
  onComplete,
  onClose, // ✅ Accept the new prop
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isOtpVerified, setIsOtpVerified] = useState(skipOtp);
  const [showSentPopup, setShowSentPopup] = useState(!skipOtp);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const correctOtp = '123456';

  const handleVerify = () => {
    if (otpInput === correctOtp) {
      setIsOtpVerified(true);
      if (showThankYou) {
        setShowThankYouModal(true);
      } else {
        onComplete();
      }
    } else {
      setAttempts(attempts + 1);
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
      {/* OTP Sent Info Modal */}
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

      {/* OTP Input Modal */}
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
            {attempts > 0 && otpInput !== correctOtp && (
              <p style={{ color: 'red', fontSize: '12px' }}>Incorrect OTP. Please try again.</p>
            )}
            <button className="modal-btn" onClick={handleVerify}>Verify</button>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
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
