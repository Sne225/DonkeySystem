import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, interpolate, Extrapolate,} from 'react-native-reanimated';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {auth } from '../firebase';

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logoScale = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, {
      duration: 4000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  useEffect(() => {
    // const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home")
      }
    })

    return unsubscribe
  }, [])

  const handleSignIn = async () => {
     {
      // const auth = getAuth();
  
      // Sign in the user using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        Alert.alert('Success', 'Logged in successfully');
        console.log('Logged in with:', user.email);
    })
      // Navigate to the next screen
      // navigate('NextScreen');
    .catch(error => {
      // Handle sign-in error, such as displaying an error message
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Wrong password');
      } else if (error.code === 'auth/operation-not-allowed') {
        Alert.alert('Error', 'Email/password sign-in is not enabled');
      } else {
        Alert.alert('Error', 'Login failed');
      }
      console.log(error);
    });
  }};
  

  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(logoScale.value, [0, 1], [0.5, 1], Extrapolate.CLAMP);
    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.container}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require('./iconn.png')}
          style={styles.logo}
        />
      </Animated.View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#009387' }]}
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: 'white' }]}
        onPress={handleCreateAccount}
      >
        <Text style={[styles.buttonText, { color: '#009387' }]}>Create Account</Text>
      </TouchableOpacity>
      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#009387' }]}>
          <FontAwesome name="facebook" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#009387' }]}>
          <FontAwesome name="google" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.signInText}>Sign in with a different account</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  signInText: {
    fontSize: 14,
    color: '#555',
  },
});

export default LoginScreen;
