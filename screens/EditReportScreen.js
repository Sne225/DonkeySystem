// EditReportScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';



const EditReportScreen = ({ navigation }) => {
  const route = useRoute();
  const reportId = route.params?.reportId;
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

 

 useEffect(() => {
    // Fetch and update the report details based on reportId
    const fetchReportData = async () => {
      try {
        const currentUser = auth.currentUser;
        const userId = currentUser ? currentUser.uid : null;

        if (userId && reportId) {
          const userDocRef = doc(firestore, 'users', userId, 'reports', reportId);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            setReportData(docSnapshot.data());
          }
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [reportId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#009387" />
      </View>
    );
  }

  const handleSaveReport = async () => {
    try {
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : null;
  
      if (userId && reportId) {
        const reportDocRef = doc(firestore, `users/${userId}/reports`, reportId);
  
        // Update the report data in Firestore
        
        await updateDoc(reportDocRef, reportData);

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate("Home");
        }, 2500);
      
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Time:</Text>
      <Text style={styles.input}>
        {reportData.date?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={styles.label}>Date:</Text>
      <Text style={styles.input}>
        {reportData.date?.toDate().toDateString()}
      </Text>
      <Text style={styles.label}>Donkey Owner Location:</Text>
      <Text style={styles.input}>
        Latitude: {reportData.location?.latitude || ''}
        {'\n'}
        Longitude: {reportData.location?.longitude || ''}
      </Text>
      <Text style={styles.label}>Actual Address:</Text>
      <Text style={styles.input}>
        {`${reportData.address?.street || ''}, ${reportData.address?.city || ''}, ${reportData.address?.postalCode || ''}, ${reportData.address?.region || ''}, ${reportData.address?.country || ''}`}
      </Text>
      <Text style={styles.label}>Owner Name:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.ownerName || ''}
        onChangeText={(text) => setReportData({ ...reportData, ownerName: text })}
      />

      <Text style={styles.label}>Donkey Count:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.donkeyCount?.toString() || ''}
        onChangeText={(text) => setReportData({ ...reportData, donkeyCount: Number(text) })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Male Adult Count:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.maleAdultCount?.toString() || ''}
        onChangeText={(text) => setReportData({ ...reportData, maleAdultCount: Number(text) })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Male Castrated Count:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.maleCastratedCount?.toString() || ''}
        onChangeText={(text) => setReportData({ ...reportData, maleCastratedCount: Number(text) })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Female Adult Count:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.femaleAdultCount?.toString() || ''}
        onChangeText={(text) => setReportData({ ...reportData, femaleAdultCount: Number(text) })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Male Foal Count:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.maleFoalCount?.toString() || ''}
        onChangeText={(text) => setReportData({ ...reportData, maleFoalCount: Number(text) })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Female Foal Count:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.femaleFoalCount?.toString() || ''}
        onChangeText={(text) => setReportData({ ...reportData, femaleFoalCount: Number(text) })}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Poor Health:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.poorHealth ? 'Yes' : 'No'}
        onChangeText={(text) => setReportData({ ...reportData, poorHealth: text === 'Yes' })}
      />

      <Text style={styles.label}>Photo:</Text>
      <Text style={styles.input}>
        {reportData.photo}
      </Text>

      <Text style={styles.label}>Owner Reports:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.ownerReports || ''}
        onChangeText={(text) => setReportData({ ...reportData, ownerReports: text })}
      />

      <Text style={styles.label}>Observations:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.observations || ''}
        onChangeText={(text) => setReportData({ ...reportData, observations: text })}
      />

      <Text style={styles.label}>Advice & Help:</Text>
      <TextInput
        style={styles.input}
        value={reportData?.adviceHelp || ''}
        onChangeText={(text) => setReportData({ ...reportData, adviceHelp: text })}
      />

      <Text style={styles.label}>Contact Vets:</Text>
      <Text style={styles.input}>
      {reportData?.contactVets.toString()}
      </Text>
       

      <Text style={styles.label}>Follow-up:</Text>
      <Text style={styles.input}>
        {reportData?.followUp.toString()}
      </Text>

      <Text style={styles.label}>Follow Up Date:</Text>
      <Text style={styles.input}>
        {reportData.date?.toDate().toDateString()}
      </Text>

      {/* Success Modal*/}
      <Modal isVisible={showSuccessModal}>
        <View
          style={{
            backgroundColor: '#009387',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Icon name="check" size={20} color="white" />
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 25 }}>
          Report Saved Successfully!
          </Text>
        </View>
      </Modal>

     
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveReport}
      >
         
        <Text style={styles.addButtonText}><Ionicons name="file-tray" size={20} color="white" />  Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009387',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#009387',
    borderRadius: 5,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default EditReportScreen;
