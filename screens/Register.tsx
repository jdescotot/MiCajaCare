/* eslint-disable prettier/prettier */
// Register.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, Switch} from 'react-native';
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

const Register = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [savingsBoxName, setSavingsBoxName] = useState('');
  const [isNewBox, setIsNewBox] = useState(false); // New state for switch

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A69E9E"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A69E9E"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.switchContainer}>
        <Switch
          value={isNewBox}
          onValueChange={setIsNewBox}
          style={styles.switch}
        />
        <Text style={styles.label}>Estoy creando una caja de Ahorro?</Text>
      </View>
      {isNewBox ? (
        <TextInput
          style={styles.input}
          placeholder="Nombre de la caja de Ahorro"
          placeholderTextColor="#A69E9E"
          value={savingsBoxName}
          onChangeText={setSavingsBoxName}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Codigo de caja de Ahorro"
          placeholderTextColor="#A69E9E"
          value={savingsBoxId}
          onChangeText={setSavingsBoxId}
        />
      )}
      <View style={styles.button}>
        <Button
          title="Registrarse"
          onPress={() => {
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                const userId = userCredential.user.uid;
                if (isNewBox) {
                  // Create a new savingsBox and set the user as the administrator
                  firestore()
                    .collection('savingsBoxes')
                    .add({
                      name: savingsBoxName,
                      administrator: userId,
                      members: [userId],
                      // other savings box properties...
                    })
                    .then(() => console.log('New savings box created'))
                    .catch((error) => console.log('Error creating new savings box:', error));
                  navigation.navigate('RegisterOrg', { userId });
                } else {
                  // Associate the user with the existing savingsBox
                  firestore()
                    .collection('savingsBoxes')
                    .doc(savingsBoxId)
                    .update({
                      members: firestore.FieldValue.arrayUnion(userId),
                    })
                    .then(() => console.log('User added to the existing savings box'))
                    .catch((error) => console.log('Error adding user to the existing savings box:', error));
                  navigation.navigate('Dashboard');
                }
                console.log('Usuario creado');
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
