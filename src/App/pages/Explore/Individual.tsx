import { useEffect, useRef, useState } from "react"
import { View, Text, Animated, StyleSheet, TouchableOpacity, Image, Dimensions, Pressable, Easing, TouchableWithoutFeedback, ScrollView, LayoutRectangle } from "react-native"
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper'
import Icon from "../../../components/icons";
import { toDate } from "../../../components/ConstantFunctions/Date";
import { Chase } from 'react-native-animated-spinkit'
import LinearGradient from "react-native-linear-gradient";
import findAge from "../../../components/ConstantFunctions/Age";

const windowWidth = Dimensions.get('window').width;
const expand = new Animated.Value(0);

const button1 = new Animated.Value(0);
const button2 = new Animated.Value(0);
const centerButton = new Animated.Value(0);

const inputRange = [0, 1];
const outputRange = [1, 0.9];
const scale1 = button1.interpolate({inputRange, outputRange});
const scale2 = button2.interpolate({inputRange, outputRange});
const scaleCenter = centerButton.interpolate({inputRange, outputRange});

export const Indiivudal = ({fade, startFadeIn, EventInfo, reject, accept, decline, user, setNextPost, slideUp, nextPost}:any) =>{
    const [images, setImages] = useState<string[]>();
    const [userInfo,setUserInfo] = useState<any>()
    const [age,setAge] = useState<any>()
    const [load, setLoad] = useState(true)
    const [tabSize, setTabSize] = useState(0)
    const [descriptionHeight, setDescriptionHeight] = useState(0)

    const hideDescription = useRef(true);
    const swiperRef = useRef<any>(null)

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
    const [eventDate, setEventDate] = useState<String[]>();

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
            case 1: await reject(EventInfo.Host, user.id);
            case 2: await decline(EventInfo.id, user.id);
            case 3: await accept(EventInfo.id, user.id);
        }

        setNextPost(-1)
        setTimeout(()=>{
            try{
                swiperRef.current.scrollTo(0)
            }catch{}
        }, 200)

        hideDescription.current = true;
        Animated.timing(
            expand,
            {
              toValue: 0,
              easing: Easing.elastic(1.1),
              delay:200,
              duration: 10,
              useNativeDriver: true,
            }
          ).start();

      }


    const fetchImages = async(uid:String) =>{
        const user = (await firestore().collection('Users').doc(EventInfo.Host).get())._data
        setUserInfo(user)

        if(user && user.ImageURLs){
            setTabSize(90/user.ImageURLs.length)

            const BirthDateTimeStamp = new Date(user.BirthDate.seconds * 1000)

            setAge(findAge(BirthDateTimeStamp))
            setEventDate(toDate({date:EventInfo.Date}));

            const imageUrls = user.ImageURLs
            const downloadPromises = imageUrls.map(async (url: string) => {

                try {
                    return await storage().refFromURL('gs://greekgators-38675.appspot.com/' + url).getDownloadURL();
                } catch (error) {
                    console.log(error);
                }
            });
        
            const downloadedUrls = await Promise.all(downloadPromises);
            setImages(downloadedUrls)
            setLoad(false);
            // setImages(['https://picsum.photos/200/300', 'https://picsum.photos/200/300','https://picsum.photos/200/300'])
            // setLoad(false);
        }
    }

    useEffect(()=>{
        startFadeIn()
        fetchImages(EventInfo.Host)
    },[EventInfo])

    const position = ()=>{
        return(<View style={{backgroundColor:'rgba(255,255,255,.3)', width:`${tabSize}%`, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
    }
    const activePosition = ()=>{
        return(<View style={{backgroundColor:'rgba(255,255,255,.8)', width:`${tabSize}%`, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3}} />)
    }

    async function flip(){
        hideDescription.current = !hideDescription.current;
        Animated.timing(
            expand,
            {
              toValue: hideDescription.current ? 0:1,
              easing: Easing.elastic(1.1),
              duration: 200,
              useNativeDriver: true,
            }
          ).start();
    }

    function find_dimesions(layout: LayoutRectangle){
        const {height} = layout;
        setDescriptionHeight(height);
      }

    return(
    <Animated.View style={{ flex:1, opacity:fade, alignSelf:'center', borderRadius:10}}>
        <LinearGradient 
        colors={['whitesmoke', 'white']}
        start={{x: 0, y: 0.6}} end={{x: 0, y: 0.8}}
        locations={[0,1]}
        style={{flex:1}}>
        <View style={{backgroundColor:'black', zIndex:11}}>
                {images && !load?
                <View style={styles.slide}>
                    <View style={{flex:1}}>
                        <Swiper 
                        index={0}
                        showsButtons={false} 
                        dot={position()} 
                        activeDot={activePosition()} 
                        paginationStyle={{position:'absolute', bottom:10}} 
                        containerStyle={{overflow:'hidden'}} 
                        loadMinimal={true} 
                        loadMinimalSize={images.length}
                        loadMinimalLoader={ <Chase size={40} color="white" />} 
                        loop={false} 
                        scrollEnabled={load ? false:true} 
                        bounces={true}
                        buttonWrapperStyle={styles.selectionWrapper}
                        ref={swiperRef} >
                        
                        {images.map((url, index)=>{
                            // Main Image
                            if(index === 0){
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
                                            <Chase size={40} color="white" />
                                        </View>}
                                    </View>)
                            }
                            // other Images
                            else if(index>0){
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
                        <Chase size={40} color="white" style={{alignSelf:'center', justifyContent:'center', top:'45%'}}/>
                    </View>
                </View>  }
        </View>
        {/* More user Info */}
        {userInfo && <View style={{paddingVertical:8, paddingHorizontal:6, backgroundColor:'white', borderBottomColor:'rgba(0,0,0,0.4)', borderBottomWidth:.5, zIndex:10}}>
            <ScrollView contentContainerStyle={{ alignSelf:'center', borderRadius:0 }} horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection:'row',}}>
                <View style={styles.info}>
                    <Icon.FontAwesome6 name="ruler-vertical" color='#0a1708' style={{alignSelf:'center'}} size={18} />
                    <Text style={{color:'black', fontSize:14, fontWeight:'600', alignSelf:'center'}}>{userInfo.Height}</Text>
                </View>
                <View style={styles.line}/>
                {userInfo.School !==0 && <>
                <View style={styles.info}>
                    <Icon.Ionicons name="school" color='#0a1708' style={{alignSelf:'center'}} size={18} />
                    <Text style={{color:'black', fontSize:14, fontWeight:'600', alignSelf:'center'}}>{userInfo.School}</Text>
                </View>
                <View style={styles.line}/></>}
                <View style={styles.info}>
                    <Icon.FontAwesome6 name="building-columns" color='#0a1708' style={{alignSelf:'center'}} size={18} />
                    <Text style={{color:'black', fontSize:14, fontWeight:'600', alignSelf:'center'}}>{userInfo.Organization}</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.info, {marginRight:20}]}>
                    <Icon.FontAwesome6 name="person-running" color='#0a1708' style={{alignSelf:'center'}} size={18} />
                    {userInfo.Hobbies.map((hobby:string, index:number) => (
                        <Text key={index} style={{color: 'white', alignSelf:'center', fontSize:12, backgroundColor:'rgb(30,30,30)', padding:4, borderRadius:5, overflow:'hidden', fontWeight:'500'}}>{hobby}</Text>
                    ))}
                </View>
            </View>
        </ScrollView>
            </View>}
        {/* Card */}
        <View style={{position: 'relative', flex: 1, marginHorizontal: 10, backgroundColor: 'transparent', overflow: 'visible', zIndex: 9}}>
            <View style={[styles.description]} onLayout={(event) => find_dimesions(event.nativeEvent.layout)}>
                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', position: 'relative'}}>
                    <View>
                        <Text style={{fontSize: 22, fontWeight: '800'}}>{EventInfo.Title}</Text>
                        <Text style={{fontSize: 16, fontWeight: '700', opacity: 0.6}}>in {eventDate && eventDate[0]} Days</Text>
                    </View>
                    <View style={{justifyContent: 'center',}}>
                        <TouchableOpacity style={{backgroundColor:'rgb(30,30,30)', padding:5, borderRadius:5, flexDirection:'row', gap:5}} onPress={flip}>
                            <Icon.Ionicons name={'expand-outline'} size={20} color='white' />
                            <Text style={{ color: 'whitesmoke', fontSize:16 }}>Description</Text>
                        </TouchableOpacity> 
                    </View>
                </View>
                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 18, fontWeight: '700'}}>{eventDate && eventDate[1]}</Text>
                        <Text style={{fontSize: 18, fontWeight: '600', opacity: 0.8}}>{eventDate && eventDate[2]}</Text>
                    </View>
                    <View style={{flexDirection: 'row', padding: 5}}>
                        <Icon.MaterialIcons name={'location-pin'} size={20} color='green' />
                        <Text style={{fontSize: 18, fontWeight: '500', zIndex: 0}}>Gainesville, FL</Text>
                    </View>
                </View>
                <Animated.View style={{position:'absolute', width:'100%', height:'110%', opacity:expand, pointerEvents:'box-none'}}>
                    <LinearGradient style={{flex:1, pointerEvents:'box-none'}}
                    colors={['whitesmoke', 'white']}
                    start={{x: 0, y: -1}} end={{x: 0, y: 1}}
                    locations={[0,1]}>
                        <View style={{ pointerEvents:'box-none', justifyContent:'center'}}>
                            <View style={{pointerEvents:'box-none', alignItems:'center', justifyContent:'center', height:'100%'}}>
                                <TouchableOpacity style={{padding:14, zIndex:10, backgroundColor:'rgb(30,30,30)', borderRadius:8}} onPress={flip}>
                                    <Text style={{fontSize:16, textAlign:'center', flexWrap:'wrap', color:'whitesmoke'}}>{EventInfo.Description}</Text>
                                    <View style={{position:'absolute', justifyContent: 'center', alignItems: 'center', right:-8, bottom:-8, backgroundColor:'rgb(220,220,220)', padding:6, borderRadius:16, zIndex:9}}>
                                        <Icon.AntDesign name='shrink' size={15} color={'black'}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>
            </View>
        </View>
        {/* Buttons */}
        <Animated.View style={{flex:1,flexDirection: 'row', justifyContent: 'space-around', position: 'relative',transform:[{translateY:slideUpButtons}], alignItems:'center', zIndex:12}}>
            <Animated.View style={[styles.button13, {transform: [{scale: scale1}]}]}>
                <Pressable style={[{ flex:1, backgroundColor:'white', justifyContent:'center', borderRadius:40}]} 
                    onPress={() => handleOption({val:1})}
                    onPressIn={() => onPressIn({ val: 1 })}
                    onPressOut={() => onPressOut({ val: 1 })}>
                    <Text style={styles.buttonText}><Icon.MaterialCommunityIcons name="close" color={'#8B2929'} size={40} /></Text>
                </Pressable>
            </Animated.View>
            <Animated.View style={[styles.button2,{ transform: [{ scale: scaleCenter }]}]}>
                <Pressable style={[{backgroundColor:'#0a1708', justifyContent:'center', borderRadius:10, paddingVertical:5}]}
                    onPress={() => {handleOption({val:2})}}
                    onPressIn={() => onPressIn({ val: 2})}
                    onPressOut={() => onPressOut({ val: 2 })}>
                    <Text style={styles.buttonText}><Icon.Entypo name="infinity" size={40} color={'white'} /></Text>
                </Pressable>
            </Animated.View>
            <Animated.View style={[styles.button13, { transform: [{ scale: scale2 }] }]}>
                <Pressable style={[{ flex:1, backgroundColor:'white', justifyContent:'center', borderRadius:40}]}
                    onPress={() => handleOption({val:3})}
                    onPressIn={() => onPressIn({ val: 3 })}
                    onPressOut={() => onPressOut({ val: 3 })}>
                <Text style={styles.buttonText}><Icon.MaterialCommunityIcons name="send-check" color={'#5F8B58'} size={30}/></Text>
                </Pressable>
            </Animated.View>
            <View style={{ position: 'absolute', width: '100%', height: '100%', borderTopRightRadius: 40, bottom:0, borderTopLeftRadius: 40, left: 0, justifyContent: 'center' }}>
                <LinearGradient
                    colors={['#4b8a43', 'transparent']}
                    start={{ x: 0.0, y: 0 }} end={{ x: 0, y: 1 }}
                    locations={[0.401, 0.4]}
                    style={{ flex: 1 }}
                />
            </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
    )
}

const styles = StyleSheet.create({
    slide: {
      width:'100%',
      justifyContent: 'center',
      alignSelf:'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderTopLeftRadius:10,
      borderTopRightRadius:10,
      overflow:'hidden',
      aspectRatio:3/3.2
    },
    innerSlide: {
        flex: 1
    },

    description:{
        flex: 1,
        justifyContent: 'space-between',
        marginVertical:6,
        alignItems: 'center',
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
        padding:10,
        zIndex:10,
        justifyContent:'center',
        backgroundColor:'#4b8a43',
    },
    button2:{
        alignSelf:'center',
        padding:10,
        width:'35%',
        height:'100%',
        zIndex:10,
        justifyContent:'center',
        marginBottom:'4%',
        borderRadius:10,
    },
    selectionWrapper:{
        backgroundColor: 'transparent',
        flexDirection: 'row', 
        position: 'absolute', 
        top: 0, 
        left: -7, 
        flex: 1, 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    imageTapSection:{
        backgroundColor:'black',
        opacity:0,
        position:'relative',
        height:'100%',
        width:windowWidth*.5,
        justifyContent:'center',
    },
    info:{
        justifyContent:'center', 
        flexDirection:'row',
        marginHorizontal:10,
        gap:6,
    },
    line:{
        height:'100%',
        width:1,
        backgroundColor:'black',
        opacity:0.5,
        alignSelf:'center',
        borderRadius:10
    }
  })