type AllowWarningPopupProps = {
  onClose: () => void;
  onFullClose: () => void;
};

const AllowWarningPopup: React.FC<AllowWarningPopupProps> = ({ onClose, onFullClose }) => {
  return (
    <div className="warning-popup-overlay" onClick={onClose}>
      <div className="warning-popup-box warning-popup-box-red" onClick={(e) => e.stopPropagation()}>
        <img src="./src/assets/warning-red.png" alt="Warning" className="warning-popup-icon" />
        <p className="warning-popup-title">Warning !</p>
        <p className="warning-popup-msg">
          "This website is flagged as a potential threat. Are you sure you want to continue?"
        </p>
        <div className="warning-popup-links">
          <span onClick={onClose}>Go Back</span>
          <span onClick={onFullClose}>Allow</span>
        </div>
      </div>
    </div>
  );
};

export default AllowWarningPopup;
