/* eslint-disable prettier/prettier */
// RegisterStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  title: {
    fontSize: 64,
    marginBottom: 26,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  inputTitle: {
    color: '#000',
    marginBottom: 2,
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 28,
    borderRadius: 20,
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
    color: 'black',
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
    width: windowWidth - 50,
    height: 70,
  },
  sliderText: {
    fontSize: 20,
  },
  registerContainer: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 16,
  },
  circle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 500,
    backgroundColor: '#FADADD',
    right: 150,
    top: 225,
  },
  circleTwo: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 600,
    backgroundColor: '#AEC6CF',
    right: -80,
    top: 475,
  },
});

export default styles;
