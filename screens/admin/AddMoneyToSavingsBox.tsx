/* eslint-disable prettier/prettier */
// screens/AddMoneyToSavingsBox.tsx
// Updated AddMoneyToSavingsBox.tsx to use the savings box ID retrieval method similar to LoansPanel.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { updateSavingsBox } from '../../services/SavingsBoxService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import styles from '../../styles/PanelStyle';

const AddMoneyToSavingsBox = () => {
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [amountToAdd, setAmountToAdd] = useState('');
  const [eventExplanation, setEventExplanation] = useState(''); // State for event explanation

  const getCurrentUserSavingsBoxId = async () => {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No se ha conectado a su cuenta no puede hacer peticiones');
    }

    const userId = user.uid;
    const userDoc = await firestore().collection('userDetails').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.savingsBoxId) {
      throw new Error('Documento de usuario o caja de ahorro no valido o faltante');
    }

    return userData.savingsBoxId;
  };

  useEffect(() => {
    const fetchSavingsBoxId = async () => {
      try {
        const id = await getCurrentUserSavingsBoxId();
        setSavingsBoxId(id);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se encontro el Id de la caja de ahorros.');
      }
    };

    fetchSavingsBoxId();
  }, []);

  const handleAddMoney = async () => {
    if (!amountToAdd || !eventExplanation) { // Check if eventExplanation is provided
      Alert.alert('Error', 'Favor complete todos los campos.');
      return;
    }

    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Monto no valido.');
      return;
    }

    try {
      const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
      const savingsBoxData = savingsBoxDoc.data();

      if (!savingsBoxData) {
        Alert.alert('Error', 'No se encontro grupo de ahorro.');
        return;
      }

      const updatedTotalInvestmentToAdd = (savingsBoxData.totalInvestmentToAdd || 0) + amount;
      await updateSavingsBox(savingsBoxId, { totalInvestmentToAdd: updatedTotalInvestmentToAdd });

      await firestore().collection('loanRequests').add({
        savingsBoxId: savingsBoxId,
        amount: amount,
        eventExplanation: eventExplanation,
        status: 'Aceptado',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Exito', 'El dinero se agrego exitosamente.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Un error ocurrio al agregar el dinero.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Money to Savings Box</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad a agregar"
        keyboardType="numeric"
        value={amountToAdd}
        onChangeText={setAmountToAdd}
      />
      <TextInput // Input for event explanation
        style={styles.input}
        placeholder="Explicación del evento"
        value={eventExplanation}
        onChangeText={setEventExplanation}
      />
      <Button title="Agregar ganancia monetaria" onPress={handleAddMoney} />
    </View>
  );
};

export default AddMoneyToSavingsBox;