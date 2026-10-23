import { useCallback, useEffect, useState } from 'react';
import { deleteProperty, getMyProperties, getProperties } from './api';
import { clearToken, getToken, saveToken } from './auth';
import AuthForm from './AuthForm';
import BookingForm from './BookingForm';
import PropertyForm from './PropertyForm';
import type { Property } from './types';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getToken());
  const [view, setView] = useState<'all' | 'mine'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadProperties = useCallback(async () => {
    try {
      const list = view === 'mine' && token ? await getMyProperties(token) : await getProperties();
      setProperties(list);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [view, token]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  function handleLoggedIn(newToken: string) {
    saveToken(newToken);
    setToken(newToken);
  }

  function handleLogout() {
    clearToken();
    setToken(null);
    setView('all');
    setEditingId(null);
  }

  async function handleDelete(property: Property) {
    if (!token) return;
    if (!window.confirm(`Supprimer l'annonce « ${property.title} » ?`)) return;

    setActionError(null);
    try {
      await deleteProperty(token, property.id);
      await loadProperties();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{view === 'mine' ? 'Mes annonces' : 'Annonces'}</h1>
        {token && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setView(view === 'mine' ? 'all' : 'mine');
                setEditingId(null);
                setActionError(null);
              }}
            >
              {view === 'mine' ? 'Toutes les annonces' : 'Mes annonces'}
            </button>
            <button onClick={handleLogout}>Se déconnecter</button>
          </div>
        )}
      </header>

      {!token && <AuthForm onLoggedIn={handleLoggedIn} />}
      {token && <PropertyForm token={token} onSaved={loadProperties} />}

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'crimson' }}>Impossible de charger les annonces : {error}</p>}
      {actionError && <p style={{ color: 'crimson' }}>{actionError}</p>}
      {!loading && !error && properties.length === 0 && (
        <p>{view === 'mine' ? "Vous n'avez pas encore publié d'annonce." : 'Aucune annonce pour le moment.'}</p>
      )}

      {properties.map((property) => (
        <article
          key={property.id}
          style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}
        >
          {token && view === 'mine' && editingId === property.id ? (
            <PropertyForm
              token={token}
              property={property}
              onSaved={() => {
                setEditingId(null);
                loadProperties();
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <h2>{property.title}</h2>
              <p>{property.description}</p>
              <p>
                {property.city} · {property.maxGuests} voyageur(s) · {property.pricePerNight} MAD / nuit
              </p>
              {view === 'all' && <BookingForm property={property} token={token} />}
              {view === 'mine' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setEditingId(property.id)}>Modifier</button>
                  <button onClick={() => handleDelete(property)}>Supprimer</button>
                </div>
              )}
            </>
          )}
        </article>
      ))}
    </main>
  );
}

export default App;