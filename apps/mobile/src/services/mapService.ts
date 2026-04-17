import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { storage, STORAGE_KEYS } from './storage';
import { SpatialMap, SpatialMapMetadata } from '@gcr26/shared';

const MAPS_DIRECTORY = `${FileSystem.documentDirectory}spatial_maps/`;

/**
 * Ensures the maps directory exists.
 */
async function ensureDirectoryExists(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(MAPS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(MAPS_DIRECTORY, { intermediates: true });
  }
}

/**
 * Saves a spatial map to the local file system and records its metadata in MMKV.
 * 
 * @param name - Display name for the map
 * @param data - Base64 encoded spatial map data
 * @returns Metadata of the saved map
 */
export async function saveMap(name: string, data: string): Promise<SpatialMapMetadata> {
  await ensureDirectoryExists();

  const id = `map_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const fileUri = `${MAPS_DIRECTORY}${id}.bin`;

  // Write binary data to file system
  await FileSystem.writeAsStringAsync(fileUri, data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fileInfo = await FileSystem.getInfoAsync(fileUri);
  if (!fileInfo.exists) {
    throw new Error(`Failed to verify written map file at ${fileUri}`);
  }

  const metadata: SpatialMapMetadata = {
    id,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: '1.0.0', // Initial versioning
    deviceModel: Platform.select({ ios: 'iOS Device', android: 'Android Device', default: 'Unknown' }),
    fileUri,
    byteSize: fileInfo.size,
  };

  // Store metadata in MMKV
  storage.set(`map_meta_${id}`, JSON.stringify(metadata));

  // Update index
  const currentIndexJson = storage.getString(STORAGE_KEYS.MAPS_INDEX);
  const index: string[] = currentIndexJson ? JSON.parse(currentIndexJson) : [];
  index.push(id);
  storage.set(STORAGE_KEYS.MAPS_INDEX, JSON.stringify(index));

  return metadata;
}

/**
 * Retrieves a spatial map and its metadata.
 * 
 * @param id - Unique map ID
 * @returns The spatial map or null if not found
 */
export async function getMap(id: string): Promise<SpatialMap | null> {
  const metaJson = storage.getString(`map_meta_${id}`);
  if (!metaJson) {
    return null;
  }

  const metadata: SpatialMapMetadata = JSON.parse(metaJson);

  // Mitigation for T-02-03 (Tampering/Inconsistency)
  const fileInfo = await FileSystem.getInfoAsync(metadata.fileUri);
  if (!fileInfo.exists) {
    console.warn(`Map file missing for ID ${id} at ${metadata.fileUri}`);
    return null;
  }

  try {
    const data = await FileSystem.readAsStringAsync(metadata.fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return {
      metadata,
      data,
    };
  } catch (error) {
    console.error(`Failed to read map file for ${id}:`, error);
    return null;
  }
}

/**
 * Lists all saved spatial map metadata.
 */
export function listMaps(): SpatialMapMetadata[] {
  const currentIndexJson = storage.getString(STORAGE_KEYS.MAPS_INDEX);
  if (!currentIndexJson) return [];

  try {
    const index: string[] = JSON.parse(currentIndexJson);
    return index
      .map(id => {
        const metaJson = storage.getString(`map_meta_${id}`);
        return metaJson ? JSON.parse(metaJson) : null;
      })
      .filter((m): m is SpatialMapMetadata => m !== null);
  } catch (e) {
    console.error('Failed to parse maps index:', e);
    return [];
  }
}
