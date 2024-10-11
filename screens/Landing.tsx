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
            <View style={styles.circleTwo}/>
            <View style={styles.circle}/>
      <Text style={styles.title}>Mi Caja Care</Text>
      <View style={styles.secondContainer}>
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
    </View>
  );
};

export default Landing;
