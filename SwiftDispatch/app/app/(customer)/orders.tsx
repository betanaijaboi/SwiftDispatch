import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useOrderStore } from '@/store/useOrderStore';
import StatusBadge from '@/components/StatusBadge';
import { formatPrice } from '@/services/pricing';
import { Order } from '@/types';

const MOCK_HISTORY: Order[] = [
  {
    id: 'ORD-1001',
    customerId: 'c1',
    pickup: { coordinates: { latitude: 6.52, longitude: 3.37 }, address: '14 Palm Close, Lekki' },
    dropoff: { coordinates: { latitude: 6.54, longitude: 3.39 }, address: 'Shoprite, VI' },
    vehicleType: 'bike',
    status: 'delivered',
    price: 1850,
    distance: 5.2,
    estimatedTime: 18,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    paymentMethod: 'cash',
    rating: 5,
  },
  {
    id: 'ORD-1002',
    customerId: 'c1',
    pickup: { coordinates: { latitude: 6.53, longitude: 3.38 }, address: 'Ikeja GRA' },
    dropoff: { coordinates: { latitude: 6.55, longitude: 3.41 }, address: 'UNILAG' },
    vehicleType: 'car',
    status: 'cancelled',
    price: 2400,
    distance: 7.1,
    estimatedTime: 25,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    paymentMethod: 'card',
  },
  {
    id: 'ORD-1003',
    customerId: 'c1',
    pickup: { coordinates: { latitude: 6.51, longitude: 3.36 }, address: 'Victoria Island' },
    dropoff: { coordinates: { latitude: 6.57, longitude: 3.44 }, address: 'Ajah' },
    vehicleType: 'van',
    status: 'rated',
    price: 5200,
    distance: 14.3,
    estimatedTime: 40,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    paymentMethod: 'wallet',
    rating: 4,
  },
];

type IoniconName = keyof typeof Ionicons.glyphMap;

const VEHICLE_ICONS: Record<string, { icon: IoniconName; color: string; bg: string }> = {
  bike:    { icon: 'bicycle',         color: Colors.primary,  bg: Colors.primaryBg  },
  bicycle: { icon: 'bicycle-outline', color: '#16A34A',       bg: '#DCFCE7'         },
  car:     { icon: 'car-outline',     color: '#2563EB',       bg: '#DBEAFE'         },
  van:     { icon: 'bus-outline',     color: '#7C3AED',       bg: '#EDE9FE'         },
};

export default function OrdersScreen() {
  const { orderHistory, currentOrder } = useOrderStore();
  const allOrders = [...(currentOrder ? [currentOrder] : []), ...orderHistory, ...MOCK_HISTORY];
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const active = allOrders.filter(o =>
    ['pending', 'searching', 'accepted', 'pickup', 'in_transit'].includes(o.status));
  const history = allOrders.filter(o =>
    ['delivered', 'cancelled', 'rated'].includes(o.status));
  const displayed = activeTab === 'active' ? active : history;

  const renderOrder = ({ item }: { item: Order }) => {
    const vehicle = VEHICLE_ICONS[item.vehicleType] ?? VEHICLE_ICONS.bike;
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => { if (activeTab === 'active') router.push('/(customer)/tracking'); }}
        activeOpacity={0.85}
      >
        <View style={styles.orderHeader}>
          <View style={[styles.vehicleIcon, { backgroundColor: vehicle.bg }]}>
            <Ionicons name={vehicle.icon} size={22} color={vehicle.color} />
          </View>
          <View style={styles.orderMeta}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString('en-NG', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })}
            </Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        <View style={styles.routeRow}>
          <View style={styles.routePoint}>
            <View style={styles.dotGreen} />
            <Text style={styles.routeText} numberOfLines={1}>{item.pickup.address}</Text>
          </View>
          <View style={styles.routePoint}>
            <View style={styles.dotRed} />
            <Text style={styles.routeText} numberOfLines={1}>{item.dropoff.address}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderPrice}>{formatPrice(item.price)}</Text>
          {item.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color="#92400E" />
              <Text style={styles.ratingText}>{item.rating}.0</Text>
            </View>
          )}
          {activeTab === 'active' && (
            <View style={styles.trackBtn}>
              <Text style={styles.trackBtnText}>Track</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <View style={styles.tabs}>
        {(['active', 'history'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'active' ? `Active (${active.length})` : `History (${history.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={displayed}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons
                name={activeTab === 'active' ? 'mail-open-outline' : 'document-text-outline'}
                size={48}
                color={Colors.textLight}
              />
            </View>
            <Text style={styles.emptyTitle}>
              No {activeTab === 'active' ? 'active orders' : 'past orders'}
            </Text>
            <Text style={styles.emptySub}>
              {activeTab === 'active'
                ? 'Book a rider from the home screen'
                : 'Your completed deliveries will appear here'}
            </Text>
            {activeTab === 'active' && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => router.push('/(customer)/home')}
              >
                <Text style={styles.emptyBtnText}>Book a Rider</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  list: { padding: Spacing.md, gap: Spacing.sm },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    gap: Spacing.sm,
  },
  orderHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  vehicleIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  orderMeta: { flex: 1 },
  orderId: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  orderDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  routeRow: { gap: 6 },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  routeText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  orderPrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, flex: 1 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  ratingText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: '#92400E' },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trackBtnText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.sm },
  emptyIconWrap: {
    width: 88, height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  emptySub: {
    fontSize: FontSize.md, color: Colors.textSecondary,
    textAlign: 'center', paddingHorizontal: Spacing.xl,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  emptyBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.md },
});
