import * as XLSX from 'xlsx';

export function exportToExcel(entries, filterLabel = 'All') {
  const rows = entries.map((e, i) => ({
    '#': i + 1,
    Date: e.date,
    Destination: e.destination,
    'Departure From': e.departureCity,
    'Duration (days)': e.duration,
    Purpose: e.purpose,
    'Personal Note': e.note || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Column widths
  worksheet['!cols'] = [
    { wch: 4 },
    { wch: 12 },
    { wch: 20 },
    { wch: 20 },
    { wch: 16 },
    { wch: 14 },
    { wch: 45 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Travel History');

  const filename = `travel-history-${filterLabel.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
