import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadow,
} from '@/constants/theme';
import { useOrderStore } from '@/store/useOrderStore';

const QUICK_TAGS = [
  '⚡ Super fast', '😊 Friendly', '📦 Careful with package',
  '📞 Communicative', '🛣️ Knew the route', '🧹 Clean vehicle',
];

export default function RateOrderScreen() {
  const { currentOrder, addToHistory, resetBooking } = useOrderStore();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    if (currentOrder) {
      addToHistory({ ...currentOrder, status: 'rated', rating, review });
    }
    setTimeout(() => {
      resetBooking();
      router.replace('/(customer)/home');
    }, 2500);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Thank you!</Text>
          <Text style={styles.successSub}>Your feedback helps us improve</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rate your experience</Text>
          <Text style={styles.subtitle}>How was your delivery?</Text>
        </View>

        {/* Rider card */}
        <View style={styles.riderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🧑</Text>
          </View>
          <View>
            <Text style={styles.riderName}>Chukwuemeka O.</Text>
            <Text style={styles.riderMeta}>🏍️ {currentOrder?.vehicleType ?? 'bike'} · {currentOrder?.id?.slice(-6).toUpperCase()}</Text>
          </View>
        </View>

        {/* Stars */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starBtn}
            >
              <Text style={[styles.star, star <= rating && styles.starFilled]}>
                {star <= rating ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.ratingLabel}>
          {rating === 0 ? 'Tap to rate' :
           rating === 1 ? '😞 Poor' :
           rating === 2 ? '😐 Fair' :
           rating === 3 ? '🙂 Good' :
           rating === 4 ? '😊 Great' : '🤩 Excellent!'}
        </Text>

        {/* Quick tags */}
        <Text style={styles.tagsTitle}>What went well?</Text>
        <View style={styles.tagsWrap}>
          {QUICK_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Review */}
        <Text style={styles.reviewLabel}>Write a review (optional)</Text>
        <TextInput
          style={styles.reviewInput}
          placeholder="Share more about your experience..."
          placeholderTextColor={Colors.textLight}
          value={review}
          onChangeText={setReview}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0}
        >
          <Text style={styles.submitText}>Submit Rating</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { resetBooking(); router.replace('/(customer)/home'); }}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  header: { alignItems: 'center', paddingTop: Spacing.xxl, paddingBottom: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 30 },
  riderName: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.text },
  riderMeta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  starBtn: { padding: Spacing.xs },
  star: { fontSize: 42, color: Colors.border },
  starFilled: { color: Colors.accent },
  ratingLabel: {
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xl,
    minHeight: 28,
  },
  tagsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  tagSelected: { borderColor: Colors.primary, backgroundColor: 'rgba(255,107,0,0.08)' },
  tagText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  tagTextSelected: { color: Colors.primary, fontWeight: FontWeight.semibold },
  reviewLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reviewInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 100,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: Spacing.xl,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  skipText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    paddingVertical: Spacing.sm,
  },
  successContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  successEmoji: { fontSize: 72 },
  successTitle: { fontSize: FontSize.xxxl, fontWeight: FontWeight.extrabold, color: Colors.text },
  successSub: { fontSize: FontSize.md, color: Colors.textSecondary },
});
