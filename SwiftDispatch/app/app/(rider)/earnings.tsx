import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { formatPrice } from '@/services/pricing';

const PERIODS = ['Today', 'This Week', 'This Month'];

const WEEKLY_DATA = [
  { day: 'Mon', amount: 3200, trips: 5 },
  { day: 'Tue', amount: 4800, trips: 7 },
  { day: 'Wed', amount: 2100, trips: 3 },
  { day: 'Thu', amount: 6500, trips: 10 },
  { day: 'Fri', amount: 5900, trips: 9 },
  { day: 'Sat', amount: 7200, trips: 11 },
  { day: 'Sun', amount: 4200, trips: 6 },
];

const TRANSACTIONS = [
  { id: 'T001', orderId: 'ORD-2041', time: '2:34 PM',   amount: 1850, type: 'earning'    },
  { id: 'T002', orderId: 'ORD-2038', time: '11:15 AM',  amount: 2400, type: 'earning'    },
  { id: 'T003', orderId: 'ORD-2035', time: '9:02 AM',   amount:  950, type: 'earning'    },
  { id: 'T004', orderId: 'Withdrawal', time: 'Yesterday', amount: 5000, type: 'withdrawal' },
  { id: 'T005', orderId: 'ORD-2029', time: 'Yesterday', amount: 3100, type: 'earning'    },
];

const maxAmount = Math.max(...WEEKLY_DATA.map(d => d.amount));

export default function EarningsScreen() {
  const [period, setPeriod] = useState(0);
  const totalWeek = WEEKLY_DATA.reduce((s, d) => s + d.amount, 0);
  const totalTrips = WEEKLY_DATA.reduce((s, d) => s + d.trips, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Earnings</Text>
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryMain}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={styles.summaryAmount}>{formatPrice(totalWeek)}</Text>
            <Text style={styles.summaryPeriod}>This week · {totalTrips} trips</Text>
          </View>
          <TouchableOpacity style={styles.withdrawBtn}>
            <Ionicons name="card-outline" size={16} color={Colors.white} />
            <Text style={styles.withdrawBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Period tabs */}
        <View style={styles.periods}>
          {PERIODS.map((p, i) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === i && styles.periodTabActive]}
              onPress={() => setPeriod(i)}
            >
              <Text style={[styles.periodText, period === i && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Earnings Breakdown</Text>
          <View style={styles.bars}>
            {WEEKLY_DATA.map((d) => (
              <View key={d.day} style={styles.barItem}>
                <Text style={styles.barAmount}>
                  {d.amount >= 1000 ? `${(d.amount / 1000).toFixed(1)}k` : d.amount}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${(d.amount / maxAmount) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.barDay}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Avg per trip', value: formatPrice(Math.round(totalWeek / totalTrips)) },
            { label: 'Online hours', value: '38h' },
            { label: 'Acceptance rate', value: '92%' },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.transactionList}>
          {TRANSACTIONS.map((t, i) => (
            <React.Fragment key={t.id}>
              <View style={styles.transactionRow}>
                <View style={[styles.transIcon, t.type === 'withdrawal' && styles.transIconWithdrawal]}>
                  <Ionicons
                    name={t.type === 'earning' ? 'cash-outline' : 'business-outline'}
                    size={20}
                    color={t.type === 'earning' ? Colors.success : Colors.error}
                  />
                </View>
                <View style={styles.transInfo}>
                  <Text style={styles.transOrder}>{t.orderId}</Text>
                  <Text style={styles.transTime}>{t.time}</Text>
                </View>
                <Text style={[styles.transAmount, t.type === 'withdrawal' && styles.transAmountNeg]}>
                  {t.type === 'earning' ? '+' : '-'}{formatPrice(t.amount)}
                </Text>
              </View>
              {i < TRANSACTIONS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
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
  summaryCard: {
    backgroundColor: Colors.secondary,
    margin: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  summaryMain: {},
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm },
  summaryAmount: {
    color: Colors.white,
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    marginTop: 4,
  },
  summaryPeriod: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.xs, marginTop: 4 },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  withdrawBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.sm },
  periods: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  periodTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceAlt,
  },
  periodTabActive: { backgroundColor: Colors.primary },
  periodText: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.textSecondary },
  periodTextActive: { color: Colors.white },
  chartCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  chartTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text, marginBottom: Spacing.md },
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: Spacing.xs },
  barItem: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barAmount: { fontSize: 9, color: Colors.textSecondary, marginBottom: 4 },
  barTrack: {
    flex: 1,
    width: '70%',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  barDay: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  transactionList: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadow.sm,
  },
  transactionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  transIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center',
  },
  transIconWithdrawal: { backgroundColor: '#FEE2E2' },
  transInfo: { flex: 1 },
  transOrder: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.text },
  transTime: { fontSize: FontSize.xs, color: Colors.textSecondary },
  transAmount: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.success },
  transAmountNeg: { color: Colors.error },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.xs },
});
