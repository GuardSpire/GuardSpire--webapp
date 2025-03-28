import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const SettingsPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [autoDetection, setAutoDetection] = useState(true);
  const [priority, setPriority] = useState('medium');
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpanded(prev => (prev === section ? null : section));
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
                  <p>{section} Settings go here</p>
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
