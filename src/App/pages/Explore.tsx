import React, {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import Toggle from "react-native-toggle-element";
import { Switch } from 'react-native-switch';

export const Explore = () =>{
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        
    },[toggle])

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        <SafeAreaView />
        <View style={{alignSelf:'center'}}>
        <Switch
            value={toggle}
            onValueChange={(val) => setToggle(val)}
            disabled={false}
            activeText={'Individual'}
            circleSize={40}
            barHeight={30}
            circleBorderWidth={0}
            activeTextStyle={Style.toggle}
            inactiveTextStyle={Style.toggle}
            inActiveText={'Group'}
            renderInsideCircle={() => <Text style={Style.toggleButton}>{!toggle ? 'Individual':'Group'}</Text>}
            backgroundInactive={'rgba(0,0,0,0.15)'}
            backgroundActive={'rgba(0,0,0,0.15)'}
            circleActiveColor={'green'}
            circleInActiveColor={'green'}
            innerCircleStyle={{ alignItems: "center", justifyContent: "center", height:25, alignSelf:'center', width:'auto', paddingHorizontal:12 }}
            outerCircleStyle={[{width:'auto', alignSelf:'center', flex:1, gap:15}]} 
            switchWidthMultiplier={5}
            />
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