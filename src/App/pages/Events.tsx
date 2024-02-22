import React, {useEffect, } from "react";
import { View, SafeAreaView, Text, Button, TouchableOpacity, Touchable } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsPage } from "./EventsStack/Events";
import { NewEvent } from "./EventsStack/CreateEvent";
import icons from "../../components/icons";

const Stack = createNativeStackNavigator();

export const Events = () =>{

    useEffect(() => {
        // get all user events & Remove any overdue events
    },[])

    return(
    <Stack.Navigator screenOptions={{headerShown:true}} initialRouteName="Events">
        <Stack.Screen
        name="Events"
        component={EventsPage}
        
        options={{
          header:()=>(
            <View style={{backgroundColor:'rgba(255,255,255,0.2)', paddingBottom:10, paddingHorizontal:20}}>
              <SafeAreaView />
              <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20, alignItems:'center'}}>
                <Text style={{fontWeight:'800', fontSize:26, opacity:0.6}}>Your Events</Text>
              </View>
            </View>
          ),
            headerTitleAlign:'center',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: 'rgb(255,255,255)',
            },
            animation:'simple_push'
          }}
        />
        <Stack.Screen
        name="New Event"
        component={NewEvent}
        options={{
          header:({navigation})=>(
            <View style={{backgroundColor:'rgba(255,255,255,0.2)', paddingBottom:10, paddingHorizontal:20}}>
              <SafeAreaView />
              <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:20, alignItems:'center'}}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                  <icons.FontAwesome size={30} name={'chevron-left'} color={'#29612F'} />
                </TouchableOpacity>
                <Text style={{fontWeight:'800', fontSize:26, opacity:0.7, color:'#19401d'}}>New Event</Text>
              </View>
            </View>
          ),
            headerTitleAlign:'center',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: 'rgb(255,255,255)',
            },
            animation:'simple_push'
          }}
        />
  </Stack.Navigator>
    )
}