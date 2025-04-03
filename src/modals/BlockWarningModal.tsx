type BlockWarningPopupProps = {
  onClose: () => void;
  onFullClose: () => void;
};

const BlockWarningPopup: React.FC<BlockWarningPopupProps> = ({ onClose, onFullClose }) => {
  return (
    <div className="warning-popup-overlay" onClick={onClose}>
      <div className="warning-popup-box warning-popup-box-yellow" onClick={(e) => e.stopPropagation()}>
        <img src="./src/assets/warning-yellow.png" alt="Warning" className="warning-popup-icon" />
        <p className="warning-popup-title">Warning !</p>
        <p className="warning-popup-msg">
          "This website may be unsafe. Are you sure you want to continue?"
        </p>
        <div className="warning-popup-links">
          <span onClick={onClose}>Go Back</span>
          <span onClick={onFullClose}>Block</span>
        </div>
      </div>
    </div>
  );
};

export default BlockWarningPopup;
