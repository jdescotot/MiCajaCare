/* eslint-disable prettier/prettier */
import { StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  title: {
    fontSize: 54,
    marginBottom: 126,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f9f9f9',
    padding: 5,
    paddingTop: 10,
    marginBottom: 16,
  },
  secondContainer: {
    marginTop: 56,
    backgroundColor: '#f9f9f9',
    paddingTop: 56,
    paddingBottom: 46,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 35,
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
