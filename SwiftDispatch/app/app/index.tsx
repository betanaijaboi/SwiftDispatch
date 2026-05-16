import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        router.replace(user.role === 'rider' ? '/(rider)/home' : '/(customer)/home');
      } else {
        router.replace('/(auth)/splash');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
});
