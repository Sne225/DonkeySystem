import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp } from "firebase/app";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateAccount from './screens/CreateAccountScreen';
import CreateReportScreen from './screens/CreateReportScreen';
import ViewReportsScreen from './screens/ViewReportsScreen';
import ReportDetailsScreen from './screens/ReportDetailsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SettingsScreen from './screens/SettingsScreen';


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
            headerShown: false,
          },
        }} >
        {/* <Stack.Screen name="Home" component={HomeScreen}  options={{title: 'Home', headerShown: false, }}/> */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{title: 'Create Account',}}/>
        <Stack.Screen name="Home" component={HomeScreen}  options={{title: 'Home', headerShown: false, }}/>
        <Stack.Screen name="CreateReport" component={CreateReportScreen} options={{ headerLeft: null, title: 'Create Report',  }}/>
        <Stack.Screen name="ViewReports" component={ViewReportsScreen} options={{title: 'View Reports',}}/>
        <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{title: 'Report Details',}}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false,}} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//firebaseconfiguration
const firebaseConfig = {
    apiKey: "AIzaSyCPn8Y47KaPBy8dppFf7SZ5Ni5cUMJ1XwY",
    authDomain: "donkeysystem-6b9fc.firebaseapp.com",
    databaseURL: "https://donkeysystem-6b9fc-default-rtdb.firebaseio.com",
    projectId: "donkeysystem-6b9fc",
    storageBucket: "donkeysystem-6b9fc.appspot.com",
    messagingSenderId: "311146237020",
    appId: "1:311146237020:web:7de2c6d0f9bb5d020eea99"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
//if problem use if(!firebase.apps.length){firebase.initializeApp(firebaseConfig);}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
