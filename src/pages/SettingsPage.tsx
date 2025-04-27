import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const SettingsPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [autoDetection, setAutoDetection] = useState(true);
  const [priority, setPriority] = useState('medium');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
  };

  const handleUsernameUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:5000/api/account/update-info', {
        currentUsername,
        newUsername,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || "Username updated!");
    } catch (err: any) {
      console.error('Update failed:', err);
      setMessage(err.response?.data?.error || "Failed to update username.");
    }
  };

  return (
    <div className="settings-container">
      <Sidebar />
      <div className="settings-content">
        <Header />
        <div className="settings-blur-overlay" />

        <div className="settings-popup-card">
          <div className="settings-profile">
            <img src="/user.png" alt="User" className="settings-avatar" />
            <div className="settings-edit-row">
              <span>Edit</span>
              <span className="edit-icon">✏️</span>
            </div>
          </div>

          {/* Collapsible Sections */}
          {['Personal Details', 'Password', 'Notification'].map(section => (
            <div key={section}>
              <div className="settings-section-header" onClick={() => toggleSection(section)}>
                <span>{section}</span>
                <span>{expanded === section ? '−' : '+'}</span>
              </div>
              {expanded === section && (
                <div className="settings-section-content">
                  {section === 'Personal Details' ? (
                    <>
                      <input
                        type="text"
                        placeholder="Current Username"
                        value={currentUsername}
                        onChange={(e) => setCurrentUsername(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                      />
                      <input
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        style={{ width: '100%', marginBottom: '10px' }}
                      />
                      <button className="feedback-btn" onClick={handleUsernameUpdate}>Save Changes</button>
                      {message && <p style={{ color: 'lime', marginTop: '10px' }}>{message}</p>}
                    </>
                  ) : (
                    <p>{section} Settings go here</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Auto Detection */}
          <div className="settings-toggle-row">
            <span>Auto Detection</span>
            <label className="switch">
              <input type="checkbox" checked={autoDetection} onChange={() => setAutoDetection(!autoDetection)} />
              <span className="slider round" />
            </label>
          </div>

          {/* Priority */}
          <div className="priority-section">
            <label>Priority</label>
            <div className="priority-options">
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
            <p className="priority-hint">
              {priority === 'low'
                ? 'Only major threats are flagged.'
                : priority === 'medium'
                ? 'Balanced level with fewer alerts.'
                : 'Maximum protection, more alerts.'}
            </p>
          </div>

          <button className="help-button" onClick={() => navigate('/help')}>Help</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
