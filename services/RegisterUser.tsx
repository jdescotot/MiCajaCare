import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { requestJoinSavingsBox } from '../services/PetitionService';
import { NavigationProp } from '@react-navigation/native';

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  savingsBoxId: string,
  navigation: NavigationProp<any>,
  setModalVisible: (visible: boolean) => void
) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    const userId = userCredential.user.uid;

    if (savingsBoxId) {
      const doc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
      if (doc.exists) {
        console.log(`Savings Box ID: ${doc.id}, Name: ${doc.data().name}`);
        await firestore().collection('savingsBoxes').doc(savingsBoxId).update({
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
        await requestJoinSavingsBox(userId, savingsBoxId, name, setModalVisible);
        console.log('Request to join savings box created');
        navigation.navigate('Dashboard');
      } else {
        console.log('No hay una caja de Ahorro con ese nombre');
        Alert.alert('No hay una caja de Ahorro con ese nombre');
      }
    } else {
      console.log('No savingsBoxId provided');
    }
    console.log('Usuario creado');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Error', 'Este correo ya esta en uso.', [
        {
          text: "OK",
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } else {
      console.log(error);
    }
  }
};