import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SecurityModel: React.FC = () => {
  const [stable, setStable] = useState<number>(0);
  const [suspicious, setSuspicious] = useState<number>(0);
  const [critical, setCritical] = useState<number>(0);

  useEffect(() => {
    const fetchSecurityModel = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User not authenticated.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/dashboard/security-model', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStable(response.data.stable || 0);
        setSuspicious(response.data.suspicious || 0);
        setCritical(response.data.critical || 0);
      } catch (err) {
        console.error('Failed to fetch security model:', err);
      }
    };

    fetchSecurityModel();
  }, []);

  return (
    <div className="security-outer-card">
      <h3 className="section-title">Security Model Integrity</h3>

      <div className="security-inner-card">
        {/* Stable */}
        <div className="status-row">
          <span className="status-label">Stable:</span>
          <div className="status-bar">
            <div className="progress-bar" style={{ width: `${stable}%`, backgroundColor: 'green' }}></div>
          </div>
          <span className="status-percent">{stable}%</span>
        </div>

        {/* Suspicious */}
        <div className="status-row">
          <span className="status-label">Suspicious:</span>
          <div className="status-bar">
            <div className="progress-bar" style={{ width: `${suspicious}%`, backgroundColor: 'orange' }}></div>
          </div>
          <span className="status-percent">{suspicious}%</span>
        </div>

        {/* Critical */}
        <div className="status-row">
          <span className="status-label">Critical:</span>
          <div className="status-bar">
            <div className="progress-bar" style={{ width: `${critical}%`, backgroundColor: 'red' }}></div>
          </div>
          <span className="status-percent">{critical}%</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityModel;
