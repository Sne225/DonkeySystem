import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import {collection, doc, getDoc} from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';


const ReportDetailsScreen = () => {
  const route = useRoute();
  const reportId = route.params?.reportId;
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Fetch the report details from Firestore
    const fetchReportData = async () => {
        try {
          console.log('Report ID received:', reportId);
  
          if (!reportId) {
            // Handle the case where reportId is missing or undefined
            console.error('Report ID is missing or undefined.');
            return;
          }
  
          const currentUser = auth.currentUser;
          const userId = currentUser ? currentUser.uid : null;
  
          if (userId) {
            const userDocRef = doc(firestore, 'users', userId, 'reports', reportId);
            const docSnapshot = await getDoc(userDocRef);
  
            if (docSnapshot.exists()) {
              setReportData(docSnapshot.data());
            } else {
              // Handle the case where the report with the specified ID does not exist
              console.error('Report not found.');
            }
          }
        } catch (error) {
          console.error('Error fetching report data:', error);
        }
      };

    fetchReportData();
  }, [reportId]);

  const handleEditReport = () => {
    // Navigate to the EditReport screen and pass the reportId
    navigation.navigate('EditReport', { reportId });
  };

  const handleDeleteReport = async () => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDeleteReport, textStyle: { color: 'red' } },
      ]
    );
  };

  const performDeleteReport = async () => {
    try {
      // Delete the report from Firestore
      const reportDocRef = firestore.doc(
        `users/${auth.currentUser?.uid}/reports/${reportId}`
      );
      await reportDocRef.delete();

      // Navigate back to the ViewReportScreen after successful deletion
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  if (!reportData) {
    // Render a loading indicator or an empty state while fetching the data
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Report Details</Text>
      <Text style={styles.label}>Time:</Text>
      <Text style={styles.value}>{reportData.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{reportData.date.toDate().toDateString()}</Text>
      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{reportData.location}</Text>
      <Text style={styles.label}>Owner Name:</Text>
      <Text style={styles.value}>{reportData.ownerName}</Text>
      <Text style={styles.label}>Donkey Count:</Text>
      <Text style={styles.value}>{reportData.donkeyCount}</Text>
      <Text style={styles.label}>Male Adult Count:</Text>
      <Text style={styles.value}>{reportData.maleAdultCount}</Text>
      <Text style={styles.label}>Male Castrated Count:</Text>
      <Text style={styles.value}>{reportData.maleCastratedCount}</Text>
      <Text style={styles.label}>Female Adult Count:</Text>
      <Text style={styles.value}>{reportData.femaleAdultCount}</Text>
      <Text style={styles.label}>Male Foal Count:</Text>
      <Text style={styles.value}>{reportData.maleFoalCount}</Text>
      <Text style={styles.label}>Female Foal Count:</Text>
      <Text style={styles.value}>{reportData.femaleFoalCount}</Text>
      <Text style={styles.label}>Poor Health:</Text>
      <Text style={styles.value}>{reportData.poorHealth ? 'Yes' : 'No'}</Text>
      <Text style={styles.label}>Photo:</Text>
      {reportData.photo && <Image source={{ uri: reportData.photo }} style={styles.photo} />}
      <Text style={styles.label}>Owner Reports:</Text>
      <Text style={styles.value}>{reportData.ownerReports}</Text>
      <Text style={styles.label}>Observations:</Text>
      <Text style={styles.value}>{reportData.observations}</Text>
      <Text style={styles.label}>Advice & Help:</Text>
      <Text style={styles.value}>{reportData.adviceHelp}</Text>
      <Text style={styles.label}>Contact Vets:</Text>
      <Text style={styles.value}>{reportData.contactVets ? 'Yes' : 'No'}</Text>
      <Text style={styles.label}>Follow-up:</Text>
      <Text style={styles.value}>{reportData.followUp ? 'Yes' : 'No'}</Text>
      {reportData.followUpDate && (
        <View>
          <Text style={styles.label}>Follow-up Date:</Text>
          <Text style={styles.value}>{reportData.followUpDate.toDate().toDateString()}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditReport}>
          <Ionicons name="pencil" size={24} color="white" />
          <Text style={styles.buttonText}>Edit      </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteReport}>
          <Ionicons name="trash" size={24} color="white" />
          <Text style={styles.buttonText}>Delete   </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#009387',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009387',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
  photo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
    // Edit and Delete Button Styles
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#009387',
      borderRadius: 5,
      padding: 10,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FF5733', // Use a different color for the delete button
      borderRadius: 5,
      padding: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 5,
    },
});

export default ReportDetailsScreen;
