import { useCallback, useEffect, useState } from 'react';
import { getProperties } from './api';
import { clearToken, getToken, saveToken } from './auth';
import AuthForm from './AuthForm';
import BookingForm from './BookingForm';
import PropertyForm from './PropertyForm';
import type { Property } from './types';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getToken());

  const loadProperties = useCallback(async () => {
    try {
      setProperties(await getProperties());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

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
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Annonces</h1>
        {token && <button onClick={handleLogout}>Se déconnecter</button>}
      </header>

      {!token && <AuthForm onLoggedIn={handleLoggedIn} />}
      {token && <PropertyForm token={token} onCreated={loadProperties} />}

      {loading && <p>Chargement...</p>}
      {error && <p>Impossible de charger les annonces : {error}</p>}
      {!loading && !error && properties.length === 0 && <p>Aucune annonce pour le moment.</p>}

      {properties.map((property) => (
        <article
          key={property.id}
          style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}
        >
          <h2>{property.title}</h2>
          <p>{property.description}</p>
          <p>
            {property.city} · {property.maxGuests} voyageur(s) · {property.pricePerNight} MAD / nuit
          </p>
          <BookingForm property={property} token={token} />
        </article>
      ))}
    </main>
  );
}

export default App;