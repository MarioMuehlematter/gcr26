import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

export default function SiteNamingModal({ visible, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      setError('Please provide a name for the site.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSave(name.trim());
      // The parent will handle closing/navigation on success
    } catch (e: any) {
      setError(e.message || 'Failed to save site');
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Save Site Origin</Text>
          <TouchableOpacity onPress={onClose} hitSlop={16} disabled={loading}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Site Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. The Wine Cellar"
          value={name}
          onChangeText={setName}
          autoFocus
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSave}
          editable={!loading}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSave} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save to Cloud</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  cancel: {
    fontSize: 16,
    color: '#888',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
  },
  error: {
    color: '#e33',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
