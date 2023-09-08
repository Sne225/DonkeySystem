import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { collection, query, orderBy, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import your Firebase configuration

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const leaderboardQuery = query(usersCollection, orderBy('reportCount', 'desc'));
        const querySnapshot = await getDocs(leaderboardQuery);

        const leaderboardData = [];

        for (const docSnapshot of querySnapshot.docs) {
          const userData = docSnapshot.data();
          const userId = docSnapshot.id;

          // Fetch the count of reports for each user
          const userReportsCollection = collection(usersCollection, userId, 'reports');
          const userReportsQuery = query(userReportsCollection);
          const userReportsSnapshot = await getDocs(userReportsQuery);

          const reportCount = userReportsSnapshot.size;

          leaderboardData.push({
            id: userId,
            name: userData.name,
            reportCount: reportCount,
          });
        }

        setLeaderboardData(leaderboardData);
      } catch (error) {
        console.error('Error getting leaderboard data:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <View>
      <Text>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View>
            <Text>{`${index + 1}. ${item.name}`}</Text>
            <Text>{`Reports: ${item.reportCount}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default LeaderboardScreen;
