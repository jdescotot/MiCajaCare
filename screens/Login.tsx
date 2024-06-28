/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import styles from '../styles/LoginStyle';
import { firebase } from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Dejó espacios en blanco");
      return;
    }
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      //await AsyncStorage.setItem('userEmail', email);
      console.log("estoy aqui ");
      const userId = userCredential.user.uid;
      const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
      console.log(userDetailsDoc.data());
      console.log(userDetailsDoc.data().savingsBoxId);
      if (userDetailsDoc.exists && userDetailsDoc.data().savingsBoxId) {
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('JoinSavingsBox');
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ReferenceError && error.message.includes('firestore')) {
        // If the error is specifically about 'firestore' not existing, navigate to JoinSavingsBox
        navigation.navigate('JoinSavingsBox');
      }else{
        Alert.alert("Credenciales incorrectas, intente de nuevo");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso</Text>
      <View style={styles.circleTwo}/>
      <View style={styles.circle}/>
      <View style={styles.loginContainer}>
        <Text style={styles.inputTitle}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input]}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Correo Electrónico"
          placeholderTextColor="#A69E9E"
          autoCapitalize="none"
        />
        <Text style={styles.inputTitle}>Contraseña</Text>
        <TextInput
          style={[styles.input]}
          onChangeText={setPassword}
          value={password}
          placeholder="Contraseña"
          placeholderTextColor="#A69E9E"
          secureTextEntry={true}
        />
        <View style={styles.spacer} />
        <Button  title="Ingresar" onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate('RegisterAdmin')}>
          <Text style={styles.forgotPassword}>Soy un administrador</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
