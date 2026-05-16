import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  PanResponder,
  Alert,
  Dimensions,
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
import { formatPrice } from '@/services/pricing';

const { height } = Dimensions.get('window');

const MOCK_INCOMING_ORDER = {
  id: 'ORD-2041',
  customer: { name: 'Adaeze Nwosu', rating: 4.7 },
  pickup: { address: '14 Palm Close, Lekki', distance: 1.2 },
  dropoff: { address: 'Shoprite, VI', distance: 5.8 },
  vehicleType: 'bike',
  price: 1850,
  estimatedTime: 22,
  packageDescription: 'iPhone 15 Pro — fragile',
};

const TARGETS: { icon: keyof typeof Ionicons.glyphMap; color: string; value: string; label: string }[] = [
  { icon: 'flag-outline',   color: Colors.primary,  value: '3/5',    label: 'Daily Goal' },
  { icon: 'flash',          color: '#FBBF24',        value: '92%',    label: 'Accept.'    },
  { icon: 'trophy-outline', color: '#A78BFA',        value: 'Silver', label: 'Tier'       },
];

export default function RiderHome() {
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: 6.5244, longitude: 3.3792, latitudeDelta: 0.02, longitudeDelta: 0.02,
  });
  const [incomingOrder, setIncomingOrder] = useState<typeof MOCK_INCOMING_ORDER | null>(null);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [todayTrips, setTodayTrips] = useState(0);
  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const countdownAnim = useRef(new Animated.Value(1)).current;

  // ── Draggable bottom panel ──────────────────────────────
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
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setIncomingOrder(MOCK_INCOMING_ORDER);
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start();
        Animated.timing(countdownAnim, { toValue: 0, duration: 30000, useNativeDriver: false }).start();
        const decline = setTimeout(() => { dismissOrder(); }, 30000);
        return () => clearTimeout(decline);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const dismissOrder = () => {
    Animated.timing(slideAnim, { toValue: 300, duration: 300, useNativeDriver: true }).start(() => {
      setIncomingOrder(null);
      countdownAnim.setValue(1);
    });
  };

  const handleAccept = () => {
    if (!incomingOrder) return;
    dismissOrder();
    setTodayEarnings(e => e + incomingOrder.price);
    setTodayTrips(t => t + 1);
    router.push('/(rider)/active-order');
  };

  const handleDecline = () => {
    Alert.alert('Decline Order?', 'Are you sure? Declining too often affects your score.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Decline', style: 'destructive', onPress: dismissOrder },
    ]);
  };

  const toggleOnline = (val: boolean) => {
    if (!val) {
      Alert.alert('Go Offline?', 'You will stop receiving new orders.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Offline', onPress: () => setIsOnline(false) },
      ]);
    } else {
      setIsOnline(true);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={userLocation}
        showsUserLocation
      >
        <Marker coordinate={userLocation} title="You">
          <View style={[styles.riderPin, isOnline ? styles.riderPinOnline : styles.riderPinOffline]}>
            <Ionicons name="bicycle" size={22} color={Colors.white} />
          </View>
        </Marker>
      </MapView>

      {/* Top status bar */}
      <SafeAreaView style={styles.topBar} pointerEvents="box-none">
        <View style={styles.topCard}>
          <View style={styles.topLeft}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, isOnline ? styles.statusDotOnline : styles.statusDotOffline]} />
              <Text style={[styles.topGreet, isOnline ? styles.topGreetOnline : styles.topGreetOffline]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
            <Text style={styles.topName}>{user?.name?.split(' ')[0]}</Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={toggleOnline}
            trackColor={{ false: Colors.border, true: Colors.success }}
            thumbColor={Colors.white}
          />
        </View>
      </SafeAreaView>

      {/* Bottom panel */}
      <Animated.View
        style={[styles.bottomPanel, { transform: [{ translateY: panY }] }]}
        onLayout={(e) => { panelHeight.current = e.nativeEvent.layout.height; }}
      >
        {/* Drag handle zone */}
        <View style={styles.dragZone} {...sheetPan.panHandlers}>
          <View style={styles.sheetHandle} />
        </View>

        {/* Today stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <Ionicons name="cash-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{formatPrice(todayEarnings || 4200)}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Earnings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <Ionicons name="rocket-outline" size={18} color="#818CF8" />
            </View>
            <Text style={styles.statValue} numberOfLines={1}>{todayTrips || 7}</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Trips Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statIconWrap}>
              <Ionicons name="star" size={18} color="#FBBF24" />
            </View>
            <Text style={styles.statValue} numberOfLines={1}>4.9</Text>
            <Text style={styles.statLabel} numberOfLines={1}>Rating</Text>
          </View>
        </View>

        {/* Status message */}
        <View style={[styles.statusMessage, isOnline ? styles.statusOnline : styles.statusOffline]}>
          <Ionicons
            name={isOnline ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={isOnline ? Colors.success : 'rgba(255,255,255,0.5)'}
          />
          <Text style={styles.statusText}>
            {isOnline
              ? 'You are online and receiving orders'
              : 'You are offline. Toggle to start earning'}
          </Text>
        </View>

        {/* Hourly targets */}
        <View style={styles.targetsRow}>
          {TARGETS.map((t) => (
            <View key={t.label} style={styles.targetCard}>
              <View style={[styles.targetIconWrap, { backgroundColor: `${t.color}22` }]}>
                <Ionicons name={t.icon} size={16} color={t.color} />
              </View>
              <Text style={styles.targetValue} numberOfLines={1} adjustsFontSizeToFit>{t.value}</Text>
              <Text style={styles.targetLabel} numberOfLines={1}>{t.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Incoming order modal */}
      {incomingOrder && (
        <Animated.View
          style={[styles.incomingModal, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Countdown bar */}
          <Animated.View
            style={[
              styles.countdownBar,
              {
                width: countdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />

          <View style={styles.incomingHeader}>
            <View style={styles.incomingBadge}>
              <Text style={styles.incomingBadgeText}>New Order!</Text>
            </View>
            <Text style={styles.incomingPrice}>{formatPrice(incomingOrder.price)}</Text>
          </View>

          <View style={styles.incomingCustomer}>
            <View style={styles.customerAvatar}>
              <Ionicons name="person-outline" size={22} color={Colors.textSecondary} />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{incomingOrder.customer.name}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.customerRating}>{incomingOrder.customer.rating}</Text>
              </View>
            </View>
            <View style={styles.vehicleBadge}>
              <Ionicons name="bicycle" size={14} color={Colors.primary} />
              <Text style={styles.vehicleBadgeText}>Bike</Text>
            </View>
          </View>

          <View style={styles.incomingRoute}>
            <View style={styles.routeRow}>
              <View style={styles.dotGreen} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Pickup · {incomingOrder.pickup.distance} km away</Text>
                <Text style={styles.routeAddr}>{incomingOrder.pickup.address}</Text>
              </View>
            </View>
            <View style={styles.routeConnector} />
            <View style={styles.routeRow}>
              <View style={styles.dotRed} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Drop-off · {incomingOrder.dropoff.distance} km</Text>
                <Text style={styles.routeAddr}>{incomingOrder.dropoff.address}</Text>
              </View>
            </View>
          </View>

          <View style={styles.packageInfo}>
            <Ionicons name="cube-outline" size={16} color="#92400E" />
            <Text style={styles.packageText}>{incomingOrder.packageDescription}</Text>
          </View>

          <View style={styles.incomingMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.incomingMetaText}>~{incomingOrder.estimatedTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="resize-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.incomingMetaText}>{incomingOrder.dropoff.distance} km</Text>
            </View>
          </View>

          <View style={styles.incomingActions}>
            <TouchableOpacity style={styles.declineBtn} onPress={handleDecline}>
              <Ionicons name="close" size={18} color={Colors.error} />
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
              <Ionicons name="checkmark" size={18} color={Colors.white} />
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    padding: Spacing.md, zIndex: 10,
  },
  topCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.md,
  },
  topLeft: {},
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDotOnline: { backgroundColor: Colors.success },
  statusDotOffline: { backgroundColor: Colors.textLight },
  topGreet: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  topGreetOnline: { color: Colors.success },
  topGreetOffline: { color: Colors.textSecondary },
  topName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  bottomPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.md,
    paddingTop: 0,
    paddingBottom: Spacing.lg,
    ...Shadow.lg,
  },
  dragZone: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  statIconWrap: {
    width: 34, height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statusOnline: { backgroundColor: 'rgba(34,197,94,0.15)' },
  statusOffline: { backgroundColor: 'rgba(255,255,255,0.05)' },
  statusText: {
    flex: 1,
    color: 'rgba(255,255,255,0.85)',
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  targetsRow: { flexDirection: 'row', gap: Spacing.sm },
  targetCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 4,
  },
  targetIconWrap: {
    width: 30, height: 30,
    borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  targetValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  targetLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  riderPin: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3,
  },
  riderPinOnline: { backgroundColor: Colors.success, borderColor: Colors.white },
  riderPinOffline: { backgroundColor: Colors.textSecondary, borderColor: Colors.white },

  // Incoming order
  incomingModal: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.md,
    ...Shadow.lg,
    overflow: 'hidden',
  },
  countdownBar: {
    position: 'absolute',
    top: 0, left: 0,
    height: 4,
    backgroundColor: Colors.primary,
  },
  incomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  incomingBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  incomingBadgeText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  incomingPrice: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.success },
  incomingCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  customerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  customerInfo: { flex: 1 },
  customerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  customerRating: { fontSize: FontSize.xs, color: Colors.textSecondary },
  vehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
  },
  vehicleBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.primary },
  incomingRoute: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  routeConnector: { width: 2, height: 16, backgroundColor: Colors.border, marginLeft: 5, marginVertical: 4 },
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success, marginTop: 4 },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, marginTop: 4 },
  routeInfo: {},
  routeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  routeAddr: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#FEF3C7',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    marginBottom: Spacing.sm,
  },
  packageText: { fontSize: FontSize.xs, color: '#92400E', fontWeight: FontWeight.medium },
  incomingMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  incomingMetaText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  incomingActions: { flexDirection: 'row', gap: Spacing.sm },
  declineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  declineBtnText: { color: Colors.error, fontWeight: FontWeight.bold, fontSize: FontSize.md },
  acceptBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.success,
  },
  acceptBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.md },
});
