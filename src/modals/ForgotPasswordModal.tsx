import { useState } from 'react';
import axios from 'axios';

interface ForgotPasswordModalProps {
  onNext: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/forgot-password/request', { email });
      localStorage.setItem('forgotPasswordEmail', email);
      setLoading(false);
      onNext();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.response?.data?.error || 'Failed to send OTP.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h4 className="modal-title">Forgot Password</h4>
        <input
          className="modal-input"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errorMsg && <p style={{ color: 'red', fontSize: '12px' }}>{errorMsg}</p>}
        <button className="modal-btn" onClick={handleConfirm} disabled={loading}>
          {loading ? 'Sending...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;