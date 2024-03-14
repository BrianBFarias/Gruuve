import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import icons from "../components/icons";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loading from "../components/Loading";
// Screens
import {Profile} from "./pages/Profile";
import { Explore } from "./pages/Explore";
import { Events } from "./pages/Events";
import { Messages } from "./pages/Messages";

import Logo from '../../assets/images/logo.png'
import { PopUp } from "../components/popUpIntro";

const Tab = createBottomTabNavigator();

const Main = () =>{
    const [userData, setUserData] = useState<any>(null)
    const [showIntro, setShowIntro] = useState(false)

    async function fetchUser(){
        const uid = auth().currentUser?.uid;
        const userInfo = await firestore().collection('Users').doc(uid).get();
        if(userInfo?._data){
            setUserData(userInfo?._data)
        }
    }

    useEffect(()=>{
        const fetch = async () =>{
            await fetchUser()
            const SI =  userData?.newAccount
            setShowIntro(SI)
        }
        fetch();
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
                        return <Image style={focused ? {objectFit:'contain', height:50, tintColor:'rgba(25, 94, 43,1)'}:{objectFit:'contain', height:50, tintColor:'black', opacity:0.5}} source={Logo}/>
                    }else if(rn === 'Messages'){
                        return <icons.MaterialCommunityIcons name={'message-processing'} size={size} color={focused? '#29612F':'black'} opacity={focused? 1:0.5} />
                    }
                    else if(rn === 'Events'){
                        return <icons.MaterialCommunityIcons name={'reorder-horizontal'} size={size+4} color={focused? '#29612F':'black'} opacity={focused? 1:0.5} />
                    }
                    else if(rn === 'Profile'){
                        return <icons.FontAwesome6 name={'user-large'} size={size} color={focused? '#29612F':'black'} opacity={focused? 1:0.5} />
                    }

                },
                headerShown:false, title:route.name, unmountOnBlur:true, tabBarShowLabel:false
            })}>
                {/* userData !== null  */}
                {userData === null ? 
                    <Tab.Screen name={"Loading"} component={Loading} initialParams={{userData}} />
                :
                (<>
                    <Tab.Screen name={"Explore"} component={Explore} initialParams={{userData}} />
                    <Tab.Screen name={"Messages"} component={Messages} initialParams={{userData}}/>
                    <Tab.Screen name={"Events"} component={Events} initialParams={{userData}}/>
                    <Tab.Screen name={"Profile"} component={Profile} initialParams={{userData}}/>
                </>)}
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