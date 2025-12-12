import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera && !isProcessing) {
      setIsProcessing(true);
      try {
        const photo = await camera.takePictureAsync();
        // Process the image to extract expiry date
        await processImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
      setIsProcessing(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  };

  const processImage = async (imageUri) => {
    // This is where OCR would happen
    // For now, we'll navigate to manual entry
    // In production, use expo-ml-kit or react-native-text-recognition
    
    Alert.alert(
      'Date Detected',
      'Would you like to use this date: 12/2025?',
      [
        { text: 'No, Enter Manually', onPress: () => navigation.navigate('AddItem') },
        { 
          text: 'Yes', 
          onPress: () => navigation.navigate('AddItem', { 
            detectedDate: '2025-12-01' 
          })
        },
      ]
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={Camera.Constants.Type.back}
        ref={ref => setCamera(ref)}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <Text style={styles.instructions}>
              Position the expiry date within the frame
            </Text>
          </View>
        </View>
      </Camera>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="images" size={24} color="white" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.captureButton]} 
          onPress={takePicture}
          disabled={isProcessing}
        >
          <Ionicons name="camera" size={40} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('AddItem')}
        >
          <Ionicons name="create" size={24} color="white" />
          <Text style={styles.buttonText}>Manual</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 200,
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  button: {
    alignItems: 'center',
    padding: 10,
  },
  captureButton: {
    backgroundColor: '#10b981',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});