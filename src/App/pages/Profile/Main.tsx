import { View, Image, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet, Pressable, LogBox, Alert } from "react-native"
import icons from "../../../components/icons";
import { useEffect, useState } from "react";
import {Images} from './Images'
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import findAge from "../../../components/ConstantFunctions/Age";
import { toDate } from "../../../components/ConstantFunctions/Date";
import { LocationName } from '../../../components/ConstantFunctions/LocName';

import FastImage from "react-native-fast-image";
import { HobbySelection } from "./HobbySelection";
import { LocationSelection } from "./LocationSelection";
import {HeightSelection} from"./heightSelection";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {CircleFade} from 'react-native-animated-spinkit'

import auth from '@react-native-firebase/auth';

// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY

export default function ProfileMain({userData, disabled, navigation, settingsToggle}:any){
    LogBox.ignoreAllLogs();
    const [currUserData, setCurrUserData] = useState(userData)

    const [Image1, setImage1] = useState<any>();
    const [allImages, setAllImages]  = useState<any>();
    const [age,setAge] = useState<any>();
    const [saving, setSaving] = useState(false);

    // popUps to edit Profile (Not preferences)
    const [hobbiesPage, setHobbiesPage] = useState(false);
    const [hobbies, setHobbies] = useState(currUserData.Hobbies);
    
    const [heightPage, setHeightPage] = useState(false);
    const [height, setHeight] = useState(currUserData.Height);
    const [location, setLocation] = useState(currUserData.Location.area)

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [locationSelector, setLocationSelector] = useState(false)

    async function fetchUser(){
        const uid = auth().currentUser?.uid;
        const userInfo = await firestore().collection('Users').doc(uid).get();
        if(userInfo?._data){
            setCurrUserData(userInfo?._data);
            setHobbies(userInfo?._data.Hobbies)
            setHeight(userInfo?._data.Height)
        }
    }

    useEffect(()=>{
        fetchImages();
        const fetchData = async () => {
            await fetchUser();
        };

        fetchData();
    },[])

    const fetchImages = async() =>{
        const user = await firestore().collection('Users').doc(userData.uid).get()
        if(user._data && user._data.ImageURLs){
            const BirthDateTimeStamp = new Date(userData.BirthDate.seconds * 1000)

            setAge(findAge(BirthDateTimeStamp))

            const imageUrls = user._data.ImageURLs
            const downloadPromises = imageUrls.map(async (url: string) => {

                try {
                    return await storage().refFromURL('gs://greekgators-38675.appspot.com/' + url).getDownloadURL();
                } catch (error) {
                    console.log(error);
                }
            });

            const downloadedUrls = await Promise.all(downloadPromises);
            setImage1(downloadedUrls[0])
            // downloadedUrls.shift()
            // console.log(downloadedUrls)
            setAllImages(downloadedUrls)
        }
    }

    function Subscription(){
        // Show Subscription Page
    }

// Confirm Age
  const AgeConfirmation = (date:any) => {
    const ageNum = findAge(date)
    if(ageNum<18){
      Alert.alert('Age Warning', 'You Must be at least 18 to register with Gruuve')
      return;
    }
    setAge(ageNum)

    // 
    
    setDatePickerVisibility(false);
  };

    function setMainImage(){
        ImagePicker.openPicker({
            width: 300,
            height: 320,
            cropping: true,
            mediaType:'photo',
            includeBase64:true,
            forceJpg:true
          }).then(image => {
            if (image && image.sourceURL && image.cropRect) {
                const saveImage = {
                    uri: image.sourceURL,
                    data: image.data || '',
                    mime: image.mime,
                    height: 320,
                    width: 300,
                    x: image.cropRect.x,
                    y: image.cropRect.y,
                }
                // Save new Image
              }
        });
    }

    function refetch(){
        // refetch all userData
    }

    function editOption(num:number){
        switch(num){
            case 5:setHeightPage(true) 
                break; 
            case 4: setHobbiesPage(true) 
                break; 
            case 3:
                setLocationSelector(true)
                break
            case 2:
                setDatePickerVisibility(true)
                break;
        }
    }

    return(
        <>            
        <SafeAreaView style={{backgroundColor:'rgb(240,240,240)', marginBottom:6,zIndex:12}} />
        <ScrollView style={{flex:1, width:'100%', overflow:'visible', zIndex:10}} bounces={false}>
            <View style={{width:'90%', flexDirection:'row', alignContent:'center', alignSelf:'center', justifyContent:'space-between'}}>
                <TouchableOpacity onPress={settingsToggle} style={{marginTop:10}}>
                    <icons.FontAwesome6 name='sliders' size={25} color='black' opacity={0.7}/>
                </TouchableOpacity>
                <Text style={{textAlign:'right', alignSelf:'center', fontSize:30, fontWeight:'800', opacity:0.8}}>Profile</Text>
            </View>
            <View style={{width:'100%', backgroundColor:'rgba(0,0,0,0)', paddingVertical:20}}>
                <Images 
                    allImages={allImages}
                    setAllImages ={setAllImages}
                    // refetch = {refetch}
                    setSaving={setSaving} />
            </View>
            {!userData.premiumMember && <TouchableOpacity style={{marginHorizontal:8, shadowColor:'black', shadowRadius:6, shadowOffset:{height:1, width:0}, shadowOpacity:0.5}} onPress={Subscription}>
                <LinearGradient
                    colors={['#295d16', '#558843']}
                    start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                    locations={[0,1]}
                    style={{padding:10, borderRadius:10}}>
                    <View style={{flexDirection:'column', gap:10}}>
                        <Text style={{color:'white', fontWeight:'700', fontSize:18}}>Upgrade to Gruuve+</Text>
                        <View style={{flexDirection:'row', justifyContent:'flex-end', gap:5}}>
                            <Text style={{color:'white', fontWeight:'400', alignSelf:'center', fontSize:20}}>For</Text>
                            <Text style={{color:'white', fontWeight:'700', alignSelf:'flex-end', fontSize:22}}>$4.99/Month</Text>
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>}
            <View style={{flex:1, backgroundColor:'rgba(255,255,255,0.9)', marginTop:12, minHeight:317, paddingVertical:10}}>
                <Pressable style={style.container1}>
                    <Text style={style.text2}>First Name</Text>
                    <Text style={style.text3}>{userData.First}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1}>
                    <Text style={style.text2}>Last Name</Text>
                    <Text style={style.text3}>{userData.Last}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1} onPress={() => editOption(2)}>
                    <Text style={style.text2}>Age</Text>
                    <Text style={style.text1}>{age}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1} onPress={() => editOption(5)}>
                    <Text style={style.text2}>Height</Text>
                    <Text style={style.text1}>{userData.Height}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1} onPress={() => editOption(3)}>
                    <Text style={style.text2}>Location</Text>
                    <Text style={style.text1}>{location}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1}>
                    <Text style={style.text2}>Sex</Text>
                    <Text style={style.text1}>{userData.Sex}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container2} onPress={() => editOption(4)}>
                    <Text style={style.text2}>Hobbies</Text>
                    <View style={{flexDirection:'row', flexWrap:'wrap', gap:10, marginTop:3}}>
                        {hobbies.map((element:String, index:number) => (
                            <Text style={style.hobby} key={index}>{element}</Text>
                        ))}
                    </View>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1}>
                    <Text style={style.text2}>Organization</Text>
                    <Text style={userData.Organization.length === 0 ? style.empty:style.text1}>{userData.Organization.length === 0 ? 'None': userData.Organization}</Text>
                </Pressable>
                <View style={style.line}/>
                <Pressable style={style.container1}>
                    <Text style={style.text2}>School</Text>
                    <Text style={userData.School.length === 0 ? style.empty:style.text1}>{userData.School.length === 0 ? 'None': userData.School}</Text>
                </Pressable>
            </View>
            {/* Pop Ups */}
            
            <HobbySelection 
                isVisible={hobbiesPage}
                setIsVisible={setHobbiesPage}
                hobbies={hobbies}
                setHobbies={setHobbies}
            />
            <HeightSelection 
                isVisible={heightPage}
                setIsVisible={setHeightPage}
                height={height}
                setHeight={setHeight}
            />
            <LocationSelection 
                isVisible={locationSelector}
                setIsVisible={setLocationSelector}
                currentLocation={userData.Location}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={AgeConfirmation}
                onCancel={()=>{ setDatePickerVisibility(false);}}
            />
        </ScrollView>
        {saving && 
            <View style={{width:'100%', height:'100%', left:0, top:0, backgroundColor:'rgba(0,0,0,0.6)', zIndex:200, position:'absolute', justifyContent:'center'}}>
                <CircleFade style={{alignSelf:'center'}} color="white"/>
            </View>}
        </>
    )
}

const style = StyleSheet.create({
    line:{
        width:'95%', 
        height:1.5, 
        backgroundColor:'black', 
        alignSelf:'center', 
        borderRadius:10, 
        opacity:0.3
    },
    container1:{
        width:'100%', 
        flexDirection:'row',
        justifyContent:'space-between', 
        alignSelf:'center', 
        paddingHorizontal:40,
        paddingVertical:10
    },
    container2:{
        width:'100%', 
        flexDirection:'column',
        justifyContent:'space-between', 
        alignSelf:'center', 
        paddingHorizontal:40,
        paddingVertical:10
    },
    text1:{
        fontSize:16,
        fontWeight:'600',
        opacity:0.9,
    },
    text2:{
        fontSize:16,
        fontWeight:'400',
        opacity:0.7
    },
    text3:{
        fontSize:16,
        fontWeight:'700',
        opacity:0.7,
    },
    hobby:{
        backgroundColor:'#448843',
        color:'rgba(255,255,255,1)',
        fontWeight:'600',
        paddingHorizontal:8,
        padding:5,
        borderRadius:10,
        overflow:'hidden'
    },
    empty:{
        fontSize:16,
        fontWeight:'400',
        opacity:0.5
    },
})