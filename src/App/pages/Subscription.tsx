import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";

export function SubscriptionPopUp({isVisible, setIsVisible}:any){

    return(
        <Modal
        isVisible={isVisible} 
        animationOut={'slideOutDown'} 
        animationIn={'slideInUp'}
        useNativeDriver={false}
        backdropColor="white"
        backdropOpacity={0}
        style={{flex: 1, margin: 0}}
        hideModalContentWhileAnimating={false} 
        onSwipeCancel={()=>{setIsVisible(false)}}
        >
            <LinearGradient
                colors={['#295d16', '#558843']}
                start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                locations={[0,1]}
                style={{flex:1, alignItems:'center'}}>            
                    <SafeAreaView />
                    <Text style={{fontWeight:'700', fontSize:30, color:'white'}}>Gruuve+</Text>
                    <View style={{flex:0.5}} />
                    <Text style={{fontWeight:'700', fontSize:25, opacity:0.6}}>Coming soon...</Text>
                    <Text>Dont worry Beta Gives you full access :)</Text>
                    <View style={{flex:1}} />
                    <TouchableOpacity onPress={()=>{setIsVisible(false)}} style={{backgroundColor:'black', borderRadius:20, padding:6, width:'60%', alignItems:'center'}}>
                        <Text style={{fontWeight:'500', fontSize:20, color:'white'}}>Cancel</Text>
                    </TouchableOpacity>    
                    <View style={{flex:.1}} />
                    <SafeAreaView />
                </LinearGradient>

        </Modal>
    )
}