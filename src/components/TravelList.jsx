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
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search destination, city, purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List header */}
      <div className="list-header">
        <div className="result-count">
          {sorted.length} {sorted.length === 1 ? 'trip' : 'trips'}
          {activeFilter !== 'all' && ` · ${activeLabel}`}
          {search && ` · matching "${search}"`}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="dest_asc">Destination A–Z</option>
            <option value="duration_desc">Longest first</option>
          </select>
          <button
            className="btn btn-success btn-sm"
            onClick={() => onExport(sorted, activeLabel)}
            disabled={sorted.length === 0}
            title="Export to Excel"
          >
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Travel cards */}
      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>No trips found</h3>
          <p>
            {entries.length === 0
              ? 'Add your first trip using the form above!'
              : 'Try adjusting the filter or search query.'}
          </p>
        </div>
      ) : (
        <div className="travel-list">
          {grouped.map(([year, items]) => (
            <div key={year}>
              <div className="year-divider">
                <span>📅 {year}</span>
              </div>
              {items.map((entry) => (
                <TravelCard
                  key={entry.id}
                  entry={entry}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
