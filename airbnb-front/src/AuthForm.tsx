import { useState, type FormEvent } from 'react';
import { login, register } from './api';

interface AuthFormProps {
  onLoggedIn: (token: string) => void;
}

function AuthForm({ onLoggedIn }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        await register({ email, firstName, lastName, plainPassword: password });
      }
      const token = await login(email, password);
      onLoggedIn(token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 320, marginBottom: 24 }}>
      <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>

      {mode === 'register' && (
        <>
          <input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </>
      )}

      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input
        type="password"
        placeholder="Mot de passe (8 caractères minimum)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />

      {error && <p style={{ color: 'crimson', margin: 0 }}>{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
      </button>

      <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Pas de compte ? Créer un compte' : 'Déjà un compte ? Se connecter'}
      </button>
    </form>
  );
}

export default AuthForm;