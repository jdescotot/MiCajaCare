/* eslint-disable prettier/prettier */
// RegisterStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  title: {
    fontSize: 74,
    marginBottom: 126,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    color: '#000',
  },
  button: {
    backgroundColor: '#f9f9f9',
    padding: 5,
    marginBottom: 16,
  },
  switch: {
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f9f9f9',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  spacer: {
    height: 50,
  },
  slider: {
    width: 200,
    height: 30,
  },
  sliderText: {
    fontSize: 20,
  },
});

export default styles;
