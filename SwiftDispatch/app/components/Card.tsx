import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadow } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'flat' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  style,
  variant = 'elevated',
  padding = 'md',
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        padding !== 'none' && styles[`padding_${padding}`],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  default: {},
  elevated: { ...Shadow.md },
  flat: { backgroundColor: Colors.surfaceAlt },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  padding_sm: { padding: Spacing.sm },
  padding_md: { padding: Spacing.md },
  padding_lg: { padding: Spacing.lg },
});
