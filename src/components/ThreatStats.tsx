import React from 'react';

const weeklyStats = {
  totalThreats: 75,
  defended: 59,
  failed: 45,
  totalScanned: 88,
};

const calculatePercentage = (value: number, total: number) => {
  return total > 0 ? Math.round((value / total) * 100) : 0;
};

const ThreatStats: React.FC = () => {
  return (
    <div className="stats-container">
      {/* Total Threats */}
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-left">
            <div className="stat-header">
              <img src="src/assets/total-threat.png" alt="Total Threats" className="stat-icon" />
              <span>Total Threats</span>
            </div>
            <div className="stat-number">{weeklyStats.totalThreats}</div>
            <p className="stat-description">Results according to this week</p>
          </div>
          <div className="stat-percentage-card">
            <div className="percentage-ring">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="30" stroke="#ddd" strokeWidth="5" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#003366"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${calculatePercentage(weeklyStats.totalThreats, weeklyStats.totalScanned)} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="45" fontSize="12" fontWeight="bold" fill="#003366" textAnchor="middle">
                  {calculatePercentage(weeklyStats.totalThreats, weeklyStats.totalScanned)}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Repeat for Defended and Failed */}
      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-left">
            <div className="stat-header">
              <img src="src/assets/defend.png" alt="Defended" className="stat-icon" />
              <span>Defended</span>
            </div>
            <div className="stat-number">{weeklyStats.defended}</div>
            <p className="stat-description">Results according to this week</p>
          </div>
          <div className="stat-percentage-card">
            <div className="percentage-ring">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="30" stroke="#ddd" strokeWidth="5" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#003366"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${calculatePercentage(weeklyStats.defended, weeklyStats.totalScanned)} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="45" fontSize="12" fontWeight="bold" fill="#003366" textAnchor="middle">
                  {calculatePercentage(weeklyStats.defended, weeklyStats.totalScanned)}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-content">
          <div className="stat-left">
            <div className="stat-header">
              <img src="src/assets/failure.png" alt="Failed" className="stat-icon" />
              <span>Failed</span>
            </div>
            <div className="stat-number">{weeklyStats.failed}</div>
            <p className="stat-description">Results according to this week</p>
          </div>
          <div className="stat-percentage-card">
            <div className="percentage-ring">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="30" stroke="#ddd" strokeWidth="5" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  stroke="#003366"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${calculatePercentage(weeklyStats.failed, weeklyStats.totalScanned)} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="45" fontSize="12" fontWeight="bold" fill="#003366" textAnchor="middle">
                  {calculatePercentage(weeklyStats.failed, weeklyStats.totalScanned)}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatStats;
