import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { Link, router, Redirect } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider";
import { checkSession } from '../../lib/appwrite';

const SignIn = () => {
  const sessionEnCours = checkSession();
  console.log("le console log du sign in", sessionEnCours);
  
  {/* création d'un usestate pour récupérer la valeur de check session */}
  const [session, setSession] = useState(null);
  useEffect(() => {
    const fetchSession = async () => {
      const sessionStatus = await checkSession();
      if (sessionStatus) {
        setSession(true);
        setIsLogged(true);
      } else {
        setSession(false);
      }
      
      {/*setIsLoading(false);*/}
    };

    fetchSession();
  }, []);
    {/* fin du check et du redirect bymalsi */}

  if (session) {
    console.log("on s'est fait", session);
    router.replace('/bookmark');
  }
  console.log(session);
  const { setUser, setIsLogged } = useGlobalContext();

  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setisSubmitting] = useState(false)


  const submit = async () => {
    if(!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
    }

    setisSubmitting(true);
    
    try {
      await signIn(form.email, form.password);

      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    finally {
      setisSubmitting(false);
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full h-full px-4 my-3 flex justify-center">
          
          <View className="items-center">
            <Image 
              source={images.logo} 
              resizeMode='contain' 
              className="w-[125px] h-[40px]" 
            />
          </View>
          <Text className="text-2xl text-white text-semi-bold mt-10 font-psemibold"> Login to Aora </Text>
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-6"
            keyboardType="email-adress"/>
            <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e})}
            otherStyles="mt-5"/>

            <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}/>

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have account ? 
              </Text>
              <Link href="/sign-up" className="text-lg font-psemibold text-secondary"> Sign Up</Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn