import { computeStats } from '../utils/filters';

export default function StatsBar({ entries }) {
  const { total, totalDays, countries, tripsThisYear } = computeStats(entries);

  const stats = [
    { icon: '✈️', value: total, label: 'Total Trips' },
    { icon: '📅', value: totalDays, label: 'Days Traveled' },
    { icon: '🌍', value: countries, label: 'Destinations' },
    { icon: '🗓️', value: tripsThisYear, label: 'Trips This Year' },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className="stat-card">
          <span className="stat-icon">{s.icon}</span>
          <div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
