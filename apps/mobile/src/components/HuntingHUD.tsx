import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScanningProgress from './ScanningProgress';

interface HuntingHUDProps {
  active: boolean;
  discoveryProgress?: number;
  isScanning?: boolean;
}

/**
 * HUD component shown when Witcher Senses are active.
 */
export const HuntingHUD = ({ active, discoveryProgress = 0, isScanning = false }: HuntingHUDProps) => {
  if (!active) return null;

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.text}>Witcher Senses Active</Text>
      </View>

      {/* Central Scanning Progress Ring */}
      <ScanningProgress 
        progress={discoveryProgress} 
        visible={isScanning && discoveryProgress > 0} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110, // Below the main HUD
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 20,
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
