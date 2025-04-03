const SuccessModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="modal-success">Changes have been Updated</p>
        <p className="modal-subtext">Thank You!</p>
        <button className="modal-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default SuccessModal;
