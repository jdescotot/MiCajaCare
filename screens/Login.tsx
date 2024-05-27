/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles/UserTypeStyle';
import { firebase } from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';

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
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log(`Logged in as: ${email}`);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Correo Electrónico"
        placeholderTextColor="#A69E9E"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Contraseña"
        placeholderTextColor="#A69E9E"
        secureTextEntry={true}
      />
      <View style={styles.spacer} />
      <Button title="Ingresar" onPress={handleLogin} />
      <View style={styles.spacer} />
      <Button color="#e36f1e" title="Olvide mi Contraseña" onPress={handleLogin} />
    </View>
  );
};

export default Login;
