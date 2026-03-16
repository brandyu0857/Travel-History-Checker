const STORAGE_KEY = 'travel_history_entries';

export function loadEntries() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSampleData();
  } catch {
    return getSampleData();
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getSampleData() {
  return [
    {
      id: '1',
      date: '2026-01-15',
      destination: 'Tokyo',
      departureCity: 'New York',
      duration: 10,
      purpose: 'Travel',
      note: 'Cherry blossom season was breathtaking. Visited Shibuya and Asakusa.',
    },
    {
      id: '2',
      date: '2025-11-03',
      destination: 'London',
      departureCity: 'New York',
      duration: 5,
      purpose: 'Business',
      note: 'Q4 product review meetings with the UK team.',
    },
    {
      id: '3',
      date: '2025-08-20',
      destination: 'Paris',
      departureCity: 'Los Angeles',
      duration: 7,
      purpose: 'Family',
      note: 'Anniversary trip with the family. Eiffel Tower at night was magical.',
    },
    {
      id: '4',
      date: '2024-06-10',
      destination: 'Singapore',
      departureCity: 'Sydney',
      duration: 4,
      purpose: 'Business',
      note: 'Tech conference and client meetings.',
    },
    {
      id: '5',
      date: '2023-03-22',
      destination: 'Cancun',
      departureCity: 'Chicago',
      duration: 8,
      purpose: 'Travel',
      note: 'Relaxing beach vacation.',
    },
  ];
}
