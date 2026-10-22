import { useState, type FormEvent } from 'react';
import { createProperty } from './api';

interface PropertyFormProps {
  token: string;
  onCreated: () => void;
}

function PropertyForm({ token, onCreated }: PropertyFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createProperty(token, {
        title,
        description,
        city,
        pricePerNight: Number(pricePerNight),
        maxGuests: Number(maxGuests),
      });
      setTitle('');
      setDescription('');
      setCity('');
      setPricePerNight('');
      setMaxGuests('');
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
      <h2>Publier une annonce</h2>
      <input placeholder="Titre (5 caractères minimum)" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required />
      <input type="number" min={1} placeholder="Prix par nuit (MAD)" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} required />
      <input type="number" min={1} placeholder="Nombre de voyageurs maximum" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} required />

      {error && <p style={{ color: 'crimson', margin: 0 }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? '...' : "Publier l'annonce"}
      </button>
    </form>
  );
}

export default PropertyForm;