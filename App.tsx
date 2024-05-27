import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';
import RegisterOrg from './screens/RegisterOrg';
import RestorePassword from './screens/RestorePassword';
import Dashboard from './screens/navigation/Dashboard';
import firebase from './firebaseConfig';
const Stack = createStackNavigator();

const App = () => {
  console.log(firebase);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={Landing}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="RegisterOrg"
          component={RegisterOrg}
          initialParams={{ userId: 'default' }}
        />
        <Stack.Screen name="RestorePassword" component={RestorePassword} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
