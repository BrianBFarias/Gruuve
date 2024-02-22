import { StyleSheet, View, Dimensions, Text } from "react-native"
import Animated, {useAnimatedStyle, useSharedValue, useAnimatedProps, runOnJS} from "react-native-reanimated"
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import ReText from "./ReText";

const KNOBSIZE = 20
const WIDTH = Dimensions.get('window').width - 80;
const MAXWIDTH = WIDTH - KNOBSIZE/4;

export const SliderRange = ({min, max, onValueChange, title, currMin, currMax}) =>{
    const knob1 = useSharedValue(((currMin - min)/(max-min)) * WIDTH);
    const knob1x = useSharedValue(0);
    const scaleKnob1 = useSharedValue(1);

    const knob2 = useSharedValue(((currMax - min)/(max-min)) * WIDTH);
    const knob2x = useSharedValue(0);
    const scaleKnob2 = useSharedValue(1);

    const animatedText1 = useSharedValue(`${currMin}`);
    const animatedText2 = useSharedValue(`${currMax}`);

    const styleLine = useAnimatedStyle(()=>{
        return{
            backgroundColor:'#397844',
            height:6,
            marginTop:-5,
            borderRadius:10,
            width:knob2.value-knob1.value,
            transform:[{translateX:knob1.value}]
        }
    });

    const onDrag1 = Gesture.Pan()
    .onBegin(() => {
        knob1x.value = knob1.value;
    })
    .onChange((event) => {
        scaleKnob1.value = 1.3
        knob1.value = event.translationX + knob1x.value < 0 ? 0 : event.translationX + knob1x.value >  knob2.value-20 ? knob2.value-20: event.translationX + knob1x.value;
        animatedText1.value = `${Math.round((min+((knob1.value/MAXWIDTH) * (max-min))))}`;
    })
    .onEnd(()=>{
        scaleKnob1.value = 1;
        runOnJS(onValueChange)({
            min:`${Math.round((min+((knob1.value/MAXWIDTH) * (max-min))))}`,
            max:`${Math.round((min+((knob2.value/MAXWIDTH) * (max-min))))}`
        })
    });

    const onDrag2 = Gesture.Pan()
    .onBegin(() => {
        knob2x.value = knob2.value;
    })
    .onChange((event) => {
        scaleKnob2.value = 1.3
        knob2.value = event.translationX + knob2x.value < knob1.value+20 ? knob1.value+20 : event.translationX + knob2x.value > MAXWIDTH ? MAXWIDTH: event.translationX + knob2x.value;
        animatedText2.value = `${Math.round((min+((knob2.value/MAXWIDTH) * (max-min))))}`;
    })
    .onEnd(()=>{
        scaleKnob2.value = 1;
        runOnJS(onValueChange)({
            min:`${Math.round((min+((knob1.value/MAXWIDTH) * (max-min))))}`,
            max:`${Math.round((min+((knob2.value/MAXWIDTH) * (max-min))))}`
        })
    });

    const styleKnob1 = useAnimatedStyle(()=>{
        return{
            transform:[{translateX: knob1.value}, {scale:scaleKnob1.value}]
        }
    });

    const styleKnob2 = useAnimatedStyle(()=>{
        return{
            transform:[{translateX: knob2.value}, {scale:scaleKnob2.value}]
        }
    });

    return(
        <View style={{backgroundColor:'rgba(0,0,0,0)', paddingBottom:20, paddingTop:14, borderRadius:20, paddingHorizontal:10}}>
            <View style={styles.rangeContainer}>
                <View style={styles.labelContainer}>
                    <ReText text={animatedText1} style={[styles.label,{position:'absolute', left:0}]}/>
                    <Text style={[styles.label2]}>{title}</Text>
                    <ReText text={animatedText2} style={[styles.label,{position:'absolute', right:0}]}/>
                </View>
            <View style={styles.track} />
                <Animated.View style={styleLine} />
                <GestureHandlerRootView>
                    <GestureDetector gesture={onDrag1}>
                        <Animated.View style={[styles.knob, styleKnob1]}/>
                    </GestureDetector>
                    <GestureDetector gesture={onDrag2}>
                        <Animated.View style={[styles.knob, styleKnob2]}/>
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>
        </View>
    )
}

export const Slider = ({min, max, onValueChange, radius, title, unit}) =>{
    const knob1 = useSharedValue((radius/max) * MAXWIDTH);
    const knob1x = useSharedValue(0);
    const scaleKnob1 = useSharedValue(1);

    const animatedText = useSharedValue(`${radius}`);
    
    const styleLine = useAnimatedStyle(()=>{
        return{
            backgroundColor:'#397844',
            height:6,
            marginTop:-5,
            borderRadius:10,
            width:knob1.value,
            transform:[{translateX:0}]
        }
    });

    const onDrag1 = Gesture.Pan()
    .onBegin(() => {
        knob1x.value = knob1.value;
    })
    .onChange((event) => {
        scaleKnob1.value = 1.3
        knob1.value = event.translationX + knob1x.value < 0 ? 0:event.translationX + knob1x.value  > MAXWIDTH ? MAXWIDTH :event.translationX + knob1x.value ;
        animatedText.value=`${Math.round((min+((knob1.value/MAXWIDTH) * (max-min))))}`;

    })
    .onEnd(()=>{
        scaleKnob1.value = 1;
        runOnJS(onValueChange)({
            radius:Math.round((min+((knob1.value/MAXWIDTH) * (max-min)))),
        })
    });

    const styleKnob1 = useAnimatedStyle(()=>{
        return{
            transform:[{translateX: knob1.value}, {scale:scaleKnob1.value}]
        }
    });

    return(
        <View style={{backgroundColor:'rgba(0,0,0,0.0)', paddingBottom:20, paddingTop:14, borderRadius:20, paddingHorizontal:10}}>
            <View style={styles.rangeContainer}>
                <View style={styles.labelContainer2}>
                    <Text  style={styles.label2}>{title}</Text>
                    <View style={{flexDirection:'row', gap:5}}>
                        <ReText text={animatedText} style={styles.label}/>
                        <Text style={styles.label}>{unit}</Text>
                    </View>
                </View>
            <View style={styles.track} />
                <Animated.View style={styleLine} />
                <GestureHandlerRootView>
                    <GestureDetector gesture={onDrag1}>
                        <Animated.View style={[styles.knob, styleKnob1]}/>
                    </GestureDetector>
                </GestureHandlerRootView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rangeContainer:{
        justifyContent:'center',
        alignContent:'center',
        alignSelf:'center'
    },
    track:{
        height:4,
        backgroundColor:'rgba(0,0,0,0.5)',
        borderRadius:10,
        width:WIDTH,
    },
    labelContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:14
    },
    labelContainer2:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:14
    },
    label:{
        color:'#497844',
        fontFamily:'AppleSDGothicNeo-Bold',
        fontWeight:'600',
        fontSize:16,
    },
    label2:{
        color:'#264f21',
        fontFamily:'AppleSDGothicNeo-Bold',
        fontWeight:'900',
        fontSize:18,
    },
    knob:{
        position:'absolute',
        backgroundColor:'#0b4710',
        height:KNOBSIZE,
        width:KNOBSIZE,
        marginTop:-KNOBSIZE+8,
        marginLeft:-8,
        borderRadius:10,
        shadowColor:'white',
        shadowRadius:2,
        shadowOpacity:1,
        shadowOffset:{width:0, height:0}
    }
})