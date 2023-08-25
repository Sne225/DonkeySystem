import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Button,
  TouchableOpacity,
  Image,
  Alert, ActivityIndicator,StyleSheet,
} from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { firestore } from '../firebase';

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Fetch user reports from the database
      const reportsSnapshot = await firestore.collection('reports').get();
      const reports = reportsSnapshot.docs.map((doc) => doc.data());

      // Calculate report counts for each user in the current month
      const currentMonth = new Date().getMonth(); // Get current month (0-11)
      const userReportCounts = {};
      reports.forEach((report) => {
        const reportMonth = report.date.toDate().getMonth();
        if (reportMonth === currentMonth) {
          const userId = report.userId;
          userReportCounts[userId] = (userReportCounts[userId] || 0) + 1;
        }
      });

      // Convert userReportCounts object into an array and sort it
      const userIds = Object.keys(userReportCounts);
      const leaderboardDataPromises = userIds.map(async (userId) => {
        const userDataSnapshot = await firestore.collection('users').doc(userId).get();
        const userData = userDataSnapshot.data();
        return {
          userId,
          reportCount: userReportCounts[userId],
          username: userData.username,
        };
      });

      const sortedLeaderboardData = await Promise.all(leaderboardDataPromises);
      sortedLeaderboardData.sort((a, b) => b.reportCount - a.reportCount);

      setLeaderboardData(sortedLeaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leaderboard</Text>
      {leaderboardData.map((user, index) => (
        <View key={user.userId} style={styles.userRow}>
          <Text style={styles.userName}>{user.userId}</Text>
          <Text style={styles.reportCount}>{user.reportCount}</Text>
        </View>
      ))}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009387',
    marginBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportCount: {
    fontSize: 16,
  },
});

export default LeaderboardScreen;
