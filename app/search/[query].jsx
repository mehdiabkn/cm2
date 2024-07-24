import { View, Text, Image, RefreshControl} from 'react-native'
import {React, useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native'
import { images } from '../../constants';
import SearchInput from '../components/SearchInput';
import Trending from '../components/Trending';
import EmptyState from '../components/EmptyState';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import VideoCard from '../components/VideoCard';
import useAppwrite from "../../lib/useAppwrite";
import { searchPosts } from "../../lib/appwrite";


const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary text-white border-2 h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard video={item} />
                )}
                ListHeaderComponent={() => (
                  <View className="my-6 px-4 space-y-6"> 
                  
                      <Text className="font-pmedium text-sm text-gray-100">
                        Search results
                      </Text>
                      <Text className="text-2xl font-psemibold text-white">
                        {query}
                      </Text>
                      <View className="mt-6 mb-8">
                        <SearchInput initialQuery={query} />
                      </View>
                  </View>
                  )}
            ListEmptyComponent={() => (
              <EmptyState 
              title="No videos found"
              subtitle="No videos found for this search query"/>
            )}
            
            />
            
            
    </SafeAreaView>
  )

}

export default Search