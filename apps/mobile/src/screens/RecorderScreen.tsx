import React, { useState, useEffect, useCallback } from 'react';
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
  ViroARImageMarker,
  ViroARTrackingTargets,
} from '@reactvision/react-viro';
import { useRecorderSession } from '../hooks/useRecorderSession';
import LockingProgressRing from '../components/LockingProgressRing';
import SiteNamingModal from '../components/SiteNamingModal';
import * as mapService from '../services/mapService';

// Register a default tracking target for development/testing
// In a real scenario, this might be dynamically loaded from a database
ViroARTrackingTargets.createTargets({
  'default_marker': {
    source: require('../../assets/icon.png'),
    orientation: 'Up',
    physicalWidth: 0.1, // 10cm
  },
});

// Define materials for AR objects
ViroMaterials.createMaterials({
  originMaterial: {
    diffuseColor: '#3498db',
  },
  lockedMaterial: {
    diffuseColor: '#2ecc71',
  },
});

/**
 * The Recorder Scene.
 */
const RecorderScene = (props: any) => {
  const { 
    onTrackingUpdated, 
    onImageMarkerFound, 
    locked 
  } = props.arSceneNavigator.viroAppProps;

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      {/* 
          Image Marker that acts as the physical landmark.
          When detected, it triggers the locking process.
      */}
      <ViroARImageMarker 
        target="default_marker"
        onAnchorFound={onImageMarkerFound}
      >
        <ViroBox
          position={[0, 0, 0]}
          scale={[0.1, 0.01, 0.1]}
          materials={[locked ? 'lockedMaterial' : 'originMaterial']}
        />
        <ViroText
          text={locked ? "ORIGIN LOCKED" : "LOCKING..."}
          scale={[0.1, 0.1, 0.1]}
          position={[0, 0.05, 0]}
          style={styles.originTextStyle}
        />
      </ViroARImageMarker>

      {/* Visual aid if not locked yet */}
      {!locked && (
        <ViroText
          text="Find Landmark to Begin"
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -2]}
          style={styles.instructionText}
        />
      )}
    </ViroARScene>
  );
};

export default function RecorderScreen({ navigation }: any) {
  const [initializing, setInitializing] = useState(true);
  const [trackingStatus, setTrackingStatus] = useState('UNAVAILABLE');
  const [showNamingModal, setShowNamingModal] = useState(false);
  
  const {
    locking,
    locked,
    onImageMarkerFound,
    completeLock,
    reset
  } = useRecorderSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTrackingUpdated = useCallback((state: any, reason: any) => {
    const statusMap: any = {
      1: 'UNAVAILABLE',
      2: 'LOADING',
      3: 'TRACKING',
      4: 'LIMITED',
    };
    setTrackingStatus(statusMap[state] || 'UNKNOWN');
  }, []);

  const handleSave = async (siteName: string) => {
    try {
      // 1. Get current AR world map from Viro
      // For now, we use a placeholder as map export is mocked/simulated in local dev
      // In production, we would use scene.getCameraOrientationAsync() or similar if available
      // or viro's map export feature.
      const placeholderMapData = "bW9jay1zcGF0aWFsLW1hcC1kYXRh"; // "mock-spatial-map-data" in base64

      // 2. Save locally
      const metadata = await mapService.saveMap(siteName, placeholderMapData);

      // 3. Sync to Cloud
      await mapService.syncMapToCloud(metadata, 'default_marker');

      setShowNamingModal(false);
      
      Alert.alert(
        "Success",
        "Site origin saved successfully to cloud.",
        [{ text: "OK", onPress: () => navigation.navigate('Home') }]
      );
    } catch (error: any) {
      console.error('Save failed:', error);
      throw error; // Re-throw to show in modal
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Initializing Recorder...</Text>
      </View>
    );
  }

  return (
    <View style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: RecorderScene as any,
        }}
        viroAppProps={{ 
          onTrackingUpdated: handleTrackingUpdated,
          onImageMarkerFound,
          locked
        }}
        style={styles.f1}
      />
      
      {/* Locking Progress Overlay */}
      <LockingProgressRing 
        visible={locking} 
        onComplete={completeLock} 
      />

      {/* Site Naming Modal */}
      <SiteNamingModal
        visible={showNamingModal}
        onClose={() => setShowNamingModal(false)}
        onSave={handleSave}
      />

      {/* HUD */}
      <View style={styles.hudContainer}>
        <View style={styles.hud}>
          <Text style={styles.hudLabel}>Mode:</Text>
          <Text style={styles.hudStatus}>
            {locked ? 'Origin Set' : 'Scanning Landmark'}
          </Text>
        </View>
        <View style={[styles.hud, { marginTop: 8 }]}>
          <Text style={styles.hudLabel}>Status:</Text>
          <Text style={[
            styles.hudStatus,
            trackingStatus === 'TRACKING' ? styles.statusGreen : styles.statusYellow
          ]}>
            {trackingStatus}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>

        {!locked && (
          <View style={styles.actionButton}>
             <Text style={styles.buttonText}>Scan Landmark</Text>
          </View>
        )}

        {locked && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.resetButton]}
              onPress={reset}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={() => setShowNamingModal(true)}
            >
              <Text style={styles.buttonText}>Save Site</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    fontSize: 20,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  instructionText: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minWidth: 100,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'rgba(192, 57, 43, 0.6)',
  },
  saveButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.6)',
  },
  buttonText: {
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
});

