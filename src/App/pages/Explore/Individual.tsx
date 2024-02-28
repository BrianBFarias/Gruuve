import { useEffect } from "react"
import { View, Text, Animated } from "react-native"

export const Indiivudal = ({fade, startFadeIn}:any) =>{

    useEffect(()=>{
        startFadeIn()
    })
    
    return(
    <Animated.View style={{ flex:1, backgroundColor:'transparent', opacity:fade, alignSelf:'center'}}>
        <Text>Individual</Text>
    </Animated.View>
    )
}