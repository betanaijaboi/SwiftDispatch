import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius,
} from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { authAPI, setAuthToken } from '@/services/api';
import { UserRole } from '@/types';
import { Ionicons } from '@expo/vector-icons';

type Step = 1 | 2 | 3;

export default function RegisterScreen() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('bike');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setUser, isLoading, setLoading } = useAuthStore();

  const validateStep = (s: Step) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!name.trim()) e.name = 'Name is required';
      if (!email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
      if (!phone.trim()) e.phone = 'Phone is required';
    }
    if (s === 2) {
      if (!password) e.password = 'Password required';
      else if (password.length < 6) e.password = 'Minimum 6 characters';
      if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (s === 3 && role === 'rider') {
      if (!vehiclePlate.trim()) e.vehiclePlate = 'Plate number required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    if (step < 3) setStep((s) => (s + 1) as Step);
    else handleRegister();
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
        ...(role === 'rider' ? { vehicleType, vehiclePlate: vehiclePlate.trim() } : {}),
      };
      const { data } = await authAPI.register(payload);
      setAuthToken(data.token);
      setUser(data.user, data.token);
      router.replace(role === 'rider' ? '/(rider)/home' : '/(customer)/home');
    } catch (err: any) {
      const isNetwork = !err?.response;
      const msg = isNetwork
        ? 'Cannot reach server. Make sure the backend is running and your phone is on the same WiFi as your PC.'
        : (err?.response?.data?.message || 'Registration failed. Please try again.');
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          {/* Header */}
          <TouchableOpacity
            onPress={() => (step > 1 ? setStep((s) => (s - 1) as Step) : router.back())}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progress}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[styles.progressDot, step >= s && styles.progressDotActive]}
              />
            ))}
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 1 ? 'Create account' : step === 2 ? 'Secure it' : 'Almost done!'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Tell us about yourself'
                : step === 2
                ? 'Set a strong password'
                : 'Just a few more details'}
            </Text>
          </View>

          {/* Step 1: Personal info */}
          {step === 1 && (
            <View style={styles.form}>
              {/* Role selector */}
              <Text style={styles.sectionLabel}>I am a</Text>
              <View style={styles.roleRow}>
                {(['customer', 'rider'] as UserRole[]).map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleCard, role === r && styles.roleCardActive]}
                    onPress={() => setRole(r)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.roleIcon}>
                      {r === 'customer' ? '📦' : '🏍️'}
                    </Text>
                    <Text style={[styles.roleLabel, role === r && styles.roleLabelActive]}>
                      {r === 'customer' ? 'Customer' : 'Dispatch Rider'}
                    </Text>
                    <Text style={styles.roleDesc}>
                      {r === 'customer' ? 'Send packages' : 'Earn by delivering'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Full name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                error={errors.name}
                leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textLight} />}
              />
              <Input
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.textLight} />}
              />
              <Input
                label="Phone number"
                placeholder="+234 800 0000 000"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                error={errors.phone}
                leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textLight} />}
              />
            </View>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <View style={styles.form}>
              <Input
                label="Password"
                placeholder="Min. 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                error={errors.password}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} />}
                rightIcon={<Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textLight} />}
                onRightIconPress={() => setShowPassword(!showPassword)}
              />
              <Input
                label="Confirm password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                error={errors.confirmPassword}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} />}
              />
            </View>
          )}

          {/* Step 3: Rider vehicle info or customer finish */}
          {step === 3 && (
            <View style={styles.form}>
              {role === 'rider' ? (
                <>
                  <Text style={styles.sectionLabel}>Vehicle type</Text>
                  <View style={styles.vehicleGrid}>
                    {VEHICLE_TYPES.map((v) => (
                      <TouchableOpacity
                        key={v.type}
                        style={[styles.vehicleCard, vehicleType === v.type && styles.vehicleCardActive]}
                        onPress={() => setVehicleType(v.type)}
                      >
                        <Ionicons
                          name={v.icon}
                          size={26}
                          color={vehicleType === v.type ? Colors.primary : Colors.textSecondary}
                        />
                        <Text
                          style={[styles.vehicleLabel, vehicleType === v.type && styles.vehicleLabelActive]}
                        >
                          {v.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Input
                    label="Plate number"
                    placeholder="e.g. ABC-123-XY"
                    value={vehiclePlate}
                    onChangeText={setVehiclePlate}
                    autoCapitalize="characters"
                    error={errors.vehiclePlate}
                    leftIcon={<Ionicons name="card-outline" size={18} color={Colors.textLight} />}
                  />
                </>
              ) : (
                <View style={styles.readyCard}>
                  <View style={styles.readyIconWrap}>
                    <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
                  </View>
                  <Text style={styles.readyTitle}>You're all set!</Text>
                  <Text style={styles.readySubtitle}>
                    Tap below to create your account and start sending packages.
                  </Text>
                </View>
              )}
            </View>
          )}

          <Button
            title={step < 3 ? 'Continue' : 'Create Account'}
            onPress={nextStep}
            loading={isLoading}
            style={styles.nextBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const VEHICLE_TYPES: { type: string; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { type: 'bike',    icon: 'bicycle',     label: 'Motorbike' },
  { type: 'bicycle', icon: 'bicycle-outline', label: 'Bicycle'  },
  { type: 'car',     icon: 'car-outline', label: 'Car'       },
  { type: 'van',     icon: 'bus-outline', label: 'Van'       },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  backBtn: {
    marginTop: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20 },
  progress: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressDotActive: { backgroundColor: Colors.primary },
  header: { marginBottom: Spacing.xl },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  form: { flex: 1 },
  inputIcon: { fontSize: 16 },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  roleRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  roleCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,107,0,0.05)',
  },
  roleIcon: { fontSize: 28, marginBottom: Spacing.xs },
  roleLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  roleLabelActive: { color: Colors.primary },
  roleDesc: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 2 },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  vehicleCard: {
    width: '47%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vehicleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,107,0,0.05)',
  },
  vehicleIcon: { marginBottom: 4 },
  vehicleLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  vehicleLabelActive: { color: Colors.primary },
  readyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  readyIconWrap: { marginBottom: Spacing.md },
  readyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
  },
  readySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  nextBtn: { marginTop: Spacing.xl, marginBottom: Spacing.md },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  footerText: { color: Colors.textSecondary, fontSize: FontSize.md },
  footerLink: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
