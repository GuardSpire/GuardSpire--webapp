import { useState } from 'react';

interface DeleteConfirmModalProps {
  onBack: () => void;
  onYes: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onBack, onYes }) => {
  const [loading, setLoading] = useState(false);

  const handleYes = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onYes();
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onBack}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-title" style={{ fontSize: '16px' }}>
          Are you sure you want to delete your account?
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginTop: '20px' }}>
          <button className="modal-btn" onClick={onBack}>Back</button>
          <button className="modal-btn" onClick={handleYes} disabled={loading}>
            {loading ? 'Processing...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;