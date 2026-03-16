import { computeStats } from '../utils/filters';

export default function StatsBar({ entries }) {
  const { total, totalDays, countries, tripsThisYear } = computeStats(entries);

  const stats = [
    { num: total, label: 'Total Trips' },
    { num: totalDays, label: 'Days Abroad' },
    { num: countries, label: 'Destinations' },
    { num: tripsThisYear, label: 'This Year' },
  ];

  return (
    <div className="stats-strip">
      {stats.map((s) => (
        <div key={s.label} className="stat-cell">
          <span className="stat-num">{s.num}</span>
          <span className="stat-lbl">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
