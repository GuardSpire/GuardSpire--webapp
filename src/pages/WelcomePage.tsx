import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ThreatStats from '../components/ThreatStats';
import QuickScan from '../components/QuickScan';
import SecurityModel from '../components/SecurityModel';
import RecentScamAlerts from '../components/RecentScamAlerts';
import MsgUrlScanner from '../components/MsgUrlScanner';

const WelcomePage: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header />

        {/* Row 1: Stat Cards */}
        <div className="stats-wrapper">
          <ThreatStats />
        </div>

        {/* Row 2: QuickScan + RecentScamAlerts */}
        <div className="row-two">
          <div className="left-column">
            <QuickScan />
            <SecurityModel />
          </div>
          <div className="right-column">
            <RecentScamAlerts />
          </div>
        </div>

        {/* Row 3: Security Model + MsgURL Scanner */}
        <div className="row-three">
          <MsgUrlScanner />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
