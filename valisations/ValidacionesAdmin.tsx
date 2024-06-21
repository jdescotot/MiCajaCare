/* eslint-disable prettier/prettier */
// validacionesAdmin.tsx
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const checkIfAdmin = async () => {
    try {
        const user = auth().currentUser;
        if (user) {
            const userId = user.uid;
            const querySnapshot = await firestore().collection('savingsBoxes').where('administrator', '==', userId).get();
            return !querySnapshot.empty;
        }
    } catch (error) {
        console.error(error);
    }
    return false;
};
