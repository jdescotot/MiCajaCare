/* eslint-disable prettier/prettier */
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBuvcYezuVJBnuFv34Qv0ipl5KCCnlXBHU',
  authDomain: 'cajaahorros-6b50f.firebaseapp.com',
  databaseURL: 'https://cajaahorros-6b50f.firebaseio.com',
  projectId: 'cajaahorros-6b50f',
  storageBucket: 'cajaahorros-6b50f.appspot.com',
  messagingSenderId: '526399056059',
  appId: '1:526399056059:android:1dc2cef01e5d70df49a19e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
