import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: 'Welcome to Donkey Reporting',
    description: 'Your ultimate app for reporting donkey sightings!',
    icon: 'md-browsers',
  },
  {
    title: 'Easy Reporting',
    description: 'Reporting donkey sightings has never been easier!',
    icon: 'md-checkmark-circle-outline',
  },
  {
    title: 'Join the Community',
    description: 'Join our community of donkey enthusiasts and help us track their movements!',
    icon: 'md-people',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const onboardingStatus = await AsyncStorage.getItem('onboardingDone');
      setIsOnboardingDone(onboardingStatus === 'true');
      
    } catch (error) {
      console.error('Error reading onboarding status:', error);
    }
  };

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingDone', 'true');
      setIsOnboardingDone(true);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

 

  return (
    <View style={styles.container}>
      <Swiper showsButtons={false} loop={false}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Ionicons name={slide.icon} size={80} color="white" style={styles.icon} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            {index === slides.length - 1 && (
              <TouchableOpacity style={styles.finishButton} onPress={handleFinishOnboarding}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
  },
  finishButton: {
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  buttonText: {
    color: '#009387',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
