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
    addToast('Trip added successfully!', 'success');
  }

  function handleEdit(entry) {
    setEditEntry(entry);
  }

  function handleSaveEdit(formData) {
    setEntries((prev) =>
      prev.map((e) => (e.id === editEntry.id ? { ...formData, id: editEntry.id } : e))
    );
    setEditEntry(null);
    addToast('Trip updated!', 'success');
  }

  function handleDeleteRequest(id) {
    setDeleteId(id);
  }

  function handleConfirmDelete() {
    setEntries((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
    addToast('Trip deleted.', 'default');
  }

  function handleExport(filtered, label) {
    try {
      exportToExcel(filtered, label);
      addToast(`Exported ${filtered.length} trips to Excel!`, 'success');
    } catch {
      addToast('Export failed. Please try again.', 'error');
    }
  }

  const deleteTarget = entries.find((e) => e.id === deleteId);

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <span className="header-icon">✈️</span>
            <div>
              <h1>Travel History Tracker</h1>
              <div className="subtitle">Track your journeys around the world</div>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm((v) => !v)}
            >
              {showAddForm ? '✕ Cancel' : '➕ Add Trip'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Stats */}
        <StatsBar entries={entries} />

        {/* Add Form */}
        {showAddForm && (
          <div className="add-section card">
            <div className="card-header">
              <div className="card-title">🗺️ New Trip Entry</div>
            </div>
            <div className="card-body">
              <TravelForm
                onSubmit={handleAdd}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        )}

        {/* History list */}
        <div className="card" style={{ marginTop: showAddForm ? '20px' : 0 }}>
          <div className="card-header">
            <div className="card-title">📋 Travel History</div>
          </div>
          <div className="card-body">
            <TravelList
              entries={entries}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onExport={handleExport}
            />
          </div>
        </div>
      </main>

      {/* Edit modal */}
      {editEntry && (
        <EditModal
          entry={editEntry}
          onSave={handleSaveEdit}
          onClose={() => setEditEntry(null)}
        />
      )}

      {/* Confirm delete modal */}
      {deleteId && (
        <ConfirmModal
          message={`Are you sure you want to delete the trip to "${deleteTarget?.destination}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} />
    </>
  );
}
