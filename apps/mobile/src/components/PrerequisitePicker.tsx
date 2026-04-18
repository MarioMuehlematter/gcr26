import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Clue } from '@gcr26/shared';

interface PrerequisitePickerProps {
  clues: Clue[];
  value: string | null;
  onChange: (id: string | null) => void;
}

/**
 * UI Component for selecting a prerequisite clue during placement.
 * Allows GMs to define narrative sequencing by making clues depend on others.
 */
export const PrerequisitePicker: React.FC<PrerequisitePickerProps> = ({ clues, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prerequisite Clue</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[styles.item, value === null && styles.selectedItem]}
          onPress={() => onChange(null)}
          activeOpacity={0.7}
        >
          <Text style={[styles.label, value === null && styles.selectedLabel]}>
            None
          </Text>
        </TouchableOpacity>

        {clues.map((clue) => {
          const isSelected = value === clue.id;
          return (
            <TouchableOpacity
              key={clue.id}
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => onChange(clue.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.label, isSelected && styles.selectedLabel]} numberOfLines={1}>
                {clue.type}
              </Text>
              <Text style={styles.subLabel} numberOfLines={1}>
                {clue.id.split('_').pop()?.substring(0, 6) || clue.id.substring(0, 6)}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedItem: {
    borderColor: '#3498db',
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
  },
  label: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  subLabel: {
    color: '#888',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  selectedLabel: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});
