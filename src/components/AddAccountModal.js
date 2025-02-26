import React from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';

export default function AddAccountModal({
  visible,
  onClose,
  onAdd,
  newAccountName,
  setNewAccountName,
  newAccountIssuer,
  setNewAccountIssuer,
  newSecretKey,
  setNewSecretKey,
  newAccountType,
  setNewAccountType,
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Account</Text>
          <Text style={styles.inputLabel}>Service Provider</Text>
          <TextInput
            style={styles.input}
            placeholder="Google, Microsoft, GitHub, etc."
            value={newAccountIssuer}
            onChangeText={setNewAccountIssuer}
          />
          <Text style={styles.inputLabel}>Account Name</Text>
          <TextInput
            style={styles.input}
            placeholder="username@example.com"
            value={newAccountName}
            onChangeText={setNewAccountName}
          />
          <Text style={styles.inputLabel}>Secret Key</Text>
          <TextInput
            style={styles.input}
            placeholder="JBSWY3DPEHPK3PXP"
            value={newSecretKey}
            onChangeText={setNewSecretKey}
          />
          <Text style={styles.inputLabel}>Authentication Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, newAccountType === 'totp' && styles.typeButtonSelected]}
              onPress={() => setNewAccountType('totp')}
            >
              <Text style={[styles.typeButtonText, newAccountType === 'totp' && styles.typeButtonTextSelected]}>
                Time Based (TOTP)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, newAccountType === 'hotp' && styles.typeButtonSelected]}
              onPress={() => setNewAccountType('hotp')}
            >
              <Text style={[styles.typeButtonText, newAccountType === 'hotp' && styles.typeButtonTextSelected]}>
                Counter Based (HOTP)
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton, 
                styles.addButtonModal, 
                !(newAccountName && newAccountIssuer && newSecretKey) && styles.addButtonDisabled
              ]}
              disabled={!(newAccountName && newAccountIssuer && newSecretKey)}
              onPress={onAdd}
            >
              <Text style={styles.addButtonText}>Add Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: colors.text.primary,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: colors.inputBg,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.text.secondary,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F3F5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontWeight: '600',
  },
  addButtonModal: {
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  addButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 