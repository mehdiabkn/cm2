import { View, Text, Image, RefreshControl, TouchableOpacity} from 'react-native'
import {React, useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native'
import SearchInput from '../components/SearchInput';
import EmptyState from '../components/EmptyState';
import { useLocalSearchParams } from 'expo-router';
import {  getUserPosts } from '../../lib/appwrite';
import VideoCard from '../components/VideoCard';
import useAppwrite from "../../lib/useAppwrite";
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../components/InfoBox';
import { router } from 'expo-router';
import { signOut } from '../../lib/appwrite';
const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getUserPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }


  return (
    <SafeAreaView className="bg-primary h-full" edges={['top', 'left', 'right']}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                  <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                    <TouchableOpacity
                      className="w-full items-end mb-10"
                      onPress={logout}>
                      <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
                    </TouchableOpacity>
                    <View className="w-16 h-16 border border-secondary rounded-full justify-center items-center">
                      <Image source= {{ uri: user?.avatar }} className="w-[90%] h-[90%] rounded-full" resizeMode="cover"/>
                    </View>

                    <InfoBox 
                      title={user?.username}
                      containterStyles='mt-5'
                      titleStyles="text-lg"
                      />
                    <View className="mt-5 flex flex-row">
                        <InfoBox
                        title={posts.length || 0}
                        subTitle="Posts"
                        titleStyles="text-xl"
                        containerStyles="mr-10"
                        subTitleStyles="text-sm"

                        />
                        <InfoBox
                        title="1.2k"
                        subTitle="Followers"
                        titleStyles="text-xl"
                        subTitleStyles="text-sm"
                        />
                    </View>


                  </View>
                  )}
            ListEmptyComponent={() => (
              <EmptyState 
              title="No videos found"
              subtitle="No videos found for this search query"/>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            
            
            />
            
            
    </SafeAreaView>
  )

}

export default Profile