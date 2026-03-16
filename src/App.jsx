import { useState, useEffect } from 'react';
import './App.css';
import StatsBar from './components/StatsBar';
import TravelForm from './components/TravelForm';
import TravelList from './components/TravelList';
import EditModal from './components/EditModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { loadEntries, saveEntries } from './utils/storage';
import { exportToExcel } from './utils/export';
import { useToast } from './hooks/useToast';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span>
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
}

export default function App() {
  const [entries, setEntries] = useState(() => loadEntries());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  function handleAdd(formData) {
    const newEntry = { ...formData, id: generateId() };
    setEntries((prev) => [newEntry, ...prev]);
    setShowAddForm(false);
    addToast('Entry recorded', 'success');
  }

  function handleSaveEdit(formData) {
    setEntries((prev) =>
      prev.map((e) => (e.id === editEntry.id ? { ...formData, id: editEntry.id } : e))
    );
    setEditEntry(null);
    addToast('Entry updated', 'success');
  }

  function handleConfirmDelete() {
    setEntries((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
    addToast('Entry removed', 'default');
  }

  function handleExport(filtered, label) {
    try {
      exportToExcel(filtered, label);
      addToast(`Exported ${filtered.length} entries`, 'success');
    } catch {
      addToast('Export failed', 'error');
    }
  }

  const deleteTarget = entries.find((e) => e.id === deleteId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <span className="header-wordmark">Travel History</span>
          <span className="header-meta">
            <LiveClock />
          </span>
          <div className="header-actions">
            <button
              className={`btn ${showAddForm ? 'btn-filled' : ''}`}
              onClick={() => setShowAddForm((v) => !v)}
            >
              {showAddForm ? '— Close' : '+ New Entry'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Stats */}
        <StatsBar entries={entries} />

        {/* Add Form */}
        {showAddForm && (
          <div className="form-panel">
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <span className="section-title">New Entry</span>
            </div>
            <TravelForm
              onSubmit={handleAdd}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* History */}
        <TravelList
          entries={entries}
          onEdit={setEditEntry}
          onDelete={setDeleteId}
          onExport={handleExport}
        />
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #000', padding: '14px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {entries.length} total entries
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Travel History Tracker
        </span>
      </footer>

      {/* Modals */}
      {editEntry && (
        <EditModal entry={editEntry} onSave={handleSaveEdit} onClose={() => setEditEntry(null)} />
      )}
      {deleteId && (
        <ConfirmModal
          message={`Remove the entry for "${deleteTarget?.destination}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
