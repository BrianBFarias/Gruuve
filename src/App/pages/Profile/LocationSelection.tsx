import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Modal from "react-native-modal";
import Icons from '../../../components/icons';
import { LocationName } from '../../../components/ConstantFunctions/LocName';
import { useEffect, useRef, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface coordinate {
    latitude: number | undefined;
    longitude: number | undefined;
}

export function LocationSelection({isVisible, setIsVisible, currentLocation, setLocation}:any){
    const [tempLocation, setTempLocation] = useState<coordinate>(currentLocation)
    const [accessable, setAccessable] = useState(false)
    const [locationName, setLocationName] = useState('');

    const mapViewRef = useRef<MapView>(null);

    async function confirmation() {
        const currentUser = auth().currentUser;
        if (currentUser) {
            const area = await LocationName(tempLocation)

            // Perform the Firestore update with the user ID
            await firestore()
                .collection('Users')
                .doc(currentUser.uid)
                .update({
                    Location: {
                        Latitude: tempLocation.latitude,
                        Longitude: tempLocation.longitude,
                        area: area
                    },
                })
                .then(() => {
                    setLocation(area)
                    setIsVisible(false);
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                });
        } else {
            // No user is signed in
            console.error("No user signed in.");
        }
    }

    function updateLocation(Region:coordinate){
        if(accessable){
            setTempLocation(Region)
        }
    }

    return(
        <Modal
        isVisible={isVisible} 
        onModalShow = {()=>setAccessable(true)}
        onModalHide={()=>setAccessable(false)}
        animationOut={'slideOutDown'} 
        animationIn={'slideInUp'}
        useNativeDriver={true} 
        hideModalContentWhileAnimating={false} 
        backdropOpacity={0}
        style={{flex: 1, margin: 0}}>
            <View style={{flex:1, backgroundColor:'white', width:'100%', height:'100%', position:'absolute'}}>
                    <SafeAreaView />
                    <View style={{flexDirection:'row', justifyContent:'space-between', width:'85%', alignSelf:'center', marginVertical:10}}>
                        <Pressable onPress={() => {setIsVisible(false)}}>
                            <Text style={style.button}>Cancel</Text>
                        </Pressable>
                        <Pressable onPress={confirmation}>
                            <Text style={style.button}>Save</Text>
                        </Pressable>
                    </View>
                    <View style={{flex:1, backgroundColor:'white', justifyContent:'center', borderRadius:4, overflow:'hidden'}}>
                    <MapView
                            ref={mapViewRef}
                            rotateEnabled={false}
                            loadingEnabled={true}
                            showsPointsOfInterest={true}
                            showsIndoorLevelPicker={true}
                            followsUserLocation={true}
                            onRegionChangeComplete={(Region) => updateLocation(Region)}
                            userLocationCalloutEnabled={true}
                            loadingBackgroundColor='white'
                            onRegionChange={()=>{}}
                            style={{height:'100%', width:'100%', backgroundColor:'white', justifyContent:'center', position:'absolute'}}
                            initialRegion={{
                                latitude: currentLocation.Latitude,
                                longitude: currentLocation.Longitude,
                                latitudeDelta: 0.09,
                                longitudeDelta: 0.09,
                            }}>
                        <Icons.MaterialIcons name="location-on" style={{alignSelf:'center'}} size={50} color='#539953'/>
                    </MapView>
                    {accessable && <View style={{bottom:'10%', position:'absolute', width:'100%', alignItems:'center'}}>
                        <Text style={{fontSize:26, fontWeight:'800', shadowColor:'white', shadowOffset:{height:0, width:0}, shadowOpacity:0.1, shadowRadius:3, color:'#052605'}}>{locationName}</Text>
                        <SafeAreaView />
                    </View>}
                </View>
            </View>
        </Modal>
    )
}

const style= StyleSheet.create({
    hobby:{ 
        padding: 8,
        backgroundColor: 'rgb(230,230,230)', 
        borderRadius: 10 
    },
    selectedHobby:{
        padding: 8,
        backgroundColor: '#39782c', 
        borderRadius: 10,
        color:'white'
    },
    text1:{
        fontWeight:'500',
        color:'white'
    },
    text2:{
        fontWeight:'500',
        color:'black',
        opacity:0.8
    },
    button:{
        fontSize:20,
        fontWeight:'600',
        color:'green'
    }
})