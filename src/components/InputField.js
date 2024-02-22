import React from "react";
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import { useState } from "react";

export default function InputField ({ label, icon, inputType, keyboardType, fieldButtonFunction, fieldButtonLabel, setText, currText, autoFocus = false}) {
    const [isFocused, setIsFocused] = useState(false);

    return(
        <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 15,
                backgroundColor: 'white',
                borderColor:'#052b05',
                borderWidth:1.5,
                borderRadius: 30,
                shadowColor:'#052b05',
                shadowOffset:{width:0, height:0},
                shadowRadius:4,
                shadowOpacity:0.2
            }}>
                <View style={iconS.symbol}>
                    {icon}
                </View>
            {inputType == 'password' ? (
                <TextInput
                placeholder={label}
                placeholderTextColor={'rgba(5, 43, 5,0.4)'}
                fontWeight={'500'}
                keyboardType={keyboardType}
                style={{flex: 1, fontSize:14, color:'black', marginLeft:10}}
                secureTextEntry={true}
                onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
                onBlur={() => setIsFocused(false)} // Set isFocused to false on blur
                onChangeText={setText}
                value={`${currText}`}
                />
            ) : (
                <TextInput
                placeholder={label}
                placeholderTextColor={'rgba(5, 43, 5,0.4)'}
                fontWeight={'500'}
                keyboardType={keyboardType}
                style={{flex: 1, fontSize:14, color:'black', marginLeft:10}}
                onFocus={() => setIsFocused(true)} // Set isFocused to true on focus
                onBlur={() => setIsFocused(false)} // Set isFocused to false on blur
                onChangeText={setText}
                value={`${currText}`}
                autoFocus={autoFocus}
                />
            )}
            <TouchableOpacity onPress={fieldButtonFunction} style={{justifyContent:'center'}}>
                <Text style={{color: 'black', fontWeight: '700', marginRight:10, opacity:0.8}}>{fieldButtonLabel}</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

const iconS =  StyleSheet.create({
    symbol:{display:'flex', justifyContent:'center', alignItems:'center', width:45, alignSelf:'center', backgroundColor:'transparent', paddingVertical:6}
  })