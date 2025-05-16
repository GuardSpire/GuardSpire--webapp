import React, { useState } from 'react';
import axios from 'axios';

const QuickScan: React.FC = () => {
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [totalScanned, setTotalScanned] = useState<number>(0);
  const [scamsDetected, setScamsDetected] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleQuickScan = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('User not authenticated. Please sign in.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/quick-scan', {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = response.data;

      // Handle known backend error cases
      if (data.error) {
        if (data.error.includes("'list' object has no attribute 'values'")) {
          alert("Scan data format not supported in web yet. Please use the mobile app.");
        } else if (data.error.includes("Missing Authorization header")) {
          alert("Authorization failed. Please sign in again.");
        } else {
          alert(data.error || "An unexpected error occurred.");
        }

        setScanProgress(0);
        setTotalScanned(0);
        setScamsDetected(0);
        setLoading(false);
        return;
      }

      // Normal data structure
      if (
        typeof data.protectionPercent === 'number' &&
        typeof data.totalScanned === 'number' &&
        typeof data.scamsDetected === 'number'
      ) {
        setScanProgress(data.protectionPercent);
        setTotalScanned(data.totalScanned);
        setScamsDetected(data.scamsDetected);
      } else {
        console.error('Unexpected response structure:', data);
        alert('Unexpected data received from server.');
      }

    } catch (err: any) {
      console.error('Quick Scan failed:', err);
      const errorMessage = err?.response?.data?.error || err.message || 'Quick Scan failed. Check console for details.';
      alert(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="quickscan-container">
      <div className="circle-wrapper">
        <svg width="200" height="200">
          <circle
            cx="100"
            cy="100"
            r="85"
            stroke="#e6e6e6"
            strokeWidth="15"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            stroke="url(#blueGradient)"
            strokeWidth="15"
            fill="none"
            strokeDasharray={`${(scanProgress * 534) / 100} 534`}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfc8da" />
              <stop offset="100%" stopColor="#002d72" />
            </linearGradient>
          </defs>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill="#002d72"
          >
            {scanProgress}%
          </text>
        </svg>
      </div>

      <button className="quickscan-btn" onClick={handleQuickScan} disabled={loading}>
        {loading ? 'Scanning...' : 'Quick Scan'}
      </button>

      {totalScanned > 0 && (
        <div className="quickscan-summary">
          <p><strong>Total Scans:</strong> {totalScanned}</p>
          <p><strong>Scams Detected:</strong> {scamsDetected}</p>
        </div>
      )}
    </div>
  );
};

export default QuickScan;
