import React, {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View, Animated} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';
import firestore from '@react-native-firebase/firestore';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Loading from "../../components/Loading";
import { Indiivudal } from "./Explore/Individual";
import { Group } from "./Explore/Group";

const Stack = createNativeStackNavigator();

export const Explore = () =>{
    const [toggle, setToggle] = useState(true);
    const [selection, setSelection] = useState(toggle)
    const [EventInfo, setEventInfo] = useState([]);
    const [GroupEventInfo, setGroupEventInfo] = useState([]);
    const [loading, setLoading] = useState(false)
    const [user, SetUser] = useState(false)
 
    const fade = new Animated.Value(0);
    const fadeOut = new Animated.Value(1);

   const startFadeIn = () =>{
    fade.setValue(0);
    Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        delay:0,
        useNativeDriver: true,
      }).start();
   }
   
   const startFadeOut = () =>{
    fadeOut.setValue(1);
    Animated.timing(fade, {
        toValue: 0,
        duration: 100,
        delay:0,
        useNativeDriver: true,
      }).start(()=>{setSelection(!selection)})
   }

    const fetchEvent = async () =>{
        // Indivudal
        if(toggle && EventInfo.length === 0){
            await fetchIndividualEvents()
        }
        // Group
        else if(!toggle && GroupEventInfo.length === 0){
            await fetchGroupEvents();
        }
    }

    useEffect(()=>{
        setLoading(true);
        fetchEvent();
        setLoading(false);
    },[GroupEventInfo, EventInfo])

    function switchScreen(){
        startFadeOut();
        setTimeout(()=>{
            setToggle(!toggle)
        }, 100)
    }

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        <SafeAreaView />
        {loading ? <Loading />:
        <View style={{alignSelf:'center'}}>
        <Switch
            value={!selection}
            onValueChange={() => {switchScreen()}}
            disabled={false}
            activeText={'Individual'}
            circleSize={40}
            barHeight={30}
            circleBorderWidth={0}
            activeTextStyle={Style.toggle}
            inactiveTextStyle={Style.toggle}
            inActiveText={'Group'}
            renderInsideCircle={() => <Text style={Style.toggleButton}>{selection ? 'Individual':'Group'}</Text>}
            backgroundInactive={'rgba(0,0,0,0.15)'}
            backgroundActive={'rgba(0,0,0,0.15)'}
            circleActiveColor={'green'}
            circleInActiveColor={'green'}
            innerCircleStyle={{ alignItems: "center", justifyContent: "center", height:25, alignSelf:'center', width:'auto', paddingHorizontal:12 }}
            outerCircleStyle={[{width:'auto', alignSelf:'center', flex:1, gap:15}]} 
            switchWidthMultiplier={5}
            />
            <Animated.View style={{opacity:fadeOut}}>
                {toggle ? <Indiivudal setEventInfo={setEventInfo} fade={fade} startFadeIn={startFadeIn} />: <Group setGroupEventInfo={setGroupEventInfo} fade={fade} startFadeIn={startFadeIn}  />}
            </Animated.View>
        </View>}
    </LinearGradient>
    )
}

const Style = StyleSheet.create({
    toggle:{
        color:'black', fontWeight:'700',textAlign:'center'
    },
    toggleButton:{
        color:'white', fontWeight:'700'
    }
})

const fetchGroupEvents = async () =>{

}

const fetchIndividualEvents = async () =>{
    
}