/* eslint-disable prettier/prettier */
// Register.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import styles from '../styles/RegisterStyle';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firebase } from '@react-native-firebase/auth';
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};
const signInWithFacebook = async () => {
  try {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a new Firebase credential with the token
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return firebase.auth().signInWithCredential(facebookCredential);
  } catch (error) {
    console.error(error);
  }
};

const Register = ({ navigation }: Props) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [identidad, setIdentidad] = useState('');
  const [contrasena, setContrasena] = useState('');
  const signInWithGoogle = async () => {
    try {
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return firebase.auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error(error);
    }
  };
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
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
/>
<TextInput
  placeholder="Password"
  secureTextEntry={true}
  value={password}
  onChangeText={setPassword}
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
      <View style={styles.button}>
        <Button title="Registrarse con Google" onPress={signInWithGoogle} />
      </View>
      <View style={styles.button}>
        <Button title="Registrarse con Facebook" onPress={signInWithFacebook} />
      </View>
      </View>
      <View style={styles.button}>
        <Button title="Crear Nueva Caja" onPress={() => {}} />
      </View>
      <View style={styles.button}>
        <Button title="Usar Caja Existente" onPress={() => {}} />
      </View>
    </View>
  );
};
export default Register;
