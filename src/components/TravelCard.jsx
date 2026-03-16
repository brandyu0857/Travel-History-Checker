const PURPOSE_ICONS = {
  Travel: '🏖️',
  Business: '💼',
  Family: '👨‍👩‍👧',
  Education: '🎓',
  Medical: '🏥',
  Other: '📌',
};

const PURPOSE_BG = {
  Travel: '#dbeafe',
  Business: '#f3e8ff',
  Family: '#fce7f3',
  Education: '#dcfce7',
  Medical: '#fee2e2',
  Other: '#f1f5f9',
};

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TravelCard({ entry, onEdit, onDelete }) {
  const icon = PURPOSE_ICONS[entry.purpose] || '📌';
  const bg = PURPOSE_BG[entry.purpose] || '#f1f5f9';

  return (
    <div className="travel-card">
      <div className="travel-card-header">
        <div className="destination-info">
          <div className="destination-icon" style={{ background: bg }}>
            {icon}
          </div>
          <div>
            <div className="destination-name">{entry.destination}</div>
            <div className="departure-info">
              ✈ from {entry.departureCity}
            </div>
          </div>
        </div>
        <div className="card-meta">
          <span className={`badge badge-${entry.purpose}`}>{entry.purpose}</span>
          <div className="card-actions">
            <button
              className="btn-ghost"
              onClick={() => onEdit(entry)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn-ghost"
              onClick={() => onDelete(entry.id)}
              title="Delete"
              style={{ color: '#dc2626' }}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div className="travel-card-body">
        <div className="info-item">
          <span className="info-label">Date</span>
          <span className="info-value">{formatDate(entry.date)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Duration</span>
          <span className="info-value">{entry.duration} {entry.duration === 1 ? 'day' : 'days'}</span>
        </div>

        {entry.note ? (
          <div className="note-section">
            <div className="note-text">"{entry.note}"</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
