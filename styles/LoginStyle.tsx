/* eslint-disable prettier/prettier */
import {StyleSheet} from 'react-native';

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
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#f9f9f9',
    padding: 5,
    marginBottom: 16,
  },
  bacbutton: {
    padding: 5,
    marginTop: 56,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0,
  },
});

export default styles;
