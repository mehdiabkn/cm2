import { useState } from "react";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

import { icons } from "../../constants";
import { createVideo } from "../../lib/appwrite";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as ImagePicker from 'expo-image-picker';
import DatePickerField from "../components/DatePickerField";
import ImagePickerGrid from "../components/ImagePickerGrid";

const convertImageToBase64 = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result.replace('data:image/jpeg;base64,', '');
      sendImageToOCR(base64);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error converting image to base64e:', error);
  }
};
const sendImageToOCR = async (base64) => {
  try {
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: 'f06e5dd3a388957',
        base64Image: `data:image/jpeg;base64,${base64}`,
        OCREngine: 2,
      }),
    }
  
  );

    const result = await response.json();
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      setText(result.ParsedResults[0].ParsedText);
      console.log(result.ParsedResults[0].ParsedText);
    } else {
      setText('No text found.');
    }
  } catch (error) {
    console.error('Error sending image to OCR:', error);
  }
};

const CreerContrat = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || value;
    setShow(Platform.OS === 'ios');
    onDateChange(currentDate);
  };
  const [images, setImages] = useState(Array(6).fill(null)); // Tableau initialisé avec 6 images nulles


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

  const openPicker = async (selectType, laquelle) => {
    console.log("openpicker");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image'? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    let uri= result["uri"];
    console.log(result);
    {/*setImageUri(uri); */}
    convertImageToBase64(uri);
    console.log("openpickee");

    console.log("laquelle = ", laquelle);
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
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error dzap", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full" edges={['top', 'left', 'right']}>
      <ScrollView className="pl-4 pr-4 flex-1">
        <Text className="text-3xl text-white font-psemibold text-center">Contrat de location</Text>
        <Text className="text-2xl text-white font-psemibold mt-5">1. Locataire</Text>

        <View className="flex-row">
        <FormField
          title="Nom locataire"
          value={form.nom}
          placeholder="Nom"
          handleChangeText={(e) => setForm({ ...form, nom: e })}
          otherStyles="mt-7 w-[45%] mr-5"
        />
         <FormField
          title="Prénom locataire"
          value={form.prenom}
          placeholder="Prénom "
          handleChangeText={(e) => setForm({ ...form, prenom: e })}
          otherStyles="mt-7 w-[45%]"
        />
        </View>
        <DatePickerField
        label="Date de naissance"
        value={form.date}
        onDateChange={(date) => setForm({ ...form, date })}
        otherStyles="mt-4 text-white font-psemibold"
      />
      <FormField
          title="Numéro de téléphone"
          value={form.tel}
          placeholder="Numéro de téléphone"
          handleChangeText={(e) => setForm({ ...form, tel: e })}
          otherStyles="mt-7"
          keyboard="numeric"
        />
        <FormField
          title="Adresse mail"
          value={form.mail}
          placeholder="Adresse mail"
          handleChangeText={(e) => setForm({ ...form, mail: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Adresse"
          value={form.adresse}
          placeholder="Adresse"
          handleChangeText={(e) => setForm({ ...form, mail: e })}
          otherStyles="mt-7"
        />
         
         <Text className="text-2xl text-white font-psemibold mt-6">2. Véhicule</Text>

         <FormField
          title="Véhicule"
          value={form.immat}
          placeholder="Immat"
          handleChangeText={(e) => setForm({ ...form, mail: e })}
          otherStyles="mt-7"
        />
        <FormField
          title="Kilométrage"
          value={form.kilometrage}
          placeholder="Adresse"
          handleChangeText={(e) => setForm({ ...form, mail: e })}
          otherStyles="mt-7"
          keyboard="numeric"
        />

         <View className="flex flex-wrap -mx-2">
     
        <View className="p-4">
            <Text className="text-xl text-white font-psemibold mb-5">Photos état des lieux</Text>
            {/* Première ligne avec trois balises Text */}
            <View className="flex flex-row justify-between mb-4">
                <View className="w-1/3 text-center mr-1 -ml-1"><TouchableOpacity onPress={() => openPicker("image", "photo1")}>
                {form.photo1 ? (
                <Image
                    source={{ uri: form.photo1.uri }}
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
                    Photo 1
                    </Text>
                </View>
                )}
                
                </TouchableOpacity></View>
                <View className="w-1/3 text-center mr-1"><TouchableOpacity onPress={() => openPicker("image", "photo2")}>
                {form.photo2 ? (
                <Image
                    source={{ uri: form.photo2.uri }}
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
                    Photo 2
                    </Text>
                </View>
                )}
                
                </TouchableOpacity></View>
                <View className="w-1/3 text-center mr-1"><TouchableOpacity onPress={() => openPicker("image", "photo3")}>
                {form.photo3 ? (
                <Image
                    source={{ uri: form.photo3.uri }}
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
                    Photo 3
                    </Text>
                </View>
                )}
                
                </TouchableOpacity></View>

            </View> 

            {/* Deuxième ligne avec trois balises Text */}
            <View className="flex flex-row justify-between">
            <View className="w-1/3 text-center mr-1 -ml-1"><TouchableOpacity onPress={() => openPicker("image", "photo4")}>
                {form.photo4 ? (
                <Image
                    source={{ uri: form.photo4.uri }}
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
                    Photo 4
                    </Text>
                </View>
                )}
                
                </TouchableOpacity></View>
            <View className="w-1/3 text-center mr-1"><TouchableOpacity onPress={() => openPicker("image", "photo5")}>
                {form.photo5 ? (
                <Image
                    source={{ uri: form.photo5.uri }}
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
                    Photo 5
                    </Text>
                </View>
                )}
                
                </TouchableOpacity></View>
                <View className="w-1/3 text-center mr-1"><TouchableOpacity onPress={() => openPicker("image", "photo6")}>
                {form.photo6 ? (
                <Image
                    source={{ uri: form.photo6.uri }}
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
        </View>
          
        </View>
        <Text className="text-2xl text-white font-psemibold mt-5">3. Conducteur n°1 </Text>

          <View className="flex-row">
          <FormField
            title="Nom conducteur 1"
            value={form.nomc1}
            placeholder="Nom"
            handleChangeText={(e) => setForm({ ...form, nomc1: e })}
            otherStyles="mt-7 w-[45%] mr-5"
          />
          <FormField
            title="Prénom conducteur 1"
            value={form.prenomc1}
            placeholder="Prénom "
            handleChangeText={(e) => setForm({ ...form, prenomc1: e })}
            otherStyles="mt-7 w-[45%]"
          />
          </View>
            <DatePickerField
            label="Date de naissance"
            value={form.datec1}
            onDateChange={(date) => setForm({ ...form, datec1 })}
            otherStyles="mt-4 text-white font-psemibold"
            />
            <FormField
              title="Numéro de téléphone"
              value={form.telc1}
              placeholder="Numéro de téléphone"
              handleChangeText={(e) => setForm({ ...form, telc1: e })}
              otherStyles="mt-7"
              keyboard="numeric"
            />
            <FormField
              title="Adresse mail"
              value={form.mail}
              placeholder="Adresse mail"
              handleChangeText={(e) => setForm({ ...form, mail: e })}
              otherStyles="mt-7"
            />
            <FormField
              title="Adresse"
              value={form.adresse}
              placeholder="Adresse"
              handleChangeText={(e) => setForm({ ...form, mail: e })}
              otherStyles="mt-7"
            />
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of yowxczceur video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
          keyboard="numeric"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreerContrat;