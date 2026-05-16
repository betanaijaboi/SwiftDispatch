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
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { authAPI, setAuthToken } from '@/services/api';
import { socketService } from '@/services/socket';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { setUser, isLoading, setLoading } = useAuthStore();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authAPI.login(email.trim(), password);
      setAuthToken(data.token);
      socketService.connect(data.token);
      setUser(data.user, data.token);
      router.replace(data.user.role === 'rider' ? '/(rider)/home' : '/(customer)/home');
    } catch (err: any) {
      const isNetwork = !err?.response;
      const msg = isNetwork
        ? 'Cannot reach server. Make sure the backend is running and your phone is on the same WiFi as your PC.'
        : (err?.response?.data?.message || 'Login failed. Please try again.');
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  // Demo login for testing
  const handleDemoLogin = (role: 'customer' | 'rider') => {
    const demoUser = {
      id: `demo_${role}_1`,
      name: role === 'customer' ? 'Demo Customer' : 'Demo Rider',
      email: `demo_${role}@swift.com`,
      phone: '+2348012345678',
      role,
      rating: 4.8,
      totalRides: 42,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser, 'demo_token_' + role);
    router.replace(role === 'rider' ? '/(rider)/home' : '/(customer)/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Ionicons name="flash" size={32} color={Colors.white} />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your SwiftDispatch account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.textLight} />}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              error={errors.password}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.textLight} />}
              rightIcon={
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={Colors.textLight} />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginBtn}
            />

            {/* Demo section */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or try demo</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.demoRow}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleDemoLogin('customer')}
              >
                <Text style={styles.demoBtnIcon}>👤</Text>
                <Text style={styles.demoBtnText}>Customer Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, styles.demoBtnRider]}
                onPress={() => handleDemoLogin('rider')}
              >
                <Text style={styles.demoBtnIcon}>🏍️</Text>
                <Text style={styles.demoBtnText}>Rider Demo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  logoBox: {
    width: 68, height: 68,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  form: { flex: 1 },
  inputIcon: { fontSize: 16 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: Spacing.lg, marginTop: -Spacing.xs },
  forgotText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  loginBtn: { marginBottom: Spacing.xl },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    marginHorizontal: Spacing.md,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  demoRow: { flexDirection: 'row', gap: Spacing.sm },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  demoBtnRider: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,107,0,0.05)',
  },
  demoBtnIcon: { fontSize: 18 },
  demoBtnText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: { color: Colors.textSecondary, fontSize: FontSize.md },
  footerLink: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
