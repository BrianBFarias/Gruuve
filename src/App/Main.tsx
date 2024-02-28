import React, { useContext } from "react";
import { Image, StyleSheet, Text, View} from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import icons from "../components/icons";

// Screens
import {Profile} from "./pages/Profile";
import { Explore } from "./pages/Explore";
import { Events } from "./pages/Events";
import { Messages } from "./pages/Messages";

import Logo from '../../assets/images/logo.png'

const Tab = createBottomTabNavigator();

const Main = () =>{

    return(
        <Tab.Navigator 
        initialRouteName={"Explore"}
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
            tabBarLabel: ({focused}) => <Text style={[focused ? {opacity:1}:{opacity:0.5}, {color:'black', fontSize:10, fontWeight:'700'}]}>{route.name}</Text>,
            headerShown:false, title:route.name, unmountOnBlur:true
        })}>
            <Tab.Screen name={"Explore"} component={Explore} />
            <Tab.Screen name={"Messages"} component={Messages} />
            <Tab.Screen name={"Events"} component={Events} />
            <Tab.Screen name={"Profile"} component={Profile} />

        </Tab.Navigator>
    )
}

const Style = StyleSheet.create({
    text:{
        color:'black'
    }
})

export default Main;