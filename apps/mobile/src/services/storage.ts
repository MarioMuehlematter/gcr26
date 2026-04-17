import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'gcr26-storage',
  encryptionKey: 'witcher-senses-secret', // Optional, per D-02 security
});

/**
 * Storage keys for spatial maps.
 */
export const STORAGE_KEYS = {
  MAPS_INDEX: 'spatial_maps_index',
  LAST_MAP_ID: 'last_used_map_id',
};
