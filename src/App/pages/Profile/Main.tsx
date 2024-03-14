import { View, Image, Text, Dimensions, ScrollView, SafeAreaView, TouchableOpacity } from "react-native"
import icons from "../../../components/icons";
import { useEffect, useState } from "react";
import {Images} from './Images'
import LinearGradient from "react-native-linear-gradient";
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import findAge from "../../../components/ConstantFunctions/Age";
import { toDate } from "../../../components/ConstantFunctions/Date";

export default function ProfileMain({userData, disabled, navigation}:any){
    const [Image1, setImage1] = useState<any>();
    const [allImages, setAllImages]  = useState<any>();
    const [age,setAge] = useState<any>()

    useEffect(()=>{
        fetchImages();
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
            setImage1('https://picsum.photos/200/300')
            downloadedUrls.shift()
            console.log(downloadedUrls)
            setAllImages(['https://picsum.photos/200/300', 'https://picsum.photos/200/300'])
        }
    }

    function Subscription(){
        // Show Subscription Page
    }

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

    return(
        <ScrollView style={{width:'100%',}} bounces={false}>
            <SafeAreaView />
            <TouchableOpacity onPress={setMainImage} style={{height: 100, width:100, shadowColor:'black', shadowOffset:{height:0, width:0}, shadowRadius:4, shadowOpacity:0.5, alignSelf:'center', borderRadius:150, borderColor:'green', borderWidth:4}}>
                <View style={{position:'absolute', top:0, right:0, height:25, width:25, backgroundColor:'white', zIndex:3, borderRadius:20, justifyContent:'center'}}>
                    <View style={{alignSelf:'center'}}><icons.MaterialIcons name='edit' size={16} color='black'/></View>
                </View>
                <View style={{position:'relative', height: '100%', width:'100%', overflow:'hidden', borderRadius:150, borderColor:'rgb(215,215,215)', borderWidth:4}}>
                    {disabled && 
                    <View style={{position:'absolute', backgroundColor:'rgba(0,0,0,0.5)', width:'100%', height:'100%', zIndex:10, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontWeight:'700', textAlign:'center'}}> Account Disabled</Text>
                    </View>}
                    <Image 
                        source={{uri:`${Image1}`}} 
                        style={{height:'100%', width:'100%'}}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center', margin:10, fontSize:18, fontWeight:'600'}}>{userData.First} {userData.Last}</Text>
            <View style={{width:'100%', backgroundColor:'rgba(0,0,0,0)', paddingVertical:20}}>
                <Images 
                allImages={allImages}
                setAllImages ={setAllImages}
                refetch = {refetch} />
            </View>
            <TouchableOpacity style={{marginHorizontal:8, shadowColor:'black', shadowRadius:8, shadowOffset:{height:1, width:0}, shadowOpacity:0.6}} onPress={Subscription}>
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
            </TouchableOpacity>
        </ScrollView>
    )
}