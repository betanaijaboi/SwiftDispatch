import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

type IoniconName = keyof typeof Ionicons.glyphMap;

const MENU: { icon: IoniconName; iconColor: string; iconBg: string; label: string }[] = [
  { icon: 'document-text-outline', iconColor: '#2563EB', iconBg: '#DBEAFE', label: 'Documents & Verification' },
  { icon: 'card-outline',          iconColor: '#16A34A', iconBg: '#DCFCE7', label: 'Bank Account'             },
  { icon: 'chatbubble-outline',    iconColor: '#7C3AED', iconBg: '#EDE9FE', label: 'Help & Support'           },
  { icon: 'notifications-outline', iconColor: '#D97706', iconBg: '#FEF3C7', label: 'Notifications'            },
  { icon: 'settings-outline',      iconColor: Colors.textSecondary, iconBg: Colors.surfaceAlt, label: 'App Settings' },
];

const PERFORMANCE: { icon: IoniconName; color: string; bg: string; label: string; value: string }[] = [
  { icon: 'rocket-outline',           color: '#818CF8', bg: '#EEF2FF', label: 'Total Trips', value: '823' },
  { icon: 'checkmark-circle-outline', color: Colors.success, bg: '#DCFCE7', label: 'Completion', value: '96%' },
  { icon: 'flash',                    color: '#FBBF24', bg: '#FEF3C7', label: 'Acceptance', value: '92%'  },
  { icon: 'time-outline',             color: Colors.primary, bg: Colors.primaryBg, label: 'Avg Time', value: '22min' },
];

export default function RiderProfile() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => { logout(); router.replace('/(auth)/splash'); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile banner */}
        <View style={styles.banner}>
          <View style={styles.avatar}>
            <Ionicons name="bicycle" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{user?.name ?? 'Rider'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.badgeText}>4.9 Rating</Text>
            </View>
            <View style={[styles.badge, styles.badgeGold]}>
              <Ionicons name="trophy-outline" size={12} color="#FDE68A" />
              <Text style={styles.badgeText}>Silver Tier</Text>
            </View>
          </View>
        </View>

        {/* Performance */}
        <View style={styles.perfCard}>
          <Text style={styles.perfTitle}>Performance</Text>
          <View style={styles.perfRow}>
            {PERFORMANCE.map(p => (
              <View key={p.label} style={styles.perfItem}>
                <View style={[styles.perfIconWrap, { backgroundColor: p.bg }]}>
                  <Ionicons name={p.icon} size={20} color={p.color} />
                </View>
                <Text style={styles.perfValue}>{p.value}</Text>
                <Text style={styles.perfLabel}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Vehicle info */}
        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleTitle}>My Vehicle</Text>
          <View style={styles.vehicleRow}>
            <View style={styles.vehicleIconWrap}>
              <Ionicons name="bicycle" size={32} color={Colors.primary} />
            </View>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>Honda CB150R · Black</Text>
              <Text style={styles.vehiclePlate}>LSD-421-AR</Text>
            </View>
            <TouchableOpacity style={styles.editVehicleBtn}>
              <Text style={styles.editVehicleText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={18} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
              </TouchableOpacity>
              {i < MENU.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  banner: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.white },
  email: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeGold: { backgroundColor: 'rgba(255,215,0,0.2)' },
  badgeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  perfCard: {
    backgroundColor: Colors.white,
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  perfTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  perfRow: { flexDirection: 'row' },
  perfItem: { flex: 1, alignItems: 'center', gap: 4 },
  perfIconWrap: {
    width: 40, height: 40,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  perfValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  perfLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, textAlign: 'center' },
  vehicleCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  vehicleTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.sm },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  vehicleIconWrap: {
    width: 60, height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  vehicleInfo: { flex: 1 },
  vehicleName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  vehiclePlate: { fontSize: FontSize.sm, color: Colors.textSecondary },
  editVehicleBtn: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  editVehicleText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  menuCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text, fontWeight: FontWeight.medium },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 52 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.errorLight,
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
  },
  logoutText: { color: Colors.error, fontWeight: FontWeight.bold, fontSize: FontSize.md },
});
