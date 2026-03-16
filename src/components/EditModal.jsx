import TravelForm from './TravelForm';

export default function EditModal({ entry, onSave, onClose }) {
  if (!entry) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Edit Entry</span>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <TravelForm initialData={entry} onSubmit={onSave} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
