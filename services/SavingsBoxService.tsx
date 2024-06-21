/* eslint-disable prettier/prettier */
// savingsBoxService.ts
import firestore from '@react-native-firebase/firestore';

export const getSavingsBox = (savingsBoxId: string) => {
  return firestore()
    .collection('savingsBoxes')
    .doc(savingsBoxId)
    .get();
};

export const updateSavingsBox = (savingsBoxId: string, data: any) => {
  return firestore()
    .collection('savingsBoxes')
    .doc(savingsBoxId)
    .update(data);
};

export const createSavingsBox = (savingsBoxId: string, data: any) => {
  return firestore()
    .collection('savingsBoxes')
    .doc(savingsBoxId)
    .set(data);
};
