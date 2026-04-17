import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroBox,
  ViroMaterials,
} from '@reactvision/react-viro';
import { useARSession } from '../hooks/useARSession';
import { ARPlaneVisualization } from '../components/ARPlaneVisualization';

// Define materials for AR objects
ViroMaterials.createMaterials({
  originMaterial: {
    diffuseColor: '#FF0000',
  },
});

/**
 * The main AR Scene.
 * Renders the world origin marker and handles tracking updates.
 */
const MainScene = (props: any) => {
  const { onTrackingUpdated } = props.arSceneNavigator.viroAppProps;

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      {/* Stable World Origin Marker (D-02) */}
      <ViroBox
        position={[0, 0, 0]}
        scale={[0.1, 0.1, 0.1]}
        materials={['originMaterial']}
      />
      <ViroText
        text="ORIGIN"
        scale={[0.2, 0.2, 0.2]}
        position={[0, 0.1, 0]}
        style={styles.originTextStyle}
      />

      {/* Surface Detection Visualization (CORE-02, D-03, D-04) */}
      <ARPlaneVisualization alignment="Horizontal" />
      <ARPlaneVisualization alignment="Vertical" />
    </ViroARScene>
  );
};

/**
 * HUD component to display tracking status over the AR view.
 */
const HUD = ({ status }: { status: string }) => (
  <View style={styles.hud}>
    <Text style={styles.hudLabel}>Status:</Text>
    <Text style={[
      styles.hudStatus,
      status === 'TRACKING' ? styles.statusGreen : styles.statusYellow
    ]}>
      {status}
    </Text>
  </View>
);

export default function ARScreen({ navigation }: any) {
  const { trackingStatus, onTrackingUpdated } = useARSession();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Brief delay to ensure camera permissions and native modules are ready
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Initializing AR Engine...</Text>
      </View>
    );
  }

  return (
    <View style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: MainScene,
        }}
        viroAppProps={{ onTrackingUpdated }}
        style={styles.f1}
      />
      
      {/* Tracking Status HUD */}
      <HUD status={trackingStatus} />

      {/* Navigation Controls */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Exit Investigation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  originTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  hud: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hudLabel: {
    color: '#aaa',
    fontSize: 12,
    marginRight: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  hudStatus: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusGreen: {
    color: '#4ADE80',
  },
  statusYellow: {
    color: '#FACC15',
  },
});
