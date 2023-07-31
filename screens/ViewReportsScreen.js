import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

const ViewReportScreen = ( {reportId}) => {
  const [reports, setReports] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch the reports from Firestore
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    if (userId) {
      const userReportsRef = collection(firestore, 'users', userId, 'reports');
      const q = query(userReportsRef);

      const fetchReports = async () => {
        const querySnapshot = await getDocs(q);
        const fetchedReports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(fetchedReports);
      };

      fetchReports();
    }
  }, []);

  const handleReportPress = (reportId) => {
    // Navigate to a screen to view the details of the report with the given ID
    navigation.navigate('ReportDetails', { reportId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => handleReportPress(item.id)}
    >
      <Text style={styles.reportTitle}>{item.ownerName}</Text>
      <Text style={styles.reportDate}>{item.date.toDate().toDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Reports</Text>
      <FlatList
        data={reports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateReport')}
      >
        <Text style={styles.addButtonText}>Add New Report</Text>
      </TouchableOpacity>
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
  listContainer: {
    flexGrow: 1,
  },
  reportItem: {
    backgroundColor: '#009387',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  reportTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportDate: {
    color: '#FFF',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewReportScreen;
