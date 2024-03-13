import React, {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View, Animated} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Loading from "../../components/Loading";
import { Indiivudal } from "./Explore/Individual";
import { Group } from "./Explore/Group";
import auth from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import { reject, accept, decline } from "./Explore/Option";

const fade = new Animated.Value(0);
const eventCard = new Animated.Value(1);

export const Explore = ({route}:any) =>{
    const [toggle, setToggle] = useState(true);
    const [selection, setSelection] = useState(toggle)
    const [EventInfo, setEventInfo] = useState<any>();
    const [GroupEventInfo, setGroupEventInfo] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null)
    const [nextPost, setNextPost] = useState(0)

    const fadeOutCard = () =>{
        Animated.timing(eventCard, {
            toValue: 0,
            duration: 600,
            delay:0,
            useNativeDriver: true,
          }).start();
       }

    const fadeInCard = () =>{
        Animated.timing(eventCard, {
            toValue: 1,
            duration: 600,
            delay:0,
            useNativeDriver: true,
          }).start();
       }

   const startFadeIn = () =>{
    fade.setValue(0);
    Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        delay:0,
        useNativeDriver: true,
      }).start();
   }

    const fetchEvent = async ({userData}:any) =>{
        // Indivudal
        if(toggle && !EventInfo){
            setLoading(true)
            const results = await fetchIndividualEvents({userData})
            setEventInfo(results)
        }
        // Group
        else if(!GroupEventInfo){
            setLoading(true)
            const results = await fetchGroupEvents({userData});
            setGroupEventInfo(results)
        }
        setLoading(false)
    }


    useEffect(()=>{
        const {userData} = route.params
        setUserID(userData.id)
        
        if(EventInfo?.length === 0 || GroupEventInfo?.length === 0 || !EventInfo || !GroupEventInfo){
            const fetchData = async () => {
                fetchEvent({userData});
            };
            fetchData();
        }
    },[EventInfo, GroupEventInfo, toggle])

    function switchScreen(){
        setToggle(!toggle)
        setSelection(!selection)
    }

    // 0 - no action, 1 - fetching new Post, 2 - newPost Fetched
    useEffect(()=>{
        if(nextPost === 1){
            fadeOutCard();
        }else if(nextPost === 2){
            setNextPost(0)
            setTimeout(()=>{
                fadeInCard()
            }, 1000)
        }
    },[nextPost])

    const empty = ({ text }: { text: string }) =>{
        return(
        <View style={{marginTop:'50%', alignItems: 'center'}}>
            <Text style={{fontWeight:'800', opacity:0.7, fontSize:24}}>{text}</Text>
            <Text style={{fontWeight:'600', opacity:0.5, fontSize:16}}>Try increasing your search radius in Profile</Text>
        </View>)
    }

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        {/* <PopUp /> */}
        <SafeAreaView />
        {loading ? <Loading />:
        <View style={{alignSelf:'center', alignItems:'center', flex:1}}>
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
                innerCircleStyle={{ alignItems: "center", justifyContent: "center", height:25, alignSelf:'center', width:'auto', paddingHorizontal:12, }}
                outerCircleStyle={{alignSelf:'center', flex:1, gap:15}} 
                switchWidthMultiplier={5}
                />
            <Animated.View style={{opacity:eventCard, flex:1}}>
                {toggle ?
                (!EventInfo ? 
                    (<View style={{}}><Loading /></View>):
                    (EventInfo.length === 0 ?
                        empty({text:'No Individual Events'}): 
                        <Indiivudal 
                        setEventInfo={setEventInfo} 
                        fade={fade} 
                        startFadeIn={startFadeIn} 
                        EventInfo={EventInfo[0]._data} 
                        reject={reject} 
                        decline={decline} 
                        accept={accept} 
                        userID={userID}
                        setNextPost={setNextPost}
                        />)):
                (!GroupEventInfo ? 
                    (<View style={{flex:1}}><Loading /></View>):
                    (GroupEventInfo.length === 0 ?
                        empty({text:'No Group Events'}): 
                        <Group 
                        setGroupEventInfo={setGroupEventInfo} 
                        fade={fade} 
                        startFadeIn={startFadeIn} 
                        GroupEventInfo = {GroupEventInfo[0]._data} 
                        reject={reject} 
                        decline={decline} 
                        accept={accept} 
                        />))
                }
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

const fetchGroupEvents = async ({userData}:any) =>{
    const radius = userData.Preference.Radius;
    const lat = userData.Location.Latitude;
    const lng = userData.Location.Longitude;
    const minAge = userData.Preference.AgeRange.min;
    const maxAge = userData.Preference.AgeRange.max;
    const uid = userData.uid;

    const firestoreRef = firebase.firestore();

    // @ts-ignore
    const GeoFirestore = geofirestore.initializeApp(firestoreRef);

    try{
        const geocollection = GeoFirestore.collection('Events');

        const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lng), radius: radius }).native;

        const AgeFiltered = query
        .where('AgeMin', '>=', minAge)
        .where('AgeMax', '<=', maxAge)
        .where('Individual', '==', false)
        .orderBy('Age')
        .orderBy('Date', 'desc')
        .get();
        
        const results  = (await AgeFiltered).docs;
        return results;

    }catch(error){
        console.log(error)
        return [];
    }

}

const fetchIndividualEvents = async ({userData}:any) =>{
    const radius = userData.Preference.Radius;
    const lat = userData.Location.Latitude;
    const lng = userData.Location.Longitude;
    const minAge = userData.Preference.AgeRange.min;
    const maxAge = userData.Preference.AgeRange.max;
    const desiredSex = userData.Preference.Sex;
    const uid = userData.uid;

    const firestoreRef = firebase.firestore();

    // @ts-ignore
    const GeoFirestore = geofirestore.initializeApp(firestoreRef);

    try{
        const geocollection = GeoFirestore.collection('Events');

        const query = geocollection.near({ center: new firebase.firestore.GeoPoint(lat, lng), radius: radius }).native;

        const AgeFiltered = query
        .where('Age', '>=', minAge)
        .where('Age', '<=', maxAge)
        .where('Sex', '==', `${desiredSex}`)
        .where('Individual', '==', true)
        .orderBy('Age')
        .orderBy('Date', 'desc')
        .limit(6)
        .get();
        
        const results  = (await AgeFiltered).docs;
        return results;

    }catch(error){
        console.log(error)
        return [];
    }
}