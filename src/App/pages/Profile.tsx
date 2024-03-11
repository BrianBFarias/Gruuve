import React, { useContext, useEffect, useRef, useState } from "react";
import { View, SafeAreaView, Text, Button, Pressable, Animated, Dimensions, Easing, TouchableOpacity, StyleSheet } from "react-native"
import auth from '@react-native-firebase/auth';
import icons from "../../components/icons";
import { SignInContext } from '../../Authentication/authTriggers/authContext';
import { Slider, SliderRange } from "../../components/slider/SliderRange";
import { Dropdown } from "react-native-element-dropdown";
import { GenderPreferences } from "../../Authentication/ProfileOptions";

const windowWidth = Dimensions.get('window').width;
const toggleSize = 45;
const inlineToggleMargin = 15;

const settingsTab = new Animated.Value(0);
const settingIcon = new Animated.Value(0);

export const Profile = ({route}:any) =>{
    let {userData} = route.params;

    const {dispatchSignedIn} = useContext(SignInContext);
    const openToggle = useRef(false);

    const [currMin, setCurrMin] = useState(18);
    const [currMax, setCurrMax] = useState(70);
    const [radius, setRadius] = useState(50) 
    const [genderPreference, setGenderPreference] = useState("");

    const [isFocus0, setIsFocus0] = useState(false);

    const settingsInverse = settingsTab.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }); 

    const bgFade = settingsTab.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }); 

    const shadowRadius = settingsTab.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 6],
      }); 

    const menuColorValue = settingsTab.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgb(242,242,242)', 'rgb(255,255,255)'],
      }); 

    const move = settingsTab.interpolate({
        inputRange: [0, 1],
        outputRange: [toggleSize+(inlineToggleMargin*2), windowWidth*0.8],
      });
      
    function signOut(){
        auth()
        .signOut()
        .then(() => console.log('User signed out!'));
        dispatchSignedIn({type:"UPDATE_SIGN_IN",payload:{userToken:null}})
    }

    useEffect(()=>{
        // fetch user Images
        // set settings
    })

    async function settingsToggle(){
        console.log(openToggle.current)

        openToggle.current = !openToggle.current;
        
        if(openToggle.current){
            settingIcon.setValue(1)
        }else{
            setTimeout(()=>{
                settingIcon.setValue(0)
              }, 200)
        }
        Animated.timing(
            settingsTab,
            {
              toValue: openToggle.current ? 1:0,
              easing: Easing.ease,
              duration: 200,
              useNativeDriver: false,
            }
          ).start();

    }

    function confrimAccDeletion(){
        // show popUp
    }

    function savePreferences(){
        //  Save new preferences
    }

    return(
    <View style={{flex:1, backgroundColor:'rgb(242,242,242)'}}>
        <View style={{flexDirection:'row',flex:1, zIndex:12,}}>
            <Animated.View style={{width:(move),zIndex:13}}>
                <Animated.View style={{backgroundColor:menuColorValue, width:move, flex:1, borderTopRightRadius:10, borderBottomRightRadius:10,  shadowColor:'black', shadowOffset:{height:0, width:0}, shadowOpacity:.6, shadowRadius:shadowRadius}}>
                        {/* Setting Info */}
                        <Animated.View style={{margin:10, display:settingsInverse, flexDirection:'column', gap:8, justifyContent:'flex-start', flex:1, overflow:'hidden'}}>
                        <SafeAreaView />
                            <View style={{flex:1}}>
                                <View style={{ flexDirection:'row', width:windowWidth*.75, marginBottom:15}}>
                                <Text style={{alignSelf:'center', fontSize:20, fontWeight:'700', flex:1}}>Preferences</Text>
                                <TouchableOpacity onPress={settingsToggle} style={{alignSelf:'flex-end'}}>
                                    <icons.MaterialIcons name='chevron-left' size={toggleSize} color='black' opacity={0.5} style={{shadowColor:'black', }}/>
                                </TouchableOpacity>
                                </View>
                                <View style={{minWidth:windowWidth*.5}}>
                                    <Text style={{textAlign:'center', fontSize:16, fontWeight:'600'}}>Gender</Text>
                                    <Dropdown
                                        style={[styles.dropdown, isFocus0 && { borderColor: 'transparent'}]}
                                        placeholderStyle={styles.placeholderStyle}
                                        selectedTextStyle={styles.selectedTextStyle}
                                        iconStyle={styles.iconStyle}
                                        containerStyle={styles.list}
                                        data={GenderPreferences}
                                        activeColor={'rgba(10, 110, 10, .15)'}
                                        search={false}
                                        onFocus={() => setIsFocus0(true)}
                                        onBlur={() => setIsFocus0(false)}
                                        maxHeight={300}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Gender Preference"
                                        searchPlaceholder="Search..."
                                        value={genderPreference}
                                        onChange={item => {
                                            setGenderPreference(item.value);
                                            setIsFocus0(false);
                                        }}
                                    renderRightIcon={() => (
                                    isFocus0 ? 
                                    <icons.MaterialCommunityIcons style={styles.icon}  name="chevron-up" size={30} />:
                                    <icons.MaterialCommunityIcons style={styles.icon} name="chevron-down" size={30} />
                                    )} />
                                </View>
                                <View style={{minWidth:windowWidth*0.5, overflow:'hidden'}}>
                                    <SliderRange min={18} max={70} title={'Age Range'} currMin={currMin} currMax={currMax} onValueChange={(range: any) =>{setCurrMax(range.max); setCurrMin(range.min)}} WIDTH={windowWidth*.6}/>
                                </View>
                                <View style={{minWidth:windowWidth*0.5, overflow:'hidden'}}>
                                    <Slider min={10} max={100} onValueChange={(range: any) =>{setRadius(range.radius)}} radius={radius} title={'Search Radius'} unit={'miles'} WIDTH={windowWidth*.5}/>
                                </View>
                                <View style={{flex:0.1}}/>
                                <TouchableOpacity onPress={savePreferences} style={{alignSelf:'center', padding:10, backgroundColor:'black', borderRadius:5, minWidth:windowWidth*0.4}}>
                                    <Text style={{color:'white', fontSize:16, textAlign:'center'}}>Save</Text>
                                </TouchableOpacity>
                                <View style={{flex:1}}/>
                                <TouchableOpacity onPress={signOut} style={{alignSelf:'center', paddingVertical:10}}>
                                    <icons.MaterialCommunityIcons name='logout' size={30}/>
                                </TouchableOpacity>
                                <View style={{flex:0.1}}/>
                            </View>
                        </Animated.View>
                        {/* Gear Icon */}
                        <Animated.View style={{position:'absolute', marginHorizontal:inlineToggleMargin, marginVertical:10, display:settingIcon}}>
                            <SafeAreaView />
                            <TouchableOpacity onPress={settingsToggle} style={{marginTop:10}}>
                                <icons.FontAwesome6 name='gear' size={30} color='grey'/>
                            </TouchableOpacity>
                        </Animated.View>
                </Animated.View>
            </Animated.View>
            <View style={{flex:1, alignItems:'center', minWidth:windowWidth, left:0, marginLeft:-(toggleSize+inlineToggleMargin*2), zIndex:4}}>
                <SafeAreaView />
                <Animated.View style={{flex:1, backgroundColor:'rgb(242,242,242)', opacity:(bgFade), position:'absolute', width:'100%', height:'100%', zIndex:5}} />
                <Text style={{fontSize:20, fontWeight:'700', fontFamily:'arial'}}>Profile</Text>
                <TouchableOpacity onPress={confrimAccDeletion} style={{alignSelf:'center', minWidth:windowWidth*0.4}}>
                    <Text style={{fontWeight:'600', fontSize:18, backgroundColor:'red', color:'whitesmoke', padding:6, borderRadius:10, overflow:'hidden', textAlign:'center'}}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    title:{
      color:'white',
      alignSelf:'center',
      marginBottom:10,
      fontSize:17,
      fontFamily:'ArialHebrew-Light',
      fontWeight:'500'
    },
    dropdown: {
      margin: 10,
      height: 50,
      backgroundColor: '#397844',
      borderRadius:5,
      borderColor:'#397844',
      padding: 12,
      shadowColor: 'white',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 2,
    },
    icon: {
        marginRight: 10,
        color:'white'
    },
    placeholderStyle: {
        fontSize: 16,
        color:'white'
    },
      selectedTextStyle: {
        fontSize: 16,
        color:'white',
        fontWeight:'600',
    },
    iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
        backgroundColor:'black'
      },
      list:{
        borderRadius:6,
        shadowColor:'black',
        shadowOffset:{width:0, height:5},
        shadowRadius:4,
        shadowOpacity:0.5
      }
})