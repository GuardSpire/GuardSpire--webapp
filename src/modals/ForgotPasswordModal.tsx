import { useState } from 'react';

const ForgotPasswordModal = ({ onNext }: { onNext: () => void }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h4 className="modal-title">Forget Password</h4>
        <input
          className="modal-input"
          type="email"
          placeholder="Enter your current email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="modal-btn" onClick={onNext}>Confirm</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
