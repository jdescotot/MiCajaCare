/* eslint-disable prettier/prettier */
// RegisterOrg.tsx
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, Button, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import firestore from '@react-native-firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { getSavingsBox, updateSavingsBox, createSavingsBox } from '../services/SavingsBoxService';

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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [totalInvestmentToAdd, setTotalInvestmentToAdd] = useState(0);
  const [efectivoEnCaja, setEfectivoEnCaja] = useState(0);
  const [ TotalStocks, setTotalStocks] = useState(0);

  console.log('el id y nombre de caja ', setSavingsBoxId, setSavingsBoxName, setStartDate, endDate);

  useEffect(() => {
    const newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    setEndDate(newEndDate);
  }, [startDate]);

  useEffect(() => {
    firestore()
    .collection('userDetails')
      .doc(userId)
      .get()
      .then((doc) => {
        const user = doc.data();
        const savingsBoxId = user?.savingsBoxId;
  
        if (savingsBoxId) {
          firestore()
            .collection('savingsBoxes')
            .doc(savingsBoxId)
            .get()
            .then((doc) => {
              if (doc.exists) {
                const savingsBoxData = doc.data();
                setSavingsBoxName(savingsBoxData?.name);
              } else {
                console.log('No savings box found with the given ID');
              }
            })
            .catch((error) => {
              console.error('Error fetching savings box details:', error);
            });
        } else {
          console.log('No savings box ID found in user details');
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }, [userId]); // Dependency array to ensure this effect runs only when userId changes

  useEffect(() => {
    getSavingsBox(savingsBoxId)
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setSavingsBoxName(data?.name);
          console.log('Caja de ahorros encontrada:', savingsBoxName,data);
        }
      });
  }, []);

  const handleUpdateSavingsBox = () => {
    return new Promise((resolve, reject) => { // Step 1: Return a new Promise
      firestore()
        .collection('userDetails')
        .doc(userId)
        .get()
        .then((doc) => {
          const user = doc.data();
          const savingsBoxId = user?.savingsBoxId;

          if (savingsBoxId) {
            const savingsBoxRef = firestore().collection('savingsBoxes').doc(savingsBoxId);
            savingsBoxRef.get().then((docSnapshot) => {
              if (docSnapshot.exists) {
                savingsBoxRef.update({
                  actionPrice,
                  loanInterestRate,
                  latePaymentInterestRate,
                  startDate,
                  endDate,
                  totalInvestmentToAdd,
                  efectivoEnCaja,
                  TotalStocks,
                })
                .then(() => {
                  console.log('Caja de ahorros actualizada');
                  resolve();
                })
                .catch((error) => {
                  console.log('Error al actualizar caja de ahorros:', error);
                  reject(error);
                });
              } else {
                console.log('No se encontro caja de ahorros para este usuario');
                reject('No savings box found');
              }
            });
          } else {
            console.log('No se encontro el id de la caja de ahorrros para este usuario');
            reject('No savings box ID found');
          }
        })
        .catch((error) => {
          console.log('Error recuperando usuario:', error);
          reject(error);
        });
    });
  };

  const handleInterestRateChange = (setRateFunction: Function, rate: string) => {
    if (rate === '') {
      setRateFunction(0);
      return;
    }
    const rateValue = parseFloat(rate);
    if (rateValue > 15) {
      Alert.alert('Tasa de interes no puede superar el 15%');
      return;
    }
    setRateFunction(rateValue);
  };

  const handleLatePaymentFeeChange = (fee: string) => {
    if (fee === '') {
      setLatePaymentInterestRate(0);
      return;
    }
    const feeValue = parseFloat(fee);
    if (feeValue > 3) {
      Alert.alert('Tasa de pago tardio no puede ser mas de 3%');
      return;
    }
    setLatePaymentInterestRate(feeValue);
  };

  useEffect(() => {
    const newEndDate = new Date(startDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    setEndDate(newEndDate);
  }, [startDate]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Nueva  caja de Ahorros</Text>
        <View style={styles.registerContainer}>
          <Text style={styles.sliderText}>Precio de Acción</Text>
          <TextInput
            style={styles.input}
            value={actionPrice.toString()}
            onChangeText={(value) => setActionPrice(value === '' ? 0 : parseFloat(value))}
            keyboardType="numeric"
          />
          <Text style={styles.sliderText}>Tasa de interes prestamo</Text>
          <TextInput
            style={styles.input}
            value={loanInterestRate.toString()}
            onChangeText={(value) => handleInterestRateChange(setLoanInterestRate, value === '' ? 0 : value)}
            keyboardType="numeric"
          />

          <Text style={styles.sliderText}>Tasa de interes por pago tardio</Text>
          <TextInput
            style={styles.input}
            placeholder="Tasa de interes por pago tardio"
            placeholderTextColor="#A69E9E"
            value={latePaymentInterestRate.toString()}
            onChangeText={(value) => handleLatePaymentFeeChange(value === '' ? 0 : value)}
            keyboardType="numeric"
          />
          <View style={styles.spacer} />
          <Button
            title="Crear caja de ahorros"
            disabled={!(actionPrice && loanInterestRate && latePaymentInterestRate)}
            onPress={() => {
              handleUpdateSavingsBox()
                .then(() => {
                  navigation.navigate('Dashboard');
                })
                .catch((error) => {
                  console.error('Failed to update savings box:', error);
                    Alert.alert(
                      "Error",
                      "No se pudo actualizar la caja de ahorros. Por favor, inténtelo de nuevo.", // Message to display
                      [
                        { text: "OK" },
                      ]
                    );
                });
            }}
          />
          <View style={{marginBottom: 50}}/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterOrg;
