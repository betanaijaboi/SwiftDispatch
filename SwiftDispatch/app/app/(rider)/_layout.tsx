import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadow } from '@/constants/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconName;
  focused: boolean;
}

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? Colors.primary : 'rgba(255,255,255,0.45)'}
      />
    </View>
  );
}

export default function RiderLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 62 + (Platform.OS === 'android' ? 0 : insets.bottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { height: tabBarHeight }],
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'map' : 'map-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'wallet' : 'wallet-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person-circle' : 'person-circle-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="active-order" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.secondary,
    borderTopWidth: 0,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'android' ? 8 : 0,
    ...Shadow.lg,
  },
  tabItem: {
    paddingTop: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: Platform.OS === 'android' ? 4 : 0,
  },
  iconWrap: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: 'rgba(245,147,50,0.15)',
  },
});
