import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import icons from "../components/icons";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Loading from "../components/Loading";

// Screens
import {Profile} from "./pages/Profile";
import { Explore } from "./pages/Explore";
import { Events } from "./pages/Events";
import { Messages } from "./pages/Messages";

import Logo from '../../assets/images/logo.png';
import { PopUp } from "../components/popUpIntro";

const Tab = createBottomTabNavigator();

type Message ={
    id:string,
    lastMessage:string,
    to:string,
    newMessage:boolean
}

const Main = () =>{
    const [userData, setUserData] = useState<any>(null);
    const [showIntro, setShowIntro] = useState(false);
    const [hasLikes, setHasLikes] = useState(true);
    const [messages, setMessages] = useState<Message[]>([])

    async function fetchUser(){
        const uid = auth().currentUser?.uid;
        const userInfo = await firestore().collection('Users').doc(uid).get();
        if(userInfo?._data){
            setUserData(userInfo?._data);
            const newAcc = userInfo?._data.newAccount;
            setShowIntro(newAcc);
        }
    }

    async function fetchMessages(){
        setMessages([
            {id:'123',
            lastMessage:'Heyyyy',
            to:`HgXtNxSmWcaZMB5KC7X90p7eLel1`,
            newMessage:true},
            {id:'135',
            lastMessage:'Thanks see u then',
            to:`xiMgRF8f8SVs0SlmTRD8A7fxwLM2`,
            newMessage:false}
        ])
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchUser(); // Wait for userData to be fetched and set
        };
        fetchData();
    }, []);

    useEffect(()=>{
        if(userData){
            const fetchData = async () => {
                await fetchMessages(); // Wait for userData to be fetched and set
            };
            fetchData();
        }
    },[userData])

    async function closeIntro(){
        const uid = auth().currentUser?.uid;
        await firestore().collection('Users').doc(uid).update({newAccount:false});
        setShowIntro(false)
    }

    return(
        <>
        {showIntro && <PopUp onAccept={closeIntro}/>}
        <Tab.Navigator 
            initialRouteName={"Profile"}
            screenOptions={({route}) => ({
                tabBarIcon:({focused, color, size}) =>{
                    let rn = route.name
                    
                    if(rn === 'Explore'){
                        return <Image style={focused ? {objectFit:'contain', height:50, tintColor:'rgba(25, 94, 43,1)'}:{objectFit:'contain', height:50, tintColor:'white', opacity:0.65}} source={Logo}/>
                    }else if(rn === 'Messages'){
                        return <icons.MaterialCommunityIcons name={'message-processing'} size={size} color={focused? 'white':'white'} opacity={focused? 1:0.65} />
                    }
                    else if(rn === 'Events'){
                        return(
                            <View>
                                <icons.MaterialCommunityIcons name={'reorder-horizontal'} size={size+4} color={focused? 'white':'white'} opacity={focused? 1:0.65} />
                                {hasLikes && <View style={{backgroundColor:'green', height:9, width:9, position:'absolute', borderRadius:10, right:0, top:2, shadowColor:'white', shadowRadius:3, shadowOffset:{width:-2, height:2}, shadowOpacity:0}}/>}
                            </View>)
                    }
                    else if(rn === 'Profile'){
                        return <icons.FontAwesome6 name={'user-large'} size={size} color={focused? 'white':'white'} opacity={focused? 1:0.65} />
                    }
                },
                headerShown:false, title:route.name, unmountOnBlur:true, tabBarShowLabel:false, tabBarStyle:{zIndex:100, backgroundColor:'#0a1708', borderTopWidth:0}
            })}
        >
            {userData === null ? 
                <Tab.Screen name={"Loading"} component={Loading}/>
            :
            (
                <>
                    <Tab.Screen name={"Explore"} component={Explore} initialParams={{userData}} />
                    <Tab.Screen name={"Messages"} component={Messages} initialParams={{userData, messages}}/>
                    <Tab.Screen name={"Events"} component={Events} initialParams={{userData}} />
                    <Tab.Screen name={"Profile"} component={Profile} initialParams={{userData}}/>
                </>
            )}
        </Tab.Navigator>
        </>
    )
}

const Style = StyleSheet.create({
    text:{
        color:'black'
    }
})

export default Main;
