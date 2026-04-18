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
  ViroBox,
  ViroMaterials,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from '@reactvision/react-viro';
import { useRecorderSession } from '../hooks/useRecorderSession';
import { useCluePlacement } from '../hooks/useCluePlacement';
import LockingProgressRing from '../components/LockingProgressRing';
import { ClueTray } from '../components/ClueTray';
import { ClueBillboard } from '../components/ClueBillboard';
import { ARPlaneVisualization } from '../components/ARPlaneVisualization';
import MapSelectionModal from '../components/MapSelectionModal';
import * as mapService from '../services/mapService';

// Register a default tracking target
ViroARTrackingTargets.createTargets({
  'default_marker': {
    source: require('../../assets/icon.png'),
    orientation: 'Up',
    physicalWidth: 0.1, // 10cm
  },
});

ViroMaterials.createMaterials({
  originMaterial: {
    diffuseColor: '#3498db',
  },
  lockedMaterial: {
    diffuseColor: '#2ecc71',
  },
});

/**
 * AR Scene for Clue Placement.
 */
const PlacementScene = (props: any) => {
  const { 
    onTrackingUpdated, 
    onImageMarkerFound, 
    locked,
    placedClues,
  } = props.arSceneNavigator.viroAppProps;

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      {/* Physical Landmark Origin */}
      <ViroARImageMarker 
        target="default_marker"
        onAnchorFound={onImageMarkerFound}
      >
        <ViroBox
          position={[0, 0, 0]}
          scale={[0.1, 0.01, 0.1]}
          materials={[locked ? 'lockedMaterial' : 'originMaterial']}
        />
        
        {/* Placed Clues relative to marker */}
        {locked && placedClues.map((clue: any) => (
          <ClueBillboard key={clue.id} clue={clue} />
        ))}
      </ViroARImageMarker>

      {/* Surface Detection Visualization */}
      <ARPlaneVisualization alignment="Horizontal" />
    </ViroARScene>
  );
};

export default function PlacementScreen({ navigation, route }: any) {
  const { mapId: initialMapId } = route.params || {};
  const [mapId, setMapId] = useState(initialMapId);
  const [initializing, setInitializing] = useState(true);
  const [trackingStatus, setTrackingStatus] = useState('UNAVAILABLE');
  const [showMapModal, setShowMapModal] = useState(false);
  
  const {
    locking,
    locked,
    onImageMarkerFound,
    completeLock,
    reset
  } = useRecorderSession();

  const {
    placedClues,
    selectedClueType,
    setSelectedClueType,
    loadClues,
    addClue,
    updateClueRotation,
  } = useCluePlacement();

  // Load existing clues when map changes
  useEffect(() => {
    if (mapId) {
      loadClues(mapId);
    }
  }, [mapId, loadClues]);

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

  const handleSaveAll = async () => {
    if (!mapId) return;
    try {
      setInitializing(true);
      for (const clue of placedClues) {
        await mapService.syncClueToCloud(mapId, clue);
      }
      Alert.alert("Success", "All clues synced to cloud.");
    } catch (error) {
      console.error('Failed to sync clues:', error);
      Alert.alert("Error", "Failed to sync clues to Firestore.");
    } finally {
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading Placement Tool...</Text>
      </View>
    );
  }

  return (
    <View style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: PlacementScene as any,
        }}
        viroAppProps={{ 
          onTrackingUpdated: handleTrackingUpdated,
          onImageMarkerFound,
          locked,
          placedClues,
          selectedClueType,
          addClue,
          updateClueRotation
        }}
        style={styles.f1}
      />
      
      {/* HUD: Mode and Status */}
      <View style={styles.hudContainer}>
        <View style={styles.hud}>
          <Text style={styles.hudLabel}>Map ID:</Text>
          <Text style={styles.hudStatus}>{mapId ? mapId.substring(0, 8) : 'None'}</Text>
        </View>
        <View style={[styles.hud, { marginTop: 8 }]}>
          <Text style={styles.hudLabel}>Landmark:</Text>
          <Text style={[
            styles.hudStatus,
            locked ? styles.statusGreen : styles.statusYellow
          ]}>
            {locked ? 'LOCKED' : 'SCANNING'}
          </Text>
        </View>
      </View>

      {/* Asset Tray (Bottom) */}
      {locked && (
        <ClueTray 
          selectedType={selectedClueType}
          onSelectType={setSelectedClueType}
        />
      )}

      {/* Action Buttons (Top) */}
      <View style={styles.topButtonContainer}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[styles.actionButton, { marginRight: 8 }]}
            onPress={() => setShowMapModal(true)}
          >
            <Text style={styles.buttonText}>Change Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSaveAll}
          >
            <Text style={styles.buttonText}>Save All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Locking Progress */}
      <LockingProgressRing 
        visible={locking} 
        onComplete={completeLock} 
      />

      {/* Map Selection Modal */}
      <MapSelectionModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelect={(id) => {
          setMapId(id);
          setShowMapModal(false);
          reset(); // Reset landmark lock when switching maps
        }}
      />
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
  hudContainer: {
    position: 'absolute',
    top: 100,
    right: 20,
    alignItems: 'flex-end',
  },
  hud: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hudLabel: {
    color: '#aaa',
    fontSize: 10,
    marginRight: 6,
    fontWeight: '600',
  },
  hudStatus: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusGreen: {
    color: '#4ADE80',
  },
  statusYellow: {
    color: '#FACC15',
  },
  topButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.6)',
    borderColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
