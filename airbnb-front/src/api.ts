import type { Booking, Property } from './types';

const API_URL = 'http://127.0.0.1:8000/api';

interface Collection<T> {
  member?: T[];
  'hydra:member'?: T[];
}

export async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${API_URL}/properties`, {
    headers: { Accept: 'application/ld+json' },
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }

  const data: Collection<Property> = await response.json();

  return data.member ?? data['hydra:member'] ?? [];
}
export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 401) {
    throw new Error('Email ou mot de passe incorrect.');
  }
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }

  const data: { token: string } = await response.json();

  return data.token;
}

export interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
  plainPassword: string;
}

export async function register(input: RegisterInput): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/ld+json', Accept: 'application/ld+json' },
    body: JSON.stringify(input),
  });

  if (response.status === 422) {
    const data = await response.json();
    throw new Error(data.detail ?? data['hydra:description'] ?? 'Données invalides.');
  }
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
}

async function throwApiError(response: Response): Promise<never> {
  if (response.status === 401) {
    throw new Error('Session expirée : déconnectez-vous puis reconnectez-vous.');
  }

  let message = `Erreur ${response.status}`;
  try {
    const data = await response.json();
    message = data.detail ?? data['hydra:description'] ?? data.description ?? message;
  } catch {
    // la réponse n'est pas du JSON : on garde le message par défaut
  }

  throw new Error(message);
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/ld+json',
    Accept: 'application/ld+json',
    Authorization: `Bearer ${token}`,
  };
}

export interface PropertyInput {
  title: string;
  description: string;
  city: string;
  pricePerNight: number;
  maxGuests: number;
}

export async function createProperty(token: string, input: PropertyInput): Promise<Property> {
  const response = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}

export interface BookingInput {
  propertyId: number;
  startDate: string;
  endDate: string;
}

export async function createBooking(token: string, input: BookingInput): Promise<Booking> {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({
      property: `/api/properties/${input.propertyId}`,
      startDate: input.startDate,
      endDate: input.endDate,
    }),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}

export async function getMyProperties(token: string): Promise<Property[]> {
  const response = await fetch(`${API_URL}/my/properties`, {
    headers: { Accept: 'application/ld+json', Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  const data: Collection<Property> = await response.json();

  return data.member ?? data['hydra:member'] ?? [];
}

export async function updateProperty(token: string, id: number, input: PropertyInput): Promise<Property> {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/merge-patch+json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  return response.json();
}

export async function deleteProperty(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/ld+json', Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    await throwApiError(response);
  }
}