/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FF6F00',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statisticsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statisticsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%', // Limita la altura máxima del modal
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 18,
    color: '#4A4A4A',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
