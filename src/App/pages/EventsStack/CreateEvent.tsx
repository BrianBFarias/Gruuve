import React, { useState } from "react";
import { View, Dimensions, Text, TextInput, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from "react-native-linear-gradient";
import DateTimePicker from '@react-native-community/datetimepicker';
import Button1 from "../../../components/Button";
import firebase from '@react-native-firebase/app'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as geofirestore from 'geofirestore';
import { toDate } from "../../../components/ConstantFunctions/Date";
import MapView from "react-native-maps";
import Icons from "../../../components/icons";

const TITLELIMIT = 20
const DESCRIPTIONLIMIT = 80
const WIDTH = Dimensions.get('window').width;

interface coordinate {
    latitude: number | undefined;
    longitude: number | undefined;
}

export const NewEvent = ({navigation, route}:any) =>{
    const [loading, setLoading] = useState(false)

    const { user } = route.params;

    const [inValidTitle, setInvalidTitle] = useState(false)
    const [inValidDate, setInValidDate] = useState(false)

    const [title, setTitle] = useState('')
    const [titleLimit, setTitleLimit] = useState(TITLELIMIT);
    const [individual, setIndividual] = useState(true);

    const [date, setDate] = useState(new Date());
    
    const [description, setDescription] = useState('')
    const [descriptionLimit, setDescriptionLimit] = useState(DESCRIPTIONLIMIT);

    const onChange = (event:any, selectedDate:any) => {
        const currentDate = selectedDate;
        setDate(currentDate);
      };
    
    function titleCheck(val:any){
        if(TITLELIMIT >= val.length){
            setTitle(val);
            setTitleLimit(TITLELIMIT-val.length)
        }else{
            return
        }
    }

    function descriptionCheck(val:any){
        if(DESCRIPTIONLIMIT >= val.length){
            setDescription(val);
            setDescriptionLimit(DESCRIPTIONLIMIT-val.length)
        }else{
            return
        }
    }

    function updateLocation(Region:coordinate){

    }

    async function sendPost(){
        // Valid form??
        const currDate = new Date()

        if(title === ''){
            setInvalidTitle(true)
        }else{
            setInvalidTitle(false)
        }if (date < currDate){
            setInValidDate(true)
        }else{
            setInValidDate(false)
        }
        if(title !== '' && date > currDate){

            setLoading(true) //start loading screen

            const firestoreRef = firebase.firestore();

            // @ts-ignore
            const GeoFirestore = geofirestore.initializeApp(firestoreRef);

            const geocollection = GeoFirestore.collection('Events');

            const uid = auth().currentUser?.uid
    
            const userData = await firestore().collection('Users').doc(uid).get()
            const lat = userData._data?.Location.Latitude;
            const long = userData._data?.Location.Longitude;
            const sex = userData._data?.Sex
            

            if(!lat || !long){
                Alert.alert("There was an error", "Please try again later")
                return;
            }
            const id = firestore().collection("Events").doc().id;

            geocollection.add({
                id:id,
                Title:title,
                Description:description,
                Date: date,
                Individual:individual,
                Host:uid,
                Sex: sex,
                coordinates: new firebase.firestore.GeoPoint(lat, long)
              }).then(()=>{
                setLoading(false)
                return;
              }).catch((error:any)=>{
                console.log(error)
                Alert.alert("Error", error.message || "An unknown error occurred");
                setLoading(false)             
            })

            navigation.goBack()
        }
        return;
    }

    return(
    <LinearGradient 
        colors={['rgb(245,245,245)', 'rgb(245,245,245)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        <View style={{flex:1, position:'relative'}}>
            <MapView
                rotateEnabled={false}
                loadingEnabled={true}
                showsPointsOfInterest={true}
                showsIndoorLevelPicker={true}
                followsUserLocation={true}
                onRegionChangeComplete={(Region) => updateLocation(Region)}
                userLocationCalloutEnabled={true}
                loadingBackgroundColor='white'
                onRegionChange={()=>{}}
                style={{position:'relative', display:'flex', zIndex:11, width:'100%', backgroundColor:'gray', justifyContent:'center', height:240, minHeight:'30%'}}
                initialRegion={{
                    latitude: user.Location.Latitude,
                    longitude: user.Location.Longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.09}}
                >
                <Icons.MaterialIcons name="location-on" style={{alignSelf:'center'}} size={50} color='#539953'/>
            </MapView>
            <View style={{position:'relative', zIndex:21, top:-10}}>
                <KeyboardAwareScrollView contentContainerStyle={{position:'relative', display:'flex', zIndex:20, justifyContent:'flex-start', gap:10, borderTopLeftRadius:12, borderTopRightRadius:12, backgroundColor:'whitesmoke', overflow:'hidden'}} bounces={false}>
                    <View style={{alignSelf:'center'}}>
                        <View style={{backgroundColor:'white', flexDirection:'row', justifyContent:'space-between', gap:20, padding:5, paddingHorizontal:20, borderBottomLeftRadius:12, borderBottomRightRadius:12}}>
                            <TouchableOpacity onPress={()=>setIndividual(true)}>
                                <Text style={individual?(Style.selected):(Style.option)}>Individual</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setIndividual(false)}>
                                <Text style={!individual?(Style.selected):(Style.option)}>Group</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{alignSelf:'center'}} >
                        <TextInput
                            placeholder={'Event Title'}
                            placeholderTextColor={'rgba(0,0,0,0.3)'}
                            onChangeText={(val)=>{titleCheck(val)}}
                            style={inValidTitle?([Style.textInput, {borderWidth:2, borderColor:'rgba(227, 62, 50, 0.8)'}]):([Style.textInput, {borderWidth:2, borderColor:'transparent'}])}
                            value={`${title}`}
                        />
                        <Text style={Style.subText}><Text style={{fontWeight:'700', color:'black'}}>{titleLimit}</Text> letters left</Text>
                    </View>
                    <View style={{flexDirection:'column', alignSelf:'center', justifyContent:'center', alignItems:'center', marginVertical:5}}>
                        <View style={inValidDate?{borderColor:'rgba(227, 62, 50, 0.8)', borderWidth:2,padding:5, borderRadius:10}:{padding:5, borderColor:'transparent', borderWidth:2}}>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={'datetime'}
                                themeVariant="light"
                                accentColor="green"
                                onChange={onChange}
                                display="compact"
                                minuteInterval={15}
                                />  
                        </View>       
                    </View>
                    <View style={{flexDirection:'row', gap:10, paddingHorizontal:20}}>
                        <View style={{borderWidth:1.5, borderRadius:4, flex:1, height:0, backgroundColor:'#29612F', alignSelf:'center', opacity:0.4, borderColor:'black'}}/>
                        <Text style={{alignSelf:'center', fontSize:20, fontWeight:'600', opacity:0.6, color:'black'}}>Boost Your Event</Text>
                        <View style={{borderWidth:1.5, borderRadius:4, flex:1, height:0, backgroundColor:'#29612F', alignSelf:'center', opacity:0.4, borderColor:'black'}}/>
                    </View>
                    <View style={{alignSelf:'center',}}>
                        <TextInput
                            placeholder={'Give a Description'}
                            placeholderTextColor={'rgba(0,0,0,0.3)'}
                            onChangeText={(val)=>{descriptionCheck(val)}}
                            style={Style.textInput2}
                            value={`${description}`}
                            multiline={true}
                        />
                        <Text style={Style.subText}><Text style={{fontWeight:'700', color:'black'}}>{descriptionLimit}</Text> letters left</Text>
                    </View>
                    <View style={{flex:2, padding:20}}>
                        <TouchableOpacity onPress={sendPost}>
                            <Button1 text={'Post'}/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </View>
    </LinearGradient>
    )
}

const Style = StyleSheet.create({
    title1:{
        fontWeight:'800',
        fontSize:18,
        color:'#29612F',
        paddingVertical:5,
        paddingHorizontal:'3%'
    },
    subText:{
        fontWeight:'500',
        fontSize:13,
        paddingTop:5,

        color:'rgba(0,0,0,0.7)'
    },
    textInput:{
        backgroundColor:'rgba(0,0,0,0.08)',
        fontSize:18,
        width: (WIDTH*.8),
        padding:8,
        borderRadius:6,
    },
    textInput2:{
        backgroundColor:'rgba(0,0,0,0.08)',
        fontSize:16,
        height:80,
        width: (WIDTH*.8),
        padding:8,
        borderRadius:6,
    },
    selected:{
        backgroundColor:'green',
        color:'white',
        padding:3,
        borderRadius:10,
        overflow:'hidden',
        paddingHorizontal:20,
        fontWeight:'500',
        fontSize:18
    },
    option:{
        color:'black',
        padding:3,
        borderRadius:5,
        overflow:'hidden',
        paddingHorizontal:20,
        fontWeight:'500',
        fontSize:18
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
})