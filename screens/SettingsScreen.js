import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking, ToastAndroid  } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Replace with your vector icon library
import { auth, firestore } from '../firebase';
import { useNavigation } from '@react-navigation/core';

const SettingsScreen = () => {

    const navigation = useNavigation();
    const timestamp = new Date().toLocaleString();


    const notifications = () => {
      navigation.navigate("Notifications")
    }

    const handleReport = () => {
      // Generate a timestamp in the format you prefer
      const timestamp = new Date().toLocaleString();
    
      Alert.alert(
        'About',
        'If you encounter any problems (please include screenshots) or have suggestions, please feel free to contact us via email.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Email Now',
            onPress: () => {
              // Specify the recipient email address, subject with the timestamp, and body message
              const recipientEmail = 'dcwuserreport@gmail.com';
              const subject = `Reporting an Issue - ${timestamp}`;
              const body = 'Describe your issue below:\n\n';
    
              // Create the email URL with recipient, subject, and body
              const emailUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    
              // Open the default email client with the pre-filled draft
              Linking.openURL(emailUrl)
                .then(() => {
                  // Show a "Thank you" message
                  ToastAndroid.show('Thank you for your feedback!', ToastAndroid.SHORT);
                })
                .catch((error) => {
                  console.error('Error opening email client:', error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    };
  

    const handleAbout= () => {
      Alert.alert(
        'About Donkey App',
    'Donkey App is a mobile application designed to help users manage their tasks and stay organized.\n\n' +
      'We are committed to making your life easier by providing a simple and effective task management solution. Thank you for choosing Donkey App!\n\n'+
      'Version: 1.0 \n' + 
      'SDK: 2.3.1.3',
    [
          {
            text: 'OK',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        { cancelable: false }
      );
    };



    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
              {
                text: 'No',
                style: 'cancel',
              },
              {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    auth
                    .signOut()
                    .then(() => {
                      navigation.replace('Login');
                    })
                    .catch(error => alert(error.message));
                },
              },
            ],
            { cancelable: true }
          );
       
      };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.separator} />
      <Text style={styles.sectionHeading}>General</Text>
      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="person" size={24} color="#009387" />
        <Text style={styles.optionText}>Account Information</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="location-on" size={24} color="#009387" />
        <Text style={styles.optionText}>Address Information</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="palette" size={24} color="#009387" />
        <Text style={styles.optionText}>Appearance</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.option} onPress={notifications} >
        <MaterialIcons name="notifications" size={24} color="#009387" />
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <Text style={styles.sectionHeading}>Support</Text>
      <TouchableOpacity style={styles.option} onPress={handleReport}>
        <MaterialIcons name="bug-report" size={24} color="#009387" />
        <Text style={styles.optionText}>Report an Issue</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.option}>
        <MaterialIcons name="help-outline" size={24} color="#009387" />
        <Text style={styles.optionText}>FAQ</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.option} onPress={handleAbout}>
        <MaterialIcons name="info" size={24} color="#009387" />
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={handleSignOut}style={styles.logoutButton}>
        <MaterialIcons name="logout" size={24} color="white" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#009387',
    marginTop: 20,
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SettingsScreen;
