import React from 'react';
import Header from '../components/Header'; // Adjust the path based on your project structure
import Sidebar from '../components/Sidebar'; // Adjust the path based on your project structure

const ReportPage: React.FC = () => {
  return (
    <div className="report-page">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="report-container">
        {/* Top Header */}
        <div className="report-header">
          <h2 className="report-title">Phishing Attack</h2>
          <div className="report-percentage-wrapper">
            <div className="report-circle">
              <span className="circle-text">100%</span>
            </div>
            <p className="report-critical">Critical</p>
          </div>
        </div>

        {/* Report Details Card */}
        <div className="report-card">
          <p><strong>Alert Type:</strong> Phishing Scam</p>
          <p><strong>Affected Platform:</strong> Online Shopping (Daraz Impersonation)</p>
          <p><strong>Suspicious URL:</strong> daraz-lk-offer.com</p>
          <p><strong>Threat Level:</strong> High</p>

          <p className="report-subtitle"><strong>Description:</strong></p>
          <p>
            This website appears to impersonate Daraz, a legitimate e-commerce platform. 
            It may be designed to steal login credentials, payment details, or personal information 
            by luring users with fake discounts, promotions, or giveaways.
          </p>

          <p className="report-subtitle"><strong>Indicators of Phishing:</strong></p>
          <ul>
            <li>The URL does not match the official Daraz domain.</li>
            <li>The website may request sensitive information such as bank details or passwords.</li>
            <li>Offers and discounts appear too good to be true.</li>
            <li>Poor website design or unusual pop-ups asking for personal information.</li>
          </ul>

          <p className="report-subtitle"><strong>Recommended Actions:</strong></p>
          <ul>
            <li>Do not enter any personal or payment details.</li>
            <li>Close the website immediately and do not click on any links.</li>
            <li>Report the phishing attempt to Daraz and relevant cybersecurity authorities.</li>
            <li>If any details were entered, immediately reset passwords and monitor financial transactions.</li>
          </ul>
        </div>

        {/* Bottom Feedback + Report */}
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
          <button className="report-button">Block & Report</button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
