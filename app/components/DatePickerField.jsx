import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale'; // Importer la locale française

const DatePickerField = ({ label, value, onDateChange, otherStyles }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || value;
    setShow(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-p-medium">{label}</Text>
      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex flex-row items-center">
        <TouchableOpacity
          className="flex-1 text-white font-psemibold text-base w-full h-full justify-center"
          onPress={() => setShow(true)}
        >
          <Text className="text-white font-psemibold">
          {value ? format(value, 'dd MMM yyyy', { locale: fr }) : 'Date de naissance'}
          </Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={value || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

export default DatePickerField;
