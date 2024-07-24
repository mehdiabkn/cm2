import { View, Text, Image, TouchableOpacity, TouchableHighlightComponent} from 'react-native'
import React, { useState, useEffect } from 'react'
import { icons } from '../../constants'
import { Video, ResizeMode } from 'expo-av'
import { isBookmarked, addBookmark, removeBookmark } from '../../lib/appwrite'

const VideoCard = ({id, video: { title, thumbnail, video, users: {username, avatar}}}) => {  
    const [play, setPlay] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        // Vérifier si l'élément est bookmarké
        const checkBookmark = async () => {
            console.log("checkbookmark dans videocart");
            const result = await isBookmarked(id);
            setBookmarked(result);
        };

        checkBookmark();
    }, [id]);  // Dépendance sur id pour re-vérifier si id change
    return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-full border border-secondary justify-center itemps-center p-0.5">
                    <Image source={{ uri: avatar }} className="w-full h-full rounded-full" resizeMode="cover"/>
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
            <Text className="text-xd text-gray-100 font pregular">
                @{username}
            </Text>
        </View>

        <View className="pt-2 mr-4">
        {bookmarked ?
            (
                <TouchableOpacity 
                    onPress={ () => {
                        removeBookmark(id);
                        setBookmarked(false);

                    }
                        }>
                    <Image source={icons.unbookmark} className="w-5 h-5" resizeMode="contain" />
                </TouchableOpacity>
            ) 
        : 
            (
                <TouchableOpacity 
                onPress={ () => {
                    addBookmark(id);
                    setBookmarked(true);
                }
                    }>
                <Image source={icons.bookmark} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
        )}
          
        </View>
        <View className="pt-2">
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
        
        </View>

    </View>
       
    { play ? <Video 
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3" 
          resizeMode={ResizeMode.CONTAIN} 
          useNativeControls
          shouldPlay 
          onPlaybackStatusUpdate={(status) => {
            if(status.didJustFinish) {
              setPlay(false);
            }
          }}/>:
    ( 
        <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => setPlay(true)}
            className="w-full h-60 rounded-xl mt-3 relative justify-center items-center">
            <Image 
                source={{ uri : thumbnail}}
                className="w-full h-full rounded-xl mt-3"
                resizeMode="cover"
            />
            <Image 
                source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode="contain" />

        </TouchableOpacity>
    ) }
    </View>
  )
}

export default VideoCard