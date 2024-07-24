import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { icons } from '../../constants';
import * as FileSystem from 'expo-file-system';

const OCRSpaceAPIKey = 'YOUR_OCR_SPACE_API_KEY';


const OCR = () => {
  const [base64Image, setBase64Image] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [text, setText] = useState('');
  const [form, setForm] = useState({
    title: "",
    image: null,
    thumbnail: null,
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
    photo5: null,
    photo6: null,
    prompt: "",
    immat: "",
    kilometrage: "",
    url: null,
    nom: "",
    prenom: "",
    datenaissance: "",
    lieunaissance: "",
    mail: ""
  });

  const sendImageToOCR = async (base64Image) => {
    if (base64Image) {
      try {
        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            apikey: 'f06e5dd3a388957',  // Remplacez par votre clé API
            base64Image: `data:image/jpeg;base64,${base64Image}`,
            language: 'fre',  // Spécifiez la langue si nécessaire
            OCREngine: 2,
          }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('OCR result:', data);
      } catch (error) {
        console.error('Error sending image to OCR:', error);
      }
    }
  };
  const convertImageToBase64 = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setBase64Image(base64);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      Alert.alert('Error', 'Failed to convert image to base64');
    }
  };

  const convertImageToBase64old = async (uri) => {
      try {
        console.log("uri", uri);
        const response = await fetch(uri);
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            sendImageToOCR(base64);
          };
          reader.readAsDataURL(blob);
        } else {
          Alert.alert('Error', 'Failed to fetch image');
        }
      } catch (error) {
        console.error('Error converting image to base64:', error);
        Alert.alert('Error', 'Failed to convert image to base64');
      }
    };
  
  const openPicker = async (selectType, laquelle) => {
      console.log("openpicker");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: selectType === 'image'? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      let uri= result.assets[0].uri;
      convertImageToBase64(uri);
      if (!result.canceled) {
        if (selectType === "image") {
          switch (laquelle) {
            case 'photo1':
              setForm({
                ...form,
                photo1: result.assets[0],
              });
              break;
            case 'photo2':
              setForm({
                ...form,
                photo2: result.assets[0],
              });
              break;
            case 'photo3':
              setForm({
                ...form,
                photo3: result.assets[0],
              });
              break;
            case 'photo4':
              setForm({
                ...form,
                photo4: result.assets[0],
              });
              break;
            case 'photo5':
              setForm({
                ...form,
                photo5: result.assets[0],
              });
              break;
            case 'photo6':
              setForm({
                ...form,
                photo6: result.assets[0],
              });
              break;
            default:
              console.log("La valeur de 'laquelle' n'est pas valide");
        }}
  
        if (selectType === "video") {
          setForm({
            ...form,
            video: result.assets[0],
          });
        }
  
        if (!result.canceled) {
          const response = await fetch(result.uri);
          const blob = await response.blob();
          const reader = new FileReader();
      
          reader.onloadend = () => {
            const base64data = reader.result.replace(/^data:.+\/(.+);base64,/, '');
            console.log(base64data);
          };
          reader.readAsDataURL(blob);
        }
      } else {
        setTimeout(() => {
          Alert.alert("Document picked", JSON.stringify(result, null, 2));
        }, 100);
      }
    };
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        convertImageToBase64(uri);
      }
    });
  };
  



  return (
    <SafeAreaView className="bg-primary h-full" edges={['top', 'left', 'right']}>
        
        <View className="p-4">
   
                <View className="w-1/3 text-center mr-1"><TouchableOpacity onPress={() => openPicker("image", "photo6")}>
                {form.photo ? (
                <Image
                    source={{ uri: form.photo.uri }}
                    resizeMode="cover"
                    className="w-full h-64 rounded-2xl"
                />
                ) : (
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                    <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                    />
                    <Text className="text-sm text-gray-100 font-pmedium">
                    Photo 6
                    </Text>
                </View>
                )}
                
                </TouchableOpacity></View>
            </View>
          
       
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default OCR;
