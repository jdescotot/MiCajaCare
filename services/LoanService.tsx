/* eslint-disable prettier/prettier */
// loanService.ts

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Alert}  from 'react-native';

export const requestLoan = async (
  loanAmount: number,
  setLoanModalVisible: (visible: boolean) => void,
  savingsBoxId: string,
  loanReason: string,
  loanDuration: number,
  loanDetail: string,
  totalInvestmentToAdd: number,
) => {
  console.log(`Enviando solicitud de préstamo para ${loanAmount}...`);

  if (loanAmount > totalInvestmentToAdd) {
    Alert.alert(
      'Error de validación',
      'El monto solicitado es mayor al dinero en caja',
      [
        { text: 'OK', onPress: () => setLoanModalVisible(false) }
      ],
      { cancelable: false }
    );
    return;
  }

  const user = auth().currentUser;
  if (user) {
    const userId = user.uid;

    const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
    if (userDetailsDoc.exists) {
      const userName = userDetailsDoc.data().name;
      const cuotas = loanAmount / loanDuration;
      await firestore().collection('loanRequests').add({
        userId,
        name: userName,
        loanAmount,
        loanReason,
        loanDuration,
        status: 'Pendiente',
        savingsBoxId,
        loanDetail,
        cuotas,
      });
      console.log('Solicitud de préstamo enviada con éxito.');
    } else {
      console.log('Detalles del usuario no encontrados.');
    }
  }

  setLoanModalVisible(false);
};
