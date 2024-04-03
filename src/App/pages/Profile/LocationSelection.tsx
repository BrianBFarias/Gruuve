import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Modal from "react-native-modal";
import icons from '../../../components/icons';
import Icons from '../../../components/icons';

export function LocationSelection(this: any, {isVisible, setIsVisible, Location, currentLocation}:any){

    function confirmation(){
        
    }

    return(
        <Modal
        isVisible={isVisible} 
        animationOut={'slideOutDown'} 
        animationIn={'slideInUp'}
        useNativeDriver={true} 
        hideModalContentWhileAnimating={true} 
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
                    <View style={{flex:1, backgroundColor:'white', justifyContent:'center', margin:10, borderRadius:10, overflow:'hidden'}}>
                        <MapView
                            provider={null}
                            showsUserLocation={false}
                            rotateEnabled={false}
                            loadingEnabled={true}
                            showsPointsOfInterest={true}
                            followsUserLocation={true}
                            userLocationCalloutEnabled={true}
                            loadingBackgroundColor='white'
                            onRegionChange={()=>{}}
                            style={{height:'100%', width:'100%', backgroundColor:'white', justifyContent:'center', position:'absolute'}}
                            initialRegion={{
                                latitude: currentLocation.Latitude,
                                longitude: currentLocation.Longitude,
                                latitudeDelta: 0.06,
                                longitudeDelta: 0.06,
                            }}>
                        <Icons.MaterialIcons name="location-on" style={{alignSelf:'center', justifyContent:'center'}} size={50} color='#295d16'/>
                    </MapView>
                </View>
                <SafeAreaView />
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