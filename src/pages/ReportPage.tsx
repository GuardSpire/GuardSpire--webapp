import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scanId: routeScanId } = useParams();
  const stateScan = location.state?.scan;

  const scanId = stateScan?.scanId || stateScan?.scan_id || routeScanId;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReported, setIsReported] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      let token = localStorage.getItem('token');

      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        navigate('/');
        return;
      }

      if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
      }

      if (!scanId) {
        setError('Scan ID not provided.');
        setLoading(false);
        return;
      }

      try {
        const endpoint = `http://localhost:5000/api/scan/manual/report/${scanId}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: token },
        });

        setReport(response.data);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Failed to load report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [scanId, navigate]);

  const handleBlockAndReport = async () => {
    let token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated.');
      return;
    }

    if (!token.startsWith('Bearer ')) {
      token = `Bearer ${token}`;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/scan/manual/report/${scanId}/report`,
        {},
        { headers: { Authorization: token } }
      );

      setIsReported(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to block and report.');
    }
  };

  const handleFeedback = async (isValid: boolean) => {
    let token = localStorage.getItem('token');
    if (!token) {
      setFeedbackStatus('You must be logged in.');
      return;
    }

    if (!token.startsWith('Bearer ')) {
      token = `Bearer ${token}`;
    }

    if (!scanId || !report?.input || !report?.threatCategory) {
      setFeedbackStatus('Missing data for feedback.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/scan/manual/feedback/${scanId}`,
        {
          feedback: isValid,
          input: report.input,
          original_category: report.threatCategory,
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      setFeedbackStatus(
        isValid ? 'Thank you for confirming.' : 'Thank you. We will review this further.'
      );
    } catch (err: any) {
      setFeedbackStatus('Failed to submit feedback.');
    }
  };

  const renderPercentageCircle = (percent: number, color: string) => {
    const radius = 45;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);

    return (
      <svg width="100" height="100">
        <circle cx="50" cy="50" r={radius} stroke="#eee" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" fontSize="18" fill={color} fontWeight="bold">
          {`${percent.toFixed(0)}%`}
        </text>
      </svg>
    );
  };

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>{error}</div>;
  if (!report) return <div>No report found.</div>;

  // Parse threat level
  const rawThreat =
    report?.threatPercentage ??
    report?.combined_threat?.confidence ??
    report?.text_analysis?.confidence ??
    report?.text_analysis?.threat_level ??
    0;

  const threatPercent =
    typeof rawThreat === 'string'
      ? parseFloat(rawThreat.replace('%', ''))
      : typeof rawThreat === 'number' && rawThreat <= 1
      ? rawThreat * 100
      : rawThreat;

  const category = (report.threatCategory || report.text_analysis?.category || 'Legitimate').toLowerCase();
  const label =
    category === 'critical' ? 'Scam Alert' :
    category === 'suspicious' ? 'Potential Threat' : 'Legitimate';

  const color =
    category === 'critical' ? '#FF0000' :
    category === 'suspicious' ? '#FFD700' : '#4CAF50';

  const indicators = report.indicators || [];
  const actions = report.actions || [];
  const description = report.description || report.text_analysis?.description || 'No description provided.';

  return (
    <div className="report-page">
      <Header />
      <Sidebar />
      <div className="report-container">
        <div className="report-header">
          <h2 className="report-title">{label}</h2>
          <div className="report-percentage-wrapper">
            {renderPercentageCircle(threatPercent, color)}
            <p className="report-critical" style={{ color }}>{category}</p>
          </div>
        </div>

        <div className="report-card">
          <p><strong>Alert Type:</strong> {label}</p>
          <p><strong>Input:</strong> {report.input || 'N/A'}</p>
          <p><strong>Threat Level:</strong> {category}</p>

          <p className="report-subtitle"><strong>Description:</strong></p>
          <p>{description}</p>

          <p className="report-subtitle"><strong>Indicators:</strong></p>
          <ul>{indicators.map((item: string, idx: number) => <li key={idx}>{item}</li>)}</ul>

          <p className="report-subtitle"><strong>Recommended Actions:</strong></p>
          <ul>{actions.map((item: string, idx: number) => <li key={idx}>{item}</li>)}</ul>
        </div>

        <button
          className="report-button"
          onClick={handleBlockAndReport}
          disabled={isReported}
          style={{
            backgroundColor: '#04366D',
            color: '#fff',
            cursor: isReported ? 'not-allowed' : 'pointer',
          }}
        >
          {isReported ? 'Reported' : 'Block & Report'}
        </button>

        <div className="report-footer">
          <div className="report-feedback-box">
            <p className="feedback-title">Feedback</p>
            <p>Do you think this alert is valid or a false alarm?</p>
            <p className="feedback-note">Your feedback helps improve our detection system.</p>
            <div className="feedback-options">
              <button className="feedback-btn" onClick={() => handleFeedback(true)}>Yes</button>
              <button className="feedback-btn" onClick={() => handleFeedback(false)}>No</button>
            </div>
            {feedbackStatus && (
              <p style={{ marginTop: 10, fontStyle: 'italic' }}>{feedbackStatus}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
