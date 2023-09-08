import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { firestore } from '../firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';


const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollection);
  
        const leaderboard = [];
  
        for (const doc of querySnapshot.docs) {
          const userData = doc.data().user;
  
          // Check if the 'user' property exists before accessing its properties
          if (userData) {
            const reportsCollection = collection(doc.ref, 'reports');
            const reportsQuerySnapshot = await getDocs(reportsCollection);
  
            leaderboard.push({
              id: doc.id,
              name: userData.name || '', // Use an empty string as a default value if 'name' is undefined
              surname: userData.surname || '', // Use an empty string as a default value if 'surname' is undefined
              reportCount: reportsQuerySnapshot.size,
            });
          }
        }
  
        // Sort the leaderboard by report count in descending order
        leaderboard.sort((a, b) => b.reportCount - a.reportCount);
  
        setLeaderboardData(leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };
  
    fetchLeaderboardData();
  }, []);
  

  return (
    <View>
      <Text>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View>
            <Text>{`${index + 1}. ${item.name} ${item.surname}`}</Text>
            <Text>{`Reports: ${item.reportCount}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default LeaderboardScreen;
