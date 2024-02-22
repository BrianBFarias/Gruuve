import { View, Animated, Easing} from "react-native"
import { useEffect } from "react";
import Logo from '../../assets/images/logo.png'

export default function Loading(){
    const loadSpin = new Animated.Value(0);

    const spin = loadSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg'],
      });

      useEffect(() => {
        Animated.loop(
          Animated.timing(
            loadSpin,
            {
              toValue: 1,
              delay:500,
              easing: Easing.elastic(1.2),
              duration: 1000,
              useNativeDriver: true,
            }
          )
        ).start();
      }, []);

    return(
        <View style={{position:'absolute',flex:1, display:'flex', justifyContent:'center', height:'100%', width:'100%', left:0, top:0}}>
            <View style={{justifyContent:'center'}}>
            <View style={{backgroundColor:'rgba(0,0,0,0.0)', borderRadius:50, padding:8, alignSelf:'center'}}>
                <Animated.Image source={Logo} style={{position:'relative', alignSelf:'center', height:80, width:80, resizeMode:'contain', transform:[{rotate: spin}]}} />
            </View>
            </View>
        </View>
    )
}