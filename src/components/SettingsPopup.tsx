import { useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Switch } from '@mui/material';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';
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
  const [otpFlowType, setOtpFlowType] = useState<'email' | 'password' | null>(null);
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const imagePopupRef = useRef<HTMLDivElement | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImagePopup(true);
  };

  const updateUsername = async () => {
    const token = localStorage.getItem('token');
    if (!currentUsername || !newUsername) {
      setMessage('Please enter both current and new username.');
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/account/update-info', {
        currentUsername,
        newUsername,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Username updated successfully!');
      setCurrentUsername('');
      setNewUsername('');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update username.');
    }
  };

  const handleSaveChanges = async (type: 'email' | 'password') => {
  const token = localStorage.getItem('token');
  if (!token) {
    setMessage('Unauthorized. Please log in.');
    return;
  }

  if (type === 'email' && (!currentEmail || !newEmail)) {
    setMessage('Please enter both current and new email.');
    return;
  }
  if (type === 'password' && (!currentPassword || !newPassword)) {
    setMessage('Please enter both current and new password.');
    return;
  }

  try {
    await axios.post('http://localhost:5000/api/account/request-otp-update', 
      { type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (type === 'email') {
      localStorage.setItem('currentEmail', currentEmail);
      localStorage.setItem('newEmail', newEmail);
    } else {
      localStorage.setItem('currentPassword', currentPassword);
      localStorage.setItem('newPassword', newPassword);
    }
    setOtpFlowType(type);
  } catch (error: any) {
    setMessage(error.response?.data?.error || 'Failed to request OTP.');
  }
};

// Render UpdateOtpFlowModal
  {otpFlowType && (
    <UpdateOtpFlowModal
      type={otpFlowType}
      onClose={() => setOtpFlowType(null)}
      onComplete={() => {
        if (otpFlowType === 'email') {
          setMessage('Email updated successfully!');
          setCurrentEmail('');
          setNewEmail('');
        } else if (otpFlowType === 'password') {
          setMessage('Password updated successfully!');
          setCurrentPassword('');
          setNewPassword('');
        }
        setOtpFlowType(null);
      }}
    />
  )}

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Unauthorized. Please log in.');
      return;
    }

    const reason = deleteReason === 'Other' && otherReason.trim() ? otherReason : deleteReason;
    if (!reason) {
      setMessage('Please select or enter a reason for deletion.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/delete/reason', 
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalStep('deleteConfirm');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to save delete reason.');
    }
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
        return (
          <DeletePasswordModal
            onNext={(isCorrect: boolean) => {
              if (isCorrect) {
                setModalStep('finalDelete');
              } else {
                setModalStep('forgotPassword');
              }
            }}
          />
        );
      case 'forgotPassword':
        return <ForgotPasswordModal onNext={() => setModalStep('otpMessage')} />;
      case 'otpMessage':
        return <OtpSentModal onNext={() => setModalStep('resetPassword')} />;
      case 'resetPassword':
        return <ResetPasswordModal onNext={() => setModalStep('finalDelete')} />;
      case 'finalDelete':
        return (
          <DeleteConfirmModal
            onBack={() => setModalStep('')}
            onYes={async () => {
              try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/delete/final', {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setModalStep('thankyou');
              } catch (error: any) {
                setMessage(error.response?.data?.error || 'Failed to delete account.');
              }
            }}
          />
        );
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
        <div className="settings-profile">
          <img src="/user.png" alt="Profile" className="settings-profile-icon" />
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

        {[{
          key: 'personal',
          label: 'Personal Details',
          content: (
            <>
              <label>Current Username</label>
              <input
                type="text"
                placeholder="Enter current username"
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
              />
              <label>New Username</label>
              <input
                type="text"
                placeholder="Enter new username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button className="settings-save" onClick={updateUsername}>Save Changes</button>
              <label>Current Email</label>
              <input
                type="email"
                placeholder="Enter current email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
              />
              <label>New Email</label>
              <input
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button className="settings-save" onClick={() => handleSaveChanges('email')}>
                Save Changes
              </button>
              <div className="delete-account">
                <p className="delete-title">Delete Account</p>
                <label className="delete-subtitle">
                  We are sorry to see you go. Are you sure you want to delete your account?
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
              <div className="auth-password-container">
                <input
                  className="auth-input"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span className="auth-eye" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <label>New Password</label>
              <div className="auth-password-container">
                <input
                  className="auth-input"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className="auth-eye" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <button className="settings-save" onClick={() => handleSaveChanges('password')}>
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

        <div className="settings-autodetect-row">
          <span>Auto Detection</span>
          <Switch color="primary" checked={autoDetection} onChange={() => setAutoDetection(!autoDetection)} />
        </div>

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
        {message && <p style={{ color: message.includes('successfully') ? 'lime' : 'red', marginTop: '10px' }}>{message}</p>}
      </div>

      <div className="settings-blur-overlay" onClick={() => setIsOpen(false)}></div>
      {renderModalFlow()}
      {otpFlowType && (
        <UpdateOtpFlowModal
          type={otpFlowType}
          onClose={() => setOtpFlowType(null)}
          onComplete={() => {
            if (otpFlowType === 'email') {
              setMessage('Email updated successfully!');
              setCurrentEmail('');
              setNewEmail('');
            } else if (otpFlowType === 'password') {
              setMessage('Password updated successfully!');
              setCurrentPassword('');
              setNewPassword('');
            }
            setOtpFlowType(null);
          }}
        />
      )}
    </div>
  );
};

export default SettingsPopup;