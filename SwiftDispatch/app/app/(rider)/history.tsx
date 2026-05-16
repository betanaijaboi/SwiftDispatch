import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius,
} from '@/constants/theme';
import { formatPrice } from '@/services/pricing';
import StatusBadge from '@/components/StatusBadge';

const MOCK_TRIPS = [
  { id: 'ORD-2041', customer: 'Adaeze Nwosu', pickup: '14 Palm Close, Lekki', dropoff: 'Shoprite, VI', vehicleType: 'bike', earning: 1850, status: 'delivered', date: 'Today, 2:34 PM', rating: 5 },
  { id: 'ORD-2038', customer: 'Tunde Balogun', pickup: 'Ikeja GRA', dropoff: 'UNILAG', vehicleType: 'bike', earning: 2400, status: 'delivered', date: 'Today, 11:15 AM', rating: 4 },
  { id: 'ORD-2035', customer: 'Chidi Okonkwo', pickup: 'VI', dropoff: 'Ajah', vehicleType: 'bike', earning: 950, status: 'cancelled', date: 'Today, 9:02 AM' },
  { id: 'ORD-2029', customer: 'Funke Adesanya', pickup: 'Surulere', dropoff: 'Yaba', vehicleType: 'bike', earning: 3100, status: 'delivered', date: 'Yesterday', rating: 5 },
  { id: 'ORD-2021', customer: 'Emeka Eze', pickup: 'Oshodi', dropoff: 'Mushin', vehicleType: 'bike', earning: 1200, status: 'delivered', date: 'Yesterday', rating: 4 },
];

export default function RiderHistory() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip History</Text>
        <Text style={styles.subtitle}>{MOCK_TRIPS.length} total trips</Text>
      </View>

      <FlatList
        data={MOCK_TRIPS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{item.id}</Text>
              <StatusBadge status={item.status as any} />
            </View>
            <Text style={styles.customer}>👤 {item.customer}</Text>
            <View style={styles.route}>
              <View style={styles.routePoint}>
                <View style={styles.dotGreen} />
                <Text style={styles.routeText} numberOfLines={1}>{item.pickup}</Text>
              </View>
              <View style={styles.routePoint}>
                <View style={styles.dotRed} />
                <Text style={styles.routeText} numberOfLines={1}>{item.dropoff}</Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.date}>{item.date}</Text>
              {item.rating && <Text style={styles.rating}>{'⭐'.repeat(item.rating)}</Text>}
              <Text style={styles.earning}>{formatPrice(item.earning)}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: Spacing.md, gap: Spacing.sm },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.text },
  customer: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  route: { gap: 4, backgroundColor: Colors.surfaceAlt, borderRadius: BorderRadius.sm, padding: Spacing.sm },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  dotRed: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  routeText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: Spacing.xs, borderTopWidth: 1, borderTopColor: Colors.border },
  date: { fontSize: FontSize.xs, color: Colors.textSecondary },
  rating: { fontSize: 12 },
  earning: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.success },
});
