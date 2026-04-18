import React, { useRef } from 'react';
import { StyleSheet, Animated, Pressable, Easing, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  onToggle: (active: boolean) => void;
}

/**
 * Medallion button that triggers Witcher Senses on hold.
 * Features a pulsing animation when active (D-03).
 */
export default function MedallionButton({ onToggle }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handlePressIn = () => {
    onToggle(true);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
    startPulse();
  };

  const handlePressOut = () => {
    onToggle(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
    stopPulse();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim }
            ],
          },
        ]}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Svg width="50" height="50" viewBox="0 0 24 24" fill="none">
            {/* Medallion wolf-head silhouette */}
            <Path
              d="M12 2L4.5 9L5 15L12 22L19 15L19.5 9L12 2Z"
              fill="#D32F2F"
              stroke="#B71C1C"
              strokeWidth="1.5"
            />
            {/* Red glowing eyes style */}
            <Circle cx="9" cy="11" r="1" fill="#FFEB3B" />
            <Circle cx="15" cy="11" r="1" fill="#FFEB3B" />
          </Svg>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  buttonWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(211, 47, 47, 0.5)',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  buttonPressed: {
    backgroundColor: '#333',
  },
});
