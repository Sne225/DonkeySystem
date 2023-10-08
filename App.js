import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TourGuideProvider } from 'rn-tourguide';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CreateAccount from './screens/CreateAccountScreen';
import CreateReportScreen from './screens/CreateReportScreen';
import ViewReportsScreen from './screens/ViewReportsScreen';
import ReportDetailsScreen from './screens/ReportDetailsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import EditReportScreen from './screens/EditReportScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TourGuideProvider>
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
        <Stack.Screen name="EditReport" component={EditReportScreen} options={{title: 'Edit Report',}}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{headerShown: false,}} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{headerShown: false,}} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{headerShown: false,}} />

      </Stack.Navigator>
    </NavigationContainer>
    </TourGuideProvider>
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
