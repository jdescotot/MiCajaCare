/* eslint-disable prettier/prettier */
// screens/AddMoneyToSavingsBox.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { getSavingsBox, updateSavingsBox } from '../../services/SavingsBoxService';
import styles from '../../styles/PanelStyle'; // Assuming you want to reuse the styles from RegisterOrg

const AddMoneyToSavingsBox = () => {
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [amountToAdd, setAmountToAdd] = useState('');

  const handleAddMoney = async () => {
    if (!savingsBoxId || !amountToAdd) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Invalid amount.');
      return;
    }

    try {
      const savingsBoxDoc = await getSavingsBox(savingsBoxId);
      const savingsBoxData = savingsBoxDoc.data();

      if (!savingsBoxData) {
        Alert.alert('Error', 'Savings box not found.');
        return;
      }

      const updatedTotalInvestmentToAdd = (savingsBoxData.totalInvestmentToAdd || 0) + amount;
      await updateSavingsBox(savingsBoxId, { totalInvestmentToAdd: updatedTotalInvestmentToAdd });
      Alert.alert('Success', 'Amount added successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding money.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Money to Savings Box</Text>
      <TextInput
        style={styles.input}
        placeholder="Savings Box ID"
        value={savingsBoxId}
        onChangeText={setSavingsBoxId}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount to Add"
        keyboardType="numeric"
        value={amountToAdd}
        onChangeText={setAmountToAdd}
      />
      <Button title="Add Money" onPress={handleAddMoney} />
    </View>
  );
};

export default AddMoneyToSavingsBox;
