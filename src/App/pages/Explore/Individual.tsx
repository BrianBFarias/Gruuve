import { useEffect, useState } from "react"
import { View, Text, Animated, StyleSheet, TouchableOpacity } from "react-native"
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper'
import icons from "../../../components/icons";
import { toDate } from "../../../components/ConstantFunctions/Date";

export const Indiivudal = ({fade, startFadeIn, EventInfo, reject, accept, decline}:any) =>{

    const [images, setImageCount] = useState()

    useEffect(()=>{
        startFadeIn()
        console.log(EventInfo)
        const fetch = async() =>{
            const user = await firestore().collection('Users').doc(EventInfo.Host).get()
            storage().refFromURL
        }
        fetch();
    })

    const position = ()=>{
        return(<View style={{backgroundColor:'rgba(0,0,0,.3)', width:'20%', height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
    }
    const activePosition = ()=>{
        return(<View style={{backgroundColor:'rgba(255,255,255,.8)', width:'20%', height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
    }
    const position2 = ()=>{
        return(<View style={{backgroundColor:'rgba(0,0,0,.2)', width:5, height: 15,borderRadius: 4, marginVertical: 3}} />)
    }
    const activePosition2 = ()=>{
        return(<View style={{backgroundColor:'rgba(0,0,0,.8)', width:5, height: 15,borderRadius: 4, marginVertical: 3}} />)
    }
    
    return(
    <Animated.View style={{ flex:1, opacity:fade, alignSelf:'center'}}>
      <View style={{height:'60%', marginBottom:5, padding:5, backgroundColor:'white'}}>
        <Swiper showsButtons={false} dot={position()} activeDot={activePosition()} paginationStyle={{position:'absolute', bottom:10}} containerStyle={{borderRadius:5, overflow:'hidden'}} >
            <View style={styles.slide1}>
                <View>
                    <Text style={styles.text}>Hello Swiper</Text>
                </View>
            </View>
            <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
            </View>
            <View style={styles.slide2}>
            <Text style={styles.text}>Nice</Text>
            </View>
        </Swiper>        
      </View>
      <View style={{height:'20%', margin:10, shadowColor:'black', shadowOpacity:0.2, shadowRadius:3, shadowOffset:{height:0, width:0}}}>
        <View style={{borderRadius:6, overflow:'hidden', flex:1}}>
            <Swiper showsButtons={false} loop={false} dot={position2()} activeDot={activePosition2()} horizontal={false}>
                <View style={styles.description}>
                <Text style={styles.text2}>Hello Swiper</Text>
                </View>
                <View style={styles.description}>
                <Text style={styles.text2}>Beautiful</Text>
                </View>
            </Swiper>        
        </View>
      </View>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', alignContent:'center', marginHorizontal:'4%', borderRadius:30}}>
        <TouchableOpacity style={[styles.button1, { backgroundColor: 'white' }]}>
            <Text style={styles.buttonText}><icons.MaterialCommunityIcons name="close" color={'#8B2929'} size={44}/></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button2, { paddingHorizontal: '15%', backgroundColor: 'rgba(0,0,0,0.85)' }]}>
            <Text style={styles.buttonText}><icons.Entypo name="infinity" size={40}/></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button1, { backgroundColor: 'white' }]}>
            <Text style={styles.buttonText}><icons.MaterialCommunityIcons name="send-check" color={'#5F8B58'} size={35}/></Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
    )
}

function image({path}:{path:string}){

}

const styles = StyleSheet.create({
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
    },
    description:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    },
    text2: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
      },
    buttonText:{
        fontSize: 20,
        color: 'white',
        alignSelf:'center'
    },
    button1:{
        alignSelf:'center',
        padding:10,
        width:70,
        height:70,
        borderRadius:40,
        justifyContent:'center',
        shadowColor:'black',
        shadowRadius:4,
        shadowOpacity:0.6,
        shadowOffset:{height:0, width:0}
    },
    button2:{
        alignSelf:'center',
        padding:10,
        height:60,
        justifyContent:'center',
        borderRadius:10,
        shadowColor:'black',
        shadowRadius:4,
        shadowOpacity:1,
        shadowOffset:{height:0, width:0}
    }
  })