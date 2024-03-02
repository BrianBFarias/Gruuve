import { useEffect, useState } from "react"
import { View, Text, Animated, StyleSheet, TouchableOpacity, Image } from "react-native"
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper'
import icons from "../../../components/icons";
import { toDate } from "../../../components/ConstantFunctions/Date";
import Loading from "../../../components/Loading";
import LinearGradient from "react-native-linear-gradient";
import findAge from "../../../components/ConstantFunctions/Age";

export const Indiivudal = ({fade, startFadeIn, EventInfo, reject, accept, decline}:any) =>{
    const [images, setImages] = useState<string[]>();
    const [userInfo,setUserInfo] = useState<any>()
    const [age,setAge] = useState<any>()
    const [load, setLoad] = useState(true)

    // [0] = Days till, [1] = weekday, [2] = timestamp
    const [eventDate, setEventDate] = useState<any[]>();

    const fetchImages = async() =>{
        const user = await firestore().collection('Users').doc(EventInfo.Host).get()
        if(user._data && user._data.ImageURLs){
            setUserInfo(user._data)
            const BirthDateTimeStamp = new Date(user._data.BirthDate.seconds * 1000)

            setAge(findAge(BirthDateTimeStamp))

            setEventDate(toDate({date:EventInfo.Date}));

            const imageUrls = user._data.ImageURLs
            const downloadPromises = imageUrls.map(async (url: string) => {

                try {
                    return await storage().refFromURL('gs://greekgators-38675.appspot.com/' + url).getDownloadURL();
                } catch (error) {
                    console.log(error);
                }
            });
        
            const downloadedUrls = await Promise.all(downloadPromises);
            setImages(downloadedUrls)
        }
    }

    useEffect(()=>{
        console.log('loading')
        startFadeIn()
        fetchImages()
    },[])

    const position = ()=>{
        return(<View style={{backgroundColor:'rgba(255,255,255,.3)', width:'20%', height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
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
      <View style={{height:'60%', marginBottom:5, marginTop:5, backgroundColor:'white'}}>
            {images ?
            <Swiper showsButtons={false} dot={position()} activeDot={activePosition()} paginationStyle={{position:'absolute', bottom:10}} containerStyle={{overflow:'hidden'}} loadMinimal={true} loadMinimalSize={images.length}loadMinimalLoader={<Loading />} loop={true}>
            {images.map((url, index)=>{
                if(index == 0){
                    return(
                        <View style={styles.slide} key={index}>
                            <View style={[{position:'absolute', bottom:0, width:'100%', zIndex:4}]}>
                            <LinearGradient 
                                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
                                start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
                                locations={[0,0.7]}
                                style={[{flex:1, flexDirection:'row', paddingVertical:20, justifyContent:'space-between', paddingHorizontal:15}, load ? {opacity:0}:{opacity:1}]}>
                                    <Text style={{color:'white', fontSize:30, fontWeight:'700'}}>{userInfo.First}</Text>
                                    <Text style={{color:'white', fontSize:26, fontWeight:'500'}}>{age}</Text>
                            </LinearGradient>
                            </View>
                            <Image source={{uri: url}} style={{objectFit:'cover', height: '100%', width:'100%', zIndex:2}} />
                            {load && <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,0.9)'}}>
                                <Loading />
                            </View>}
                        </View>)
                }else{
                    return(    
                    <View style={styles.slide} key={index}>
                        <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,0.9)'}}>
                            <Image source={{uri: url}} style={{objectFit:'cover', height: '100%', width:'100%', zIndex:2}} onLoad={() =>{if(index === images.length-1){setLoad(false)}}}/>
                        </View>
                    </View>                        
                    )
                }
            })}
            </Swiper>:
            <View style={{flex:1, backgroundColor:'black'}}>
                <Loading />
            </View>}
      </View>
      <View style={{height:'20%', margin:10, shadowColor:'black', shadowOpacity:0.2, shadowRadius:3, shadowOffset:{height:0, width:0}}}>
        <View style={{borderRadius:6, overflow:'hidden', flex:1}}>
            <Swiper showsButtons={false} loop={false} dot={position2()} activeDot={activePosition2()} horizontal={false}>
                <View style={styles.description}>
                    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                        <View style={{}}>
                            <Text style={{fontSize:24, fontWeight:'800'}}>Date Function</Text>
                            <Text style={{fontSize:18, fontWeight:'700', opacity:0.6}}>in 4 Days</Text>
                        </View>
                        <View style={{flexDirection:'row', padding:5}}>
                            <icons.MaterialIcons name={'location-pin'} size={20} color='green' />
                            <Text style={{fontSize:18, fontWeight:'500'}}>Gainesville</Text>
                        </View>
                    </View>
                    <Text style={{alignSelf:'flex-start', fontSize:20, fontWeight:'600'}}>8:00 pm</Text>
                </View>
                <View style={styles.description}>
                <Text style={styles.text2}>Beautiful</Text>
                </View>
            </Swiper>        
        </View>
      </View>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignContent:'center',  borderRadius:30}}>
        <TouchableOpacity style={[styles.button1, { backgroundColor: 'white' }]}>
            <Text style={styles.buttonText}><icons.MaterialCommunityIcons name="close" color={'#8B2929'} size={44}/></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button2, { paddingHorizontal: '15%', backgroundColor: 'rgba(0,0,0,0.85)' }]}>
            <Text style={styles.buttonText}><icons.Entypo name="infinity" size={40}/></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button3, { backgroundColor: 'white' }]}>
            <Text style={styles.buttonText}><icons.MaterialCommunityIcons name="send-check" color={'#5F8B58'} size={35}/></Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
    )
}

const styles = StyleSheet.create({
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      margin:4,
      borderRadius:10,
      overflow:'hidden'
    },
    description:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding:10
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
        alignSelf:'flex-end',
        padding:10,
        width:80,
        height:90,
        borderTopRightRadius:40,
        justifyContent:'center',
        shadowColor:'black',
        shadowRadius:4,
        shadowOpacity:0.6,
        shadowOffset:{height:0, width:0}
    },
    button3:{
        alignSelf:'flex-end',
        padding:10,
        width:80,
        height:90,
        borderTopLeftRadius:40,
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