import { useState, useEffect } from 'react';
import './App.css';
import StatsBar from './components/StatsBar';
import TravelForm from './components/TravelForm';
import TravelList from './components/TravelList';
import EditModal from './components/EditModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { loadEntries, addEntry, updateEntry, deleteEntry } from './utils/storage';
import { supabase } from './lib/supabase';
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
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { toasts, addToast } = useToast();

  async function fetchEntries() {
    try {
      const data = await loadEntries();
      setEntries(data);
    } catch {
      addToast('Failed to load entries', 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();

    const channel = supabase
      .channel('travel_entries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'travel_entries' }, () => {
        fetchEntries();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function handleAdd(formData) {
    const newEntry = { ...formData, id: generateId() };
    try {
      await addEntry(newEntry);
      setEntries((prev) => [newEntry, ...prev]);
      setShowAddForm(false);
      addToast('Entry recorded', 'success');
    } catch {
      addToast('Failed to save entry', 'error');
    }
  }

  async function handleSaveEdit(formData) {
    const updated = { ...formData, id: editEntry.id };
    try {
      await updateEntry(updated);
      setEntries((prev) => prev.map((e) => (e.id === editEntry.id ? updated : e)));
      setEditEntry(null);
      addToast('Entry updated', 'success');
    } catch {
      addToast('Failed to update entry', 'error');
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteEntry(deleteId);
      setEntries((prev) => prev.filter((e) => e.id !== deleteId));
      setDeleteId(null);
      addToast('Entry removed', 'default');
    } catch {
      addToast('Failed to delete entry', 'error');
    }
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

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gray-400)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Loading...
      </div>
    );
  }

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
