import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useOrderStore } from '@/store/useOrderStore';
import { formatPrice } from '@/services/pricing';

const { height } = Dimensions.get('window');

const STATUS_INFO = {
  searching: { title: 'Finding your rider...', sub: 'Matching with nearby riders', emoji: '🔍', color: '#3B82F6' },
  accepted:  { title: 'Rider accepted!', sub: 'Your rider is heading to pickup', emoji: '🎉', color: Colors.success },
  pickup:    { title: 'Rider at pickup', sub: 'Collecting your package', emoji: '📦', color: '#8B5CF6' },
  in_transit:{ title: 'Package in transit', sub: 'On the way to destination', emoji: '🏍️', color: Colors.primary },
  delivered: { title: 'Delivered! 🎉', sub: 'Your package has arrived', emoji: '✅', color: Colors.success },
  cancelled: { title: 'Order cancelled', sub: 'Your order was cancelled', emoji: '❌', color: Colors.error },
};

export default function TrackingScreen() {
  const { currentOrder, riderLocation, updateOrderStatus, resetBooking } = useOrderStore();
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [riderCoords, setRiderCoords] = useState({
    latitude: 6.5144,
    longitude: 3.3692,
  });
  const [timeLeft, setTimeLeft] = useState(currentOrder?.estimatedTime ?? 15);

  // Simulate rider movement and status progression
  useEffect(() => {
    if (!currentOrder) return;

    // Pulse animation for searching
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    if (currentOrder.status === 'searching') pulse.start();

    // Simulate status flow
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (currentOrder.status === 'searching') {
      timers.push(setTimeout(() => updateOrderStatus('accepted'), 3000));
      timers.push(setTimeout(() => updateOrderStatus('pickup'), 8000));
      timers.push(setTimeout(() => updateOrderStatus('in_transit'), 14000));
      timers.push(setTimeout(() => updateOrderStatus('delivered'), 22000));
    }

    // Simulate rider movement
    const moveInterval = setInterval(() => {
      setRiderCoords(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.002,
      }));
    }, 2000);

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => {
      pulse.stop();
      timers.forEach(clearTimeout);
      clearInterval(moveInterval);
      clearInterval(countdown);
    };
  }, [currentOrder?.status]);

  if (!currentOrder) {
    router.replace('/(customer)/home');
    return null;
  }

  const statusKey = currentOrder.status as keyof typeof STATUS_INFO;
  const info = STATUS_INFO[statusKey] ?? STATUS_INFO.searching;
  const isDelivered = currentOrder.status === 'delivered';
  const isCancelled = currentOrder.status === 'cancelled';

  const handleCancel = () => {
    Alert.alert('Cancel Order?', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Cancel Order',
        style: 'destructive',
        onPress: () => {
          updateOrderStatus('cancelled');
          setTimeout(() => {
            resetBooking();
            router.replace('/(customer)/home');
          }, 2000);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: riderCoords.latitude,
          longitude: riderCoords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation
      >
        {/* Rider marker */}
        <Marker coordinate={riderCoords} title="Rider">
          <Animated.View style={[styles.riderMarker, { transform: [{ scale: currentOrder.status === 'searching' ? pulseAnim : new Animated.Value(1) }] }]}>
            <Text style={styles.riderMarkerEmoji}>🏍️</Text>
          </Animated.View>
        </Marker>

        {/* Pickup marker */}
        {currentOrder.pickup && (
          <Marker coordinate={currentOrder.pickup.coordinates} title="Pickup">
            <View style={styles.pickupMarker}>
              <Text style={{ fontSize: 20 }}>📍</Text>
            </View>
          </Marker>
        )}

        {/* Route line */}
        {currentOrder.pickup && (
          <Polyline
            coordinates={[riderCoords, currentOrder.pickup.coordinates]}
            strokeColor={Colors.primary}
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
        )}
      </MapView>

      {/* Top status bar */}
      <SafeAreaView style={styles.topBar} pointerEvents="box-none">
        <View style={styles.statusPill}>
          <Text style={styles.statusEmoji}>{info.emoji}</Text>
          <Text style={styles.statusPillText}>{info.title}</Text>
        </View>
      </SafeAreaView>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        {/* Rider info */}
        {!isDelivered && !isCancelled && currentOrder.status !== 'searching' && (
          <View style={styles.riderCard}>
            <View style={styles.riderAvatar}>
              <Text style={styles.riderAvatarEmoji}>🧑</Text>
            </View>
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>Chukwuemeka O.</Text>
              <View style={styles.riderRating}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={styles.ratingText}>4.9 · 823 rides</Text>
              </View>
              <Text style={styles.vehicleInfo}>
                🏍️ Honda CB150R · LSD-421-AR
              </Text>
            </View>
            <View style={styles.riderActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnEmoji}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnEmoji}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Status */}
        <View style={[styles.statusCard, { borderColor: info.color }]}>
          <Text style={styles.statusTitle}>{info.title}</Text>
          <Text style={styles.statusSub}>{info.sub}</Text>

          {/* Progress steps */}
          <View style={styles.progress}>
            {PROGRESS_STEPS.map((step, i) => {
              const stepIndex = PROGRESS_STEPS.indexOf(PROGRESS_STEPS.find(s => s.status === currentOrder.status) ?? PROGRESS_STEPS[0]);
              const isDone = i <= stepIndex;
              return (
                <React.Fragment key={step.status}>
                  <View style={[styles.progressStep, isDone && styles.progressStepDone]}>
                    <Text style={styles.progressEmoji}>{step.emoji}</Text>
                  </View>
                  {i < PROGRESS_STEPS.length - 1 && (
                    <View style={[styles.progressLine, i < stepIndex && styles.progressLineDone]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Route info */}
        <View style={styles.routeRow}>
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>📍 From</Text>
            <Text style={styles.routeValue} numberOfLines={1}>{currentOrder.pickup.address}</Text>
          </View>
          <View style={styles.routeArrow}>
            <Text style={styles.routeArrowText}>→</Text>
          </View>
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>🏁 To</Text>
            <Text style={styles.routeValue} numberOfLines={1}>{currentOrder.dropoff.address}</Text>
          </View>
        </View>

        {/* Price + ETA */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Total</Text>
            <Text style={styles.metaValue}>{formatPrice(currentOrder.price)}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ETA</Text>
            <Text style={styles.metaValue}>~{timeLeft} min</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Order ID</Text>
            <Text style={styles.metaValue}>{currentOrder.id.slice(-6).toUpperCase()}</Text>
          </View>
        </View>

        {/* CTA */}
        {isDelivered ? (
          <TouchableOpacity
            style={styles.rateBtn}
            onPress={() => router.push('/(customer)/rate-order')}
          >
            <Text style={styles.rateBtnText}>⭐  Rate your rider</Text>
          </TouchableOpacity>
        ) : isCancelled ? (
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => { resetBooking(); router.replace('/(customer)/home'); }}
          >
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        ) : currentOrder.status === 'searching' ? (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const PROGRESS_STEPS = [
  { status: 'searching', emoji: '🔍' },
  { status: 'accepted', emoji: '✅' },
  { status: 'pickup', emoji: '📦' },
  { status: 'in_transit', emoji: '🏍️' },
  { status: 'delivered', emoji: '🏁' },
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    alignItems: 'center', paddingTop: Spacing.md, zIndex: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    ...Shadow.md,
  },
  statusEmoji: { fontSize: 18 },
  statusPillText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.md,
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: Spacing.md,
  },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  riderAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  riderAvatarEmoji: { fontSize: 28 },
  riderDetails: { flex: 1 },
  riderName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  riderRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  starIcon: { fontSize: 12 },
  ratingText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  vehicleInfo: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  riderActions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  actionBtnEmoji: { fontSize: 18 },
  statusCard: {
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  statusTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  statusSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.md },
  progress: { flexDirection: 'row', alignItems: 'center' },
  progressStep: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  progressStepDone: { backgroundColor: Colors.primary },
  progressEmoji: { fontSize: 16 },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border },
  progressLineDone: { backgroundColor: Colors.primary },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  routeInfo: { flex: 1 },
  routeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  routeValue: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  routeArrow: { paddingHorizontal: 4 },
  routeArrowText: { fontSize: 18, color: Colors.textSecondary },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: { flex: 1, alignItems: 'center' },
  metaLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  metaValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  metaDivider: { width: 1, backgroundColor: Colors.border },
  rateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rateBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  homeBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtnText: { color: Colors.error, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  riderMarker: { alignItems: 'center', justifyContent: 'center' },
  riderMarkerEmoji: { fontSize: 30 },
  pickupMarker: { alignItems: 'center', justifyContent: 'center' },
});
