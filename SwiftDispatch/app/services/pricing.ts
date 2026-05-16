import { VehicleOption, VehicleType } from '@/types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    type: 'bike',
    label: 'SwiftBike',
    description: 'Fast motorcycle delivery',
    icon: 'bicycle',
    basePrice: 300,
    pricePerKm: 80,
    capacity: 'Up to 10kg',
    eta: 5,
  },
  {
    type: 'bicycle',
    label: 'EcoCycle',
    description: 'Eco-friendly bicycle delivery',
    icon: 'bicycle-outline',
    basePrice: 150,
    pricePerKm: 50,
    capacity: 'Up to 5kg',
    eta: 12,
  },
  {
    type: 'car',
    label: 'SwiftCar',
    description: 'Sedan for larger packages',
    icon: 'car-outline',
    basePrice: 500,
    pricePerKm: 120,
    capacity: 'Up to 30kg',
    eta: 8,
  },
  {
    type: 'van',
    label: 'SwiftVan',
    description: 'Van for bulk deliveries',
    icon: 'bus-outline',
    basePrice: 1000,
    pricePerKm: 180,
    capacity: 'Up to 200kg',
    eta: 10,
  },
];

export function calculatePrice(
  vehicleType: VehicleType,
  distanceKm: number
): number {
  const vehicle = VEHICLE_OPTIONS.find((v) => v.type === vehicleType);
  if (!vehicle) return 0;
  const raw = vehicle.basePrice + vehicle.pricePerKm * distanceKm;
  return Math.round(raw / 10) * 10;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function formatPrice(amount: number, currency = '₦'): string {
  return `${currency}${amount.toLocaleString()}`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
