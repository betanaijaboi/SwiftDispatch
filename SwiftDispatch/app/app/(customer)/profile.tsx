import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrderStore } from '@/store/useOrderStore';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface MenuItem {
  icon: IoniconName;
  iconColor: string;
  iconBg: string;
  label: string;
  arrow?: boolean;
  badge?: string;
}

const MENU_SECTIONS: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline',   iconColor: '#2563EB', iconBg: '#DBEAFE', label: 'Edit Profile',      arrow: true },
      { icon: 'phone-portrait-outline', iconColor: '#16A34A', iconBg: '#DCFCE7', label: 'Phone Number', arrow: true },
      { icon: 'lock-closed-outline',    iconColor: '#7C3AED', iconBg: '#EDE9FE', label: 'Change Password', arrow: true },
      { icon: 'location-outline', iconColor: Colors.primary, iconBg: Colors.primaryBg, label: 'Saved Addresses', arrow: true },
    ],
  },
  {
    title: 'Payments',
    items: [
      { icon: 'card-outline',    iconColor: '#0369A1', iconBg: '#E0F2FE', label: 'Payment Methods',    arrow: true },
      { icon: 'wallet-outline',  iconColor: '#16A34A', iconBg: '#DCFCE7', label: 'Swift Wallet',       arrow: true, badge: '₦2,500' },
      { icon: 'receipt-outline', iconColor: '#D97706', iconBg: '#FEF3C7', label: 'Transaction History', arrow: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'chatbubble-outline',    iconColor: '#7C3AED', iconBg: '#EDE9FE', label: 'Help & Support',  arrow: true },
      { icon: 'document-text-outline', iconColor: Colors.textSecondary, iconBg: Colors.surfaceAlt, label: 'Terms & Privacy', arrow: true },
      { icon: 'star-outline',          iconColor: '#D97706', iconBg: '#FEF3C7', label: 'Rate the App',   arrow: true },
    ],
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { orderHistory } = useOrderStore();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
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
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={42} color={Colors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="pencil" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name ?? 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified account</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{orderHistory.length + 3}</Text>
              <Text style={styles.statLabel}>Deliveries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FBBF24" />
                <Text style={styles.statValue}>4.9</Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>6mo</Text>
              <Text style={styles.statLabel}>Member since</Text>
            </View>
          </View>
        </View>

        {/* Promo code */}
        <View style={styles.promoCard}>
          <View>
            <Text style={styles.promoTitle}>Your referral code</Text>
            <Text style={styles.promoCode}>SWIFT-{user?.id?.slice(-4).toUpperCase() ?? 'ABCD'}</Text>
            <Text style={styles.promoDesc}>Share & earn ₦500 per friend</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn}>
            <Ionicons name="share-outline" size={16} color={Colors.white} />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity style={styles.menuItem}>
                    <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon} size={18} color={item.iconColor} />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <View style={styles.menuRight}>
                      {item.badge && (
                        <View style={styles.menuBadge}>
                          <Text style={styles.menuBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                      {item.arrow && (
                        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
                      )}
                    </View>
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SwiftDispatch v1.0.0</Text>
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  profileCard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  avatarContainer: { position: 'relative', marginBottom: Spacing.md },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  name: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, color: Colors.text },
  email: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  verifiedText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: FontWeight.semibold },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    width: '100%',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  promoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  promoTitle: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs },
  promoCode: { color: Colors.white, fontSize: FontSize.xl, fontWeight: FontWeight.extrabold, letterSpacing: 1 },
  promoDesc: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, marginTop: 2 },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  shareBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  menuSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  menuSectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
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
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  menuBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  menuBadgeText: { color: Colors.white, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginLeft: 52 + Spacing.md },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.errorLight,
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
  },
  logoutText: { color: Colors.error, fontWeight: FontWeight.bold, fontSize: FontSize.md },
  version: {
    textAlign: 'center',
    color: Colors.textLight,
    fontSize: FontSize.xs,
    marginTop: Spacing.md,
  },
});
