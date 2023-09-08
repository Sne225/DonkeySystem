import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, FAB } from 'react-native-paper';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Firebase authentication listener
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Function to get the current time and set the time-based greeting
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();

      let greetingText = '';
      if (hours >= 5 && hours < 12) {
        greetingText = 'Good morning';
      } else if (hours >= 12 && hours < 17) {
        greetingText = 'Good afternoon';
      } else {
        greetingText = 'Good evening';
      }

      setCurrentTime(`${hours}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`);
      setGreeting(greetingText);
    };

    // Update the current time and greeting every minute
    getCurrentTime();
    const intervalId = setInterval(getCurrentTime, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Greeting Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Hello, {user ? user.displayName || 'Guest' : 'Guest'}</Title>
          <Paragraph>{greeting}</Paragraph>
          <Paragraph>Let's get to work</Paragraph>
          <Paragraph>{currentTime}</Paragraph>
        </Card.Content>
      </Card>

      {/* To-Do Tasks Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>To Do Tasks</Title>
          <Button mode="contained" onPress={() => {/* Handle button press */}}>
            Create New Report
          </Button>
        </Card.Content>
      </Card>

      {/* Ongoing Tasks Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Ongoing Tasks</Title>
          {/* Display at least 2 recently submitted reports here */}
          <Card>
            <Card.Content>
              <Title>Report 1</Title>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content>
              <Title>Report 2</Title>
            </Card.Content>
          </Card>
        </Card.Content>
      </Card>

      {/* User Profile Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>User Profile</Title>
          {/* Add user profile details here */}
        </Card.Content>
      </Card>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => {/* Handle FAB press */}}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Cloud white background
    padding: 16,
  },
  card: {
    marginVertical: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
