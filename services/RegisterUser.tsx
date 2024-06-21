/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const registerUser = (email: string, password: string,  name: string, isNewBox: boolean, savingsBoxName: string, savingsBoxId: string, navigation: any) => {
    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      userCredential.user.updateProfile({
        displayName: name,
      });
      const userId = userCredential.user.uid;

      if (isNewBox) {
        firestore()
          .collection('savingsBoxes')
          .doc(savingsBoxName)
          .set({
            name: savingsBoxName,
            administrator: userId,
            members: [userId],
          })
          .then((docRef) => {
            console.log('New savings box created');
            firestore()
              .collection('userDetails')
              .doc(userId)
              .set({
                amountOwed: 0,
                amountTaken: 0,
                nextPaymentDate: null,
                pendingPayments: 0,
                sharesBoughtThisWeek: 0,
                totalInvestment: 0,
              })
              .catch((error) => {
                console.log('Error creating user details:', error);
              });
            firestore()
              .collection('users')
              .doc(userId)
              .set({
                savingsBoxId: docRef.id,
              })
              .then(() => {
                navigation.navigate('RegisterOrg', { userId });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log('Error creating new savings box:', error);
          });
      } else {
        firestore()
        .collection('savingsBoxes')
        .doc(savingsBoxId) // Use the savings box ID to get the document
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc && doc.exists) {
                console.log(`Savings Box ID: ${doc.id}, Name: ${doc.data().name}`);
            }

            firestore()
              .collection('savingsBoxes')
              .doc(savingsBoxId)
              .update({
                members: firestore.FieldValue.arrayUnion(userId),
              })
              .then(() => {
                console.log('usuario agregado a la caja de ahorro existente');
                firestore()
                  .collection('userDetails')
                  .doc(userId)
                  .set({
                    amountOwed: 0,
                    amountTaken: 0,
                    nextPaymentDate: null,
                    pendingPayments: 0,
                    sharesBoughtThisWeek: 0,
                    totalInvestment: 0,
                  })
                  .catch((error) => {
                    console.log('Error creating user details:', error);
                  });
                firestore()
                  .collection('users')
                  .doc(userId)
                  .set({
                    savingsBoxId,
                  })
                  .then(() => {
                    navigation.navigate('Dashboard');
                  })
                  .catch((error) => {
                    console.log('Error actualizando usuario con caja de ahorro:', error);
                  });
              })
              .catch((error) => {
                console.log('Error al agregar usario a caja de ahorro', error);
              });
          } else {
            console.log('No hay una caja de ahorro con ese nombre');
          }
        });
      }
      console.log('Usuario creado');
    })
    .catch((error) => {
      console.log(error);
    });
    navigation.navigate('RegisterOrg', { userId: 'yourUserId' });
};
