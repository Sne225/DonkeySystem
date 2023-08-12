import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import firebase, { createUserWithEmailAndPassword } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

const CreateAccountScreenNew = () => {
  return (
    <View>
      <Text>CreateAccountScreenNew</Text>
    </View>
  )
}


const styles = StyleSheet.create({})

export default CreateAccountScreenNew