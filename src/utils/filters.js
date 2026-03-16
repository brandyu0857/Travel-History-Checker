export const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'this_year', label: 'This Year' },
  { key: 'last_year', label: 'Last Year' },
  { key: '3_years', label: 'Last 3 Years' },
  { key: '5_years', label: 'Last 5 Years' },
  { key: '10_years', label: 'Last 10 Years' },
];

export const PURPOSE_OPTIONS = ['Travel', 'Business', 'Family', 'Education', 'Medical', 'Other'];

export function applyFilter(entries, filterKey) {
  const now = new Date();
  const year = now.getFullYear();

  return entries.filter((e) => {
    const entryDate = new Date(e.date);
    const entryYear = entryDate.getFullYear();

    switch (filterKey) {
      case 'this_year':
        return entryYear === year;
      case 'last_year':
        return entryYear === year - 1;
      case '3_years':
        return entryDate >= new Date(year - 2, 0, 1);
      case '5_years':
        return entryDate >= new Date(year - 4, 0, 1);
      case '10_years':
        return entryDate >= new Date(year - 9, 0, 1);
      default:
        return true;
    }
  });
}

export function applySearch(entries, query) {
  if (!query.trim()) return entries;
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.destination.toLowerCase().includes(q) ||
      e.departureCity.toLowerCase().includes(q) ||
      e.purpose.toLowerCase().includes(q) ||
      (e.note && e.note.toLowerCase().includes(q))
  );
}

export function sortEntries(entries, sortKey) {
  const sorted = [...entries];
  switch (sortKey) {
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'dest_asc':
      return sorted.sort((a, b) => a.destination.localeCompare(b.destination));
    case 'duration_desc':
      return sorted.sort((a, b) => Number(b.duration) - Number(a.duration));
    default:
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export function groupByYear(entries) {
  const groups = {};
  for (const entry of entries) {
    const year = new Date(entry.date).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(entry);
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
}

export function computeStats(entries) {
  const totalDays = entries.reduce((sum, e) => sum + Number(e.duration || 0), 0);
  const countries = new Set(entries.map((e) => e.destination)).size;
  const thisYear = new Date().getFullYear();
  const tripsThisYear = entries.filter((e) => new Date(e.date).getFullYear() === thisYear).length;
  return { total: entries.length, totalDays, countries, tripsThisYear };
}
