import { View, Text, Image, RefreshControl} from 'react-native'
import {React, useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native'
import { images } from '../../constants';
import SearchInput from '../components/SearchInput';
import Trending from '../components/Trending';
import EmptyState from '../components/EmptyState';
import { Redirect } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getAllPosts, getBookmarks, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../components/VideoCard';

const BookMark = () => {
  const { data:posts, refetch, } = useAppwrite(getBookmarks);
  const { data:latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  const { isLogged } = useGlobalContext();
  const { user, setUser, setIsLogged } = useGlobalContext();

  if(!isLogged) return <Redirect href="/sign-in" />
  const nombres = [ {id: '1'}
   ];
  
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary text-white border-secondary-200 h-full" edges={['top', 'left', 'right']}>  
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard id={item.$id} video={item} />
                )}
                ListHeaderComponent={() => (
                  <View className="my-6 px-4 space-y-6"> 
                  
                  <View className="justify-between items-start flex-row mb-6">
                  <View>
                    <Text className="font-pmedium text-sm text-gray-100">
                      Bookmark 
                    </Text>
                    
                  </View>
                    <View className="mt-1.5">
                      <Image 
                      source={images.logoSmall}
                      className="w-9 h-10"
                      resizeMode='contain'/>
                      
                    </View>

                    </View> 
                    
                    
                    <View className="w-full flex-1 pt-5 pb-8">
                    <Text className="text-lg font-pregular text-gray-100 mb-3">
                      Bookmarked
                    </Text>

                    
                    </View>

                  </View>)}
            ListEmptyComponent={() => (
              <EmptyState 
              title="No videos found"
              subtitle="Start upload videos from your feed !"
              link="home"/>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
           
            />
            
            
            
    </SafeAreaView>
  )
}

export default BookMark