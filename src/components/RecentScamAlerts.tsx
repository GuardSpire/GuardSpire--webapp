import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecentScamAlerts: React.FC = () => {
  const [scamData, setScamData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage("User not authenticated.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/recent-alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        if (data.error) {
          if (data.error.includes("'list' object has no attribute 'values'")) {
            setErrorMessage("Scan data format not supported in web. Please use the mobile app.");
          } else {
            setErrorMessage(data.error || "Failed to fetch scam alerts.");
          }
          return;
        }

        const alerts = data.recentAlerts || [];
        // Log the raw alerts to debug the number of records returned by the API
        console.log('Raw alerts from API:', alerts);

        // Remove duplicates based on scanId
        const uniqueAlerts = [];
        const seenScanIds = new Set();
        for (const alert of alerts) {
          const scanId = alert.scan_id || alert.scanId;
          if (!seenScanIds.has(scanId)) {
            seenScanIds.add(scanId);
            uniqueAlerts.push(alert);
          }
        }

        // Log the unique alerts to debug the deduplication process
        console.log('Unique alerts after deduplication:', uniqueAlerts);

        // Take the first 10 unique alerts
        const displayAlerts = uniqueAlerts.slice(0, 10);

        // Log the final display alerts
        console.log('Final alerts to display:', displayAlerts);

        const processedAlerts = displayAlerts.map((alert: any) => {
          const threatLevel = alert.threatLevel?.toLowerCase() || 'stable';
          const percentage = Math.round(alert.threatPercentage ?? 0);

          let color = '#4CAF50';
          if (threatLevel === 'critical') {
            color = '#FF0000';
          } else if (threatLevel === 'suspicious') {
            color = '#FFD700';
          } else if (threatLevel === 'stable' || threatLevel === 'legitimate') {
            color = '#4CAF50';
          }

          return {
            ...alert,
            scanId: alert.scan_id || alert.scanId, // Ensure scanId is set
            color,
            percentage,
          };
        });

        setScamData(processedAlerts);
        setErrorMessage(null);
      } catch (err: any) {
        console.error('Failed to fetch scam alerts', err);
        setErrorMessage(err?.response?.data?.error || 'Failed to load alerts.');
      }
    };

    fetchAlerts();
  }, []);

  const handleNavigate = (scan: any) => {
    console.log('Navigating with scan:', scan);
    navigate('/report', { state: { scan: { scanId: scan.scanId, ...scan } } });
  };

  return (
    <div className="recent-outer-card">
      <h3 className="section-title">Recent Scam Alerts</h3>

      {errorMessage ? (
        <div style={{ color: 'red', marginTop: 10 }}>{errorMessage}</div>
      ) : (
        <div className="recent-inner-card">
          <div
            className="scam-alert-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              padding: '0 10px',
              marginBottom: 10,
            }}
          >
            <span style={{ width: '30%' }}>Detection</span>
            <span style={{ width: '50%' }}>Threat Level</span>
            <span style={{ width: '20%', textAlign: 'right' }}>Status</span>
          </div>

          {scamData.length === 0 ? (
            <p style={{ marginTop: 10, textAlign: 'center' }}>No recent alerts</p>
          ) : (
            scamData.map((item, index) => (
              <div
                className="scam-alert-row"
                key={index}
                onClick={() => handleNavigate(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  cursor: 'pointer',
                }}
              >
                <span className="alert-text" style={{ width: '30%' }}>{item.platform || 'Unknown'}</span>

                <div
                  className="bar"
                  style={{
                    width: '50%',
                    height: 10,
                    backgroundColor: '#eee',
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>

                <span
                  className="alert-percent"
                  style={{ width: '20%', textAlign: 'right', fontWeight: 'bold' }}
                >
                  {item.percentage}%
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecentScamAlerts;