import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import firebase, { createUserWithEmailAndPassword } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';

const CreateAccountScreen = () => {

  const navigation = useNavigation();


  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const auth = getAuth();
  
      // Create the user account using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
    })
  
      const user = auth.currentUser;
      const uid = user.uid;
  
      const firestore = getFirestore();
  
      // Store the additional user data in Firestore
      const userRef = doc(firestore, 'users', uid);
      await setDoc(userRef, {
        name,
        surname,
        email,
        city,
      });
  
      // Display success message or navigate to the next screen
      navigation.navigate('Home');

    } catch (error) {
      // Handle sign-up error, such as displaying an error message
      console.log('Error creating user:', error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>

      <View style={styles.fieldContainer}>
        <FontAwesome name="user" size={20} color="#009387" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.fieldContainer}>
        <FontAwesome name="user" size={20} color="#009387" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Surname"
          value={surname}
          onChangeText={setSurname}
        />
      </View>

      <View style={styles.fieldContainer}>
        <FontAwesome name="envelope" size={15} color="#009387" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.fieldContainer}>
        <FontAwesome name="map-marker" size={24} color="#009387" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="City Name"
          value={city}
          onChangeText={setCity}
        />
      </View>

      <View style={styles.fieldContainer}>
        <FontAwesome name="lock" size={20} color="#009387" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.socialButtonContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#009387" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={20} color="#009387" />
        </TouchableOpacity>
      </View>

      <Text style={styles.signUpText}>Sign up with a different account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 40,
    fontWeight: '900',
    color: '#009387',
    marginBottom: 70,
    textAlign: 'center',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#009387',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialButtonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  socialButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default CreateAccountScreen;
