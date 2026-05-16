import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';

const { height } = Dimensions.get('window');

type IoniconName = keyof typeof Ionicons.glyphMap;

const QUICK_ADDRESSES: { label: string; address: string; icon: IoniconName; bg: string; color: string }[] = [
  { label: 'Home',   address: '14 Palm Close, Lekki', icon: 'home',     bg: '#FEF9C3', color: '#CA8A04' },
  { label: 'Office', address: '3 Broad Street, VI',   icon: 'business', bg: '#DBEAFE', color: '#2563EB' },
  { label: 'Gym',    address: 'FitLife, Ajah',         icon: 'barbell',  bg: '#DCFCE7', color: '#16A34A' },
];

const PROMO_BANNERS: { id: string; title: string; sub: string; color: string; icon: IoniconName }[] = [
  { id: '1', title: '50% OFF',       sub: 'First 3 deliveries',  color: '#F59332', icon: 'pricetag' },
  { id: '2', title: 'Free Delivery', sub: 'Orders above ₦5,000', color: '#7C3AED', icon: 'rocket'   },
  { id: '3', title: 'Earn Points',   sub: 'Refer a friend',       color: '#16A34A', icon: 'star'     },
];

const SERVICES: { id: string; icon: IoniconName; iconColor: string; label: string; desc: string; bg: string }[] = [
  { id: '1', icon: 'flash',       iconColor: '#D97706', label: 'Express',   desc: 'Same hour delivery',   bg: '#FFF8EE' },
  { id: '2', icon: 'cube-outline',iconColor: '#16A34A', label: 'Standard',  desc: 'Scheduled delivery',   bg: '#ECFDF5' },
  { id: '3', icon: 'storefront',  iconColor: '#2563EB', label: 'Business',  desc: 'Bulk & frequent',      bg: '#EFF6FF' },
  { id: '4', icon: 'moon',        iconColor: '#7C3AED', label: 'Night Owl', desc: '10pm – 6am',           bg: '#F5F3FF' },
];

export default function CustomerHome() {
  const { user } = useAuthStore();
  const { currentOrder, setPickup } = useOrderStore();
  const [userLocation, setUserLocation] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const mapRef = useRef<MapView>(null);

  // ── Draggable bottom sheet ──────────────────────────────
  const panelHeight = useRef(0);
  const lastY = useRef(0);
  const panY = useRef(new Animated.Value(0)).current;

  const sheetPan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy, dx }) =>
        Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx),
      onPanResponderMove: (_, { dy }) => {
        const next = lastY.current + dy;
        panY.setValue(Math.max(0, Math.min(next, panelHeight.current - 32)));
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const next = lastY.current + dy;
        const minimized = panelHeight.current - 32;
        const snapTo = (vy > 0.4 || next > minimized * 0.35) ? minimized : 0;
        lastY.current = snapTo;
        Animated.spring(panY, {
          toValue: snapTo, useNativeDriver: true, tension: 70, friction: 12,
        }).start();
      },
    })
  ).current;
  // ────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setUserLocation(region);
        setPickup({
          coordinates: { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
          address: 'Current location',
        });
        mapRef.current?.animateToRegion(region, 800);
      }
    })();
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.container}>
      {/* Full-screen map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={userLocation}
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker coordinate={userLocation} title="You are here">
          <View style={styles.userMarker}>
            <View style={styles.userMarkerInner} />
          </View>
        </Marker>
      </MapView>

      {/* ── Map overlay panel ── */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">

        {/* Top row: greeting + notification */}
        <View style={styles.topHeader}>
          <View style={styles.greetingCard}>
            <Text style={styles.greeting}>{greeting}, {firstName}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={12} color={Colors.primary} />
              <Text style={styles.locationText}>Lagos, Nigeria</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(customer)/notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search / where-to bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(customer)/booking')}
          activeOpacity={0.95}
        >
          <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Where are you sending to?</Text>
          <View style={styles.searchArrow}>
            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Active order badge */}
        {currentOrder && ['accepted', 'pickup', 'in_transit'].includes(currentOrder.status) && (
          <TouchableOpacity
            style={styles.activeOrderBadge}
            onPress={() => router.push('/(customer)/tracking')}
            activeOpacity={0.9}
          >
            <View style={styles.activeOrderIcon}>
              <Ionicons name="bicycle" size={22} color={Colors.primary} />
            </View>
            <View style={styles.activeOrderText}>
              <Text style={styles.activeOrderTitle}>Rider on the way</Text>
              <Text style={styles.activeOrderSub}>Tap to track your delivery</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* ── Bottom sheet ── */}
      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY: panY }] }]}
        onLayout={(e) => { panelHeight.current = e.nativeEvent.layout.height; }}
      >
        {/* Drag handle zone */}
        <View style={styles.dragZone} {...sheetPan.panHandlers}>
          <View style={styles.sheetHandle} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Quick destinations */}
          <Text style={styles.sectionTitle}>Quick Send</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
          >
            {/* New address card */}
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => router.push('/(customer)/booking')}
            >
              <View style={[styles.quickIcon, { backgroundColor: Colors.primaryBg }]}>
                <Ionicons name="add" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.quickLabel}>New</Text>
              <Text style={styles.quickSub}>Address</Text>
            </TouchableOpacity>

            {QUICK_ADDRESSES.map((q) => (
              <TouchableOpacity
                key={q.label}
                style={styles.quickCard}
                onPress={() => router.push('/(customer)/booking')}
              >
                <View style={[styles.quickIcon, { backgroundColor: q.bg }]}>
                  <Ionicons name={q.icon} size={22} color={q.color} />
                </View>
                <Text style={styles.quickLabel}>{q.label}</Text>
                <Text style={styles.quickSub} numberOfLines={1}>{q.address}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Services */}
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[styles.serviceCard, { backgroundColor: s.bg }]}
                onPress={() => router.push('/(customer)/booking')}
                activeOpacity={0.85}
              >
                <View style={[styles.serviceIconWrap, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
                  <Ionicons name={s.icon} size={22} color={s.iconColor} />
                </View>
                <Text style={styles.serviceLabel}>{s.label}</Text>
                <Text style={styles.serviceDesc}>{s.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Promo banners */}
          <Text style={styles.sectionTitle}>Offers for you</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promoRow}
          >
            {PROMO_BANNERS.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.promoBanner, { backgroundColor: p.color }]}
                activeOpacity={0.9}
              >
                <View style={styles.promoIconWrap}>
                  <Ionicons name={p.icon} size={22} color="rgba(255,255,255,0.9)" />
                </View>
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* Map overlay */
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  greetingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    ...Shadow.sm,
  },
  greeting: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  notifBtn: {
    width: 46, height: 46,
    borderRadius: 23,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  notifDot: {
    position: 'absolute',
    top: 9, right: 9,
    width: 9, height: 9,
    borderRadius: 5,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
  },

  /* Search bar */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    ...Shadow.lg,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  searchArrow: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Active order */
  activeOrderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  activeOrderIcon: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOrderText: { flex: 1 },
  activeOrderTitle: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  activeOrderSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSize.xs,
    marginTop: 1,
  },

  /* User location marker */
  userMarker: {
    width: 22, height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(59,130,246,0.25)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(59,130,246,0.5)',
  },
  userMarkerInner: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },

  /* Bottom sheet */
  bottomSheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.50,
    paddingHorizontal: Spacing.md,
    paddingTop: 0,
    ...Shadow.lg,
  },
  dragZone: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  sheetHandle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },

  /* Quick destinations */
  quickRow: { gap: Spacing.sm, paddingBottom: Spacing.sm },
  quickCard: { alignItems: 'center', width: 76, gap: 4 },
  quickIcon: {
    width: 52, height: 52,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  quickSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  /* Services */
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  serviceCard: {
    width: '47%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 6,
  },
  serviceIconWrap: {
    width: 40, height: 40,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginTop: 2,
  },
  serviceDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },

  /* Promos */
  promoRow: { gap: Spacing.sm, paddingBottom: Spacing.sm },
  promoBanner: {
    width: 148,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  promoIconWrap: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2,
  },
  promoTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  promoSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
});
