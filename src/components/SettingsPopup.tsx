import { useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { Switch } from '@mui/material';
import { useSettings } from '../context/SettingsContext';

import ForgotPasswordModal from '../modals/ForgotPasswordModal';
import OtpSentModal from '../modals/OtpSentModal';
import ResetPasswordModal from '../modals/ResetPasswordModal';
import SuccessModal from '../modals/SuccessModal';
import DeletePasswordModal from '../modals/DeletePasswordModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import UpdateOtpFlowModal from '../modals/UpdateOtpFlowModal';

const SettingsPopup = () => {
  const { isOpen, position, setIsOpen } = useSettings();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [autoDetection, setAutoDetection] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [modalStep, setModalStep] = useState('');
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [otpFlowType, setOtpFlowType] = useState<'email' | 'password' | null>(null);

  const imagePopupRef = useRef<HTMLDivElement | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImagePopup(true);
  };

  const handleDeleteAccount = () => {
    setModalStep('deleteConfirm');
    setPasswordAttempts(0);
  };

  const handlePasswordNext = (correct: boolean) => {
    if (correct) {
      setModalStep('thankyou');
    } else {
      const updatedAttempts = passwordAttempts + 1;
      if (updatedAttempts >= 2) {
        setPasswordAttempts(0);
        setModalStep('confirmEmail');
      } else {
        setPasswordAttempts(updatedAttempts);
      }
    }
  };

  const handleFinalReset = () => {
    setModalStep('thankyou');
  };

  const renderModalFlow = () => {
    switch (modalStep) {
      case 'deleteConfirm':
        return (
          <DeleteConfirmModal
            onBack={() => setModalStep('')}
            onYes={() => setModalStep('deletePassword')}
          />
        );
      case 'deletePassword':
        return <DeletePasswordModal onNext={handlePasswordNext} />;
      case 'confirmEmail':
        return <ForgotPasswordModal onNext={() => setModalStep('otpMessage')} />;
      case 'otpMessage':
        return <OtpSentModal onNext={() => setModalStep('resetPassword')} />;
      case 'resetPassword':
        return <ResetPasswordModal onNext={handleFinalReset} />;
      case 'forgotPassword':
        return <ForgotPasswordModal onNext={() => setModalStep('otpMessage')} />;
      case 'thankyou':
        return <SuccessModal onClose={() => setModalStep('')} />;
      default:
        return null;
    }
  };

  if (!isOpen || !position) return null;

  const popupStyle: React.CSSProperties = {
    position: 'absolute',
    top: position.top ?? 100,
    left: position.anchor === 'sidebar' ? position.left + 50 : position.left - 380,
    maxWidth: 360,
    width: '100%',
    zIndex: 9999,
  };

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup-card" style={popupStyle} onClick={(e) => e.stopPropagation()}>
        {/* Profile Image */}
        <div className="settings-profile">
          <img src="src/assets/user.png" alt="Profile" className="settings-profile-icon" />
          <div className="settings-profile-edit" onClick={handleEditClick}>
            <FaEdit className="edit-icon" /> <span>Edit</span>
          </div>
          {showImagePopup && (
            <div className="profile-image-popup" ref={imagePopupRef}>
              <p>Upload or Remove Profile Picture</p>
              <button className="settings-save">Upload Image</button>
              <button className="settings-save" style={{ backgroundColor: '#b00020' }}>Remove Image</button>
            </div>
          )}
        </div>

        {/* Sections */}
        {[{
          key: 'personal',
          label: 'Personal Details',
          content: (
            <>
              <label>Current Username</label>
              <input type="text" placeholder="Enter current username" />
              <label>New Username</label>
              <input type="text" placeholder="Enter new username" />
              <button className="settings-save">Save Changes</button>

              <label>Current Email</label>
              <input type="email" placeholder="Enter current email" />
              <label>New Email</label>
              <input type="email" placeholder="Enter new email" />
              <button className="settings-save" onClick={() => setOtpFlowType('email')}>
                Save Changes
              </button>

              {/* Delete Account Section */}
              <div className="delete-account">
                <p className="delete-title">Delete Account</p>
                <label className="delete-subtitle">
                  We are really sorry to see you go. Are you sure you want to delete your account?
                </label>
                <div className="delete-options-list">
                  {['No longer using my account', 'Service is not good', 'Don’t understand how to use', 'Don’t need anymore', 'Other']
                    .map(reason => (
                      <div key={reason} className="delete-option">
                        <input
                          type="radio"
                          name="deleteReason"
                          value={reason}
                          checked={deleteReason === reason}
                          onChange={() => setDeleteReason(reason)}
                        />
                        <span>{reason}</span>
                      </div>
                    ))}
                </div>
                {deleteReason === 'Other' && (
                  <input
                    type="text"
                    className="delete-other-input"
                    placeholder="Please specify your reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                )}
                <button
                  className="settings-save"
                  style={{ backgroundColor: '#b00020', width: '100%', marginTop: '10px' }}
                  onClick={handleDeleteAccount}
                >
                  Confirm Delete
                </button>
              </div>
            </>
          )
        },
        {
          key: 'password',
          label: 'Password',
          content: (
            <>
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
              <button
                className="settings-save"
                onClick={() => setOtpFlowType('password')}
              >
                Save Changes
              </button>
              <p
                className="settings-profile-edit"
                style={{ marginTop: '5px', cursor: 'pointer' }}
                onClick={() => setModalStep('forgotPassword')}
              >
                Forgot Password?
              </p>
            </>
          )
        },
        {
          key: 'notification',
          label: 'Notification',
          content: (
            <>
              {[
                'Scam Alerts', 'Silent Mode', 'High Risk Only', 'All Suspicious',
                'Instant Notification', 'Daily Summary', 'Enable Sound', 'Vibration'
              ].map(label => (
                <div className="settings-toggle-row" key={label}>
                  <span>{label}</span>
                  <Switch color="primary" />
                </div>
              ))}
            </>
          )
        }].map(({ key, label, content }) => (
          <div className="settings-section" key={key}>
            <div className="settings-section-header" onClick={() => toggleSection(key)}>
              <span>{label}</span>
              {expanded === key ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expanded === key && <div className="settings-section-body">{content}</div>}
          </div>
        ))}

        {/* Auto Detection */}
        <div className="settings-autodetect-row">
          <span>Auto Detection</span>
          <Switch color="primary" checked={autoDetection} onChange={() => setAutoDetection(!autoDetection)} />
        </div>

        {/* Priority */}
        <div className="settings-priority">
          <span>Priority</span>
          <div className="settings-radio-group">
            {['low', 'medium', 'high'].map(level => (
              <label key={level}>
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={priority === level}
                  onChange={() => setPriority(level)}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
          <div className="priority-msg">
            {priority === 'low' && <p>* Only major threats are flagged</p>}
            {priority === 'medium' && <p>* Balanced level with fewer warnings</p>}
            {priority === 'high' && <p>* Flags even slight suspicious activity</p>}
          </div>
        </div>

        <button className="settings-help">Help</button>
      </div>

      <div className="settings-blur-overlay" onClick={() => setIsOpen(false)}></div>
      {renderModalFlow()}
      {otpFlowType && (
        <UpdateOtpFlowModal
          type={otpFlowType}
          onClose={() => setOtpFlowType(null)} // Pass the onClose handler
          onComplete={() => console.log('OTP flow completed')} // Provide the required onComplete prop
        />
      )}
    </div>
  );
};

export default SettingsPopup;
