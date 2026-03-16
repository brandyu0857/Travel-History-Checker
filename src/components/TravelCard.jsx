function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function TravelCard({ entry, onEdit, onDelete }) {
  return (
    <div className="travel-row">
      {/* Main info */}
      <div className="row-main">
        <div className="row-destination">{entry.destination}</div>
        <div className="row-from">from {entry.departureCity}</div>
        {entry.note && <div className="row-note">{entry.note}</div>}
      </div>

      {/* Date */}
      <div className="row-cell">
        <span className="row-cell-label">Date</span>
        <span className="row-cell-value">{formatDate(entry.date)}</span>
      </div>

      {/* Duration */}
      <div className="row-cell">
        <span className="row-cell-label">Duration</span>
        <span className="row-cell-value">{entry.duration}d</span>
      </div>

      {/* Purpose */}
      <div className="row-cell">
        <span className="row-cell-label">Purpose</span>
        <span className="row-purpose">{entry.purpose}</span>
      </div>

      {/* Actions */}
      <div className="row-actions">
        <button className="btn-ghost" onClick={() => onEdit(entry)} title="Edit">Edit</button>
        <button className="btn-ghost danger" onClick={() => onDelete(entry.id)} title="Delete">Del</button>
      </div>
    </div>
  );
}
