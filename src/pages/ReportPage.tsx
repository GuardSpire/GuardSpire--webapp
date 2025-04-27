import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ReportPage: React.FC = () => {
  const location = useLocation();
  const scan = location.state?.scan;

  const [report, setReport] = useState<any>(scan || null);

  useEffect(() => {
    const fetchReport = async () => {
      if (scan) return; // ✅ already have from history
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/scan/manual/report/latest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReport(response.data);
      } catch (err) {
        console.error('Error fetching report:', err);
      }
    };

    fetchReport();
  }, [scan]);

  const getCircleColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'red';
      case 'suspicious':
        return 'orange';
      case 'stable':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (!report) return null;

  return (
    <div className="report-page">
      <Header />
      <Sidebar />

      <div className="report-container">
        <div className="report-header">
          <h2 className="report-title">{report.type || report.input || 'Scan Report'}</h2>
          <div className="report-percentage-wrapper">
            <div
              className="report-circle"
              style={{ borderColor: getCircleColor(report.threatLevel || report.status) }}
            >
              <span
                className="circle-text"
                style={{ color: getCircleColor(report.threatLevel || report.status) }}
              >
                {(report.threatPercentage
                  ? Math.round(report.threatPercentage * 100)
                  : report.percentage || 0)}%
              </span>
            </div>
            <p
              className="report-critical"
              style={{ color: getCircleColor(report.threatLevel || report.status) }}
            >
              {(report.threatLevel || report.status || '').toLowerCase()}
            </p>
          </div>
        </div>

        <div className="report-card">
          <p><strong>Alert Type:</strong> {report.type || 'N/A'}</p>
          <p><strong>Affected Platform:</strong> {report.platform || 'N/A'}</p>
          <p><strong>Suspicious URL:</strong> {report.url || report.input || 'N/A'}</p>
          <p><strong>Threat Level:</strong> {report.threatLevel || report.status || 'N/A'}</p>

          <p className="report-subtitle"><strong>Description:</strong></p>
          <p>{report.description || 'No description available.'}</p>

          <p className="report-subtitle"><strong>Indicators of Phishing:</strong></p>
          <ul>
            {(report.indicators || [
              'URL does not match official site.',
              'Request for personal/banking info.',
              'Too-good-to-be-true discounts.',
              'Pop-ups or suspicious design.'
            ]).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <p className="report-subtitle"><strong>Recommended Actions:</strong></p>
          <ul>
            {(report.actions || [
              'Avoid entering any personal data.',
              'Close the page immediately.',
              'Report this scam to authorities.',
              'Change passwords and monitor accounts.'
            ]).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <button className="report-button">Block & Report</button>

        <div className="report-footer">
          <div className="report-feedback-box">
            <p className="feedback-title">Feedbacks</p>
            <p>Do you think this alert is valid or a false alarm?</p>
            <p className="feedback-note">Your feedback helps improve our detection system.</p>
            <div className="feedback-options">
              <button className="feedback-btn">Yes</button>
              <button className="feedback-btn">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
