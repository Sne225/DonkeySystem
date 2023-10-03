import React, { useState, useEffect } from 'react';
import { Modal, View, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapPopup = ({ isVisible, onClose, onLocationSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);

  useEffect(() => {
    // Function to get the current location and address
    const getLocationAsync = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const location = await Location.watchPositionAsync(
        { enableHighAccuracy: true, timeInterval: 5000 },
        async (location) => {
          setCurrentLocation(location.coords);

          // Use reverse geocoding to get the address for the detected location
          const address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          // Format the address as a string (you can customize this)
          const formattedAddress = `${address[0].name}, ${address[0].city}, ${address[0].region}, ${address[0].country}`;
          setCurrentAddress(formattedAddress);
        }
      );
    };

    // Call the function to get the current location and address when the component mounts
    getLocationAsync();
  }, []); // Empty dependency array means this effect runs only once on mount

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleUseLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation, currentAddress);
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          onPress={handleMapPress}
          initialRegion={
            currentLocation
              ? {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : null
          }
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
              pinColor="blue"
            />
          )}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
            />
          )}
        </MapView>
        <Text>Detected Address: {currentAddress}</Text>
        <Button
          title="Use this location"
          onPress={handleUseLocation}
        />
        <Button
          title="Close"
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

export default MapPopup;
