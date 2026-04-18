import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface DiscoveryNotificationProps {
  discoveredClueIds: string[];
}

const { width } = Dimensions.get('window');

/**
 * Notification component that slides down when a new clue is discovered.
 */
export const DiscoveryNotification = ({ discoveredClueIds }: DiscoveryNotificationProps) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const prevCount = useRef(discoveredClueIds.length);

  useEffect(() => {
    // Only trigger if the count increased
    if (discoveredClueIds.length > prevCount.current) {
      showNotification();
    }
    prevCount.current = discoveredClueIds.length;
  }, [discoveredClueIds.length]);

  const showNotification = () => {
    setVisible(true);
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 60, // Position from top
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  if (!visible && slideAnim.__getValue() === -100) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.notification}>
        <Text style={styles.icon}>🔍</Text>
        <View>
          <Text style={styles.title}>New Clue Discovered!</Text>
          <Text style={styles.subtitle}>Team progress updated</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  notification: {
    width: width * 0.9,
    backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#94a3b8', // slate-400
    fontSize: 12,
  },
});
