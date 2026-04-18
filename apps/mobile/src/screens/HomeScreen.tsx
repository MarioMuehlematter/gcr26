import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Platform, Linking } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { auth, db } from '../firebase';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import GameScreen from './GameScreen';
import MapSelectionModal from '../components/MapSelectionModal';

const ADMIN_URL = 'https://gcr26-dev.netlify.app';

export default function HomeScreen({ navigation }: any) {
  const { profile, loading } = useUser();
  const { user } = useAuth();
  const [mapModalVisible, setMapModalVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await updateDoc(doc(db, 'users', user.uid), { pushToken: token });
    })();
  }, [user?.uid]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (profile?.teamId) {
    return <GameScreen teamId={profile.teamId} />;
  }

  if (profile?.isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>GCR</Text>
        <Text style={styles.heading}>Hey, Admin!</Text>
        <Text style={styles.message}>Manage the game or map new locations.</Text>
        
        <TouchableOpacity 
          style={styles.recordButton} 
          onPress={() => navigation.navigate('Recorder')}
        >
          <Text style={styles.adminButtonText}>Record New Site →</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.recordButton, { backgroundColor: '#3498db' }]} 
          onPress={() => setMapModalVisible(true)}
        >
          <Text style={styles.adminButtonText}>Place Clues →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.adminButton} onPress={() => Linking.openURL(ADMIN_URL)}>
          <Text style={styles.adminButtonText}>Open Admin Panel →</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <MapSelectionModal
          visible={mapModalVisible}
          onClose={() => setMapModalVisible(false)}
          onSelect={(mapId) => {
            setMapModalVisible(false);
            navigation.navigate('Placement', { mapId });
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GCR</Text>
      <Text style={styles.heading}>You're all set!</Text>
      <Text style={styles.message}>
        Your admins will assign you to a team soon.
      </Text>
      <TouchableOpacity
        style={styles.arButton}
        onPress={() => navigation.navigate('AR')}
      >
        <Text style={styles.arButtonText}>Start Investigation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 64,
  },
  adminButton: {
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  recordButton: {
    backgroundColor: '#27ae60', // Green for "recording/active" action
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  arButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 48,
  },
  arButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  signOutButton: {
    padding: 12,
  },
  signOutText: {
    color: '#aaa',
    fontSize: 14,
  },
});
