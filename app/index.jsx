import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { Image } from 'react-native';
import CustomButton from './components/CustomButton';
import { Redirect, router } from 'expo-router';
import { getCurrentUser } from "../lib/appwrite";
import { checkSession } from '../lib/appwrite';
import { useGlobalContext } from '../context/GlobalProvider';
import { useEffect } from 'react';

export default function App() {
  const {isLoading, isLoggedIn, setIsLogged } = useGlobalContext();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionStatus = await checkSession();
      if (sessionStatus) {
        setIsLogged(true);
        router.replace('/home');
      } else {
        setIsLogged(false);
      }
      {/*setIsLoading(false);*/}
    };

    fetchSession();
  }, []); 

  if(isLoggedIn) 
    {
      console.log("apapa");
      return router.push('/home')
    }
  else if(isLoading) {
      console.log("loadingo");
      return (
        <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle= {{ height: '100%'}}>
          <View className="w-full justify-center items-center h-[85vh] px-4" style={{ justifyContent: 'flex-start' }}>
            <Image 
              source={images.logo} 
              className="w-[130px] h-[84px]"
              resizeMode="contain"/>
            <Image 
              source={images.cards}
              className="max-w--[380px] w-full h-[300px]"
              resizeMode="contain"
              />
          <View className="relative mt-5">
          <TouchableOpacity onPress= {checkSession}>
  
  <Text className="text-lg font-psemibold text-secondary">
      PARRRRRRRIOTE
      </Text>
    </TouchableOpacity>
            <Text className="text-3xl text-white font-bold text-center"> PARRRRRRRIOTE          
              <Text className="text-secondary-200"> AORA</Text>
              
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8" 
              resizeMode="contain"/>
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center"> Where cash meets malsi: embark on a journey of limitless exploration with aoera</Text>
          <CustomButton title="Continue with Email"
          handlePress={() => router.push('/sign-in')}
          containerStyles="w-full mt-7"
          ></CustomButton>
          </View>
        </ScrollView>
        <StatusBar backgroundColor='#161622' style='light'/>
      </SafeAreaView>
    );
  }
    else {
      console.log("apipi");
      return (

        <SafeAreaView className="bg-primary h-full">
          <ScrollView contentContainerStyle= {{ height: '100%'}}>
            <View className="w-full justify-center items-center h-[85vh] px-4" style={{ justifyContent: 'flex-start' }}>
              <Image 
                source={images.logo} 
                className="w-[130px] h-[84px]"
                resizeMode="contain"/>
              <Image 
                source={images.cards}
                className="max-w--[380px] w-full h-[300px]"
                resizeMode="contain"
                />
            <View className="relative mt-5">
            <TouchableOpacity onPress= {checkSession}>
    
    <Text className="text-lg font-psemibold text-secondary">
        BENYEDDER
        </Text>
      </TouchableOpacity>
              <Text className="text-3xl text-white font-bold text-center"> Discover Endless activities with           
                <Text className="text-secondary-200"> AORA</Text>
                
              </Text>
              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8" 
                resizeMode="contain"/>
            </View>
            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center"> Where cash meets malsi: embark on a journey of limitless exploration with aoera</Text>
            <CustomButton title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
            ></CustomButton>
            </View>
          </ScrollView>
          <StatusBar backgroundColor='#161622' style='light'/>
        </SafeAreaView>
      );
    }
 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 