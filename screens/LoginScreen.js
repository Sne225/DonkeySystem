import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; // Assuming you have the vector icons library installed
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {auth } from '../firebase';

const facebookIcon = require('../assets/facebook.png');
const googleIcon = require('../assets/google.png');


const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    {
     // const auth = getAuth();
 
     // Sign in the user using Firebase Authentication
     if (email.trim() === '') {
       Alert.alert('Error Login', 'Please enter your email address 📧');
       return;
     }

     if (!isValidEmail(email)) {
       Alert.alert('Error Login', 'Please enter a valid email address 🙂');
       return;
     }
 
     if (password.trim() === '') {
       Alert.alert('Error Login', 'Please enter a password 🔑');
       return;
     }

     if (password.length < 6)
     {
       Alert.alert('Error Login', 'Password short. Please enter at least characters! 🔢');
       return;
     }

     await signInWithEmailAndPassword(auth, email, password)
     .then(userCredentials => {
       const user = userCredentials.user;

       setShowSuccessModal(true);
   setTimeout(() => {
     setShowSuccessModal(false);
     navigation.replace("Home");
   }, 2500);
       console.log('Logged in with:', user.email);
   })
     // Navigate to the next screen
     // navigate('NextScreen');
   .catch(error => {
     
     // Handle sign-in error, such as displaying an error message
     if (error.code === 'auth/invalid-email') {
       Alert.alert('Error Login', 'Your email is invalid. Please try again. ❌');
     } else if (error.code === 'auth/wrong-password') {
       Alert.alert('Error Login', 'Incorrect Password. Please try again. ❌');
     } else if (error.code === 'auth/operation-not-allowed') {
       Alert.alert('Error Login', 'Email/password sign-in is not enabled');
     }  else if (error.code === 'auth/user-not-found') {
       Alert.alert('Error Login', 'This user does not exist. Please try again. 💀');
     } else if (error.code === 'auth/too-many-requests') {
       Alert.alert('Account Temporary Locked', 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. 😔');
     } else {
       Alert.alert('Error', 'Login failed');
     }
     console.log(error);
   });
 }};

 //Validation of email address
 const isValidEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
 };
 
 //Navigate to create account screen
 const handleCreateAccount = () => {
   navigation.navigate('CreateAccount');
 };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.heading}>Hi, Welcome Back👋</Text>
      <Text style={styles.subHeading}>Hello again. You have been missed!</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordInput}>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#009783"
            />
          </TouchableOpacity>
        </View>
        </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox}>
          {/* Implement your checkbox logic here */}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Remember Me</Text>
        <Text style={styles.forgotPassword}>Forgot Password</Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

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
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 30 }}>
            Successfully signed in!
          </Text>
        </View>
      </Modal>

      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>Or Login With</Text>
        <View style={styles.separator} />
      </View>

      {/* Other components */}
      <View style={styles.socialButtonContainer}>
        <TouchableOpacity style={[styles.socialButton, { borderColor: 'lightgrey' }]} onPress={()=>{}}>
          <View style={styles.iconContainer}>
            <Image source={facebookIcon} style={styles.icon} />
          </View>
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { borderColor: 'lightgrey' }]} onPress={()=>{}}>
          <View style={styles.iconContainer}>
            <Image source={googleIcon} style={styles.icon} />
          </View>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signUpText}>
        Don't have an account? 
        <Text style={styles.signUpLink} onPress={handleCreateAccount}> Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  
  header: {
    marginBottom: 20,
    alignItems: 'center', // Center the content horizontally
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 14,
    color: 'grey',
    fontWeight: 'bold',
    marginTop: 5, 
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontWeight: 'bold',
  },
  input: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    padding: 10,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginRight: 10,
  },
  checkboxLabel: {
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: 'red',
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#009387',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: 'lightgrey',
  },
  separatorText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  socialButton: {
    marginTop:10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 30,
    paddingVertical:15,

  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  socialButtonText: {
    fontWeight: 'bold',
  },
  signUpText: {
    textAlign: 'center',
    justifyContent: "center",
    fontSize: 16,
    position: 'relative',
    top: 100, // Change this value to move the text to a different position from the top
    left: 0,
    color: "grey"
   
  },
  signUpLink: {
    color: '#009387',
    fontWeight: 'bold',
  },
   passwordInput: {
    flexDirection: 'row',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    padding: 10,
    fontWeight: 'bold'
  },
  eyeIcon: {
    marginLeft: 135,
  },
});

export default LoginScreen;
