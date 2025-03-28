import React from 'react';
import { useNavigate } from 'react-router-dom';

const scamData = [
  { type: 'Phishing Attack', percentage: 100, color: 'red' },
  { type: 'Job Scam', percentage: 85, color: 'yellow' },
  { type: 'Sampath Bank', percentage: 60, color: 'green' },
  { type: 'Phishing Attack', percentage: 100, color: 'red' },
  { type: 'Job Scam', percentage: 85, color: 'yellow' },
  { type: 'Sampath Bank', percentage: 60, color: 'green' },
  { type: 'Phishing Attack', percentage: 100, color: 'red' },
  { type: 'Job Scam', percentage: 85, color: 'yellow' },
  { type: 'Sampath Bank', percentage: 60, color: 'green' },
  { type: 'Phishing Attack', percentage: 100, color: 'red' },
  { type: 'Job Scam', percentage: 85, color: 'yellow' },
  { type: 'Sampath Bank', percentage: 60, color: 'green' },
];

const RecentScamAlerts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="recent-outer-card">
      <h3 className="section-title">Recent Scam Alerts</h3>
      <div className="recent-inner-card">
        {/* Header */}
        <div className="scam-alert-header">
          <span>Detection</span>
          <span>Threat Level</span>
          <span>Status</span>
        </div>

        {/* Alerts */}
        {scamData.map((item, index) => (
          <div
            className="scam-alert-row"
            key={index}
            onClick={() => navigate('/report')}
          >
            <span className="alert-text">{item.type}</span>
            <div className="bar">
              <div
                className="progress-bar"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            <span className="alert-percent">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentScamAlerts;
