import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, firestore } from '../firebase'
import { collection, doc, getDoc  } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core'

const HomeScreen = () => {

  const navigation = useNavigation()

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => {
             navigation.replace("Login")
        })
        .catch(error => alert(error.messagw))
    };

    const handleCreateReport = () => {
      navigation.navigate('CreateReport');
    };
    const handleViewReports = () => {
      navigation.navigate('ViewReports');
    };
    
    const [userName, setUserName] = useState('');
    
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
          }
        } catch (error) {
          console.error('Error getting user data:', error);
        }
      };
  
      getUserData();
    }, []);;

  return (
    <View style={styles.container}>
      <Text style={styles.greetText}>Hi, <Text style={styles.nameText}>{userName ? userName : 'Loading...'}!</Text></Text>
      <TouchableOpacity onPress={handleCreateReport} style={styles.button}>
      <Text style={styles.buttonText}>Create A Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={handleViewReports}
        style={styles.button }
      >
        <Text style={styles.buttonText}>View Reports</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={handleSignOut}
        style={styles.button }
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor:'#009387',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40
    
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
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
})