import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockWarningModal from '../modals/BlockWarningModal';
import BlockReportWarningModal from '../modals/BlockReportWarningModal';
import AllowWarningModal from '../modals/AllowWarningModal';

const WarningPopup = () => {
  const [action, setAction] = useState('');
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleFullClose = () => {
    setAction('');
    setVisible(false);
  };

  const handleLearnMore = () => {
    setVisible(false);
    navigate('/report');
  };

  return (
    <>
      {visible && (
        <div className="m-warning-popup-overlay">
          <div className="m-warning-popup-box">
            <img src="./src/assets/logo.png" alt="logo Icon" className="m-warning-popup-icon" />
            <p className="m-warning-popup-title red">Warning: Potential Threat Detected!</p>
            <p className="m-warning-popup-msg">
              This content may steal your personal information or passwords. It’s recommended to close this page immediately.
            </p>
            <div className="m-warning-popup-links">
              <span onClick={() => setAction('block')}>Block</span>
              <span onClick={() => setAction('blockReport')}>Block & Report</span>
              <span onClick={() => setAction('allow')}>Allow</span>
              <span onClick={handleLearnMore}>Learn More..</span>
            </div>
          </div>
        </div>
      )}

      {action === 'block' && (
        <BlockWarningModal
          onClose={() => setAction('')}
          onFullClose={handleFullClose}
        />
      )}

      {action === 'blockReport' && (
        <BlockReportWarningModal
          onClose={() => setAction('')}
          onFullClose={handleFullClose}
        />
      )}

      {action === 'allow' && (
        <AllowWarningModal
          onClose={() => setAction('')}
          onFullClose={handleFullClose}
        />
      )}
    </>
  );
};

export default WarningPopup;
