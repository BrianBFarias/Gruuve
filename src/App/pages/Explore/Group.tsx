import { useEffect } from "react"
import { View, Text, Animated } from "react-native"
import LinearGradient from "react-native-linear-gradient"

export const Group = ({fade, startFadeIn}:any) =>{

    useEffect(()=>{
        startFadeIn()
    })
    
    return(
    <Animated.View style={{flex:1, backgroundColor:'transparent', opacity:fade, alignSelf:'center'}}>
        <LinearGradient 
        colors={['rgb(235,235,235)', 'rgb(255,255,255)']}
        start={{x: 0, y: 0}} end={{x: 0, y: 1}}
        locations={[0,0.5]}
        style={{flex:1}}>
            <Text>Group</Text>

        </LinearGradient>
    </Animated.View>
    )
}