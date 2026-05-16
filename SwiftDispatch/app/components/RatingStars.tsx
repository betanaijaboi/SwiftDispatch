import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 24,
  onRate,
  readonly = false,
}: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => !readonly && onRate?.(i + 1)}
            disabled={readonly}
            style={styles.star}
          >
            <View
              style={[
                styles.starShape,
                { width: size, height: size, borderRadius: size / 2 },
                filled ? styles.filled : half ? styles.half : styles.empty,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Simple star using text emoji for cross-platform compatibility
export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  onRate,
  readonly = false,
}: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => !readonly && onRate?.(i + 1)}
          disabled={readonly}
        >
          <View style={{ paddingHorizontal: 2 }}>
            {/* Unicode star */}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { marginHorizontal: 2 },
  starShape: {},
  filled: { backgroundColor: Colors.accent },
  half: { backgroundColor: Colors.accent, opacity: 0.5 },
  empty: { backgroundColor: Colors.border },
});
