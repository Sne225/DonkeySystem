import React from 'react';
import { View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Demo = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Open Drawer" onPress={openDrawer} />
      <Icon name="menu-outline" size={30} onPress={openDrawer} />
    </View>
  );
};

export default Demo;
