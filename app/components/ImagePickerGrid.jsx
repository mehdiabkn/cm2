import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '../../constants';

const ImagePickerGrid = ({ images, onImagePress }) => {
  const renderImage = (image, index) => (
    <TouchableOpacity key={index} onPress={() => onImagePress(index)} className="w-full">
      {image ? (
        <Image
          source={{ uri: image.uri }}
          resizeMode="cover"
          className="w-full h-32 rounded-2xl"
        />
      ) : (
        <View className="w-full h-32 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center">
          <Image
            source={icons.upload}
            resizeMode="contain"
            alt="upload"
            className="w-5 h-5"
          />
          <Text className="text-sm text-gray-100 font-pmedium">
            Choose a file
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="mt-7">
      <Text className="text-base text-gray-100 font-pmedium mb-4">
        Thumbnail Images
      </Text>
      <View className="flex flex-wrap -mx-2">
        <View className="w-1/3 px-2 mb-4">{renderImage(1)}</View>
        <View className="w-1/3 px-2 mb-4">{renderImage(2)}</View>
        <View className="w-1/3 px-2 mb-4">{renderImage(3)}</View>
        <View className="w-1/3 px-2 mb-4">{renderImage(4)}</View>
        <View className="w-1/3 px-2 mb-4">{renderImage(5)}</View>
        <View className="w-1/3 px-2 mb-4">{renderImage(6)}</View>
      </View>
    </View>
  );
};

export default ImagePickerGrid;
