/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from '../styles/LandingStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';

type LandingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Landing'
>;

type Props = {
  navigation: LandingScreenNavigationProp;
};

const Landing = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola!</Text>
      <View style={styles.button}>
        <Button
          title="Ya tengo una cuenta"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Aun no tengo una cuenta"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
};

export default Landing;
