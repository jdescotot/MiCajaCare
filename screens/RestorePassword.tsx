/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles/UserTypeStyle';
import { firebase } from '@react-native-firebase/auth';

const RestorePassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRestorePassword = async () => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      console.log(`Password reset email sent to: ${email}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restore Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="New Password"
        secureTextEntry={true}
      />
      <Button title="Restore Password" onPress={handleRestorePassword} />
    </View>
  );
};

export default RestorePassword;
