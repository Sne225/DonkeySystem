import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');


const NotificationsScreen = () => {

  const navigation = useNavigation();

    return (
      <View style={styles.container}>
      <Text style={styles.heading}>Your Notifications</Text>

      <View style={styles.lottie}>
      <Text style={styles.noReportsText}>You currently do not have any notifications. </Text>
          <LottieView source={require('../assets/animations/notifications.json')}
          autoPlay loop />
    </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >

        <Text style={styles.backButtonText}><Ionicons name="arrow-back" size={17} color="white" />  Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};


export default NotificationsScreen

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
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row', // Align icon and text horizontally
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10, // Add some space between the icon and text
  },
  lottie:{
    width: width*0.9-50,
    height: width,
    marginLeft: 30,
},
noReportsText: {
  fontSize: 18,
  color: 'black',
  textAlign: 'center',
  marginBottom: 20,
},
});
