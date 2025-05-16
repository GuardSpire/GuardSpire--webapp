import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MsgUrlScanner = () => {
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleScan = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Please enter a message or URL to scan.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('User not authenticated. Please sign in.');
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setScanComplete(false);
    setErrorMessage('');

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.1;
      });
    }, 200);

    try {
      const scanResponse = await axios.post(
        'http://localhost:5000/api/scan/manual',
        { input: inputText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { scan_id, error, warnings } = scanResponse.data;

      if (error) {
        setErrorMessage(error);
        setIsScanning(false);
        clearInterval(interval);
        return;
      }

      // Handle warnings (e.g., Firebase save failure)
      if (warnings?.length) {
        setErrorMessage(warnings.join('; '));
      }

      const reportResponse = await axios.get(
        `http://localhost:5000/api/scan/manual/report/${scan_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanResult(reportResponse.data);
      setScanComplete(true);
      setIsScanning(false);
    } catch (error: any) {
      console.error('Scan failed:', error);
      setErrorMessage(
        error.response?.status === 404
          ? 'Scan report not found. Please try again.'
          : 'Scan failed. Please try again.'
      );
      setIsScanning(false);
      clearInterval(interval);
    }
  };

  const getColor = (category: string = '', type: string = '') => {
    const normalized = (type || category || '').toLowerCase();
    if (['scam alert', 'critical', 'scam', 'phishing'].includes(normalized)) return '#FF0000';
    if (['potential threat', 'suspicious'].includes(normalized)) return '#FFD700';
    return '#4CAF50';
  };

  const getDetectionLabel = (category: string = '', type: string = '') => {
    const normalized = (type || category || '').toLowerCase();
    if (['scam alert', 'critical', 'scam', 'phishing'].includes(normalized)) return 'Scam Alert';
    if (['potential threat', 'suspicious'].includes(normalized)) return 'Potential Threat';
    if (['legitimate', 'stable'].includes(normalized)) return 'Legitimate';
    return 'Legitimate';
  };

  const getThreatPercentage = (scanData: any) => {
    if (scanData?.threatPercentage !== undefined) {
      const raw = scanData.threatPercentage;
      const val = typeof raw === 'string' ? parseFloat(raw.replace('%', '')) / 100 : parseFloat(raw);
      return isNaN(val) ? 0 : val;
    }

    if (scanData?.combined_threat?.score !== undefined) {
      const score = parseFloat(scanData.combined_threat.score);
      return isNaN(score) ? 0 : score / 9.5;
    }

    if (scanData?.text_analysis?.threat_level !== undefined) {
      const level = parseFloat(scanData.text_analysis.threat_level);
      return isNaN(level) ? 0 : level / 9.5;
    }

    return 0;
  };

  const getThreatCategory = (scanData: any) => {
    if (scanData?.threatCategory) return scanData.threatCategory;
    if (scanData?.text_analysis?.category) return scanData.text_analysis.category;
    if (scanData?.combined_threat?.category) return scanData.combined_threat.category;
    return 'Legitimate';
  };

  const getDescription = (scanData: any) => {
    if (scanData?.description && scanData.description !== 'No description available.') {
      return scanData.description;
    }
    if (scanData?.text_analysis?.description) {
      return scanData.text_analysis.description;
    }

    const confidence = (getThreatPercentage(scanData) * 100).toFixed(1);
    const category = getThreatCategory(scanData);
    return `Classified as ${category} (Confidence: ${confidence}%)`;
  };

  const threatCategory = scanComplete ? getThreatCategory(scanResult) : '';
  const threatLabel = getDetectionLabel(threatCategory);
  const threatColor = getColor(threatCategory);
  const threatPercent = getThreatPercentage(scanResult);
  const description = getDescription(scanResult);

  return (
    <div className="scanner-outer">
      <h2 className="scanner-title">Msg & URL Scanner</h2>

      {errorMessage && (
        <div className="scanner-error" style={{ color: '#FF0000', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}

      <div className="scanner-inner">
        <div className={`scanner-input-box ${isScanning ? 'disabled' : ''}`}>
          {isScanning ? (
            <div className="scanner-progress">
              <svg className="scanner-ring" width="100" height="100">
                <circle cx="50" cy="50" r="45" stroke="#ddd" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#04366D"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="283"
                  strokeDashoffset={`${283 - 283 * progress}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="58" textAnchor="middle" fontSize="20" fill="#04366D" fontWeight="bold">
                  {Math.round(progress * 100)}%
                </text>
              </svg>
            </div>
          ) : (
            <textarea
              className="scanner-input"
              placeholder="+ Add a Message or a URL to Scan"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isScanning}
            />
          )}
        </div>

        <button className="scanner-button" onClick={handleScan} disabled={isScanning}>
          Scan
        </button>

        {scanComplete && scanResult && (
          <>
            <h3 className="scanner-subtitle">Status</h3>
            <div className="scanner-status-card">
              <div className="scanner-status-header">{threatLabel}</div>

              <div className="scanner-status-body">
                <div className="scanner-status-row">
                  <p className="scanner-status-label">Threat Level</p>
                  <div className="scanner-threat-bar">
                    <div
                      style={{
                        width: `${Math.round(threatPercent * 100)}%`,
                        height: '100%',
                        backgroundColor: threatColor,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div className="scanner-status-row">
                  <p className="scanner-status-label">Status</p>
                  <p
                    className="scanner-critical"
                    style={{ fontWeight: 'bold', color: threatColor }}
                  >
                    {threatLabel}
                  </p>
                </div>
              </div>

              <div className="scanner-percentage-badge">
                <div
                  className="scanner-badge-circle"
                  style={{ borderColor: threatColor, color: threatColor }}
                >
                  <span>{Math.round(threatPercent * 100)}%</span>
                </div>
              </div>
            </div>

            <h3 className="scanner-subtitle">Alert Details & Insights</h3>
            <div className="scanner-alert-card">
              <p><strong>Alert Type:</strong> {threatLabel}</p>
              <p><strong>Affected Platform:</strong> {scanResult.platform || scanResult.affectedPlatform || 'N/A'}</p>
              <p><strong>Suspicious URL:</strong> {scanResult.url || scanResult.suspiciousUrl || 'N/A'}</p>
              <p><strong>Threat Level:</strong> {threatLabel}</p>
              <p><strong>Description:</strong> {description}</p>
            </div>

            <button
              className="scanner-more-btn"
              onClick={() => navigate('/report', { state: { scan: scanResult } })}
            >
              ... More Details
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MsgUrlScanner;