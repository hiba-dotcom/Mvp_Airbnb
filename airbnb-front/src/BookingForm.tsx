import { useState, type FormEvent } from 'react';
import { createBooking } from './api';
import type { Property } from './types';

interface BookingFormProps {
  property: Property;
  token: string | null;
}

function BookingForm({ property, token }: BookingFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  if (!token) {
    return <p style={{ color: '#666' }}>Connectez-vous pour réserver.</p>;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const booking = await createBooking(token, {
        propertyId: property.id,
        startDate,
        endDate,
      });
      setSuccess(`Réservation confirmée : ${booking.totalPrice} MAD au total.`);
      setStartDate('');
      setEndDate('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label>
        Arrivée{' '}
        <input type="date" min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </label>
      <label>
        Départ{' '}
        <input type="date" min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? '...' : 'Réserver'}
      </button>
      {error && <p style={{ color: 'crimson', width: '100%', margin: 0 }}>{error}</p>}
      {success && <p style={{ color: 'green', width: '100%', margin: 0 }}>{success}</p>}
    </form>
  );
}

export default BookingForm;