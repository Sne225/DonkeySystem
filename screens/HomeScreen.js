import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Animated, Easing } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useFonts, Inter_100Thin, Inter_200ExtraLight, Inter_300Light,
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { TourGuideZone, useTourGuideController, TourGuideZoneByPosition } from 'rn-tourguide';

const HomeScreen = () => {

  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);
  const isFocused = useIsFocused();
  const { start } = useTourGuideController();
  const [isAnimating, setIsAnimating] = useState(true);


  const startAnimation = () => {
    // Create an Animated.Value for scaling
    const scaleValue = new Animated.Value(1);

    if (isAnimating) {
      // Use loop method to create a continuous animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.6, // Scale up to 1.4 times
            duration: 80, // Animation duration
            useNativeDriver: true, // To use native driver for performance
            easing: Easing.linear,
          }),
          Animated.timing(scaleValue, {
            toValue: 1.1, // Back to the original scale
            duration: 1300, // Animation duration
            useNativeDriver: true, // To use native driver for performance
            easing: Easing.linear,
          }),
        ]),
      ).start();
    }

    return scaleValue; // Return the Animated.Value instance
  };

  
  const scaleValue = startAnimation();


  const handleButtonPress = () => {
    setIsAnimating(false); // Toggle the animation state
  };

  let [fontsLoaded] = useFonts({
    Inter_100Thin, Inter_200ExtraLight, Inter_300Light, Inter_400Regular,
    Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
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
          setUserSurname(userData.surname);

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
    navigation.navigate('CreateReport', {userName, userSurname});
  };

  const handleViewReports = () => {
    navigation.navigate('ViewReports', {userName, userSurname});
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

  return (

    <View style={styles.container}>
      <Text style={{fontSize: 39, color: 'white', position: 'absolute',
     top: 35, left: 30, fontFamily: 'Inter_600SemiBold' }}>Hi, {userName}
      </Text>

      <View style={styles.profileLogo}>
          <Feather name="user" size={25} color="#009387" />
      </View>
      
     <TouchableOpacity activeOpacity={0.3}  style={styles.infoButton} onPress={() => {start(); handleButtonPress();}} >
           <Animated.View style={{ transform: [{ scale: scaleValue }], }}>
          <Feather name="info" size={20} color="white" />
          </Animated.View>
     </TouchableOpacity>

      <Text style={{fontSize: 20, color: 'white', position: 'absolute', top:87, 
          left: 30, fontFamily: 'Inter_400Regular'}}>Let's get to work</Text>
    
     <Text style={styles.heading}>Project Tasks</Text>
      <View style={styles.tasks}>
        <Text style={{fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#009387', position: 'absolute',
     top: 20, left: 15,}}>Create New Report</Text>
     <Text style={{fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'lightgrey',
     top: 10, left: -20,}}>Create a new report in this section</Text>
    
      <TouchableOpacity style={styles.FAB} onPress={handleCreateReport}>
        <TourGuideZone zone={1}>
        <Feather
          name="plus"
          size={25}
          color="white"
          style={{ fontWeight: 'bold' }}
        />
         </TourGuideZone>
         <TourGuideZoneByPosition
          zone={1}
          text={'Use this button to create a new donkey report.'}
          shape={'circle'}
          isTourGuide
          bottom={-55}
          left={-18}
          width={80}
          height={80}
        />
      </TouchableOpacity>
      </View>
      
      <TourGuideZone zone={7}
      text={'Enjoy the app and have fun doing the reports! 😁🐴'}
      ></TourGuideZone>

      <Text style={styles.heading}>Completed Tasks</Text>   
      <View style={styles.tasks}>
        <Text style={{fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#009387', position: 'absolute',
     top: 20, left: 15,}}>Reports Completed</Text>
     <Text style={{fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'lightgrey',
     top: 10, left: -20,}}>Number of reports you've submitted</Text>

      <TouchableOpacity style={styles.FAB} onPress={()=>{}}>
        <TourGuideZone zone={2}>
        <Text style={{fontSize: 20, color: 'white',
    fontFamily:  'Inter_600SemiBold', alignItems: 'center', textAlign: 'center', marginRight: 5,}}>{reportCount}</Text>
     </TourGuideZone>
     <TourGuideZoneByPosition
          zone={2}
          text={'This number indicates the number of reports you have created in the app.'}  
          shape={'circle'}
          isTourGuide
          bottom={-52}
          left={-18}
          width={80}
          height={80}
        />
      </TouchableOpacity>
      </View>
   
    

      <Text style={styles.heading}>Reports</Text>
      <View style={styles.tasks}>
        <Text style={{fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#009387', position: 'absolute',
     top: 20, left: 15,}}>View Reports</Text>
     <Text style={{fontSize: 12, fontFamily: 'Inter_600SemiBold', color: 'lightgrey',
     top: 10, left: -20,}}>Your saved reports are stored in here</Text>

      <TouchableOpacity style={styles.FAB} onPress={handleViewReports}>
         <TourGuideZone zone={3}>
        <Feather
          name="folder"
          size={25}
          color="white"
          style={{ fontWeight: 'bold' }}
        />
        </TourGuideZone>
        <TourGuideZoneByPosition
          zone={3}
          text={'Use this button to view your saved reports.'}
          shape={'circle'}
          isTourGuide
          bottom={-54}
          left={-19}
          width={80}
          height={80}
        />
      </TouchableOpacity>
      </View>
   
     

      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}>
          <Feather name="home" size={24} color='white' />
          <Text style={styles.navButtonText}>Home</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleLeaderboard}
        >
           <TourGuideZone zone={4}>
          <Feather name="award" size={24} color='white' />
          </TourGuideZone>
          <TourGuideZoneByPosition
          zone={4}
          text={'View the leaderboard and see where you rank against other workers.'}
          shape={'circle'}
          isTourGuide
          bottom={-30}
          width={80}
          height={80}
        />
          <Text style={styles.navButtonText}>Leaderboards</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleNotifications}
        >
           <TourGuideZone zone={5}>
          <Feather name="bell" size={24} color='white'/>
          </TourGuideZone>

        <TourGuideZoneByPosition zone={5}
          text={'View your in app notifications.'}
          shape={'circle'}
          isTourGuide
          bottom={-30}
          width={80}
          height={80}
        />
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>
               
        <TouchableOpacity
          style={styles.navButton}
          onPress={handleSettings}
        >
          <TourGuideZone zone={6}
      >
          <Feather name="settings" size={24} color='white' />
          </TourGuideZone>
          <TourGuideZoneByPosition
          zone={6}
          text={'View your settings and personal information.'}
          shape={'circle'}
          isTourGuide
          bottom={-30}
          left={-14}
          width={80}
          height={80}
        />
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
       
      </View>
    </View>
  
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
  top: 52,
  right: 29,
  },
  infoButton: {
    borderRadius: 80,
    padding: 10,
    backgroundColor: '#009387',
    bottom: 20,
    height: "5.5%",
    position: 'absolute',
    top: 126,
  right: 36.5,
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
    alignItems: 'center',
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
