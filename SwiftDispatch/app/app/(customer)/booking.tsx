import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useOrderStore } from '@/store/useOrderStore';
import { VEHICLE_OPTIONS, calculatePrice, calculateDistance, formatPrice, formatDistance, formatDuration } from '@/services/pricing';
import { VehicleType, PaymentMethod } from '@/types';
import Button from '@/components/Button';

type BookingStep = 'location' | 'vehicle' | 'details' | 'payment';

const MOCK_SUGGESTIONS: { id: string; name: string; address: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: '1', name: 'Shoprite, Lekki',            address: 'Admiralty Way, Lekki Phase 1',       icon: 'storefront-outline' },
  { id: '2', name: 'UNILAG Main Gate',            address: 'University Road, Akoka',             icon: 'school-outline'     },
  { id: '3', name: 'Murtala Muhammed Airport',    address: 'Ikeja, Lagos',                       icon: 'airplane-outline'   },
  { id: '4', name: 'Eko Hotel',                   address: 'Plot 1415, Adetokunbo Ademola St, VI', icon: 'business-outline' },
  { id: '5', name: 'Balogun Market',              address: 'Lagos Island',                       icon: 'bag-handle-outline' },
];

export default function BookingScreen() {
  const {
    pickup, dropoff, selectedVehicle, selectedPayment,
    note, packageDescription,
    setPickup, setDropoff, setSelectedVehicle, setSelectedPayment,
    setNote, setPackageDescription, setEstimates, estimatedPrice,
    estimatedDistance, estimatedTime,
  } = useOrderStore();

  const [step, setStep] = useState<BookingStep>('location');
  const [pickupText, setPickupText] = useState(pickup?.address ?? 'Current location');
  const [dropoffText, setDropoffText] = useState(dropoff?.address ?? '');
  const [activeInput, setActiveInput] = useState<'pickup' | 'dropoff' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (pickup && dropoff && selectedVehicle) {
      const dist = calculateDistance(
        pickup.coordinates.latitude,
        pickup.coordinates.longitude,
        dropoff.coordinates.latitude,
        dropoff.coordinates.longitude
      );
      const price = calculatePrice(selectedVehicle, dist);
      const vehicle = VEHICLE_OPTIONS.find((v) => v.type === selectedVehicle)!;
      const time = vehicle.eta + dist * 3;
      setEstimates(price, dist, time);
    }
  }, [pickup, dropoff, selectedVehicle]);

  const selectSuggestion = (s: (typeof MOCK_SUGGESTIONS)[0]) => {
    const location = {
      coordinates: {
        latitude: 6.5244 + Math.random() * 0.05,
        longitude: 3.3792 + Math.random() * 0.05,
      },
      address: s.address,
      name: s.name,
    };
    if (activeInput === 'pickup') {
      setPickup(location);
      setPickupText(s.name);
    } else {
      setDropoff(location);
      setDropoffText(s.name);
    }
    setActiveInput(null);
    Keyboard.dismiss();
  };

  const canProceedLocation = pickupText.trim() && dropoffText.trim();

  const handleConfirmOrder = async () => {
    if (!pickup || !dropoff || !selectedVehicle) return;
    setIsConfirming(true);
    // Simulate order creation (real: call orderAPI.create)
    setTimeout(() => {
      const mockOrder = {
        id: `ORD-${Date.now()}`,
        customerId: 'customer_1',
        pickup: pickup,
        dropoff: dropoff,
        vehicleType: selectedVehicle,
        status: 'searching' as const,
        price: estimatedPrice,
        distance: estimatedDistance,
        estimatedTime: estimatedTime,
        note,
        packageDescription,
        createdAt: new Date().toISOString(),
        paymentMethod: selectedPayment,
      };
      useOrderStore.getState().setCurrentOrder(mockOrder);
      setIsConfirming(false);
      router.replace('/(customer)/tracking');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top nav */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 'location') router.back();
            else setStep(prev =>
              prev === 'vehicle' ? 'location' :
              prev === 'details' ? 'vehicle' : 'details'
            );
          }}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {step === 'location' ? 'Where to?' :
           step === 'vehicle' ? 'Choose Rider' :
           step === 'details' ? 'Package Details' : 'Payment'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Step indicators */}
      <View style={styles.steps}>
        {(['location', 'vehicle', 'details', 'payment'] as BookingStep[]).map((s, i) => (
          <React.Fragment key={s}>
            <View style={[styles.stepDot, step === s && styles.stepDotActive,
              ['vehicle', 'details', 'payment'].indexOf(s) <= ['location', 'vehicle', 'details', 'payment'].indexOf(step) && styles.stepDotDone
            ]}>
              <Text style={styles.stepDotText}>{i + 1}</Text>
            </View>
            {i < 3 && <View style={[styles.stepLine,
              ['vehicle', 'details', 'payment'].indexOf(s) <= ['location', 'vehicle', 'details', 'payment'].indexOf(step) && styles.stepLineDone
            ]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Locations */}
        {step === 'location' && (
          <View>
            <View style={styles.locationCard}>
              <View style={styles.locationDots}>
                <View style={styles.dotGreen} />
                <View style={styles.dotLine} />
                <View style={styles.dotRed} />
              </View>
              <View style={styles.locationInputs}>
                <TouchableOpacity onPress={() => setActiveInput('pickup')} activeOpacity={1}>
                  <TextInput
                    style={[styles.locationInput, activeInput === 'pickup' && styles.locationInputActive]}
                    placeholder="Pickup location"
                    placeholderTextColor={Colors.textLight}
                    value={pickupText}
                    onChangeText={setPickupText}
                    onFocus={() => setActiveInput('pickup')}
                  />
                </TouchableOpacity>
                <View style={styles.locationDivider} />
                <TouchableOpacity onPress={() => setActiveInput('dropoff')} activeOpacity={1}>
                  <TextInput
                    style={[styles.locationInput, activeInput === 'dropoff' && styles.locationInputActive]}
                    placeholder="Drop-off location"
                    placeholderTextColor={Colors.textLight}
                    value={dropoffText}
                    onChangeText={setDropoffText}
                    onFocus={() => setActiveInput('dropoff')}
                    autoFocus={!dropoffText}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Suggestions */}
            {activeInput && (
              <View style={styles.suggestions}>
                <Text style={styles.suggestionsTitle}>Suggestions</Text>
                {MOCK_SUGGESTIONS.filter(s =>
                  !dropoffText || s.name.toLowerCase().includes(
                    (activeInput === 'dropoff' ? dropoffText : pickupText).toLowerCase()
                  ) || true
                ).map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={styles.suggestionRow}
                    onPress={() => selectSuggestion(s)}
                  >
                    <View style={styles.suggestionIcon}>
                      <Ionicons name={s.icon} size={18} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionName}>{s.name}</Text>
                      <Text style={styles.suggestionAddr}>{s.address}</Text>
                    </View>
                    <Text style={styles.suggestionArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Button
              title="Confirm Locations"
              onPress={() => {
                if (!dropoff) {
                  setDropoff({
                    coordinates: { latitude: 6.5544, longitude: 3.3492 },
                    address: dropoffText,
                  });
                }
                setStep('vehicle');
              }}
              disabled={!canProceedLocation}
              style={styles.actionBtn}
            />
          </View>
        )}

        {/* STEP 2: Vehicle */}
        {step === 'vehicle' && (
          <View>
            {/* Route summary */}
            <View style={styles.routeSummary}>
              <View style={styles.routePoint}>
                <View style={styles.dotGreen} />
                <Text style={styles.routeText} numberOfLines={1}>{pickupText}</Text>
              </View>
              <Text style={styles.routeArrow}>↓</Text>
              <View style={styles.routePoint}>
                <View style={styles.dotRed} />
                <Text style={styles.routeText} numberOfLines={1}>{dropoffText}</Text>
              </View>
            </View>

            <Text style={styles.vehicleTitle}>Available riders</Text>
            {VEHICLE_OPTIONS.map((v) => {
              const dist = estimatedDistance || 5;
              const price = calculatePrice(v.type, dist);
              const time = v.eta + dist * 3;
              const isSelected = selectedVehicle === v.type;
              return (
                <TouchableOpacity
                  key={v.type}
                  style={[styles.vehicleCard, isSelected && styles.vehicleCardSelected]}
                  onPress={() => setSelectedVehicle(v.type as VehicleType)}
                  activeOpacity={0.85}
                >
                  <View style={styles.vehicleIconWrap}>
                    <Ionicons name={v.icon as keyof typeof Ionicons.glyphMap} size={28} color={isSelected ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <View style={styles.vehicleInfo}>
                    <Text style={styles.vehicleName}>{v.label}</Text>
                    <Text style={styles.vehicleDesc}>{v.description}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <Ionicons name="cube-outline" size={11} color={Colors.textLight} />
                      <Text style={styles.vehicleCap}>{v.capacity}</Text>
                    </View>
                  </View>
                  <View style={styles.vehiclePricing}>
                    <Text style={[styles.vehiclePrice, isSelected && styles.vehiclePriceSelected]}>
                      {formatPrice(price)}
                    </Text>
                    <Text style={styles.vehicleEta}>~{Math.round(time)} min</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedCheck}>
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            <Button
              title="Continue"
              onPress={() => setStep('details')}
              disabled={!selectedVehicle}
              style={styles.actionBtn}
            />
          </View>
        )}

        {/* STEP 3: Package details */}
        {step === 'details' && (
          <View>
            <Text style={styles.detailsLabel}>Describe your package</Text>
            <TextInput
              style={styles.detailsInput}
              placeholder="e.g. iPhone 15 Pro, fragile"
              placeholderTextColor={Colors.textLight}
              value={packageDescription}
              onChangeText={setPackageDescription}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.detailsLabel}>Note for rider (optional)</Text>
            <TextInput
              style={styles.detailsInput}
              placeholder="e.g. Call before arrival, leave at gate"
              placeholderTextColor={Colors.textLight}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />

            {/* Order summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              {[
                { label: 'Distance', value: formatDistance(estimatedDistance) },
                { label: 'Estimated time', value: formatDuration(estimatedTime) },
                { label: 'Vehicle', value: VEHICLE_OPTIONS.find(v => v.type === selectedVehicle)?.label ?? '' },
              ].map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{row.label}</Text>
                  <Text style={styles.summaryValue}>{row.value}</Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotal}>{formatPrice(estimatedPrice)}</Text>
              </View>
            </View>

            <Button
              title="Choose Payment"
              onPress={() => setStep('payment')}
              style={styles.actionBtn}
            />
          </View>
        )}

        {/* STEP 4: Payment */}
        {step === 'payment' && (
          <View>
            <Text style={styles.paymentTitle}>Payment method</Text>
            {PAYMENT_METHODS.map((pm) => {
              const isSelected = selectedPayment === pm.method;
              return (
                <TouchableOpacity
                  key={pm.method}
                  style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
                  onPress={() => setSelectedPayment(pm.method as PaymentMethod)}
                >
                  <View style={[styles.paymentIconWrap, { backgroundColor: isSelected ? Colors.primaryBg : Colors.surfaceAlt }]}>
                    <Ionicons name={pm.icon} size={22} color={pm.iconColor} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentName}>{pm.label}</Text>
                    <Text style={styles.paymentDesc}>{pm.desc}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioActive]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Final summary */}
            <View style={styles.finalSummary}>
              <View style={styles.finalRow}>
                <Text style={styles.finalLabel}>Route</Text>
                <Text style={styles.finalValue} numberOfLines={1}>{pickupText} → {dropoffText}</Text>
              </View>
              <View style={styles.finalRow}>
                <Text style={styles.finalLabel}>Amount</Text>
                <Text style={[styles.finalValue, styles.finalAmount]}>{formatPrice(estimatedPrice)}</Text>
              </View>
            </View>

            <Button
              title={`Book Rider — ${formatPrice(estimatedPrice)}`}
              onPress={handleConfirmOrder}
              loading={isConfirming}
              style={styles.actionBtn}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const PAYMENT_METHODS: { method: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string; label: string; desc: string }[] = [
  { method: 'cash',   icon: 'cash-outline',   iconColor: '#16A34A', label: 'Cash',   desc: 'Pay rider on delivery'    },
  { method: 'card',   icon: 'card-outline',   iconColor: '#2563EB', label: 'Card',   desc: 'Visa, Mastercard, Verve'  },
  { method: 'wallet', icon: 'wallet-outline', iconColor: '#7C3AED', label: 'Wallet', desc: 'Swift balance: ₦2,500'    },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 20 },
  navTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  stepDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  stepDotDone: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  stepDotText: { fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border },
  stepLineDone: { backgroundColor: Colors.primary },
  content: { flex: 1, paddingHorizontal: Spacing.md },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  locationDots: { alignItems: 'center', paddingTop: 14, gap: 4 },
  dotGreen: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success },
  dotLine: { width: 2, height: 32, backgroundColor: Colors.border, marginVertical: 2 },
  dotRed: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  locationInputs: { flex: 1 },
  locationInput: {
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  locationInputActive: { color: Colors.primary },
  locationDivider: { height: 1, backgroundColor: Colors.border },
  suggestions: {
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
    overflow: 'hidden',
  },
  suggestionsTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  suggestionIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  suggestionText: { flex: 1 },
  suggestionName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  suggestionAddr: { fontSize: FontSize.xs, color: Colors.textSecondary },
  suggestionArrow: { fontSize: 22, color: Colors.textLight },
  actionBtn: { marginTop: Spacing.xl },
  routeSummary: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    gap: 4,
  },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  routeText: { flex: 1, fontSize: FontSize.sm, color: Colors.text, fontWeight: FontWeight.medium },
  routeArrow: { fontSize: 18, color: Colors.textSecondary, paddingLeft: 4 },
  vehicleTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  vehicleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,107,0,0.03)',
  },
  vehicleIconWrap: {
    width: 52, height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  vehicleDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },
  vehicleCap: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  vehiclePricing: { alignItems: 'flex-end' },
  vehiclePrice: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  vehiclePriceSelected: { color: Colors.primary },
  vehicleEta: { fontSize: FontSize.xs, color: Colors.textSecondary },
  selectedCheck: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: 8, right: 8,
  },
  checkmark: { color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold },
  detailsLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  detailsInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 88,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  summaryCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  summaryTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryValue: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text },
  summaryDivider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.xs },
  summaryTotalLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  summaryTotal: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.primary },
  paymentTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text, marginTop: Spacing.md, marginBottom: Spacing.sm },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  paymentCardSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(255,107,0,0.03)' },
  paymentIconWrap: {
    width: 44, height: 44,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  paymentInfo: { flex: 1 },
  paymentName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  paymentDesc: { fontSize: FontSize.xs, color: Colors.textSecondary },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  finalSummary: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.xs,
  },
  finalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  finalLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  finalValue: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.text, flex: 1, textAlign: 'right' },
  finalAmount: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.primary },
});
