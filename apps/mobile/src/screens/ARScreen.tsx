import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroBox,
  ViroMaterials,
} from '@reactvision/react-viro';
import { useARSession } from '../hooks/useARSession';
import { storage, STORAGE_KEYS } from '../services/storage';
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
const HUD = ({ status, relocalizationStatus }: { 
  status: string, 
  relocalizationStatus: string 
}) => (
  <View style={styles.hudContainer}>
    <View style={styles.hud}>
      <Text style={styles.hudLabel}>Tracking:</Text>
      <Text style={[
        styles.hudStatus,
        status === 'TRACKING' ? styles.statusGreen : styles.statusYellow
      ]}>
        {status}
      </Text>
    </View>
    
    {relocalizationStatus !== 'NONE' && (
      <View style={[styles.hud, { marginTop: 8 }]}>
        <Text style={styles.hudLabel}>Relocalize:</Text>
        <Text style={[
          styles.hudStatus,
          relocalizationStatus === 'SUCCESS' ? styles.statusGreen : 
          relocalizationStatus === 'FAILED' ? styles.statusRed : styles.statusYellow
        ]}>
          {relocalizationStatus}
        </Text>
      </View>
    )}
  </View>
);

export default function ARScreen({ navigation }: any) {
  const { 
    trackingStatus, 
    onTrackingUpdated,
    relocalizing,
    relocalizationStatus,
    saveCurrentMap,
    loadMapAndRelocalize
  } = useARSession();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Brief delay to ensure camera permissions and native modules are ready
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveMap = async () => {
    try {
      await saveCurrentMap(`Manual Save ${new Date().toLocaleTimeString()}`);
      Alert.alert('Success', 'Spatial map saved successfully!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save spatial map');
    }
  };

  const handleLoadLastMap = async () => {
    const lastId = storage.getString(STORAGE_KEYS.LAST_MAP_ID);
    if (!lastId) {
      Alert.alert('Info', 'No saved map found to load.');
      return;
    }
    await loadMapAndRelocalize(lastId);
  };

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
          scene: MainScene as any,
        }}
        viroAppProps={{ onTrackingUpdated }}
        style={styles.f1}
      />
      
      {/* Tracking Status HUD */}
      <HUD 
        status={trackingStatus} 
        relocalizationStatus={relocalizationStatus}
      />

      {/* Debug Serialization Controls (Wave 3) */}
      <View style={styles.debugControls}>
        <TouchableOpacity style={styles.debugButton} onPress={handleSaveMap}>
          <Text style={styles.debugButtonText}>Save Map</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.debugButton, relocalizing && styles.buttonDisabled]} 
          onPress={handleLoadLastMap}
          disabled={relocalizing}
        >
          <Text style={styles.debugButtonText}>
            {relocalizing ? 'Relocalizing...' : 'Load Last Map'}
          </Text>
        </TouchableOpacity>
      </View>

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
  hudContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'flex-end',
  },
  hud: {
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
  statusRed: {
    color: '#EF4444',
  },
  debugControls: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  debugButton: {
    flex: 0.48,
    padding: 15,
    backgroundColor: 'rgba(59, 130, 246, 0.7)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.5)',
  },
  debugButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
