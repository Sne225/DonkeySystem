import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { CheckBox } from 'react-native-check-box';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { Feather, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import { Checkbox } from 'react-native-paper';

const facebookIcon = require('../assets/facebook.png');
const googleIcon = require('../assets/google.png');


const CreateAccountScreens = () => {
  
  const navigation = useNavigation();



  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const handleSignUp = async () => {
    try {

      if (name.trim() === '') {
        Alert.alert('Name Not Entered', 'Please enter your name');
        return;
      }
      if (surname.trim() === '') {
        Alert.alert('Surname Not Entered', 'Please enter your surname');
        return;
      }
      if (email.trim() === '') {
        Alert.alert('Email Not Entered', 'Please enter your email address 📧');
        return;
      }
 
      if (!isValidEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }

      if (city.trim() === '') {
        Alert.alert('City Not Entered', 'Please enter your city 📍');
        return;
      }
  
      if (password.trim() === '') {
        Alert.alert('Password Empty', 'Please enter a password 🔑');
        return;
      }
 
      if (password.length < 6)
      {
        Alert.alert('Password Too Short', 'Please enter at least 6 characters');
        return;
      }
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
      setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.navigate("Home");
        }, 2500);

    } catch (error) {
      // Handle sign-up error, such as displaying an error message
      console.log('Error creating user:', error);
    }
  };

  const handleCheckboxPress = () => {
    setAgreeToTerms(!agreeToTerms);
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.header}></View>
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account 🐴</Text>
      <Text style={styles.subHeading}>Join the best community!</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Surname</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your surname"
          onChangeText={setSurname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your city"
          onChangeText={setCity}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordInput}>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <View style={styles.checkboxContainer}>
      <TouchableOpacity style={[styles.checkbox, agreeToTerms && styles.checked]} onPress={handleCheckboxPress}>
        {agreeToTerms && <Feather name="check" size={18} color="white" />}
      </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

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
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
            Account Created Successfully!
          </Text>
        </View>
      </Modal>

      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>or sign up with</Text>
        <View style={styles.separator} />
      </View>

      <View style={styles.socialButtonContainer}>
        <TouchableOpacity style={[styles.socialButton, { borderColor: 'lightgrey' }]} onPress={() => {}}>
          <View style={styles.iconContainer}>
            <Image source={facebookIcon} style={styles.icon} />
          </View>
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { borderColor: 'lightgrey' }]} onPress={() => {}}>
          <View style={styles.iconContainer}>
            <Image source={googleIcon} style={styles.icon} />
          </View>
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center', // Center the content horizontally
  },
    scrollViewContent: {
      flexGrow: 1,
      paddingVertical: 20,
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
  checked: {
    backgroundColor: '#009387',
    borderColor: 'white',
  },
  signUpButton: {
    backgroundColor: '#009387',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
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
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 30,
    paddingVertical: 15,
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
  passwordInput: {
    flexDirection: 'row',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    padding: 10,
    fontWeight: 'bold',
  },
});

export default CreateAccountScreens;
