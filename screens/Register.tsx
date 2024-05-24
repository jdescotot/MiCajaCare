/* eslint-disable prettier/prettier */
// Register.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { firebase } from '@react-native-firebase/auth';
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Register = ({ navigation }: Props) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [contrasena, setContrasena] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefono"
        value={telefono}
        onChangeText={setTelefono}
      />
      <TextInput
        style={styles.input}
        placeholder="Identidad"
        value={identidad}
        onChangeText={setIdentidad}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={contrasena}
        onChangeText={setContrasena}
      />
      <View style={styles.button}>
      <Button
        title="Registrarse"
        onPress={() => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(telefono, contrasena)
            .then(() => {
              console.log('Usuario creado');
              navigation.navigate('Dashboard');
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      />
      </View>
    </View>
  );
};
export default Register;
