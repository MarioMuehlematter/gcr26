import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RecorderScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Scanning mode active</Text>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
  },
});
