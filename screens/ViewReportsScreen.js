import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';




const ViewReportScreen = ( {reportId}) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

    if (userId) {
      const userReportsRef = collection(firestore, 'users', userId, 'reports');
      const q = query(userReportsRef);

      const fetchReports = async () => {
        try {
          const querySnapshot = await getDocs(q);
          const fetchedReports = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReports(fetchedReports);
        } catch (error) {
          console.error('Error fetching reports:', error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching data
        }
      };

      fetchReports();
    }
  }, []);

  const handleReportPress = (reportId) => {
    // Navigate to a screen to view the details of the report with the given ID
    navigation.navigate('ReportDetails', { reportId });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#009387" />
      </View>
    );
  }

  // const handleDeleteReport = async (reportId) => {
  //   // Show an alert to confirm the deletion
  //   Alert.alert(
  //     'Confirm Deletion',
  //     'Are you sure you want to delete this report?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: async () => {
  //           try {
  //             // Delete the report from Firestore
  //             await deleteDoc(collection(firestore, 'users', auth.currentUser?.uid, 'reports', reportId));

  //             // Remove the deleted report from the local state
  //             setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));

  //             // Show a success message (optional)
  //             Alert.alert('Report Deleted', 'The report has been successfully deleted.');
  //           } catch (error) {
  //             console.error('Error deleting report:', error);
  //             // Show an error message (optional)
  //             Alert.alert('Error', 'An error occurred while deleting the report. Please try again later.');
  //           }
  //         },
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  const handleDeleteReport = async (reportId) => {
    // Show an alert to confirm the deletion
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the report from Firestore
              await deleteDoc(doc(firestore, 'users', auth.currentUser?.uid, 'reports', reportId));
  
              // Remove the deleted report from the local state
              setReports((prevReports) => prevReports.filter((report) => report.id !== reportId));
  
              // Show a success message (optional)
              Alert.alert('Report Deleted', 'The report has been successfully deleted.');
            } catch (error) {
              console.error('Error deleting report:', error);
              // Show an error message (optional)
              Alert.alert('Error', 'An error occurred while deleting the report. Please try again later.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.reportItem}
      onPress={() => handleReportPress(item.id)}
    >
      <View style={styles.reportData}>
      <Text style={styles.reportTitle}>{item.ownerName}</Text>
      <Text style={styles.reportDate}>{item.date.toDate().toDateString()}</Text>
      </View>

      <Icon name="trash" size={24} color="white" style={styles.deleteIcon} onPress={() => handleDeleteReport(item.id)} />

    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.noReportsText}>No Reports found</Text>
      ) : (
        <FlatList showsVerticalScrollIndicator={false}
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateReport')}
      >
         
        <Text style={styles.addButtonText}><Ionicons name="add-circle-outline" size={17} color="white" />  Add New Report</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
    justifyContent: 'space-between', // Align children vertically with space in-between
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
    flexDirection: 'row-reverse', // Place the bin icon on the right end
    alignItems: 'center',
  },
  deleteIcon: {
    marginRight: 15, // Add a margin on the left side of the icon for spacing
  },
  reportData: {
    flex: 1,
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
    flexDirection: 'row', // Align icon and text horizontally
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10, // Add some space between the icon and text
  },
  noReportsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009387',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ViewReportScreen;
