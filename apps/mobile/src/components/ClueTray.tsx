import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ClueType } from '@gcr26/shared';
// @ts-ignore - Importing from workspace package
import clueConfig from '../../../../packages/shared/src/clues.json';

interface ClueTrayProps {
  selectedType: ClueType | null;
  onSelectType: (type: ClueType) => void;
}

/**
 * Map asset filenames to require statements for React Native.
 * These must be statically analyzable.
 */
const CLUE_ASSETS: Record<string, any> = {
  'footprint.png': require('../../assets/clues/footprint.png'),
  'bloodstain.png': require('../../assets/clues/bloodstain.png'),
  'scuff.png': require('../../assets/clues/scuff.png'),
};

/**
 * UI Component for selecting a clue type to place.
 * Renders as a horizontal scrollable tray at the bottom of the screen.
 */
export const ClueTray: React.FC<ClueTrayProps> = ({ selectedType, onSelectType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Clue Type</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {clueConfig.types.map((type: any) => {
          const isSelected = selectedType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => onSelectType(type.id as ClueType)}
              activeOpacity={0.7}
            >
              <Image 
                source={CLUE_ASSETS[type.asset]} 
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedItem: {
    borderColor: '#00ff00',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  icon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  label: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
});
