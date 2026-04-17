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

// Define materials for AR objects
ViroMaterials.createMaterials({
  originMaterial: {
    diffuseColor: '#3498db',
  },
});

/**
 * The Recorder Scene.
 */
const RecorderScene = (props: any) => {
  const { onTrackingUpdated } = props.arSceneNavigator.viroAppProps;

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      <ViroBox
        position={[0, 0, 0]}
        scale={[0.1, 0.1, 0.1]}
        materials={['originMaterial']}
      />
      <ViroText
        text="SITE ORIGIN"
        scale={[0.2, 0.2, 0.2]}
        position={[0, 0.1, 0]}
        style={styles.originTextStyle}
      />
    </ViroARScene>
  );
};

export default function RecorderScreen({ navigation }: any) {
  const [initializing, setInitializing] = useState(true);
  const [trackingStatus, setTrackingStatus] = useState('UNAVAILABLE');

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onTrackingUpdated = (state: any, reason: any) => {
    const statusMap: any = {
      1: 'UNAVAILABLE',
      2: 'LOADING',
      3: 'TRACKING',
      4: 'LIMITED',
    };
    setTrackingStatus(statusMap[state] || 'UNKNOWN');
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
          onTrackingUpdated,
        }}
        style={styles.f1}
      />
      
      {/* HUD */}
      <View style={styles.hudContainer}>
        <View style={styles.hud}>
          <Text style={styles.hudLabel}>Mode:</Text>
          <Text style={styles.hudStatus}>Scanning Active</Text>
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

      {/* Navigation Controls */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Exit Recorder</Text>
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
});
