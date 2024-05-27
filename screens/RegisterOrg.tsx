/* eslint-disable prettier/prettier */
// RegisterOrg.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import firestore from '@react-native-firebase/firestore';
import { RouteProp } from '@react-navigation/native';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'RegisterOrg'>;
    route: RouteProp<RootStackParamList, 'RegisterOrg'>;
};

const RegisterOrg = ({ navigation, route }: Props) => {
  const { userId } = route.params;
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [savingsBoxName, setSavingsBoxName] = useState('');
  const [actionPrice, setActionPrice] = useState(0);
  const [loanInterestRate, setLoanInterestRate] = useState(0);
  const [latePaymentInterestRate, setLatePaymentInterestRate] = useState(0);

  const handleInterestRateChange = (setRateFunction: Function, rate: string) => {
    const rateValue = parseFloat(rate);
    if (rateValue > 15) {
        Alert.alert('Interest rate cannot be over 15%');
      return;
    }
    setRateFunction(rateValue);
  };

  const handleLatePaymentFeeChange = (fee: string) => {
    const feeValue = parseFloat(fee);
    if (feeValue > 3) {
        Alert.alert('Late payment fee cannot be over 3%');
      return;
    }
    setLatePaymentInterestRate(feeValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva  caja de Ahorros</Text>
      <Text style={styles.sliderText}>Precio de Acción</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={500}
        step={1}
        value={actionPrice}
        onValueChange={setActionPrice}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <TextInput
        style={styles.input}
        value={actionPrice.toString()}
        onChangeText={(value) => setActionPrice(parseFloat(value))}
      />
      <Text style={styles.sliderText}>Tasa de interes prestamo</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={15}
        step={0.5}
        value={loanInterestRate}
        onValueChange={setLoanInterestRate}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <TextInput
        style={styles.input}
        // placeholder="Tasa de interes prestamo"
        // placeholderTextColor="#A69E9E"
        value={loanInterestRate.toString()}
        onChangeText={(value) => handleInterestRateChange(setLoanInterestRate, value)}
      />
      <Text style={styles.sliderText}>Tasa de interes por pago tardio</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={3} // Set your maximum value here
        step={0.5} // Set your step value here
        value={latePaymentInterestRate}
        onValueChange={setLatePaymentInterestRate}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <TextInput
        style={styles.input}
        placeholder="Tasa de interes por pago tardio"
        placeholderTextColor="#A69E9E"
        value={latePaymentInterestRate.toString()}
        onChangeText={(value) => handleLatePaymentFeeChange(value)}
      />
      <View style={styles.spacer} />
      <Button
        title="Crear caja de ahorros"
        onPress={() => {
          if (savingsBoxId) {
            // Associate the user with the existing savingsBox
            firestore()
              .collection('savingsBoxes')
              .doc(savingsBoxId)
              .update({
                members: firestore.FieldValue.arrayUnion(userId),
                sharePrice: actionPrice,
                loanInterestRate: loanInterestRate,
                latePaymentInterestRate: latePaymentInterestRate,
              })
              .then(() => console.log('User added to the existing savings box'))
              .catch((error) => console.log('Error adding user to the existing savings box:', error));
          } else {
            // Create a new savingsBox and set the user as the administrator
            firestore()
              .collection('savingsBoxes')
              .add({
                name: savingsBoxName,
                administrator: userId,
                members: [userId],
                actionPrice,
                loanInterestRate,
                latePaymentInterestRate,
                // other savings box properties...
                // add initial values for the savings box
                sharesBoughtThisWeek: 0,
                amountTaken: 0.00,
                amountOwed: 0.00,
                pendingPayments: 0.00,
                nextPaymentDate: null, // or set a default date if needed
                totalInvestment: 0.00,
                totalPoolInvestment: 0.00,
                pendingRequests: 0,
              })
              .then(() => console.log('New savings box created'))
              .catch((error) => console.log('Error creating new savings box:', error));
          }
          navigation.navigate('Dashboard');
        }}
      />
    </View>
  );
};

export default RegisterOrg;
