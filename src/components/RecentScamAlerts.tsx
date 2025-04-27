import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentScamAlerts: React.FC = () => {
  const [scamData, setScamData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/recent-alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const alerts = response.data.recentAlerts.map((alert: any) => {
          let color = 'gray';
          let percentage = 0;

          const threatLevel = alert.threatLevel?.toLowerCase();
          if (threatLevel === 'critical') {
            color = 'red';
            percentage = 100;
          } else if (threatLevel === 'suspicious') {
            color = 'orange';
            percentage = 60;
          } else if (threatLevel === 'stable') {
            color = 'green';
            percentage = 0;
          }

          return {
            ...alert,
            color,
            percentage,
          };
        });

        setScamData(alerts);
      } catch (err) {
        console.error('Failed to fetch scam alerts', err);
      }
    };

    fetchAlerts();
  }, []);

  const handleNavigate = (scan: any) => {
    navigate('/report', { state: { scan } });
  };

  return (
    <div className="recent-outer-card">
      <h3 className="section-title">Recent Scam Alerts</h3>
      <div className="recent-inner-card">
        <div className="scam-alert-header">
          <span>Detection</span>
          <span>Threat Level</span>
          <span>Status</span>
        </div>

        {scamData.map((item, index) => (
          <div
            className="scam-alert-row"
            key={index}
            onClick={() => handleNavigate(item)}
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
