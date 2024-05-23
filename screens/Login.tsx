/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import styles from '../styles/LoginStyle';
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresar</Text>
      <TextInput style={styles.input} placeholder="Numero de Telefono" />
      <TextInput
        style={styles.input}
        placeholder="Contraseña
        "
        secureTextEntry={true}
      />
      <View style={styles.button}>
        <Button
          title="Ingresar"
          onPress={() => navigation.navigate('Dashboard')}
        />
      </View>
      <View style={styles.button}>
        <Button color="#e36f1e" title="Olvide mi contraseña" onPress={() => navigation.navigate('RestorePassword')} />
      </View>
      <View style={styles.bacbutton}>
        <Button color="#e36f1e" title="No tengo una cuenta" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
};

export default Login;
