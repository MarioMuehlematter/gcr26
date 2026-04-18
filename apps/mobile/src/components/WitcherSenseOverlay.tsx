import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

interface Props {
  active: boolean;
}

/**
 * Full-screen overlay providing the "Witcher Senses" visual effect.
 * Uses a semi-transparent desaturated filter and vignette (D-01).
 * Set to pointerEvents="none" to allow interaction with AR scene elements (D-03).
 */
export default function WitcherSenseOverlay({ active }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [active, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
      pointerEvents="none"
    >
      {/* Base desaturation filter - D-01: rgba(50, 50, 50, 0.4) */}
      <View style={styles.filter} />
      
      {/* Vignette effect simulation using overlapping views */}
      <View style={[styles.vignette, styles.vignetteTop]} />
      <View style={[styles.vignette, styles.vignetteBottom]} />
      <View style={[styles.vignette, styles.vignetteLeft]} />
      <View style={[styles.vignette, styles.vignetteRight]} />
      
      {/* Optional: Subtle scanning line or grain could go here */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 500, // Above AR scene, but below MedallionButton
  },
  filter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(50, 50, 50, 0.4)',
  },
  vignette: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  vignetteTop: {
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  vignetteBottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%',
  },
  vignetteLeft: {
    top: '20%',
    bottom: '20%',
    left: 0,
    width: '15%',
  },
  vignetteRight: {
    top: '20%',
    bottom: '20%',
    right: 0,
    width: '15%',
  },
});
