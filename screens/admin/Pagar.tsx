/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addPaymentToTotalInvestment } from '../../services/PaymentService';

const Pagar = () => {
  const [amount, setAmount] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log('Amount to pay:', amount);
    addPaymentToTotalInvestment(amount);
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Eingrese el monto a pagar"
      />
      <Button
        title="Submit Payment"
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginBottom: 20,
  },
});

export default Pagar;
