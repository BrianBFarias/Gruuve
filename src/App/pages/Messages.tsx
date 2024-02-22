import React, { useContext } from "react";
import { View, SafeAreaView, Text, Button } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import Loading from "../../components/Loading";
export const Messages = () =>{

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        <SafeAreaView />
        {/* <Text style={{ alignSelf:'center', fontSize:20 }}>MESAGGESS</Text> */}
        <Loading />
    </LinearGradient>
    )
}