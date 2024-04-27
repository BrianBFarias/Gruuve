import React, {useEffect, useState} from "react";
import { View, SafeAreaView, Text, Button, TouchableOpacity } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import Loading2 from "../../components/Loading2";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {Message} from './Messages/Message'
import {ListMessages} from './Messages/ListMessages'
import icons from "../../components/icons";

// TESTING

// 
const Stack = createNativeStackNavigator();

export const Messages = () =>{
    const [user, setUser] = useState({});
    const [fetching, setFetching] = useState(true)

    const fetchData = async () => {
        try {
          const uid = auth().currentUser?.uid;
          const userData = await firestore().collection('Users').doc(uid).get();
          if (userData._data) {
            setUser(userData._data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
            setFetching(false); 
        }
      };
    
      useEffect(()=>{
        fetchData();
      })

    //   colors={['#29612F', '#0a400b']}
    return(
    <View style={{flex:1, backgroundColor:'white'}}>
        <SafeAreaView />
        {fetching ?
            <View style={{flex:1, backgroundColor:'red'}}>
                <LinearGradient 
                colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
                start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
                locations={[0.4,1]}
                style={{flex:1}}>
                    <Loading2 />
                </LinearGradient>
            </View>
        :
        <>
            <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="MessageList">
                <Stack.Screen
                    name="MessageList"
                    component={ListMessages}
                    initialParams={{ user }}
                    options={{
                        header: ({ navigation }) => (
                        <View style={{ paddingBottom: 10, paddingHorizontal: 20, backgroundColor:'transparent'}}>
                            <SafeAreaView />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, alignItems: 'center' }}>
                            <Text style={{ fontWeight: '700', fontSize: 20, opacity: 1, color: '#0a400b' }}>Messages</Text>
                            </View>
                        </View>
                        ),
                        headerShadowVisible: false,
                        headerBackTitleVisible: false,
                        headerStyle: {
                        backgroundColor: 'rgb(255,255,255)',
                        },
                        animation: 'simple_push'
                    }}
                />
                <Stack.Screen
                    name="Message"
                    component={ListMessages}
                    initialParams={{ user }}
                    options={{
                        header: ({ navigation }) => (
                        <View style={{ paddingBottom: 10, paddingHorizontal: 20, backgroundColor:'rgba(245,245,245,1)'}}>
                            <SafeAreaView />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, bottom: 0, height: 30, width: 30 }}>
                                <icons.FontAwesome size={30} name={'chevron-left'} color={'#0a400b'} />
                            </TouchableOpacity>
                            <Text style={{ fontWeight: '600', fontSize: 26, opacity: 1, color: '#0a400b' }}>New Event</Text>
                            </View>
                        </View>
                        ),
                        headerShadowVisible: false,
                        headerBackTitleVisible: false,
                        headerStyle: {
                        backgroundColor: 'rgb(255,255,255)',
                        },
                        animation: 'simple_push'
                    }}
                />
            </Stack.Navigator>

        </>}
    </View>
    )
}