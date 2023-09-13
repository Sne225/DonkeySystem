import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateAccount from './screens/CreateAccountScreens';
import CreateReportScreen from './screens/CreateReportScreen';
import ViewReportsScreen from './screens/ViewReportsScreen';
import ReportDetailsScreen from './screens/ReportDetailsScreen';
import OnboardingScreen from './screens/OnboardingScreenz';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';



const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();


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
        {/* <Stack.Screen name="CreateAccount" component={CreateAccount} options={{title: 'Create Account',}}/> */}
        <Stack.Screen name="CreateAccount" component={CreateAccount} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={HomeScreen}  options={{title: 'Home', headerShown: false, }}/>
        <Stack.Screen name="CreateReport" component={CreateReportScreen} options={{ headerLeft: null, title: 'Create Report',  }}/>
        <Stack.Screen name="ViewReports" component={ViewReportsScreen} options={{title: 'View Reports',}}/>
        <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} options={{title: 'Report Details',}}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false,}} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{headerShown: false,}} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{headerShown: false,}} />
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
