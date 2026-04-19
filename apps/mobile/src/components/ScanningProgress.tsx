import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  progress: number; // 0 to 1
  visible: boolean;
}

const RING_SIZE = 140;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * HUD progress indicator for clue discovery.
 * Displays an animated SVG ring that fills as the player stays near a clue.
 */
export default function ScanningProgress({ progress, visible }: Props) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 300, // Smooth transition between progress updates
      useNativeDriver: true,
    }).start();
  }, [progress]);

  if (!visible) return null;

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        {/* Track */}
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
        />
        {/* Progress Ring */}
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="#FF4500" // High-visibility OrangeRed for Witcher Senses
          strokeWidth={STROKE_WIDTH}
          fill="transparent"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        <Text style={styles.label}>ANALYZING CLUE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%', // Centered vertically in the upper half to avoid overlap with Medallion
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // Glow effect
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    color: '#FF4500',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 4,
  },
});
