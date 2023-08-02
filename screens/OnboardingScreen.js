import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';

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
  const progress = new Animated.Value(0);

  const handleFinishOnboarding = () => {
    // You can add any functionality you want here, e.g., mark onboarding as completed in AsyncStorage.
    // For this example, we'll just navigate to the main app screen.
    navigation.navigate('Login');
  };

  const handleOnboardingChange = (index) => {
    Animated.timing(progress, {
      toValue: index,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const handleGetStarted = () => {
    handleFinishOnboarding();
  };

  const animatedCardStyle = {
    transform: [
      {
        scale: progress.interpolate({
          inputRange: slides.map((_, index) => index),
          outputRange: slides.map((_, index) => (index === 0 ? 1 : 0.8)),
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Swiper
        showsButtons={false}
        loop={false}
        onIndexChanged={handleOnboardingChange}
        containerStyle={styles.swiperContainer}
      >
        {slides.map((slide, index) => (
          <TouchableWithoutFeedback key={index} onPress={handleGetStarted}>
            <View style={styles.slide}>
              <Animated.View style={[styles.card, animatedCardStyle]}>
                <Ionicons name={slide.icon} size={80} color="white" style={styles.icon} />
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </Swiper>
      {progress._value === slides.length - 0 && (
        <TouchableWithoutFeedback onPress={handleGetStarted}>
          <View style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Get Started</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  swiperContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFA5',
    borderRadius: 16,
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
    marginBottom: 60,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009387',
  },
});

export default OnboardingScreen;
