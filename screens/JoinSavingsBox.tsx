/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/auth';
import { requestJoinSavingsBox } from '../services/PetitionService';

const JoinSavingsBox = ({ navigation }) => {
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');

  const handleJoinSavingsBox = async () => {
    const userId = firebase().currentUser?.uid;
    if (userId) {
      try {
        await firestore()
          .collection('userDetails')
          .doc(userId)
          .update({
            savingsBoxId: savingsBoxId,
          });

          if (savingsBoxId) {
            const docRef = firestore().collection('savingsBoxes').doc(savingsBoxId);
            const doc = await docRef.get();
            if (doc.exists) {
              console.log(`Savings Box ID: ${doc.id}, Name: ${doc.data().name}`);
              await docRef.update({
                members: firestore.FieldValue.arrayUnion(userId),
              });
              console.log('User added to the existing savings box');
              await firestore().collection('userDetails').doc(userId).set({
                name: name,
                amountOwed: 0,
                amountTaken: 0,
                nextPaymentDate: null,
                pendingPayments: 0,
                sharesBoughtThisWeek: 0,
                totalInvestment: 0,
                savingsBoxId: savingsBoxId,
                isAdmin: false,
                isActive: false,
              });
              console.log('User details created/updated with savings box ID');
              // Proceed with any additional steps, like sending a join request
              await requestJoinSavingsBox(userId, savingsBoxId, name, setModalVisible);
              console.log('Request to join savings box created');
              navigation.navigate('Dashboard');
            } else {
              console.log('No hay una caja de Ahorro con ese nombre');
              Alert.alert('No hay una caja de Ahorro con ese nombre');
            }
          }

        Alert.alert('Éxito', 'Te has unido exitosamente a la caja de ahorros.');
        navigation.navigate('Dashboard');
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Hubo un error al unirte a la caja de ahorros.');
      }
    } else {
      Alert.alert('Error', 'Debes estar conectado para unirte a una caja de ahorros.');
    }
  };

  return (
    <View>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#A69E9E"
          value={name}
          onChangeText={setName}
        />
      <TextInput
        placeholder="Ingresa el ID de la Caja de Ahorros"
        value={savingsBoxId}
        onChangeText={setSavingsBoxId}
      />
      <Button
        title="Unirse a la Caja de Ahorros"
        onPress={handleJoinSavingsBox}
      />
    </View>
  );
};

export default JoinSavingsBox;
