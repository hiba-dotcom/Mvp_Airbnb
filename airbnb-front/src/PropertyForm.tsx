import { useState, type FormEvent } from 'react';
import { createProperty, updateProperty } from './api';
import type { Property } from './types';

interface PropertyFormProps {
  token: string;
  property?: Property;
  onSaved: () => void;
  onCancel?: () => void;
}

function PropertyForm({ token, property, onSaved, onCancel }: PropertyFormProps) {
  const [title, setTitle] = useState(property?.title ?? '');
  const [description, setDescription] = useState(property?.description ?? '');
  const [city, setCity] = useState(property?.city ?? '');
  const [pricePerNight, setPricePerNight] = useState(property ? String(property.pricePerNight) : '');
  const [maxGuests, setMaxGuests] = useState(property ? String(property.maxGuests) : '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const input = {
      title,
      description,
      city,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
    };

    try {
      if (property) {
        await updateProperty(token, property.id, input);
      } else {
        await createProperty(token, input);
        setTitle('');
        setDescription('');
        setCity('');
        setPricePerNight('');
        setMaxGuests('');
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
      <h2>{property ? "Modifier l'annonce" : 'Publier une annonce'}</h2>
      <input placeholder="Titre (5 caractères minimum)" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required />
      <input type="number" min={1} placeholder="Prix par nuit (MAD)" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} required />
      <input type="number" min={1} placeholder="Nombre de voyageurs maximum" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} required />

      {error && <p style={{ color: 'crimson', margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={submitting}>
          {submitting ? '...' : property ? 'Enregistrer' : "Publier l'annonce"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default PropertyForm;