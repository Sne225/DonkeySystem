import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  Button,
  TouchableOpacity,
  Image,
  Alert, ActivityIndicator,StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore } from '../firebase';
import { collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Camera } from 'expo-camera'; // Import Camera from expo-camera
import * as Location from "expo-location";
import MapPopup from './MapPopup';
import axios from 'axios';




//Functional Component of CreateReport Screen
const CreateReportScreen = ({ route }) => {
  const { userName, userSurname } = route.params;
  //States for the screen
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  // const [address, SetAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [donkeyCount, setDonkeyCount] = useState(0);
  const [maleAdultCount, setMaleAdultCount] = useState(0);
  const [maleCastratedCount, setMaleCastratedCount] = useState(0);
  const [femaleAdultCount, setFemaleAdultCount] = useState(0);
  const [maleFoalCount, setMaleFoalCount] = useState(0);
  const [femaleFoalCount, setFemaleFoalCount] = useState(0);
  const [poorHealth, setPoorHealth] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [ownerReports, setOwnerReports] = useState('');
  const [observations, setObservations] = useState('');
  const [adviceHelp, setAdviceHelp] = useState('');
  const [contactVets, setContactVets] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);
  const navigation = useNavigation();

  //Shows current date but can be changed upon click
  const handleDateChange = (event, selectedDate) => {2 
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  //A hook that requests camera permission
  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraPermissionStatus.status === 'granted');
    })();
  }, []);

  //Open map
  const openMapPopup = () => {
    setIsMapVisible(true);
  };
 
  //Close map
  const closeMapPopup = () => {
    setIsMapVisible(false);
  };



  useEffect(() => {
    // Function to fetch location data

    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: locationData.coords.latitude.toString(),
          longitude: locationData.coords.longitude.toString(),
        });

        // Reverse geocode the coordinates to get the address
        let addressData = await Location.reverseGeocodeAsync({
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        });

        // Extract and set the address details
        setAddress({
          street: addressData[0].street,
          postalCode: addressData[0].postalCode,
          city: addressData[0].city,
          region: addressData[0].region,
          country: addressData[0].country,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
        setAddress({ street: '', postalCode: '', city: '', region: '', country: '' });
      }
    };

    // Fetch location immediately when the component mounts
    fetchLocation();

    // Set up an interval to refresh location every 30 seconds (adjust as needed)
    const refreshInterval = setInterval(() => {
      fetchLocation();
    }, 10000); // 10 seconds in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(refreshInterval);
  }, []);


  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  //A function to pick an image and validate permission.
  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraPermissionStatus.status === 'granted');
    })();
  }, []);

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant access to your photo library to pick an image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        // setPhoto(result.uri);
        if (result.assets && result.assets.length > 0) {
          // The selected image is now accessed through the "assets" array
          const selectedAsset = result.assets[0];
          setPhoto(selectedAsset.uri);
      }
    }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef) {
      try {
        const photoData = await cameraRef.takePictureAsync({ quality: 0.7 });
        setPhoto(photoData.uri);
        setShowCamera(false); // Close the camera view after taking a picture
      } catch (error) {
        console.log('Error taking picture:', error);
      }
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
  };

  const calculateTotalDonkeyCount = () => {
    const total = maleAdultCount + maleCastratedCount + femaleAdultCount + maleFoalCount + femaleFoalCount;
    setDonkeyCount(total);
  };
  

  useEffect(() => {
    calculateTotalDonkeyCount();
  }, [maleAdultCount, maleCastratedCount, femaleAdultCount, maleFoalCount, femaleFoalCount]);

  const storage = getStorage();

  const createReportCollection = async (userId) => {
    const userDocRef = doc(firestore, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);
  
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, {});
    }
  
    const reportCollectionRef = collection(userDocRef, 'reports');
    // You don't need to check if the collection exists because it will be created automatically when you add a document to it.
    return reportCollectionRef;
  };

  //Show alert for Observation completion
  useEffect(() => {
    if (poorHealth) {
      const msg = "Please complete the signs of poor health on the observation field.";
      Alert.alert("Complete Observation Field", msg);
    }
  }, [poorHealth]);  



    // Save the report data to Firestore
    const handleSubmit = async () => {
    //Loading
    setIsLoading(true);

    


  // Validate the required fields and store the missing field names in an array
    const missingFields = [];
  if (!date) missingFields.push('Date');
  if (!location) missingFields.push('Location');
  if (!ownerName) missingFields.push('Name of Donkey Owner');

  // Check if there are any missing fields
  if (missingFields.length > 0) {
    // Construct the error message with the missing field names
    const errorMessage = `Please fill in the following required fields: ${missingFields.join(', ')}`;
    Alert.alert('Missing Fields', errorMessage);
    setIsLoading(false);
    return;
  }
  
    let photoUrl = null;
     if (photo) {
      const photoRef = ref(storage, `photos/${Date.now()}`);
    
      try {
        const response = await fetch(photo);
        const blob = await response.blob();
    
        // Upload the image blob with the correct content type
        await uploadBytes(photoRef, blob, { contentType: response.headers.get('content-type') });
    
        photoUrl = await getDownloadURL(photoRef);
      } catch (error) {
        console.error('Error reading or uploading image:', error);
      }
    }
   
  
    const reportData = {
      date: Timestamp.fromDate(new Date(date)), // Convert date to Firestore timestamp
      ownerName,
      location,
      address,
      donkeyCount: Number(donkeyCount), // Convert to a number if needed
      maleAdultCount: Number(maleAdultCount),
      maleCastratedCount: Number(maleCastratedCount),
      femaleAdultCount: Number(femaleAdultCount),
      maleFoalCount: Number(maleFoalCount),
      femaleFoalCount: Number(femaleFoalCount),
      poorHealth,
      photo: photoUrl,
      ownerReports,
      observations,
      adviceHelp,
      contactVets,
      followUp,
      followUpDate: followUpDate ? Timestamp.fromDate(new Date(followUpDate)) : null,
    };
  
    if (contactVets) {
      await sendEmail(reportData);
    }
    // Save the report data to Firestore with the current user's ID
    const currentUser = auth.currentUser;
    const userId = currentUser ? currentUser.uid : null;

  
    if (userId) {
      try {
        const reportCollectionRef = await createReportCollection(userId);
  
        // const docRef = await setDoc(doc(reportCollectionRef), reportData);
        await setDoc(doc(reportCollectionRef), reportData);
      console.log('Report created successfully.');
  
        // Reset the form after submitting
        setDate(new Date());
        setOwnerName('');
        setLocation('');
        setAddress('');
        setDonkeyCount(0);
        setMaleAdultCount(0);
        setMaleCastratedCount(0);
        setFemaleAdultCount(0);
        setMaleFoalCount(0);
        setFemaleFoalCount(0);
        setPoorHealth(false);
        setPhoto(null);
        setOwnerReports('');
        setObservations('');
        setAdviceHelp('');
        setContactVets(false);
        setFollowUp(false);
        setFollowUpDate(null);
      } catch (error) {
        console.error('Error creating report:', error);
        
        setIsLoading(false);
        // Handle any error cases
      } finally {
        // isLoading to false when the submission process completes
        setIsLoading(false);
        setIsSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitSuccess(false);
      navigation.navigate("Home");
    }, 2500);
      }
      
    }
  };

  const sendEmail = async (reportData) => {
    
      // Convert the report data to a formatted string
      const reportDataString = JSON.stringify(reportData, null, 2);
      const uniqueId = Date.now().toString();
      const subject = `Emergency Notification - ${uniqueId}`;
  
      const response = await axios.post(
        'https://api.sendinblue.com/v3/smtp/email',
        {
          sender: { name: 'DCW APP Notification', email: 'DCW.Userreport@gmail.com' },
          to: [{ email: 'protectorpeace@gmail.com' }],
          subject: subject,
          htmlContent: `
            <html>
              <body>
                <p>Good day, I hope this email finds you well.</p><br>
                <p>Please note this report requires attention and a <span style="font-weight:bold">Veterinarian has been requested</span>. Have a look at the report data below:</p><br>
                
                <p> <span style="font-weight:bold">Report Submitted Time:</span> ${reportData.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <p> <span style="font-weight:bold">Name of Worker:</span> ${userName} ${userSurname}</p>
                <p> <span style="font-weight:bold">Date:</span> ${reportData.date.toDate().toDateString()}</p>
                <p> <span style="font-weight:bold">Location of Donkey Owner:</span> Latitude: ${reportData.location.latitude}, 
                Longitude: ${reportData.location.longitude}</p>
                <p> <span style="font-weight:bold">Reverse Geocoded Location:</span> ${reportData.address.street}, 
                ${reportData.address.city}, ${reportData.address.postalCode}, ${reportData.address.region}, 
                ${reportData.address.country}</p>
                <p> <span style="font-weight:bold">Number of Donkeys Owned:</span> ${donkeyCount}</p>
                <p> <span style="font-weight:bold">Number of Adult Males (Not Castrated):</span> ${maleAdultCount}</p>
                <p> <span style="font-weight:bold">Number of Adult Castrated Males:</span> ${maleCastratedCount}</p>
                <p> <span style="font-weight:bold">Number of Adult Females:</span>${femaleAdultCount}</p>
                <p> <span style="font-weight:bold">Number of Male Foals:</span> ${maleFoalCount}</p>
                <p> <span style="font-weight:bold">Number of Female Foals:</span> ${femaleFoalCount}</p>
                
                <p> <span style="font-weight:bold">Any donkey showing poor signs of health?</span> ${poorHealth}</p><br>
                
                <p style="font-weight:bold">Picture of Donkey:
                <img src="${reportData.photo}" alt="Donkey Image" style="width: 300px; height: 300px; display: block;">
                <br>
                
                <p> <span style="font-weight:bold">Owner Report:</span> ${ownerReports}</p>
                <p> <span style="font-weight:bold">Observations:</span> ${observations}</p>
                <p> <span style="font-weight:bold">Advices & Help:</span> ${adviceHelp}</p>
                <p> <span style="font-weight:bold">Followup Date:</span> ${reportData.followUpDate.toDate().toDateString()}</p><br>
                
                <p>Please respond promptly as the user indicated that a <span style="font-weight:bold">Veterinarian has been requested.</span>.</p>
                <p>Kind Regards,</P>
                <p style="font-weight:bold">DCW APP</p>
                <img src="https://i.ibb.co/Kmbwqf8/icon.png" alt="Donkey Image" style="width: 45px; height: 45px; display: block;">
              </body>
            </html>
          `,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': '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',
          },
        }
      );
      
      if (response.status === 201) {
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email. Response:', response.data);
      }
      
  };

  const fullAddress = `${address.street}, ${address.city}, ${address.region}, ${address.postalCode}, ${address.country}`;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}><Text style={styles.label}>Date</Text> {date.toDateString()}</Text>
        
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity style={styles.mapButton} onPress={openMapPopup}>
        <Text style={styles.mapText}>Open Map</Text>
      </TouchableOpacity>

      {currentLocation && (
        <Text>Selected Location: {currentLocation.latitude}, {currentLocation.longitude}</Text>
        
      )}

      {selectedLocation && (
        <Text>Selected Location: {selectedLocation.latitude}, {selectedLocation.longitude}</Text>
        
      )}
      <MapPopup
        isVisible={isMapVisible}
        onClose={closeMapPopup}
        onLocationSelect={() => {}}
        style={styles.mapButton}
      />
      </View>

      <View style={styles.fieldContainer}>
      <Text style={styles.label}>Name of Donkey Owner</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the name"
          value={ownerName}
          onChangeText={setOwnerName}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location of Donkey Owner Property</Text>
        {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter the location"
          value={`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
          editable={false} // Set to false to make it read-only
        />
      )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Reverse Geocoded Address</Text>
        {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <TextInput
            style={styles.input}
            placeholder="Address"
            value={`${fullAddress}`}
            multiline={true}
            editable={false}
          />
      )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Number of Donkeys Owned</Text>
        <View style={styles.totalNumber}>
    
          <Text style={styles.counterText}>{donkeyCount}</Text>
         
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Number of Adult Males (Not castrated)</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setMaleAdultCount(maleAdultCount > 0 ? maleAdultCount - 1 : 0)}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterText}>{maleAdultCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setMaleAdultCount(maleAdultCount + 1)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Number of Adult Castrated Males</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setMaleCastratedCount(maleCastratedCount > 0 ? maleCastratedCount - 1 : 0)}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterText}>{maleCastratedCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setMaleCastratedCount(maleCastratedCount + 1)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Number of Adult Females</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setFemaleAdultCount(femaleAdultCount > 0 ? femaleAdultCount - 1 : 0)}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterText}>{femaleAdultCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setFemaleAdultCount(femaleAdultCount + 1)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Number of Male Foals</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setMaleFoalCount(maleFoalCount > 0 ? maleFoalCount - 1 : 0)}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterText}>{maleFoalCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setMaleFoalCount(maleFoalCount + 1)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Number of Female Foals</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setFemaleFoalCount(femaleFoalCount > 0 ? femaleFoalCount - 1 : 0)}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.counterText}>{femaleFoalCount}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => setFemaleFoalCount(femaleFoalCount + 1)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Repeat the above pattern for other fields */}

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Are There Donkeys Showing Signs of Poor Health?</Text>
        <Switch value={poorHealth} onValueChange={setPoorHealth} />
      </View>
      


      {/* Camera Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Take a Photo of the Donkey</Text>
        <TouchableOpacity style={styles.photoButton} onPress={handleImagePick}>
          {/* {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          ) : (
          )} */}
          <Text style={styles.photoButtonText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={() => setShowCamera(true)}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoPreview} />
          ) : (
            <Text style={styles.photoButtonText}>Take Photo</Text>
          )}
        </TouchableOpacity>
        {photo && (
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handleRemovePhoto}
          >
            <Ionicons name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        {showCamera && cameraPermission && (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.cameraPreview}
              type={cameraType}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.cameraControlButton}
                  onPress={handleTakePicture}
                >
                  <Ionicons name="camera" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cameraControlButton}
                  onPress={() =>
                    setCameraType(
                      cameraType === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    )
                  }
                >
                  <Ionicons name="camera-reverse" size={32} color="white" />
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        )}
      </View>

      {/* Owner Reports */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Owner Reports</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the owner reports"
          value={ownerReports}
          onChangeText={setOwnerReports}
          multiline
        />
      </View>

      {/* Observations */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Observations</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your observations"
          value={observations}
          onChangeText={setObservations}
          multiline
        />
      </View>

      {/* Advice */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Advices & Help</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your advice or help given"
          value={adviceHelp}
          onChangeText={setAdviceHelp}
          multiline
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Did You Need to Contact the Vets?</Text>
        <Switch value={contactVets} onValueChange={setContactVets} />
      </View>

      {/* Follow-up */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Have You Scheduled a Follow-up Visit?</Text>
        <Switch value={followUp} onValueChange={setFollowUp} />
      </View>

      {followUp && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date of Follow-up Visit</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>
              {followUpDate ? followUpDate.toDateString() : 'Select a date'}
            </Text>
            {showDatePicker && (
              <DateTimePicker
                value={followUpDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || followUpDate;
                  setShowDatePicker(false);
                  setFollowUpDate(currentDate);
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      )}

      <Modal isVisible={isSubmitSuccess}>
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
            Report Submitted!
          </Text>
        </View>
      </Modal>

      {/* Render the loading screen when isLoading is true */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009387" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="rocket" size={24} color="white" />
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#009387',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  mapButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#009387",
    color: "white",
  },
  mapText: {
    color: "#fff"
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
  },
  totalNumber: {
    borderWidth: 1,
    borderColor: '#009387',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 25,
    width: "23%",
    marginBottom: -8,
    marginLeft: 3,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    backgroundColor: '#009387',
    borderRadius: 15,
    padding: 5,
    marginHorizontal: 5,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  photoButton: {
    backgroundColor: '#009387',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100, // Adjust this value as needed
  },
  successMessageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#009387',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 60,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: 'white',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  cameraPreview: {
    flex: 1,
    width: '100%',
    height: 450,
    marginBottom: 10,
  },
  cameraControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraControlButton: {
    padding: 10,
  },  
};

export default CreateReportScreen;
