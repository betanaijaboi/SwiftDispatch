import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <SafeAreaView style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.appName}>SwiftDispatch</Text>
          <Text style={styles.tagline}>Delivery, redefined.</Text>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View
          style={[
            styles.features,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA Buttons */}
        <Animated.View style={[styles.buttons, { opacity: buttonAnim }]}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.9}
          >
            <Text style={styles.btnPrimaryText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.9}
          >
            <Text style={styles.btnSecondaryText}>I already have an account</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const FEATURES = [
  '🏍️  Real-time rider tracking',
  '💳  Multiple payment options',
  '⭐  Trusted, rated riders',
  '📦  Any package, any size',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  circle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(245,147,50,0.08)',
    top: -120,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(245,147,50,0.05)',
    top: 180,
    left: -80,
  },
  circle3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(245,147,50,0.06)',
    bottom: 120,
    right: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingTop: height * 0.12,
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoIcon: { fontSize: 44 },
  appName: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FontSize.lg,
    color: 'rgba(255,255,255,0.5)',
    marginTop: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  features: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  featureText: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: FontWeight.medium,
  },
  buttons: {
    gap: Spacing.sm,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 17,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  btnSecondary: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  btnSecondaryText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
