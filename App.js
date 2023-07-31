import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateAccount from './screens/CreateAccountScreen';
import CreateReportScreen from './screens/CreateReportScreen';
import ViewReportsScreen from './screens/ViewReportsScreen';
import ReportDetailsScreen from './screens/ReportDetailsScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer> 
      <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#009387',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} >
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{
          title: 'Create Account',
        }}/>
        <Stack.Screen name="Home" component={HomeScreen}  options={{title: 'Home', headerLeft: null,}}/>
        <Stack.Screen name="CreateReport" component={CreateReportScreen} options={{
          title: 'Create Report', headerLeft: null,
        }}/>
        <Stack.Screen name="ViewReports" component={ViewReportsScreen} />
        <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
