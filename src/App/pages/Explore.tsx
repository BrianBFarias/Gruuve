import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View, Animated, Easing} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';
import Loading from "../../components/Loading";
import { Indiivudal } from "./Explore/Individual";
import { Group } from "./Explore/Group";
import firestore, { firebase } from '@react-native-firebase/firestore';
import * as geofirestore from 'geofirestore';
import { reject, accept, decline } from "./Explore/Option";
import Icons from "../../components/icons";

const fade = new Animated.Value(0);
const eventCard = new Animated.Value(1);
const slideUp = new Animated.Value(0);
const nextAnimation = new Animated.Value(0);

export const Explore = ({route}:any) =>{
    const [toggle, setToggle] = useState(true);
    const [selection, setSelection] = useState(toggle)
    const [EventInfo, setEventInfo] = useState<any>();
    const [EventInfoEmpty, setEventInfoEmpty] = useState(false)
    const [GroupEventInfo, setGroupEventInfo] = useState<any>();
    const [GroupEventInfoEmpty, setGroupEventInfoEmpty] = useState(false)
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null)
    const [nextPost, setNextPost] = useState(0)

    const transitionIconName = useRef('');

    const transitionIconPop = nextAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1.2],
      }); 
    const transitionIconRotate = nextAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '15deg', '0deg'],
      }); 

    const TransitionIcon = () =>{
        Animated.timing(nextAnimation, {
            toValue: 1,
            duration: 200,
            delay:100,
            useNativeDriver: true,
          }).start();

        setTimeout(()=>{
            Animated.timing(nextAnimation, {
                toValue: 0,
                duration: 200,
                delay:0,
                useNativeDriver: true,
              }).start();
        }, 700)
       }

    const fadeOutCard = () =>{
        Animated.timing(eventCard, {
            toValue: 0,
            duration: 200,
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

   useEffect(()=>{
    slideUp.setValue(0)
   },[])

    const fetchEvent = async ({userData}:any) =>{
        console.log('Getting more events')
        // Indivudal
        if(toggle && (!EventInfo || EventInfo.length===0)){
            setLoading(true)
            const results = await fetchIndividualEvents({userData})
            if(results?.length !== 0){
                setEventInfoEmpty(false)
            }
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
        console.log(EventInfo?.length)

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

    // 0 - no action, -1 - newPost Fetched
    // 1 - Reject/fetching new Post
    // 2 - Decline/fetching new Post
    // 3 - Like/fetching new Post
    useEffect(()=>{
        if(nextPost >= 1 && nextPost <= 3){
            switch(nextPost){
                case 1: transitionIconName.current = 'close';
                    break;
                case 2: transitionIconName.current = 'infinity';
                    break; 
                case 3: transitionIconName.current = 'send-check';
                    break;
            }
            fadeOutCard();
            TransitionIcon()
            setTimeout(()=>{
                const newArray = [...EventInfo.slice(1)];
                if(newArray.length === 0){
                    setEventInfoEmpty(true)
                    setEventInfo(newArray);
                }
            },300)
        }else if(nextPost === -1){
            setNextPost(0)
            setTimeout(()=>{
                fadeInCard();
            }, 800)
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
                <Animated.View style={{position:"absolute", height:'100%', width:'100%', alignItems:'center', justifyContent:'center', zIndex:10, pointerEvents:'none', opacity:nextAnimation, transform:[{scale:transitionIconPop}, {rotate:transitionIconRotate}]}}>
                    <Icons.MaterialCommunityIcons name={transitionIconName.current} color={transitionIconName.current === 'close' ? 'red': transitionIconName.current === 'infinity'? 'black':'green'} size={80}/>
                </Animated.View>
            <Animated.View style={{opacity:eventCard, flex:1}}>
                {toggle ?
                (!EventInfo || loading ? 
                    (<View><Loading /></View>):
                    (EventInfoEmpty?
                        empty({text:'No Individual Events'}): 
                        <Indiivudal 
                        setEventInfo={setEventInfo} 
                        fade={fade} 
                        slideUp={slideUp}
                        startFadeIn={startFadeIn} 
                        EventInfo={!EventInfoEmpty ? EventInfo[0]._data:null} 
                        reject={reject} 
                        decline={decline} 
                        accept={accept} 
                        userID={userID}
                        setNextPost={setNextPost}
                        />)):
                (GroupEventInfoEmpty ? 
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
        </View>
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
        console.log(results.length)
        return results;

    }catch(error){
        console.log(error)
        return null;
    }
}