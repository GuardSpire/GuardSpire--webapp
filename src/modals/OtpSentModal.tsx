const OtpSentModal = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="modal-text">
          We have sent a one-time password to your email. Enter it in the current password box to reset your password.
        </p>
        <button className="modal-btn" onClick={onNext}>Ok</button>
      </div>
    </div>
  );
};

export default OtpSentModal;
