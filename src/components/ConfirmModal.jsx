export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <span className="modal-title">Confirm Delete</span>
          <button className="btn-ghost" onClick={onCancel}>Close</button>
        </div>
        <div className="modal-body">
          <p className="confirm-text">{message}</p>
          <div className="form-actions">
            <button className="btn btn-filled" onClick={onConfirm}>Delete</button>
            <button className="btn" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
