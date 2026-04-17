import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Modal,
} from 'react-native';

interface Props {
  visible: boolean;
}

/**
 * Overlay component to provide visual feedback during AR relocalization.
 * Displays instructions and a progress indicator for the alignment process.
 * Follows the SignUpModal.tsx pattern for overlays.
 */
export const RelocalizationOverlay: React.FC<Props> = ({ visible }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Start progress bar animation (15 seconds timeout matching useARSession.ts)
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: false, // width doesn't support native driver
      }).start();

      // Start pulsing icon animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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
    } else {
      progressAnim.stopAnimation();
      pulseAnim.stopAnimation();
    }
  }, [visible, progressAnim, pulseAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.pulseIcon} />
          </Animated.View>

          <Text style={styles.title}>Aligning with environment...</Text>
          <Text style={styles.instructions}>
            Move your device slowly around the room to help the engine recognize the surroundings.
          </Text>

          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 30,
  },
  pulseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  instructions: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
});

export default RelocalizationOverlay;
