import { View, Text, TouchableOpacity, Animated, StyleSheet} from "react-native"
import icons from "./icons"
import { useEffect } from "react"
import Swiper from "react-native-swiper"

const size = new Animated.Value(0)

export const PopUp = (props) =>{

    useEffect(()=>{
        present()
    },[])

    const present = () =>{
        Animated.timing(size, {
            toValue: 1,
            duration: 200,
            delay:0,
            useNativeDriver: true,
          }).start();
       }

    const hide = () =>{
        size.setValue(1)
        Animated.timing(size, {
            toValue: 0,
            duration: 200,
            delay:0,
            useNativeDriver: true,
          }).start();
       }

    function handleNext(){
        hide()
        setTimeout(()=>{
            props.onAccept()
        }, 200)
    }
    return(
        <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,0.6)', zIndex:101, justifyContent:'center'}}>
            <Animated.View style={{alignSelf:'center', backgroundColor:'white', borderRadius:10, shadowColor:'black', shadowOffset:{height:0, width:0}, shadowRadius:50, shadowOpacity:1, gap:10, transform:[{scale: size}], minHeight:'35%', width:'75%'}}>
                <Swiper
                    showsButtons={false}
                    loop={false}
                    activeDotColor={'green'}
                    loadMinimal={true} 
                    containerStyle={{flex:1}}
                >
                    <View  style={styles.slide1}>
                        <Text style={{alignSelf:'center', fontSize:22, fontWeight:'700', marginBottom:15}}>Welcome to Gruuve</Text>
                        <Text style={{alignSelf:'center', fontSize:12, fontWeight:'400', marginBottom:15, opacity:0.7, textAlign:'center'}}>Run through this very quick Intro to get you started</Text>

                        <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                            <icons.MaterialCommunityIcons name="close" color={'#8B2929'} size={34}/>
                            <Text style={styles.text1}>- Reject a User</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                            <icons.MaterialCommunityIcons name="infinity" color={'black'} size={34}/>
                            <Text style={styles.text1}>- Decline an Event</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                            <icons.MaterialCommunityIcons name="send-check" color={'#5F8B58'} size={34}/>
                            <Text style={styles.text1}>- Show interest for an Event</Text>
                        </View>
                    </View>
                    <View style={styles.slide2}>
                        <Text style={{alignSelf:'center', margin:10, fontSize:20, fontWeight:'700'}}>Handle Images</Text>
                        <View style={{height:180, width:150, backgroundColor:'rgba(0,0,0,0.3)', alignSelf:'center', borderRadius:5, flexDirection:'row',justifyContent:"space-around"}}>
                            <View style={styles.mockImageClick}>
                                <icons.MaterialIcons name={'touch-app'} size={40} color='white' />
                                
                            </View>
                            <View style={styles.mockImageClick}>
                                <icons.MaterialIcons name={'touch-app'} size={40} color='white' />
                            </View>
                        </View>
                    </View>
                    <View  style={styles.slide2}>
                        <Text style={{alignSelf:'center', fontSize:22, fontWeight:'700', marginBottom:15}}>Additional Info</Text>
                        <View style={{flexDirection:'row', alignItems:'center', gap:10,}}>
                            <Text style={styles.text1}>Swipe to Delete Events</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                            <Text style={styles.text1}>Tap Event to View More Info</Text>
                        </View>
                        <View style={{flex:1}}/>
                        <TouchableOpacity style={{alignSelf:'center', backgroundColor:'black', paddingVertical:5, paddingHorizontal:'10%', borderRadius:10, marginTop:15}} onPress={handleNext}>
                            <Text style={{color:'white', fontSize:18}}>Continue</Text>
                        </TouchableOpacity>
                        <View style={{flex:1}}/>
                    </View>
                </Swiper>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    text1:{
        fontSize:16
    }, 
    slide1:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding:20
    },
    slide2:{
        flex:1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap:12,
        padding:20
    },
    mockImageClick:{
        height:'95%',
        width:'45%',
        backgroundColor:'rgba(0,0,0,0.2)',
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:3
    }
})