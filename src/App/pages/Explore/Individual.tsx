import { useEffect, useRef, useState } from "react"
import { View, Text, Animated, StyleSheet, TouchableOpacity, Image, Dimensions, Pressable, Easing } from "react-native"
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper'
import icons from "../../../components/icons";
import { toDate } from "../../../components/ConstantFunctions/Date";
import Loading from "../../../components/Loading";
import LinearGradient from "react-native-linear-gradient";
import findAge from "../../../components/ConstantFunctions/Age";

const windowWidth = Dimensions.get('window').width;
const rotate = new Animated.Value(0);

const button1 = new Animated.Value(0);
const button2 = new Animated.Value(0);
const centerButton = new Animated.Value(0);

const inputRange = [0, 1];
const outputRange = [1, 0.9];
const scale1 = button1.interpolate({inputRange, outputRange});
const scale2 = button2.interpolate({inputRange, outputRange});
const scaleCenter = centerButton.interpolate({inputRange, outputRange});

export const Indiivudal = ({fade, startFadeIn, EventInfo, reject, accept, decline, userID, setNextPost, slideUp}:any) =>{
    const [images, setImages] = useState<string[]>();
    const [userInfo,setUserInfo] = useState<any>()
    const [age,setAge] = useState<any>()
    const [load, setLoad] = useState(true)

    const hideDescription = useRef(true)

    const slideUpButtons = slideUp.interpolate({
        inputRange: [0, 1],
        outputRange: [150, 0],
      }); 
      
      Animated.timing(slideUp, {
        toValue: 1,
        duration:800,
        easing:Easing.bezier(0.7,0.4,0.4,1),
        useNativeDriver: true,
      }).start();
    

    // [0] = Days till, [1] = weekday, [2] = timestamp
    const [eventDate, setEventDate] = useState<any[]>();

    const move = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: [0,  -(windowWidth-15)],
      });

    // Button Press in and Out Animation
    const onPressIn = ({val}:any) => {
        Animated.spring(val===1?button1:val===2?centerButton:button2, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      };
      const onPressOut = ({val}:any) => {
        Animated.spring(val==1?button1: val==2?centerButton:button2, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      };

      async function handleOption({val}:any){
        setNextPost(val)

        switch(val){
            case 1: await reject(EventInfo.Host, userID);
            case 2: await decline(EventInfo.id, userID);
            case 3: await accept(EventInfo.id, userID);
        }
        setNextPost(-1)
      }


    // const fetchImages = async() =>{
    //     const user = await firestore().collection('Users').doc(EventInfo.Host).get()
    //     if(user._data && user._data.ImageURLs){
    //         setUserInfo(user._data)
    //         const BirthDateTimeStamp = new Date(user._data.BirthDate.seconds * 1000)

    //         setAge(findAge(BirthDateTimeStamp))

    //         setEventDate(toDate({date:EventInfo.Date}));

    //         const imageUrls = user._data.ImageURLs
    //         const downloadPromises = imageUrls.map(async (url: string) => {

    //             try {
    //                 return await storage().refFromURL('gs://greekgators-38675.appspot.com/' + url).getDownloadURL();
    //             } catch (error) {
    //                 console.log(error);
    //             }
    //         });
        
    //         const downloadedUrls = await Promise.all(downloadPromises);
    //         setImages(downloadedUrls)
    //     }
    // }

    useEffect(()=>{
        startFadeIn()
        // fetchImages()
    },[])

    const position = ()=>{
        return(<View style={{backgroundColor:'rgba(255,255,255,.3)', width:'20%', height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
    }
    const activePosition = ()=>{
        return(<View style={{backgroundColor:'rgba(255,255,255,.8)', width:'20%', height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
    }

    async function flip(){
        hideDescription.current = !hideDescription.current;
        Animated.timing(
            rotate,
            {
              toValue: hideDescription.current ? 0:1,
              easing: Easing.elastic(1.1),
              duration: 300,
              useNativeDriver: true,
            }
          ).start();
    }


    
    return(
    <Animated.View style={{ flex:1, opacity:fade, alignSelf:'center'}}>
      <View style={{height:'60%', marginBottom:5, marginTop:5, backgroundColor:'white'}}>
            {images ?
            <View style={styles.slide}>
                <View style={{flex:1}}>
                    <Swiper showsButtons={false} dot={position()} activeDot={activePosition()} paginationStyle={{position:'absolute', bottom:10}} containerStyle={{overflow:'hidden'}} loadMinimal={true} loadMinimalSize={images.length}loadMinimalLoader={<Loading />} loop={true} scrollEnabled={load ? false:true}>
                    {images.map((url, index)=>{
                        // Main Image
                        if(index == 0){
                            return(<View style={styles.innerSlide} key={index}>
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
                        }
                        // other Images
                        else{
                            return(    
                            <View style={styles.innerSlide} key={index}>
                                <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,0.9)'}}>
                                    <Image source={{uri: url}} style={{objectFit:'cover', height: '100%', width:'100%', zIndex:2}} onLoad={() =>{if(index === images.length-1){setLoad(false)}}}/>
                                </View>
                            </View>                        
                            )
                        }
                    })}
                    </Swiper>
                </View>
            </View>
            :
            <View style={styles.slide}>
                <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,0.9)'}}>
                    <Loading />
                </View>
            </View>  }
      </View>
      <View style={{height:'15%', margin:10, shadowColor:'white', shadowOpacity:1, shadowRadius:3, shadowOffset:{height:0, width:0}}}>
        <View style={{overflow:'hidden', flex:1, width:windowWidth-15}}>
            <Animated.View style={[{backgroundColor:'transparent', flexDirection:'row', width:'200%', transform:[{ translateX: move }]}]}>
                <View style={[styles.description]}>
                    <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                        <View style={{}}>
                            <Text style={{fontSize:24, fontWeight:'800'}}>{EventInfo.Title}</Text>
                            <Text style={{fontSize:18, fontWeight:'700', opacity:0.6}}>in 4 Days</Text>
                        </View>
                        <View style={{flexDirection:'row', padding:5}}>
                            <icons.MaterialIcons name={'location-pin'} size={20} color='green' />
                            <Text style={{fontSize:18, fontWeight:'500'}}>Gainesville, FL</Text>
                        </View>
                    </View>
                    <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{alignSelf:'flex-start', flexDirection:'row', gap:10}}>
                            <Text style={{fontSize:20, fontWeight:'700'}}>Tuesday</Text>
                            <Text style={{fontSize:20, fontWeight:'600', opacity:0.8}}>8:00 pm</Text>
                        </View>
                        {EventInfo.Description && 
                        <TouchableOpacity style={{alignSelf:'center', backgroundColor:'rgba(0,0,0,0.7)', padding:6, borderRadius:20, shadowColor:'black', shadowOpacity:0.4, shadowRadius:3, shadowOffset:{height:0, width:0}}} onPress={flip}>
                            <Text style={{color:'white', fontWeight:'600', fontSize:12}}> View Description </Text>
                        </TouchableOpacity>}
                    </View>
                </View>
                <Pressable style={[styles.description2]} onPress={flip}>
                    <Text style={{fontSize:20, fontWeight:'800'}}>Description</Text>
                    <Text style={{fontSize:16, textAlign:'center', flexWrap:'wrap'}}>adkfhsdh fsdhf sdhf sdhf shdf sdhfsdfhs dfhsdfhsfd</Text>
                </Pressable>
            </Animated.View>
        </View>
      </View>
      <Animated.View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', position: 'relative',transform:[{translateY:slideUpButtons}] }}>
        <Animated.View style={[styles.button13, {transform: [{scale: scale1}]}]}>
            <Pressable style={[{ flex:1, backgroundColor:'white', justifyContent:'center', borderRadius:40}]} 
                onPress={() => handleOption({val:1})}
                onPressIn={() => onPressIn({ val: 1 })}
                onPressOut={() => onPressOut({ val: 1 })}>
                <Text style={styles.buttonText}><icons.MaterialCommunityIcons name="close" color={'#8B2929'} size={40} /></Text>
            </Pressable>
        </Animated.View>
        <Animated.View style={[styles.button2,{ transform: [{ scale: scaleCenter }]}]}>
            <Pressable style={[{backgroundColor:'#1c2e1a', justifyContent:'center', borderRadius:10, paddingVertical:5}]}
                onPress={() => handleOption({val:2})}
                onPressIn={() => onPressIn({ val: 2 })}
                onPressOut={() => onPressOut({ val: 2 })}>
                <Text style={styles.buttonText}><icons.Entypo name="infinity" size={40} /></Text>
            </Pressable>
        </Animated.View>
        <Animated.View style={[styles.button13, { transform: [{ scale: scale2 }] }]}>
            <Pressable style={[{ flex:1, backgroundColor:'white', justifyContent:'center', borderRadius:40}]}
                onPress={() => handleOption({val:3})}
                onPressIn={() => onPressIn({ val: 3 })}
                onPressOut={() => onPressOut({ val: 3 })}>
            <Text style={styles.buttonText}><icons.MaterialCommunityIcons name="send-check" color={'#5F8B58'} size={30}/></Text>
            </Pressable>
        </Animated.View>
        <View style={{ position: 'absolute', width: '100%', height: '90%', borderTopRightRadius: 40, bottom:0, borderTopLeftRadius: 40, overflow: 'hidden', left: 0, right: 0,justifyContent: 'center' }}>
            <LinearGradient
                colors={['#4b8a43', 'transparent']}
                start={{ x: 0.0, y: 0 }} end={{ x: 0, y: 1 }}
                locations={[0.401, 0.4]}
                style={{ flex: 1 }}
            />
        </View>
      </Animated.View>
    </Animated.View>
    )
}

const styles = StyleSheet.create({
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignSelf:'center',
      marginBottom:4,
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius:6,
      overflow:'hidden',
      aspectRatio:3/3.2
    },
    innerSlide: {
        flex: 1,
    },

    description:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:10,
        width:'100%'
    },
    description2:{
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap:10,
        padding:10,
        width:'100%'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    },
    buttonText:{
        fontSize: 20,
        color: 'white',
        alignSelf:'center'
    },
    button13:{
        alignSelf:'center',
        overflow:'hidden',
        width:95,
        height:80,
        borderRadius:40,
        padding:12,
        zIndex:10,
        justifyContent:'center',
        backgroundColor:'#4b8a43',
        marginTop:'4%',
    },
    button2:{
        alignSelf:'center',
        padding:10,
        width:'35%',
        height:'100%',
        zIndex:10,
        justifyContent:'center',
        marginBottom:'2%',
        borderRadius:10,
    },
  })