import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SecurityModel: React.FC = () => {
  const [stable, setStable] = useState<number>(0);
  const [suspicious, setSuspicious] = useState<number>(0);
  const [critical, setCritical] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityModel = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('User not authenticated.');
          setErrorMessage('You are not signed in.');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/dashboard/security-model', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;

        if (data.error) {
          if (data.error.includes("'list' object has no attribute 'values'")) {
            setErrorMessage("Scan data format not supported in web yet. Please use the mobile app.");
          } else {
            setErrorMessage(data.error);
          }
          return;
        }

        setStable(data.stable || 0);
        setSuspicious(data.suspicious || 0);
        setCritical(data.critical || 0);
        setErrorMessage(null); // Clear error if successful

      } catch (err: any) {
        console.error('Failed to fetch security model:', err);
        setErrorMessage(err?.response?.data?.error || 'Failed to load security model.');
      }
    };

    fetchSecurityModel();
  }, []);

  return (
    <div className="security-outer-card">
      <h3 className="section-title">Security Model Integrity</h3>

      {errorMessage ? (
        <div style={{ color: 'red', marginTop: 10 }}>{errorMessage}</div>
      ) : (
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
      )}
    </div>
  );
};

export default SecurityModel;
