 import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, createNavigationContainerRef }  from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import RegisterOrg from './screens/RegisterOrg';
import RestorePassword from './screens/RestorePassword';
import Dashboard from './screens/navigation/Dashboard';
import LoansPanel from './screens/admin/LoansPanel';
import Stockpanel from './screens/admin/StockPanel';
import firebase from './firebaseConfig';
import AddMoneyToSavingsBox from './screens/admin/AddMoneyToSavingsBox';
import Pagar from './screens/admin/Pagar';
import RegisterAdmin from './screens/RegisterAdmin';
import JoinSavingsBox from './screens/JoinSavingsBox';
import AdminPanel from './screens/AdminPanel';

const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();

const App = () => {
  console.log(firebase);
  useEffect(() => {
    const checkLogin = async () => {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (userEmail && navigationRef.isReady()) {
        navigationRef.navigate('Dashboard');
      }else{
        navigationRef.current?.navigate('Landing');
      }
    };

    checkLogin();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{title: 'Bienvenido'}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="RegisterAdmin" component={RegisterAdmin} />
        <Stack.Screen
          name="RegisterOrg"
          component={RegisterOrg}
          initialParams={{ userId: 'default' }}
        />
        <Stack.Screen name="RestorePassword" component={RestorePassword} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="LoansPanel" component={LoansPanel} />
        <Stack.Screen name="StockPanel" component={Stockpanel} />
        <Stack.Screen name="AddMoneyToSavingsBox" component={AddMoneyToSavingsBox} />
        <Stack.Screen name="Pagar" component={Pagar} />
        <Stack.Screen name="JoinSavingsBox" component={JoinSavingsBox} />
        <Stack.Screen name="AdminPanel" component={AdminPanel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
