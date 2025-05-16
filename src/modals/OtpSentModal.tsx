interface OtpSentModalProps {
  onNext: () => void;
}

const OtpSentModal: React.FC<OtpSentModalProps> = ({ onNext }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p className="modal-text">
          We have sent a one-time password to your email. Enter it in the next step to reset your password.
        </p>
        <button className="modal-btn" onClick={onNext}>Ok</button>
      </div>
    </div>
  );
};

export default OtpSentModal;