import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HuntingHUDProps {
  active: boolean;
}

/**
 * HUD component shown when Witcher Senses are active.
 */
export const HuntingHUD = ({ active }: HuntingHUDProps) => {
  if (!active) return null;

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.text}>Witcher Senses Active</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110, // Below the main HUD
    right: 20,
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.6)', // Subtle red background
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
