import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigation, useIsFocused } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);
  const isFocused = useIsFocused();

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

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => alert(error.message));
  };

  const handleCreateReport = () => {
    navigation.navigate('CreateReport');
  };

  const handleViewReports = () => {
    navigation.navigate('ViewReports');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#009387" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.profileLogo}>
          <Feather name="user" size={40} color="#009387" />
        </View>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userCity}>{userCity}</Text>
      </View>

      <View style={styles.reportsCard}>
        <Text style={styles.reportsCount}>{reportCount}</Text>
        <Text style={styles.reportsLabel}>Reports</Text>
      </View>

      <TouchableOpacity onPress={handleCreateReport} style={styles.actionButton}>
        <Feather name="file-plus" size={24} color="white" />
        <Text style={styles.actionText}>   Create A Report</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleViewReports} style={styles.actionButton}>
        <Feather name="list" size={24} color="white" />
        <Text style={styles.actionText}>      View Reports</Text>
      </TouchableOpacity>

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
          onPress={() => {}}
        >
          <Feather name="award" size={24} color='white' />
          <Text style={styles.navButtonText}>Leaderboards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {}}
        >
          <Feather name="bell" size={24} color='white'/>
          <Text style={styles.navButtonText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {}}
        >
          <Feather name="settings" size={24} color='white' />
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
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#009387',
    width: '100%',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  profileLogo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
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
  reportsCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#009387',
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
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#009387',
    width: '100%',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center', // Change the background color to match the primary color\
    marginBottom: 10,
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
