import { useState } from 'react';
import TravelCard from './TravelCard';
import { FILTER_OPTIONS, applyFilter, applySearch, sortEntries, groupByYear } from '../utils/filters';

export default function TravelList({ entries, onEdit, onDelete, onExport }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date_desc');

  const filtered = applyFilter(entries, activeFilter);
  const searched = applySearch(filtered, search);
  const sorted = sortEntries(searched, sort);
  const grouped = groupByYear(sorted);

  const activeLabel = FILTER_OPTIONS.find((f) => f.key === activeFilter)?.label || 'All';

  return (
    <div>
      {/* Filter + Search bar */}
      <div className="filter-bar">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}

        <div className="filter-spacer" />

        <div className="search-wrap">
          <span className="search-lbl">Search</span>
          <input
            type="text"
            placeholder="destination, purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="list-controls">
        <span className="result-info">
          {sorted.length} {sorted.length === 1 ? 'entry' : 'entries'}
          {activeFilter !== 'all' && ` · ${activeLabel}`}
          {search && ` · "${search}"`}
        </span>
        <div className="list-actions">
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="dest_asc">A → Z</option>
            <option value="duration_desc">Longest first</option>
          </select>
          <button
            className="btn"
            onClick={() => onExport(sorted, activeLabel)}
            disabled={sorted.length === 0}
          >
            Export .xlsx
          </button>
        </div>
      </div>

      {/* Entries */}
      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-line">No entries found</div>
          <div className="empty-state-title">
            {entries.length === 0 ? 'Add your first trip' : 'Try a different filter'}
          </div>
        </div>
      ) : (
        grouped.map(([year, items]) => (
          <div key={year}>
            <div className="year-mark">{year}</div>
            {items.map((entry) => (
              <TravelCard
                key={entry.id}
                entry={entry}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
