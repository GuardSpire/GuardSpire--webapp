import React from 'react';

const SecurityModel: React.FC = () => {
  return (
    <div className="security-outer-card">
      <h3 className="section-title">Security Model Integrity</h3>

      <div className="security-inner-card">
        {/* Stable */}
        <div className="status-row">
          <span className="status-label">Stable:</span>
          <div className="status-bar">
            <div className="progress-bar" style={{ width: '70%', backgroundColor: 'green' }}></div>
          </div>
          <span className="status-percent">70%</span>
        </div>

        {/* Suspicious */}
        <div className="status-row">
          <span className="status-label">Suspicious:</span>
          <div className="status-bar">
            <div className="progress-bar" style={{ width: '90%', backgroundColor: 'orange' }}></div>
          </div>
          <span className="status-percent">90%</span>
        </div>

        {/* Critical */}
        <div className="status-row">
          <span className="status-label">Critical:</span>
          <div className="status-bar">
            <div className="progress-bar" style={{ width: '50%', backgroundColor: 'red' }}></div>
          </div>
          <span className="status-percent">50%</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityModel;
