/* eslint-disable prettier/prettier */
// petitionService.ts

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const sendPetition = async (
  numShares: number,
  setModalVisible: (visible: boolean) => void,
  savingsBoxId: string
) => {
  console.log(`Enviando petición para solicitar ${numShares} acciones...`);

  const user = auth().currentUser;
  if (user) {
    const userId = user.uid;
    const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
    if (userDetailsDoc.exists) {
      const userName = userDetailsDoc.data().name;
      await firestore().collection('stockRequests').add({
        userId,
        userName,
        numShares,
        status: 'Pendiente',
        savingsBoxId,
      });
      console.log('Petición enviada con éxito.');
    } else {
      console.log('No se encontró el nombre de usuario en los detalles del usuario.');
    }
  }

  setModalVisible(false);
};

  export const requestLoan = async (loanAmount: number, setLoanModalVisible: (visible: boolean) => void) => {
    console.log(`Enviando solicitud de prestamo para ${loanAmount}...`);

    const user = auth().currentUser;
    if (user) {
        const userId = user.uid;
        const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
        if (userDetailsDoc.exists) {
            const userName = userDetailsDoc.data().name;
            await firestore().collection('loanRequests').add({
                userId,
                userName,
                loanAmount,
                status: 'Pendiente',
            });
        } else {
            console.log('No se encontro el nombre de usuario en los detalles del usuario.');
        }
    }

    setLoanModalVisible(false);
};

export const requestJoinSavingsBox = async (
  userId: string,
  savingsBoxId: string,
  name: string,
  setModalVisible: (visible: boolean) => void
) => {
  console.log(`Enviando solicitud para unirse a la caja de ahorros ${savingsBoxId}...`);

  await firestore().collection('savingsBoxJoinRequests').add({
    userId,
    userName: name,
    savingsBoxId,
    status: 'Pendiente',
  });

  console.log('Solicitud enviada con éxito.');
  setModalVisible(false);
};
