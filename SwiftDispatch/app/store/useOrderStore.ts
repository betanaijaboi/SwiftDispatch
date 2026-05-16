import { create } from 'zustand';
import { Order, Location, VehicleType, OrderStatus, PaymentMethod, RiderLocation } from '@/types';

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  pickup: Location | null;
  dropoff: Location | null;
  selectedVehicle: VehicleType | null;
  selectedPayment: PaymentMethod;
  note: string;
  packageDescription: string;
  riderLocation: RiderLocation | null;
  isSearching: boolean;
  estimatedPrice: number;
  estimatedDistance: number;
  estimatedTime: number;

  setPickup: (location: Location) => void;
  setDropoff: (location: Location) => void;
  setSelectedVehicle: (type: VehicleType) => void;
  setSelectedPayment: (method: PaymentMethod) => void;
  setNote: (note: string) => void;
  setPackageDescription: (desc: string) => void;
  setCurrentOrder: (order: Order | null) => void;
  updateOrderStatus: (status: OrderStatus) => void;
  updateRiderLocation: (location: RiderLocation) => void;
  setSearching: (searching: boolean) => void;
  setEstimates: (price: number, distance: number, time: number) => void;
  addToHistory: (order: Order) => void;
  resetBooking: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  currentOrder: null,
  orderHistory: [],
  pickup: null,
  dropoff: null,
  selectedVehicle: null,
  selectedPayment: 'cash',
  note: '',
  packageDescription: '',
  riderLocation: null,
  isSearching: false,
  estimatedPrice: 0,
  estimatedDistance: 0,
  estimatedTime: 0,

  setPickup: (location) => set({ pickup: location }),
  setDropoff: (location) => set({ dropoff: location }),
  setSelectedVehicle: (type) => set({ selectedVehicle: type }),
  setSelectedPayment: (method) => set({ selectedPayment: method }),
  setNote: (note) => set({ note }),
  setPackageDescription: (desc) => set({ packageDescription: desc }),

  setCurrentOrder: (order) => set({ currentOrder: order }),

  updateOrderStatus: (status) =>
    set((state) => ({
      currentOrder: state.currentOrder
        ? { ...state.currentOrder, status }
        : null,
    })),

  updateRiderLocation: (location) => set({ riderLocation: location }),
  setSearching: (searching) => set({ isSearching: searching }),
  setEstimates: (price, distance, time) =>
    set({ estimatedPrice: price, estimatedDistance: distance, estimatedTime: time }),

  addToHistory: (order) =>
    set((state) => ({ orderHistory: [order, ...state.orderHistory] })),

  resetBooking: () =>
    set({
      pickup: null,
      dropoff: null,
      selectedVehicle: null,
      note: '',
      packageDescription: '',
      isSearching: false,
      currentOrder: null,
      riderLocation: null,
    }),
}));
