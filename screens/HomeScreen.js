import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
// import AppLoading from 'expo-app-loading';




const HomeScreen = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);
  const isFocused = useIsFocused();

  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });


  useEffect(() => {
    const getUserData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        const userRef = doc(collection(firestore, 'users'), uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserName(userData.name);
          setUserCity(userData.city);

          const reportsCollectionRef = collection(userRef, 'reports');
          const reportsSnapshot = await getDocs(reportsCollectionRef);
          setReportCount(reportsSnapshot.size);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error getting user data:', error);
        setIsLoading(false);
      }
    };

    getUserData();
  }, [isFocused]);

 


  const handleCreateReport = () => {
    navigation.navigate('CreateReport');
  };

  const handleViewReports = () => {
    navigation.navigate('ViewReports');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  }

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  }

  const handleLeaderboard = () => {
    navigation.navigate('Leaderboard');
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={{fontSize: 39, color: 'white', position: 'absolute',
     top: 35, 
     left: 30, 
     fontFamily: 'Inter_600SemiBold' }}>Hi, {userName}</Text>
      <View style={styles.profileLogo}>
          <Feather name="user" size={25} color="#009387" />
        </View>
        <Text style={{fontSize: 20,
    color: 'white',
    position: 'absolute',
     top:87, 
     left: 30, fontFamily: 'Inter_400Regular'}}>Let's get to work</Text>
    
     <Text style={styles.heading}>Project Tasks</Text>

      <View style={styles.tasks}>
        <Text style={{fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#009387', position: 'absolute',
     top: 20, 
     left: 15,}}>Create New Report</Text>
     <Text style={{fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'lightgrey',
     top: 10, 
     left: -20,}}>Your new reports are logged in here</Text>

        <View style={styles.FAB}>
        <Feather name="plus" size={25} color="white" style={{ fontWeight: 'bold' }} onPress={handleCreateReport}/>
        </View>
      </View>

      <Text style={styles.heading}>Completed Tasks</Text>

      <View style={styles.tasks}>
        <Text style={{fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#009387', position: 'absolute',
     top: 20, 
     left: 15,}}>Reports Completed</Text>
     <Text style={{fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'lightgrey',
     top: 10, 
     left: -20,}}>Number of reports you've submitted</Text>

        <View style={styles.FAB}>
        <Text style={{fontSize: 20, color: 'white',
    fontFamily:  'Inter_600SemiBold', paddingLeft: 4, textAlign: 'center',}}>{reportCount}</Text>
        </View>
      </View>

      <Text style={styles.heading}>Reports</Text>

      <View style={styles.tasks}>
        <Text style={{fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#009387', position: 'absolute',
     top: 20, 
     left: 15,}}>View Reports</Text>
     <Text style={{fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'lightgrey',
     top: 10, 
     left: -20,}}>Your saved reports are stored in here</Text>

        <View style={styles.FAB}>
        <Feather name="folder" size={25} color="white" style={{ fontWeight: 'bold' }} onPress={handleViewReports}/>
        </View>
      </View>

      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={[styles.navButton, isFocused ? styles.activeNavButton : null]}
          onPress={() => navigation.navigate('Home')}
        >
          <Feather name="home" size={24} color='white' />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleLeaderboard}
        >
          <Feather name="award" size={24} color='white' />
          <Text style={styles.navButtonText}>Leaderboards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNotifications}
        >
          <Feather name="bell" size={24} color='white'/>
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleSettings}
        >
          <Feather name="settings" size={24} color='white' />
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#317773',
    padding: 20,
  },
  heading: {
    textAlign: 'left',
    color: 'white',
    fontSize: 17,
    marginBottom: 10,
    fontFamily: 'Inter_600SemiBold',
    left: 12,
  },
  tasks: {
    backgroundColor: 'white',
    width: '100%',
    padding: 35,
    borderRadius: 20,
    marginBottom: 30,
  },
  profileLogo: {
    backgroundColor: 'white',
  padding: 15,
  borderRadius: 40,
  marginBottom: 10,
  position: 'absolute',
  top: 52, // Adjust this value to control the vertical spacing from the top
  right: 29,
  },
  FAB: {
    position: 'absolute',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#009387',
    margin: 24,
    right: 0,
    bottom: -2,
    
  },
  userCity: {
    fontSize: 16,
    color: 'white',
  },
  reportsCard: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontWeight: "bold",
    fontSize: 18,
    color: 'white',
    justifyContent: 'center',
    marginBottom: 20,
    left: 124,

  },
  reportsLabel: {
    fontSize: 16,
    color: '#009387',
  },
  actionButton: {
    backgroundColor: '#009387',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  navigationBar: {
    position: 'absolute',
    left: 21,
    bottom: 10,
    flexDirection: 'row',
    backgroundColor: '#009387',
    width: '100%',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center', // Change the background color to match the primary color\
    marginBottom: 20,
  },
  navButton: {
    alignItems: 'center',
   
  },
  navButtonText: {
    color: 'white',
    marginTop: 5,
    
  }
});

export default HomeScreen;
