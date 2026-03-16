import { useState, useEffect } from 'react';
import { PURPOSE_OPTIONS } from '../utils/filters';

const EMPTY_FORM = {
  date: '',
  destination: '',
  departureCity: '',
  duration: '',
  purpose: 'Travel',
  note: '',
};

function validate(data) {
  const errors = {};
  if (!data.date) errors.date = 'Date is required';
  if (!data.destination.trim()) errors.destination = 'Destination is required';
  if (!data.departureCity.trim()) errors.departureCity = 'Departure city is required';
  if (!data.duration || Number(data.duration) < 1) errors.duration = 'Duration must be at least 1';
  if (!data.purpose) errors.purpose = 'Purpose is required';
  return errors;
}

export default function TravelForm({ onSubmit, onCancel, initialData = null }) {
  const [form, setForm] = useState(initialData ? { ...initialData } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
    else setForm({ ...EMPTY_FORM });
    setErrors({});
  }, [initialData]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, duration: Number(form.duration) });
    if (!initialData) setForm({ ...EMPTY_FORM });
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        {/* Date */}
        <div className="form-group">
          <label htmlFor="f-date">Date <span className="required-star">*</span></label>
          <input
            id="f-date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={errors.date ? 'error' : ''}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>

        {/* Destination */}
        <div className="form-group">
          <label htmlFor="f-dest">Destination <span className="required-star">*</span></label>
          <input
            id="f-dest"
            type="text"
            placeholder="e.g. Tokyo, Japan"
            value={form.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            className={errors.destination ? 'error' : ''}
          />
          {errors.destination && <span className="field-error">{errors.destination}</span>}
        </div>

        {/* Departure city */}
        <div className="form-group">
          <label htmlFor="f-dep">Departure From <span className="required-star">*</span></label>
          <input
            id="f-dep"
            type="text"
            placeholder="e.g. New York"
            value={form.departureCity}
            onChange={(e) => handleChange('departureCity', e.target.value)}
            className={errors.departureCity ? 'error' : ''}
          />
          {errors.departureCity && <span className="field-error">{errors.departureCity}</span>}
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="f-dur">Duration (days) <span className="required-star">*</span></label>
          <input
            id="f-dur"
            type="number"
            placeholder="e.g. 7"
            min="1"
            value={form.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className={errors.duration ? 'error' : ''}
          />
          {errors.duration && <span className="field-error">{errors.duration}</span>}
        </div>

        {/* Purpose */}
        <div className="form-group">
          <label htmlFor="f-purpose">Purpose <span className="required-star">*</span></label>
          <select
            id="f-purpose"
            value={form.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            className={errors.purpose ? 'error' : ''}
          >
            {PURPOSE_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.purpose && <span className="field-error">{errors.purpose}</span>}
        </div>

        {/* Note */}
        <div className="form-group full-width">
          <label htmlFor="f-note">Personal Note</label>
          <textarea
            id="f-note"
            placeholder="Add personal notes, highlights, or memories..."
            value={form.note}
            onChange={(e) => handleChange('note', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {initialData ? '💾 Save Changes' : '➕ Add Trip'}
        </button>
      </div>
    </form>
  );
}
