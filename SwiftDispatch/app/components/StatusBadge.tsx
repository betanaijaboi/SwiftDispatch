import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { OrderStatus } from '@/types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending:    { label: 'Pending',     bg: '#FEF3C7', text: '#92400E', dot: Colors.warning },
  searching:  { label: 'Searching',  bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  accepted:   { label: 'Accepted',   bg: '#D1FAE5', text: '#065F46', dot: Colors.success },
  pickup:     { label: 'Picking Up', bg: '#EDE9FE', text: '#4C1D95', dot: '#8B5CF6' },
  in_transit: { label: 'In Transit', bg: '#FEE2E2', text: '#991B1B', dot: Colors.primary },
  delivered:  { label: 'Delivered',  bg: '#D1FAE5', text: '#065F46', dot: Colors.success },
  cancelled:  { label: 'Cancelled',  bg: '#F3F4F6', text: '#374151', dot: Colors.textLight },
  rated:      { label: 'Completed',  bg: '#D1FAE5', text: '#065F46', dot: Colors.success },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
