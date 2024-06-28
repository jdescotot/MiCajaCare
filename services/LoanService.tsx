/* eslint-disable prettier/prettier */
// loanService.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const requestLoan = async (
  roundedTotalInterestAmount: number,
  setLoanModalVisible: (visible: boolean) => void,
  savingsBoxId: string,
  loanReason: string,
  loanDuration: number,
  loanDetail: string,
  originalLoan: number,
) => {
  console.log(`Enviando solicitud de préstamo de ${originalLoan}...`);
    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
      if (userDetailsDoc.exists) {
        const userName = userDetailsDoc.data().name;
        const cuotas = (originalLoan + roundedTotalInterestAmount) / loanDuration;

        await firestore().runTransaction(async (transaction) => {
          const savingsBoxRef = firestore().collection('savingsBoxes').doc(savingsBoxId);
          const savingsBoxDoc = await transaction.get(savingsBoxRef);

          if (!savingsBoxDoc.exists) {
            throw new Error("documento no existe!");
          }

          const currentTotalInvestmentToAdd = savingsBoxDoc.data().totalInvestmentToAdd || 0;
          const newTotalInvestmentToAdd = currentTotalInvestmentToAdd - originalLoan;
          if (newTotalInvestmentToAdd < 0 ) {
            Alert.alert('Solicitud requeire mas dinero del que hay disponible');
          }else if(userDetailsDoc.data().isActive === false){
            Alert.alert('Usuario inactivo');
          }else{
            await firestore().collection('loanRequests').add({
              userId,
              name: userName,
              originalLoan,
              loanReason,
              loanDuration,
              status: 'Pendiente',
              savingsBoxId,
              loanDetail,
              cuotas,
              requestType: 'Solicitud de préstamo',
              roundedTotalInterestAmount,
            });
            Alert.alert('Solicitud enviada con Exito');
          }
        });
      } else {
        console.log('Detalles del usuario no encontrados.');
      }
    }

    setLoanModalVisible(false);
};
