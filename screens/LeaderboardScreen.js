import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '../firebase'; // Replace with your Firebase configuration import
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Feather';
import { parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import Tooltip from 'react-native-walkthrough-tooltip';


export default function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState('allTime'); // Default to all-time
  const [tooltipVisible, setTooltipVisible] = useState(false);


  const getLeaderboardData = async () => {
    try {
      const usersCollectionRef = collection(firestore, 'users');
      const q = query(usersCollectionRef, orderBy('name'));
  
      const querySnapshot = await getDocs(q);
      const leaderboardDataPromises = [];
  
      querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;
  
        const reportsCollectionRef = collection(userDoc.ref, 'reports');
        const reportsPromise = getDocs(reportsCollectionRef).then((reportsSnapshot) => {
          const reportCount = reportsSnapshot.size;
          return { userId, userName: userData.name, userSurname: userData.surname, reportCount };
        });
  
        leaderboardDataPromises.push(reportsPromise);
      });
  
      const leaderboardData = await Promise.all(leaderboardDataPromises);
  
      // Sort leaderboardData by reportCount in descending order
      leaderboardData.sort((a, b) => b.reportCount - a.reportCount);
  
      // Assign ranks based on the sorted order
      leaderboardData.forEach((user, index) => {
        user.position = index + 1; // 1-based ranking
      });
  
      setLeaderboardData(leaderboardData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setIsLoading(false);
    }
  };
  
  

  useEffect(() => {
    setCurrentUser(auth.currentUser?.uid); // Store the current user's ID
    getLeaderboardData();
  }, []);

  useEffect(() => {
    if (selectedInterval === 'weekly') {
      const currentDate = new Date();
      const startOfWeekDate = startOfWeek(currentDate);
      const endOfWeekDate = endOfWeek(currentDate);

      // Call your filter function with the startOfWeekDate and endOfWeekDate
      filterData(startOfWeekDate, endOfWeekDate);
    } else if (selectedInterval === 'monthly') {
      const currentDate = new Date();
      const startOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Call your filter function with the startOfMonthDate and endOfMonthDate
      filterData(startOfMonthDate, endOfMonthDate);
    } else {
      getLeaderboardData();
    }
  }, [selectedInterval]);

  const parseDate = (dateString) => {
    try {
      // Replace non-breaking space (\u202F) with a regular space
      const cleanedDateString = dateString.replace(/\u202F/g, ' ');

      // Parse the date string with the specified format
      return parse(cleanedDateString, "MMMM d, yyyy 'at' h:mm:ss a 'UTC'XXX", new Date());
    } catch (error) {
      console.error('Error parsing date:', error);
      return null; // Handle parsing errors by returning null or another suitable default value
    }
  };

  const handleAnimationSpeed = 2;
  const handleAnimationSpeed2 = 0.5;


  const filterData = async (startDate, endDate) => {
    try {
      const usersCollectionRef = collection(firestore, 'users');
      const q = query(usersCollectionRef, orderBy('name'));
  
      const querySnapshot = await getDocs(q);
      const leaderboardDataPromises = [];
  
      querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;
  
        const reportsCollectionRef = collection(userDoc.ref, 'reports');
        const reportsPromise = getDocs(reportsCollectionRef).then((reportsSnapshot) => {
          // Filter reports by date (e.g., this month or this week)
          const filteredReports = reportsSnapshot.docs.filter((reportDoc) => {
            const reportData = reportDoc.data();
            const reportDate = reportData.date.toDate();
  
            return reportDate >= startDate && reportDate <= endDate;
          });
  
          return { userId, userName: userData.name, userSurname: userData.surname, reportCount: filteredReports.length };
        });
  
        leaderboardDataPromises.push(reportsPromise);
      });
  
      const filteredData = await Promise.all(leaderboardDataPromises);
  
      // Sort filteredData by reportCount in descending order
      filteredData.sort((a, b) => b.reportCount - a.reportCount);
  
      leaderboardData.forEach((user, index) => {
        const foundUser = filteredData.find((item) => item.userId === user.userId);
        if (foundUser) {
          user.position = index + 1;
        }
      });
  
      setLeaderboardData(filteredData);
    } catch (error) {
      console.error(`Error fetching ${selectedInterval} leaderboard data:`, error);
    }
  };
  

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <LottieView
          source={require('../assets/animations/loader.json')}
          autoPlay
          loop
          speed={handleAnimationSpeed}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Leaderboard</Text>
        <Tooltip
          isVisible={tooltipVisible}
          content={<Text>This section is the leaderboard, where workers like yourself compete with each other
            workers to become in the top 3 Donkey Care Worker! The top 3 workers will be selected and win awards!
            Good luck!
            </Text>}
          placement="bottom" // You can change this to 'top', 'left', or 'right' as needed
          onClose={() => setTooltipVisible(false)}
        >
        <TouchableOpacity onPress={() => setTooltipVisible(true)}>
    <Icon name="info" size={24} color="#FFFFFF" style={styles.infoIcon} />
  </TouchableOpacity>
</Tooltip>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedInterval === 'weekly' && styles.activeButton,
          ]}
          onPress={() => setSelectedInterval('weekly')}
        >
          <Text style={[styles.buttonText, selectedInterval === 'weekly' && styles.activeButtonText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedInterval === 'monthly' && styles.activeButton,
          ]}
          onPress={() => setSelectedInterval('monthly')}
        >
          <Text style={[styles.buttonText, selectedInterval === 'monthly' && styles.activeButtonText]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedInterval === 'allTime' && styles.activeButton,
          ]}
          onPress={() => setSelectedInterval('allTime')}
        >
          <Text style={[styles.buttonText, selectedInterval === 'allTime' && styles.activeButtonText]}>
            All Time
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.lottieContainer}>
        {/* Render the LottieView */}
        <LottieView
          source={require('../assets/animations/win.json')}
          autoPlay
          loop={false}
          speed={handleAnimationSpeed2}
          style={styles.lottie}
        />
      </View>
      <ScrollView scrollToOverflowEnabled showsVerticalScrollIndicator={false} style={styles.leaderboardContainer}>
        {leaderboardData.map((user, index) => (
          <View
            style={[
              styles.leaderboardRow,
              user.userId === currentUser && styles.currentUserHighlight,
            ]}
            key={index}
          >
            <View>
              <Text
                style={[
                  styles.userName,
                  user.userId === currentUser && styles.currentUserText,
                ]}
              >
                {user.userName}
              </Text>
              <Text
                style={[
                  styles.userSurname,
                  user.userId === currentUser && styles.currentUserText,
                ]}
              >
                {user.userSurname}
              </Text>
            </View>
            <Text
              style={[
                styles.reportCount,
                user.userId === currentUser && styles.currentUserText,
              ]}
            >
              Reports: {user.reportCount}
            </Text>
            <View style={styles.rankContainer}>
              <Text
                style={[
                  styles.userRank,
                  user.userId === currentUser && styles.currentUserText,
                ]}
              >
                Rank: {user.position}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#317773',
    padding: 20,
  },
  lottieContainer: {
    alignItems: 'center',
    marginTop: 80, 
    marginBottom: 20,
    
  },
  lottie: {
    position: 'absolute',
    top: -105,
    width: 300, 
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  loadingText: {
    fontWeight: "bold",
    fontSize: 20,
    color: 'white',
    justifyContent: 'center',
    marginBottom: 210,
    left: 124,
  },
  heading: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoIcon: {
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#00a782', 
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  activeButtonText: {
    color: '#FFFFFF', 
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leaderboardContainer: {
    flexGrow: 1,
  },
  leaderboardRow: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentUserHighlight: {
    backgroundColor: '#00a782', // Change the background color for the current user
  },
  currentUserText: {
    color: 'white', // Set font color to white for the current user
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSurname: {
    fontSize: 14,
  },
  reportCount: {
    fontSize: 16,
    position: 'absolute',
    left: 130,
  },
  userRank: {
    fontSize: 16,
  },
});
