import { useState } from 'react';

const ConfirmEmailModal = ({ onConfirm }: { onConfirm: () => void }) => {
  const [email, setEmail] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h4 className="modal-title">Confirm Your Email</h4>
        <input
          className="modal-input"
          type="email"
          placeholder="Enter your current email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="modal-btn" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmEmailModal;
