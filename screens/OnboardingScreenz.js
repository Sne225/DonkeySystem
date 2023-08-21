import { View, Text, StyleSheet, Dimensions, TouchableOpacity, LogBox } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
LogBox.ignoreLogs(['ViewPropTypes']);
// import { setItem } from '../utils/asyncStorage';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{
        navigation.navigate('Login');
        // setItem('onboarded', '1');
    }

  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            bottomBarHighlight={false}
            containerStyles={{paddingHorizontal: 15}}
            titleStyles={{color: "white"}}
            subTitleStyles={{color: "white"}}
            pages={[
                {
                    backgroundColor: '#E3B448',
                    image: (
                        <View style={styles.lottie}>
                            <LottieView source={require('../assets/animations/insight.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Welcome to Donkey Reporting',
                    subtitle: 'Your ultimate app for reporting donkey sightings!',
                },
                {
                    
                    backgroundColor: '#317773',
                    image: (
                        <View style={styles.lottie}>
                            <LottieView source={require('../assets/animations/easy.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Easy Reporting',
                    subtitle: 'Reporting donkey sightings has never been easier!',

                },
                {
                    backgroundColor: '#101820',
                    image: (
                        <View style={styles.lottie}>
                            <LottieView source={require('../assets/animations/community.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Join the Community',
                    subtitle: 'Join our community of donkey enthusiasts and help us track their movements!',
                },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width
    },
    doneButton: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: '100%',
        borderBottomLeftRadius: '100%'
    }
})