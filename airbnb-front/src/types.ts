export interface Property {
  id: number;
  title: string;
  description: string;
  city: string;
  pricePerNight: number;
  maxGuests: number;
  owner: string;
}

export interface Booking {
  id: number;
  property: string;
  guest: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}