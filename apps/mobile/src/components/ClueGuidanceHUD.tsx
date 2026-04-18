import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

interface Props {
  active: boolean;
  angle: number | null;
}

/**
 * HUD component that renders screen-edge "Aura" gradients to guide the player
 * toward the next undiscovered clue (D-04).
 * 
 * The auras appear when the target is off-screen (> 20 degrees) and
 * get brighter as the player turns toward it.
 */
export default function ClueGuidanceHUD({ active, angle }: Props) {
  const leftOpacity = useRef(new Animated.Value(0)).current;
  const rightOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active || angle === null) {
      Animated.parallel([
        Animated.timing(leftOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(rightOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      return;
    }

    let leftTarget = 0;
    let rightTarget = 0;

    const absAngle = Math.abs(angle);
    
    // D-04: Show auras only when the target is off-center (> 20 degrees)
    if (absAngle >= 20) {
      // Animate aura opacity based on abs(angle): brighter as the player turns toward the target.
      // Max brightness (0.8) at 20 degrees, fading to 0.1 at 120+ degrees.
      const brightness = Math.max(0.1, 0.8 - (Math.min(120, absAngle) - 20) / 100 * 0.7);
      
      if (angle < 0) {
        leftTarget = brightness;
      } else {
        rightTarget = brightness;
      }
    }

    Animated.parallel([
      Animated.timing(leftOpacity, { toValue: leftTarget, duration: 150, useNativeDriver: true }),
      Animated.timing(rightOpacity, { toValue: rightTarget, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [active, angle, leftOpacity, rightOpacity]);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Left Edge Aura */}
      <Animated.View style={[styles.auraContainer, styles.auraLeft, { opacity: leftOpacity }]}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="gradLeft" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFD700" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradLeft)" />
        </Svg>
      </Animated.View>

      {/* Right Edge Aura */}
      <Animated.View style={[styles.auraContainer, styles.auraRight, { opacity: rightOpacity }]}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="gradRight" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0" stopColor="#FFD700" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#FFD700" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradRight)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 450, // Below WitcherSenseOverlay (500) but above AR scene
  },
  auraContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '20%',
  },
  auraLeft: {
    left: 0,
  },
  auraRight: {
    right: 0,
  },
});
