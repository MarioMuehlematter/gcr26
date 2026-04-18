import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { getSpatialMaps } from '../services/mapService';
import { storage, STORAGE_KEYS } from '../services/storage';
import { SpatialMapMetadata } from '@gcr26/shared';

interface Props {
  visible: boolean;
  onSelect: (mapId: string) => void;
  onClose: () => void;
}

export default function MapSelectionModal({ visible, onSelect, onClose }: Props) {
  const [maps, setMaps] = useState<SpatialMapMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const lastMapId = storage.getString(STORAGE_KEYS.LAST_MAP_ID);

  useEffect(() => {
    if (visible) {
      loadMaps();
    }
  }, [visible]);

  async function loadMaps() {
    setLoading(true);
    try {
      const allMaps = await getSpatialMaps();
      // Sort: last used first, then by date
      const sorted = allMaps.sort((a, b) => {
        if (a.id === lastMapId) return -1;
        if (b.id === lastMapId) return 1;
        return b.createdAt - a.createdAt;
      });
      setMaps(sorted);
    } catch (error) {
      console.error('Failed to load maps:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: SpatialMapMetadata }) => (
    <TouchableOpacity
      style={[
        styles.mapItem,
        item.id === lastMapId && styles.lastMapItem
      ]}
      onPress={() => onSelect(item.id)}
    >
      <View>
        <Text style={styles.mapName}>{item.name}</Text>
        <Text style={styles.mapMeta}>
          {new Date(item.createdAt).toLocaleDateString()} • {item.clueCount || 0} clues
        </Text>
      </View>
      {item.id === lastMapId && (
        <View style={styles.lastBadge}>
          <Text style={styles.lastBadgeText}>RECENT</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Site</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#111" />
          </View>
        ) : (
          <FlatList
            data={maps}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>No spatial maps found.</Text>
                <Text style={styles.emptySub}>Record a site first.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  mapItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lastMapItem: {
    borderColor: '#27ae60',
    borderWidth: 1,
  },
  mapName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  mapMeta: {
    fontSize: 12,
    color: '#888',
  },
  lastBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lastBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#888',
  },
});
