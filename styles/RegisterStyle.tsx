/* eslint-disable prettier/prettier */
// RegisterStyles.js
import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FF6F00',
  },
  title: {
    fontSize: 32,
    marginBottom: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputTitle: {
    color: '#000',
    marginBottom: 8,
    marginTop: 5,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFA726',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 28,
    borderRadius: 20,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 16,
    borderRadius: 10,
  },
  switch: {
    marginBottom: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    color: '#FFFFFF', 
  },
  registerContainer: {
    backgroundColor: '#FB8C00',
    borderRadius: 20,
    padding: 20,
  },
  circle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 500,
    backgroundColor: '#FFB74D',
    right: 150,
    top: 225,
  },
  circleTwo: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 600,
    backgroundColor: '#FFD54F',
    right: -80,
    top: 475,
  },
});

export default styles;

