export type UserRole = 'customer' | 'rider';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  totalRides?: number;
  isVerified?: boolean;
  createdAt: string;
}

export interface RiderProfile extends User {
  role: 'rider';
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleColor: string;
  isOnline: boolean;
  currentLocation?: Coordinates;
  earnings?: number;
  completedDeliveries?: number;
}

export type VehicleType = 'bike' | 'bicycle' | 'van' | 'car';

export interface VehicleOption {
  type: VehicleType;
  label: string;
  description: string;
  icon: string;
  basePrice: number;
  pricePerKm: number;
  capacity: string;
  eta: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  coordinates: Coordinates;
  address: string;
  name?: string;
  placeId?: string;
}

export type OrderStatus =
  | 'pending'
  | 'searching'
  | 'accepted'
  | 'pickup'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'rated';

export interface Order {
  id: string;
  customerId: string;
  riderId?: string;
  rider?: RiderProfile;
  pickup: Location;
  dropoff: Location;
  vehicleType: VehicleType;
  status: OrderStatus;
  price: number;
  distance: number;
  estimatedTime: number;
  note?: string;
  packageDescription?: string;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  rating?: number;
  review?: string;
  paymentMethod: PaymentMethod;
}

export type PaymentMethod = 'cash' | 'card' | 'wallet';

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  createdAt: string;
  orderId?: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderRole: UserRole;
  message: string;
  createdAt: string;
}

export interface RiderLocation {
  riderId: string;
  coordinates: Coordinates;
  heading?: number;
  speed?: number;
  timestamp: string;
}
