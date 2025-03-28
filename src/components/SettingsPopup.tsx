import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { Switch } from '@mui/material';
import { useSettings } from '../context/SettingsContext';

const SettingsPopup = () => {
  const { isOpen, position, setIsOpen } = useSettings();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [autoDetection, setAutoDetection] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const imagePopupRef = useRef<HTMLDivElement | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImagePopup(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowImagePopup(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (imagePopupRef.current && !imagePopupRef.current.contains(target)) {
        setShowImagePopup(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

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
          <img src="src/assets/user.png" alt="Profile" className="settings-profile-icon" />
          <div className="settings-profile-edit" onClick={handleEditClick}>
            <FaEdit className="edit-icon" /> <span>Edit</span>
          </div>
          {showImagePopup && (
            <div className="profile-image-popup" ref={imagePopupRef} onClick={(e) => e.stopPropagation()}>
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
              <input type="text" placeholder="Enter current username" />
              <label>New Username</label>
              <input type="text" placeholder="Enter new username" />
              <button className="settings-save">Save Changes</button>

              <label>Current Email</label>
              <input type="email" placeholder="Enter current email" />
              <label>New Email</label>
              <input type="email" placeholder="Enter new email" />
              <button className="settings-save">Save Changes</button>

              {/* 🔴 Delete Account */}
              <div className="delete-account">
                <p className="delete-title">Delete Account</p>
                <label className="delete-subtitle">
                  We are really sorry to see you go. Are you sure you want to delete your account?
                </label>

                <div className="delete-options-list">
                  {[
                    'No longer using my account',
                    'Service is not good',
                    'Don’t understand how to use',
                    'Don’t need anymore',
                    'Other'
                  ].map(reason => (
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
              <button className="settings-save">Save Changes</button>
            </>
          )
        },
        {
          key: 'notification',
          label: 'Notification',
          content: (
            <>
              {[
                'Scam Alerts',
                'Silent Mode',
                'High Risk Only',
                'All Suspicious',
                'Instant Notification',
                'Daily Summary',
                'Enable Sound',
                'Vibration',
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
            {priority === 'medium' && <p>* A balanced level that detects most scams with fewer warnings.</p>}
            {priority === 'high' && <p>* Flags even slight suspicious activity for maximum protection.</p>}
          </div>
        </div>

        <button className="settings-help">Help</button>
      </div>

      <div className="settings-blur-overlay" onClick={() => setIsOpen(false)}></div>
    </div>
  );
};

export default SettingsPopup;
