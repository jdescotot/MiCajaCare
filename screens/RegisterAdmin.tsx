/* eslint-disable prettier/prettier */
// RegisterAdmin.tsx
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, Switch, KeyboardAvoidingView, Platform, BackHandler, ToastAndroid, Alert } from 'react-native';
import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const RegisterAdmin = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savingsBoxName, setSavingsBoxName] = useState('');
  const [doubleBackToExitPressedOnce, setDoubleBackToExitPressedOnce] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (doubleBackToExitPressedOnce) {
        BackHandler.exitApp();
      } else {
        setDoubleBackToExitPressedOnce(true);
        ToastAndroid.show('Presione de nuevo para salir', ToastAndroid.SHORT);

        setTimeout(() => {
          setDoubleBackToExitPressedOnce(false);
        }, 2000);

        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [doubleBackToExitPressedOnce]);

  const handleRegister = async () => {
    try {
      const querySnapshot = await firestore().collection('savingsBoxes').get();
      const existingNames = querySnapshot.docs.map((doc) => doc.data().name);

      if (existingNames.includes(savingsBoxName)) {
        Alert.alert('Error', 'El nombre de la caja de ahorro ya existe. Por favor, elija otro nombre.');
      } else {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;

        await userCredential.user.updateProfile({ displayName: name });

        await firestore().collection('savingsBoxes').doc(savingsBoxName).set({
          name: savingsBoxName,
          administrator: userId,
          members: [userId],
        });

        await firestore().collection('userDetails').doc(userId).set({
          name: name,
          amountOwed: 0,
          amountTaken: 0,
          nextPaymentDate: null,
          pendingPayments: 0,
          sharesBoughtThisWeek: 0,
          totalInvestment: 0,
          savingsBoxId: savingsBoxName,
          isAdmin: true,
          isActive: true,
        });

        navigation.navigate('RegisterOrg', { userId });
        console.log('Usuario creado y caja de ahorro registrada');
      }
    } catch (error) {
      console.log('Error registrando usuario o caja de ahorro:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Este correo ya está en uso por otra cuenta.');
      } else {
        Alert.alert('Error', 'Hubo un error al registrar el usuario o la caja de ahorro. Por favor, intente de nuevo.');
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.circleTwo} />
        <View style={styles.circle} />
        <Text style={styles.title}>Admin</Text>
        <View style={styles.registerContainer}>
          <Text style={styles.inputTitle}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#A69E9E"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputTitle}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A69E9E"
            value={email}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />

          <Text style={styles.inputTitle}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#A69E9E"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <View>
            <Text style={styles.inputTitle}>Nombre de la Caja de Ahorro</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la caja de Ahorro"
              placeholderTextColor="#A69E9E"
              value={savingsBoxName}
              onChangeText={(text) => setSavingsBoxName(text.toLowerCase().replace(/\s+/g, ''))}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Registrarse"
              disabled={!(savingsBoxName)}
              onPress={handleRegister}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterAdmin;
