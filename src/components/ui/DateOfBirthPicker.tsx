import { useEffect, useState } from 'react';
import type { FieldError } from 'react-hook-form';

interface DateOfBirthPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);

function daysInMonth(month: number, year: number): number {
  if (!month || !year) return 31;
  // Day 0 of the next month is the last day of the given month.
  return new Date(year, month, 0).getDate();
}

/**
 * Three-select date of birth picker.
 * Outputs an ISO 8601 string (YYYY-MM-DD) via onChange, or an empty string
 * if any part is not yet selected.
 * Integrates with react-hook-form via Controller.
 */
export default function DateOfBirthPicker({ value, onChange, onBlur, error }: DateOfBirthPickerProps) {
  // Parse the incoming YYYY-MM-DD value into three independent pieces.
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  // Sync if the form resets or value changes externally.
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-');
      setYear(y);
      setMonth(String(parseInt(m, 10)));
      setDay(String(parseInt(d, 10)));
    }
  }, [value]);

  const maxDay = daysInMonth(parseInt(month, 10), parseInt(year, 10));
  const days = Array.from({ length: maxDay }, (_unused, i) => i + 1);

  const handleChange = (newDay: string, newMonth: string, newYear: string) => {
    if (newDay && newMonth && newYear) {
      const m = newMonth.padStart(2, '0');
      // Clamp the day if the new month/year has fewer days.
      const max = daysInMonth(parseInt(newMonth, 10), parseInt(newYear, 10));
      const clampedDay = Math.min(parseInt(newDay, 10), max).toString().padStart(2, '0');
      onChange(`${newYear}-${m}-${clampedDay}`);
    } else {
      onChange('');
    }
  };

  const cls = `form-input dob-select${error ? ' form-input--error' : ''}`;

  return (
    <div className="form-field">
      <span className="form-label">Date of birth</span>
      <div className="dob-row">
        <div className="dob-col">
          <label htmlFor="dob-day" className="dob-sublabel">Day</label>
          <select
            id="dob-day"
            className={cls}
            value={day}
            onChange={(e) => {
              setDay(e.target.value);
              handleChange(e.target.value, month, year);
            }}
            onBlur={onBlur}
            aria-label="Day of birth"
          >
            <option value="">—</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="dob-col dob-col--month">
          <label htmlFor="dob-month" className="dob-sublabel">Month</label>
          <select
            id="dob-month"
            className={cls}
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              handleChange(day, e.target.value, year);
            }}
            onBlur={onBlur}
            aria-label="Month of birth"
          >
            <option value="">—</option>
            {MONTHS.map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </select>
        </div>

        <div className="dob-col">
          <label htmlFor="dob-year" className="dob-sublabel">Year</label>
          <select
            id="dob-year"
            className={cls}
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              handleChange(day, month, e.target.value);
            }}
            onBlur={onBlur}
            aria-label="Year of birth"
          >
            <option value="">—</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <span className="form-error" role="alert">{error.message}</span>
      )}
    </div>
  );
}
