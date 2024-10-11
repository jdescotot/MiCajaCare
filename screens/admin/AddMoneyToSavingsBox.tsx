/* eslint-disable prettier/prettier */
// screens/AddMoneyToSavingsBox.tsx

import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { updateSavingsBox } from '../../services/SavingsBoxService';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import styles from '../../styles/PanelStyle';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const AddMoneyToSavingsBox = () => {
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [amountToAdd, setAmountToAdd] = useState('');
  const [eventExplanation, setEventExplanation] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: 'Ganancias por Eventos' });
  }, [navigation]);

  const getCurrentUserSavingsBoxId = async () => {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('No se ha conectado a su cuenta, no puede hacer peticiones');
    }

    const userId = user.uid;
    const userDoc = await firestore().collection('userDetails').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.savingsBoxId) {
      throw new Error('Documento de usuario o caja de ahorro no válido o faltante');
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
        Alert.alert('Error', 'No se encontró el ID de la caja de ahorros.');
      }
    };

    fetchSavingsBoxId();
  }, []);

  const handleAddMoney = async () => {
    if (!amountToAdd || !eventExplanation) {
      Alert.alert('Error', 'Favor complete todos los campos.');
      return;
    }

    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Monto no válido.');
      return;
    }

    try {
      const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
      const savingsBoxData = savingsBoxDoc.data();

      if (!savingsBoxData) {
        Alert.alert('Error', 'No se encontró grupo de ahorro.');
        return;
      }

      const updatedTotalInvestmentToAdd = (savingsBoxData.totalInvestmentToAdd || 0) + amount;
      const updatedGananciaDeCaja = (savingsBoxData.gananciaDeCaja || 0) + amount;
      await updateSavingsBox(savingsBoxId, {
        totalInvestmentToAdd: updatedTotalInvestmentToAdd,
        gananciaDeCaja: updatedGananciaDeCaja,
      });

      await firestore().collection('loanRequests').add({
        savingsBoxId: savingsBoxId,
        amount: amount,
        eventExplanation: eventExplanation,
        status: 'Aceptado',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // Modificación aquí: Navegar a la pantalla principal después de una solicitud exitosa
      Alert.alert('Éxito', 'El dinero se agregó exitosamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Un error ocurrió al agregar el dinero.');
    }
  };

  return (
    <LinearGradient colors={['#f0f0f0', '#d9d9d9']} style={styles.gradientContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Ganancias por Eventos</Text>
        <TextInput
          style={styles.input}
          placeholder="Cantidad a agregar"
          keyboardType="numeric"
          value={amountToAdd}
          onChangeText={setAmountToAdd}
        />
        <TextInput
          style={styles.input}
          placeholder="Explicación del evento"
          value={eventExplanation}
          onChangeText={setEventExplanation}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddMoney}>
          <Text style={styles.buttonText}>Agregar ganancia monetaria</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AddMoneyToSavingsBox;
