import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { Feather } from '@expo/vector-icons'; // Import Feather icons from Expo

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        const userRef = doc(collection(firestore, 'users'), uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const name = userData.name;
          setUserName(name);
          
          // Fetch the "reports" collection under the user's document
          const reportsCollectionRef = collection(userRef, 'reports');
          const reportsSnapshot = await getDocs(reportsCollectionRef);
          setReportCount(reportsSnapshot.size); // Assuming the user's reports are stored as an array in Firestore
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error getting user data:', error);
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

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
      <Text style={styles.greetText}>
        Hi, <Text style={styles.nameText}>{userName ? userName : 'Loading...'}!</Text>
      </Text>
      <TouchableOpacity onPress={handleCreateReport} style={styles.button}>
        <Feather name="file-plus" size={24} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Create A Report</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleViewReports} style={styles.button}>
        <Feather name="list" size={24} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>View Reports ({reportCount})</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Feather name="log-out" size={24} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Graphical Summary of Reports */}
      <View style={styles.summaryContainer}>
        {/* You can add charts or graphical representations of user's reports data here */}
        {/* For example, bar charts, pie charts, etc. */}
        {/* You can use libraries like react-native-svg-charts or others to implement the charts */}
        {/* For this example, let's display a simple summary text */}
        <Text style={styles.summaryText}>Total Reports: {reportCount}</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#009387',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row', // Added to align the icon and text horizontally
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 10, // Added to create space between the icon and text
  },
  greetText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  nameText: {
    color: '#009387',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
});
