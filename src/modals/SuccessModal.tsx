interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-success">Thank You!</p>
        <p className="modal-subtext">Your action was completed successfully.</p>
        <button className="modal-btn" onClick={onClose}>Ok</button>
      </div>
    </div>
  );
};

export default SuccessModal;