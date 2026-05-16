import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { formatPrice } from '@/services/pricing';

type DeliveryStep = 'heading_pickup' | 'at_pickup' | 'in_transit' | 'delivered';

const STEPS: { key: DeliveryStep; label: string; emoji: string }[] = [
  { key: 'heading_pickup', label: 'Heading to pickup', emoji: '🏍️' },
  { key: 'at_pickup', label: 'At pickup', emoji: '📦' },
  { key: 'in_transit', label: 'In transit', emoji: '🚀' },
  { key: 'delivered', label: 'Delivered', emoji: '✅' },
];

const ORDER = {
  id: 'ORD-2041',
  customer: { name: 'Adaeze Nwosu', phone: '+2348012345678', rating: 4.7 },
  pickup: { address: '14 Palm Close, Lekki', coords: { latitude: 6.52, longitude: 3.37 } },
  dropoff: { address: 'Shoprite, VI', coords: { latitude: 6.54, longitude: 3.39 } },
  price: 1850,
  packageDescription: 'iPhone 15 Pro — fragile',
  paymentMethod: 'cash',
};

export default function ActiveOrderScreen() {
  const [step, setStep] = useState<DeliveryStep>('heading_pickup');
  const mapRef = useRef<MapView>(null);

  const currentStepIndex = STEPS.findIndex(s => s.key === step);
  const isLast = currentStepIndex === STEPS.length - 1;

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex].key);
    }
  };

  const handleDelivered = () => {
    Alert.alert(
      'Confirm Delivery',
      `Have you delivered the package to ${ORDER.dropoff.address}?`,
      [
        { text: 'Not yet', style: 'cancel' },
        {
          text: 'Yes, Delivered!',
          onPress: () => {
            setStep('delivered');
            setTimeout(() => router.replace('/(rider)/home'), 3000);
          },
        },
      ]
    );
  };

  const nextBtnLabel =
    step === 'heading_pickup' ? '📦 Arrived at Pickup' :
    step === 'at_pickup' ? '🚀 Package Picked Up' :
    step === 'in_transit' ? '✅ Confirm Delivery' : '';

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: (ORDER.pickup.coords.latitude + ORDER.dropoff.coords.latitude) / 2,
          longitude: (ORDER.pickup.coords.longitude + ORDER.dropoff.coords.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={ORDER.pickup.coords} title="Pickup">
          <View style={styles.pickupPin}>
            <Text style={styles.pinEmoji}>📍</Text>
          </View>
        </Marker>
        <Marker coordinate={ORDER.dropoff.coords} title="Dropoff">
          <View style={styles.dropoffPin}>
            <Text style={styles.pinEmoji}>🏁</Text>
          </View>
        </Marker>
        <Polyline
          coordinates={[ORDER.pickup.coords, ORDER.dropoff.coords]}
          strokeColor={Colors.primary}
          strokeWidth={4}
        />
      </MapView>

      {/* Top nav */}
      <SafeAreaView style={styles.topNav} pointerEvents="box-none">
        <View style={styles.navCard}>
          <Text style={styles.navTitle}>Active Delivery</Text>
          <Text style={styles.navOrder}>#{ORDER.id}</Text>
        </View>
      </SafeAreaView>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        {/* Progress */}
        <View style={styles.progress}>
          {STEPS.map((s, i) => {
            const done = i <= currentStepIndex;
            return (
              <React.Fragment key={s.key}>
                <View style={[styles.progressStep, done && styles.progressStepDone]}>
                  <Text style={styles.progressEmoji}>{s.emoji}</Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.progressLine, i < currentStepIndex && styles.progressLineDone]} />
                )}
              </React.Fragment>
            );
          })}
        </View>

        <Text style={styles.currentStatus}>
          {STEPS[currentStepIndex].emoji}  {STEPS[currentStepIndex].label}
        </Text>

        {/* Customer card */}
        <View style={styles.customerCard}>
          <View style={styles.customerAvatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{ORDER.customer.name}</Text>
            <Text style={styles.customerRating}>⭐ {ORDER.customer.rating}</Text>
          </View>
          <View style={styles.customerActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <View>
              <Text style={styles.routeType}>Pickup</Text>
              <Text style={styles.routeAddr}>{ORDER.pickup.address}</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.dotRed} />
            <View>
              <Text style={styles.routeType}>Drop-off</Text>
              <Text style={styles.routeAddr}>{ORDER.dropoff.address}</Text>
            </View>
          </View>
        </View>

        {/* Package + earnings */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>📦 Package</Text>
            <Text style={styles.metaValue} numberOfLines={1}>{ORDER.packageDescription}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>💰 Earning</Text>
            <Text style={[styles.metaValue, styles.earningText]}>{formatPrice(ORDER.price)}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>💳 Payment</Text>
            <Text style={styles.metaValue}>{ORDER.paymentMethod === 'cash' ? '💵 Cash' : '💳 Card'}</Text>
          </View>
        </View>

        {/* Action button */}
        {step !== 'delivered' ? (
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={step === 'in_transit' ? handleDelivered : handleNextStep}
          >
            <Text style={styles.nextBtnText}>{nextBtnLabel}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.deliveredCard}>
            <Text style={styles.deliveredEmoji}>🎉</Text>
            <Text style={styles.deliveredText}>Delivery Complete!</Text>
            <Text style={styles.deliveredEarning}>You earned {formatPrice(ORDER.price)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    position: 'absolute', top: 0, left: 0, right: 0,
    padding: Spacing.md, zIndex: 10,
  },
  navCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.md,
  },
  navTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  navOrder: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.md,
    ...Shadow.lg,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  progressStep: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  progressStepDone: { backgroundColor: Colors.primary },
  progressEmoji: { fontSize: 16 },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border },
  progressLineDone: { backgroundColor: Colors.primary },
  currentStatus: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  customerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 22 },
  customerInfo: { flex: 1 },
  customerName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  customerRating: { fontSize: FontSize.xs, color: Colors.textSecondary },
  customerActions: { flexDirection: 'row', gap: Spacing.xs },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.sm,
  },
  actionBtnText: { fontSize: 18 },
  routeCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  routeConnector: { width: 2, height: 12, backgroundColor: Colors.border, marginLeft: 5, marginVertical: 4 },
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success, marginTop: 4 },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary, marginTop: 4 },
  routeType: { fontSize: FontSize.xs, color: Colors.textSecondary },
  routeAddr: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  metaRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  metaLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  metaValue: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.text, textAlign: 'center' },
  earningText: { color: Colors.success, fontSize: FontSize.sm },
  metaDivider: { width: 1, backgroundColor: Colors.border },
  nextBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 17,
    alignItems: 'center',
  },
  nextBtnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  deliveredCard: {
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  deliveredEmoji: { fontSize: 40 },
  deliveredText: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.success },
  deliveredEarning: { fontSize: FontSize.md, color: Colors.success },
  pickupPin: {},
  dropoffPin: {},
  pinEmoji: { fontSize: 30 },
});
