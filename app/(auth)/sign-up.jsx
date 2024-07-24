import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { createUser } from '../../lib/appwrite'
import FormField from '../components/FormField'
import CustomButton from '../components/CustomButton'
import { Link } from 'expo-router'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const submit = async() => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    finally {
      setSubmitting(false);
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
          <Text className="text-2xl text-white text-semi-bold mt-10 font-psemibold"> Sign Up to Aora </Text>
          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e})}
            otherStyles="mt-6"
            />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}/>

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Already have an account ? 
              </Text>
              <Link href="/sign-in" className="text-lg font-psemibold text-secondary"> Sign In</Link>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp