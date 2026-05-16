import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius,
} from '@/constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  read: boolean;
  time: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Rider on the way',      message: 'Chukwuemeka is heading to your pickup location. ETA: 8 mins',          type: 'order',  read: false, time: '2m ago'    },
  { id: '2', title: '50% off your next ride!', message: 'Use code SWIFT50 before midnight tonight. Valid for SwiftBike only.', type: 'promo',  read: false, time: '1h ago'    },
  { id: '3', title: 'Package delivered',     message: 'Your package has been delivered to Shoprite, VI. Tap to rate.',        type: 'order',  read: true,  time: 'Yesterday' },
  { id: '4', title: 'Welcome to SwiftDispatch!', message: 'Book your first delivery and get 3 free rides with code WELCOME3.',  type: 'system', read: true,  time: '2 days ago'},
  { id: '5', title: 'New service: Night Owl', message: 'We now deliver 24/7! Book late-night deliveries at the same prices.',  type: 'promo',  read: true,  time: '3 days ago'},
];

const TYPE_CONFIG: Record<
  NotificationItem['type'],
  { icon: IoniconName; iconColor: string; bg: string }
> = {
  order:  { icon: 'cube-outline',     iconColor: '#7C3AED', bg: '#EDE9FE' },
  promo:  { icon: 'pricetag-outline', iconColor: '#D97706', bg: '#FEF3C7' },
  system: { icon: 'flash',            iconColor: Colors.primary, bg: Colors.primaryBg },
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadCount}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllBtn}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <TouchableOpacity
              style={[styles.card, !item.read && styles.cardUnread]}
              onPress={() => setNotifications(prev =>
                prev.map(n => n.id === item.id ? { ...n, read: true } : n)
              )}
              activeOpacity={0.85}
            >
              <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={22} color={cfg.iconColor} />
              </View>
              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={[styles.cardTitle, !item.read && styles.cardTitleUnread]}>
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-outline" size={48} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No new notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  unreadCount: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  markAllBtn: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
  list: { padding: Spacing.md, gap: Spacing.sm },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  cardUnread: {
    backgroundColor: 'rgba(245,147,50,0.03)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconBox: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: 2 },
  cardTitle: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  cardTitleUnread: { color: Colors.text, fontWeight: FontWeight.bold },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, flexShrink: 0 },
  message: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  time: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 80, gap: Spacing.sm },
  emptyIconWrap: {
    width: 88, height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text },
  emptySub: { fontSize: FontSize.md, color: Colors.textSecondary },
});
