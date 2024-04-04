import React, {useEffect, useRef, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View, Animated, StatusBar, Easing} from "react-native"
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
    const [EventInfo, setEventInfo] = useState<any>(null);
    const [EventInfoEmpty, setEventInfoEmpty] = useState(false)
    const [GroupEventInfo, setGroupEventInfo] = useState<any>(null);
    const [GroupEventInfoEmpty, setGroupEventInfoEmpty] = useState(false)
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null)
    const [nextPost, setNextPost] = useState(0)

    const transitionIconName = useRef('');

    const transitionIconPop = nextAnimation.interpolate({
        inputRange: [0, 2],
        outputRange: [0.6, 1.4],
      }); 

    const TransitionIcon = () =>{
        Animated.timing(nextAnimation, {
            toValue: 2,
            duration: 300,
            delay:50,
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
        // Indivudal
        if(toggle && (EventInfo == null || EventInfo.length===0 && !EventInfoEmpty)){
            setLoading(true)
            const results = await fetchIndividualEvents({userData})
            if(results && results.length === 0){
                setEventInfoEmpty(true)
            }
            setEventInfo(results)
        }
        // Group
        else if((GroupEventInfo == null || GroupEventInfo.length===0 && !GroupEventInfoEmpty)){
            setLoading(true)
            const results = await fetchGroupEvents({userData});
            if(results && results.length === 0){
                setGroupEventInfoEmpty(true)
            }
            setGroupEventInfo(results)
        }
        setLoading(false)
    }

    useEffect(()=>{
        const {userData} = route.params
        setUserID(userData.id)

        if((!EventInfo || EventInfo.length===0 )|| (!GroupEventInfo || GroupEventInfo.length===0)){
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
        <View style={{flex:1, width:'100%', borderTopLeftRadius:10, borderTopRightRadius:10, overflow:'hidden'}}>
        <LinearGradient 
        colors={['rgb(225,225,225)', 'rgb(255,255,255)']}
        start={{x: 0, y: 1}} end={{x: 0, y: 0}}
        locations={[0,0.5]}
        style={{flex:1, width:'100%', justifyContent:'center', alignItems: 'center'}}>
            <Text style={{fontWeight:'800', opacity:0.7, fontSize:24, color:'black'}}>{text}</Text>
            <Text style={{fontWeight:'600', opacity:0.5, fontSize:16, color:'black'}}>Try increasing your search radius in Profile</Text>
            </LinearGradient>
        </View>)
    }

    const fetchGroupEvents = async ({userData}:any) =>{
        const radius = userData.Preference.Radius;
        const lat = userData.Location.Latitude;
        const lng = userData.Location.Longitude;
        const minAge = userData.Preference.AgeRange.min;
        const maxAge = userData.Preference.AgeRange.max;
    
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

            if(results.length == 0){
                setGroupEventInfoEmpty(true)
            }
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

            if(results.length == 0){
                setEventInfoEmpty(true)
            }

            return results;
    
        }catch(error){
            console.log(error)
            return null;
        }
    }

    return(
    <View 
        style={{backgroundColor:'black', flex:1, width:'100%'}}>
        {/* <PopUp /> */}
        <StatusBar  barStyle="light-content" translucent={true} />
        <View style={{alignSelf:'center', alignItems:'center', flex:1, width:'100%'}}>
                <View style={{backgroundColor:'black', width:'100%', alignItems:'center', paddingBottom:8}}>
                    <SafeAreaView />
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
                    backgroundInactive={'rgba(255,255,255,0.1)'}
                    backgroundActive={'rgba(255,255,255,0.1)'}
                    circleActiveColor={'green'}
                    circleInActiveColor={'green'}
                    innerCircleStyle={{ alignItems: "center", justifyContent: "center", height:25, alignSelf:'center', width:'auto', paddingHorizontal:12, }}
                    outerCircleStyle={{alignSelf:'center', flex:1, gap:15}} 
                    switchWidthMultiplier={5}
                    />
                </View>
                <Animated.View style={{position:'absolute', width:'100%', height: '100%', top:0, backgroundColor:'#4b8a43', opacity:nextAnimation, pointerEvents:'none', zIndex:101}}>
                    <Animated.View style={{position:"absolute", height:'100%', width:'100%', alignItems:'center', justifyContent:'center', zIndex:10, pointerEvents:'none', transform:[{scale:transitionIconPop}]}}>
                        <Icons.MaterialCommunityIcons 
                        name={transitionIconName.current} 
                        color={transitionIconName.current === 'close' ? '#8f0600': transitionIconName.current === 'infinity'? 'white':'black'} 
                        opacity={transitionIconName.current === 'send-check' || transitionIconName.current === 'close'?0.6:0.8}
                        size={80}/>
                    </Animated.View>
                </Animated.View>
            <Animated.View style={{opacity:eventCard, flex:1, width:'100%', backgroundColor:'whitesmoke', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                {toggle ?
                (!EventInfo|| loading ? 
                    (<View style={{flex:1}}><Loading /></View>):
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
                (!GroupEventInfo || loading ? 
                    (<View style={{flex:1}}><Loading /></View>):
                    (GroupEventInfoEmpty ?
                        empty({text:'No Group Events'}): 
                        <Group 
                        setGroupEventInfo={setGroupEventInfo} 
                        fade={fade} 
                        startFadeIn={startFadeIn} 
                        GroupEventInfo = {!GroupEventInfoEmpty ? GroupEventInfo[0]._data:null} 
                        reject={reject} 
                        decline={decline} 
                        accept={accept} 
                        />))
                }
            </Animated.View>
        </View>
    </View>
    )
}

const Style = StyleSheet.create({
    toggle:{
        color:'white', fontWeight:'700',textAlign:'center'
    },
    toggleButton:{
        color:'white', fontWeight:'700'
    }
})