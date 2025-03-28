import React from 'react';

interface QuickScanProps {
  scanProgress?: number; // Optional prop (default to 85)
}

const QuickScan: React.FC<QuickScanProps> = ({ scanProgress = 85 }) => {
  const handleQuickScan = () => {
    alert("Quick Scan initiated (simulate scan)!");
    // Implement real scan logic here later
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
      <button className="quickscan-btn" onClick={handleQuickScan}>
        Quick Scan
      </button>
    </div>
  );
};

export default QuickScan;
