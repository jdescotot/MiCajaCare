/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import styles from '../styles/LoginStyle';
import { firebase } from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log(`Logged in as: ${email}`);
      await AsyncStorage.setItem('userEmail', email);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
      Alert.alert("Credenciales incorrectas, intente de nuevo");
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
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotPassword}>Olvidé mi Contraseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
