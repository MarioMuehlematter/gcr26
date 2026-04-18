import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Clue } from '@gcr26/shared';
import { useRecorderSession } from '../hooks/useRecorderSession';
import { useCluePlacement } from '../hooks/useCluePlacement';
import LockingProgressRing from '../components/LockingProgressRing';
import { ClueTray } from '../components/ClueTray';
import { PrerequisitePicker } from '../components/PrerequisitePicker';
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
    selectedClueType,
    selectedPrerequisiteId,
    addClue,
    updateClueRotation,
    landmarkPos,
    setLandmarkPos
  } = props.arSceneNavigator.viroAppProps;

  const [ghostClue, setGhostClue] = useState<Clue | null>(null);
  const sceneRef = useRef<any>(null);

  // Interaction Logic: Relative Math (D-03)
  const handleSceneClick = useCallback((clickPos: [number, number, number]) => {
    if (!locked || !selectedClueType) return;
    
    // Calculate position relative to landmark
    const relPos: [number, number, number] = [
      clickPos[0] - landmarkPos[0],
      clickPos[1] - landmarkPos[1],
      clickPos[2] - landmarkPos[2],
    ];
    
    addClue(relPos, selectedPrerequisiteId);
  }, [locked, selectedClueType, selectedPrerequisiteId, landmarkPos, addClue]);

  // Snap-to-Plane Preview (Checker Issue 3)
  const onCameraTransformUpdate = useCallback(async (cameraTransform: any) => {
    // Only show ghost if we are locked and have a selection
    if (!locked || !selectedClueType || !sceneRef.current) {
      if (ghostClue) setGhostClue(null);
      return;
    }

    // Perform hit test with camera forward to find planes
    try {
      const results = await sceneRef.current.performARHitTestWithRay(cameraTransform.forward);
      
      if (results && results.length > 0) {
        const hit = results[0]; // Nearest surface
        const relPos: [number, number, number] = [
          hit.transform.position[0] - landmarkPos[0],
          hit.transform.position[1] - landmarkPos[1],
          hit.transform.position[2] - landmarkPos[2],
        ];
        
        setGhostClue({
          id: 'ghost',
          type: selectedClueType,
          position: relPos,
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          metadata: {}
        });
      } else {
        setGhostClue(null);
      }
    } catch (e) {
      // Hit test might fail if scene is not ready
      setGhostClue(null);
    }
  }, [locked, selectedClueType, landmarkPos, ghostClue]);

  return (
    <ViroARScene 
      ref={sceneRef}
      onTrackingUpdated={onTrackingUpdated}
      onClick={(pos: any) => handleSceneClick(pos)}
      onCameraTransformUpdate={onCameraTransformUpdate}
    >
      {/* Physical Landmark Origin */}
      <ViroARImageMarker 
        target="default_marker"
        onAnchorFound={(anchor: any) => {
          setLandmarkPos(anchor.position);
          onImageMarkerFound(anchor);
        }}
      >
        <ViroBox
          position={[0, 0, 0]}
          scale={[0.1, 0.01, 0.1]}
          materials={[locked ? 'lockedMaterial' : 'originMaterial']}
        />
        
        {/* Placed Clues relative to marker */}
        {locked && placedClues.map((clue: any) => (
          <ClueBillboard 
            key={clue.id} 
            clue={clue} 
            onRotate={(newRot) => updateClueRotation(clue.id, newRot)}
          />
        ))}

        {/* Ghost Preview with Highlight */}
        {ghostClue && (
          <ClueBillboard clue={ghostClue} highlighted={true} />
        )}
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
  const [landmarkPos, setLandmarkPos] = useState<[number, number, number]>([0, 0, 0]);
  
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
    selectedPrerequisiteId,
    setSelectedPrerequisiteId,
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
          selectedPrerequisiteId,
          addClue,
          updateClueRotation,
          landmarkPos,
          setLandmarkPos
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

      {/* Narrative & Asset Trays (Bottom) */}
      {locked && (
        <View style={styles.bottomTrays}>
          <PrerequisitePicker
            clues={placedClues}
            value={selectedPrerequisiteId}
            onChange={setSelectedPrerequisiteId}
          />
          <ClueTray 
            selectedType={selectedClueType}
            onSelectType={setSelectedClueType}
          />
        </View>
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
  bottomTrays: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
