import { View, Text, TouchableOpacity, PanResponder } from 'react-native'
import React, { useRef } from 'react'
import { Tabs, Redirect, useNavigation } from 'expo-router'
import { icons } from '../../constants'
import { Image } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const TabIcon = ({icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image 
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
    {/* La commande pour afficher en focus en gras le nav selectionne */}
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color}}>
        {name}
      </Text>
    </View>
  )
}
const TabsLayout = () => {
  const navigation = useNavigation();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Start the gesture if a horizontal swipe is detected
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          navigation.navigate('(divers)/messages');
        }
      },
    })
  ).current;
  return (
    <View {...panResponder.panHandlers} style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height: 84,
        }
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', headerShown: false, tabBarIcon: ({color, focused}) =>
      (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          
      ) }} />      
      <Tabs.Screen name="bookmark" options={{ title: 'Bookmark', headerShown: false, tabBarIcon: ({color, focused}) =>
        (
            <TabIcon
              icon={icons.search}
              color={color}
              name="Explorer"
              focused={focused} />
        ) }} />      
        <Tabs.Screen name="createevent" options={{ title: 'Create', headerShown: false, tabBarIcon: ({color, focused}) =>
          (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Créer un event"
                focused={focused} />
          ) }} />
          <Tabs.Screen name="profile" options={{ title: 'Bookmark', headerShown: false, tabBarIcon: ({color, focused}) =>
        (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused} />
        ) }} />     
    </Tabs>
    </View>
  )
}

export default TabsLayout