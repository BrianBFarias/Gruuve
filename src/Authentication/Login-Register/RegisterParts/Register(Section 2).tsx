import React, { useEffect, useRef, useState,  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView} from "react-native";
import {AuthForm} from '../../AuthenticationStyling'
import Icon3 from 'react-native-vector-icons/FontAwesome6'
import { Dropdown } from 'react-native-element-dropdown';
import Button1 from '../../../components/Button';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MapView from 'react-native-maps';
import Icons from '../../../components/icons';

import { LocationName } from '../../../components/ConstantFunctions/LocName';

import findAge from '../../../components/ConstantFunctions/Age';
import { GreekOptions, Genders, Height } from '../../ProfileOptions';

interface coordinate {
  latitude: number | 0;
  longitude: number | 0;
}

export default function Section2({location, setLocation, organization, setOrganization, age, setAge, setGender, gender, nextSection, setBirthDate, height, setHeight}:any){
  const [isFocus0, setIsFocus0] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);
  const [locationFetched, setLocationFetched] = useState(false)

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const mapViewRef = useRef<MapView>(null);

  const [permissionGranted, setPermissionGranted] = useState(false)
  
  function grantAccess(){
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async (result:any) => {
      console.log(result)
      switch (result) {
          case RESULTS.UNAVAILABLE:
              setPermissionGranted(false)
            break;
          case RESULTS.DENIED:
              setPermissionGranted(false)
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
              setPermissionGranted(true)
            break;
          case RESULTS.BLOCKED:
              setPermissionGranted(false)
            break;
        }
        return
  });
  }

  const setLocationPosition = async () =>{
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 60000,
    })
    .then(async location => {
      const longitude = location.longitude;
      const latitude = location.latitude;

      let r = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09
    };

      mapViewRef.current?.animateToRegion(r, 700)      
      setLocation({longitude, latitude})
  })
  .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })
  }

  function next(){
    if(age.value === 0 || organization === "" || location.Location === "" || age === 0 ){
      return;
    }
    else if(location.Coordinates.longitude === 0 || location.Coordinates.latitude === 0){
      return;
    }
    nextSection()
  }

  function updateLocation(Region:coordinate){
    setLocation(Region)
  }

  const AgeConfirmation = (date:any) => {
    const ageNum = findAge(date)
    if(ageNum<18){
      Alert.alert('Age Warning', 'You Must be at least 18 to register with Gruuve')
      return;
    }
    setAge(ageNum)
    setBirthDate(date)
    
    setDatePickerVisibility(false);
  };

  return(
    <View style={{display:'flex', justifyContent:'space-between', height:'100%'}}>
      <Text style={AuthForm.header3}>Setup Your Profile</Text>
    <View style={{backgroundColor:'transparent', marginHorizontal:10, padding:10, paddingVertical:20, borderRadius:10, overflow:'hidden', flex:1}}>
    <Dropdown
      style={[styles.dropdown, isFocus0 && { borderColor: 'transparent'}]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      containerStyle={styles.list}
      activeColor={'rgba(10, 110, 10, .15)'}
      data={Genders}
      search={false}
      onFocus={() => setIsFocus0(true)}
      onBlur={() => setIsFocus0(false)}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Gender"
      searchPlaceholder="Search..."
      value={gender}
      onChange={item => {
        setGender(item.value);
        setIsFocus0(false);
      }}
      renderLeftIcon={() => (
        <Icon3 style={styles.icon} name="person" size={20} />
      )}
      renderRightIcon={() => (
        isFocus0 ? 
        <Icons.MaterialCommunityIcons style={styles.icon} name="chevron-up" size={30} />:
        <Icons.MaterialCommunityIcons style={styles.icon} name="chevron-down" size={30} />
      )} />
    <Dropdown
      style={[styles.dropdown, isFocus2 && { borderColor: 'transparent'}]}
      placeholderStyle={styles.placeholderStyle}
      containerStyle={styles.list}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={GreekOptions}
      activeColor={'rgba(10, 110, 10, .15)'}
      search
      onFocus={() => setIsFocus2(true)}
      onBlur={() => setIsFocus2(false)}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Greek Involvment..."
      searchPlaceholder="Search..."
      value={organization}
      onChange={item => {
        setOrganization(item.value);
        setIsFocus2(false);
      }}
      renderLeftIcon={() => (
        <Icon3 style={styles.icon} color="#3f8644" name="building-columns" size={20} />
      )}
      renderRightIcon={() => (
        isFocus2 ? 
        <Icons.MaterialCommunityIcons style={styles.icon} color="#3f8644" name="chevron-up" size={30} />:
        <Icons.MaterialCommunityIcons style={styles.icon} color="#3f8644" name="chevron-down" size={30} />
      )}/>
    <TouchableOpacity style={styles.dropdown} onPress={()=>{setDatePickerVisibility(true);}}>
      <Text style={[age==0?{opacity:0.6, fontWeight:'500'}:{opacity:1, fontWeight:'600'}, {color:'#194715', fontSize:16}]}>{age === 0 ? 'Birthday': age}</Text>
    </TouchableOpacity>
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={AgeConfirmation}
      onCancel={()=>{ setDatePickerVisibility(false);}}
      />
      <Dropdown
      style={[styles.dropdown, isFocus4 && { borderColor: 'tnsparent'}]}
      placeholderStyle={styles.placeholderStyle}
      containerStyle={styles.list}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={Height}
      activeColor={'rgba(10, 110, 10, .15)'}
      onFocus={() => setIsFocus4(true)}
      onBlur={() => setIsFocus4(false)}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Height"
      searchPlaceholder="Search..."
      value={height}
      onChange={item => {
        setHeight(item);
        setIsFocus4(false);
      }}
      renderLeftIcon={() => (
        <Icon3 style={styles.icon} color="#3f8644" name="ruler-vertical" size={20} />
      )}
      renderRightIcon={() => (
        isFocus4 ? 
        <Icons.MaterialCommunityIcons style={styles.icon} color="#3f8644" name="chevron-up" size={30} />:
        <Icons.MaterialCommunityIcons style={styles.icon} color="#3f8644" name="chevron-down" size={30} />
      )}/>
      <View style={{flex:1, width:'100%', borderRadius:6, overflow:'hidden'}}>
         <MapView
          ref={mapViewRef}
          rotateEnabled={false}
          loadingEnabled={true}
          showsPointsOfInterest={true}
          showsIndoorLevelPicker={true}
          followsUserLocation={true}
          onRegionChangeComplete={(Region) => updateLocation(Region)}
          userLocationCalloutEnabled={true}
          loadingBackgroundColor='white'
          onRegionChange={()=>{}}
          style={{height:'100%', width:'100%', backgroundColor:'white', justifyContent:'center', position:'absolute'}}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 2,
            longitudeDelta: 2
          }} />
        <View style={{width:'100%', height:'100%', flex:1, justifyContent:'center', pointerEvents:'box-none'}}>
            <View style={{alignSelf:'center', shadowColor:'black', shadowOffset:{height:3, width:0}, shadowRadius:2, shadowOpacity:0.4, pointerEvents:'none', marginBottom:25}}>
              <Icons.MaterialIcons name="location-on" size={44} color='#539953'/>
            </View>
            <TouchableOpacity style={{position:'absolute', top:0, right:0, padding:8, borderBottomRightRadius:10, overflow:'hidden'}} onPress={setLocationPosition}>
              <View style={{flex:1, shadowColor:'black', shadowOffset:{height:0, width:0}, shadowRadius:2, shadowOpacity:0.4}}>
                <Icons.FontAwesome6 name="location-crosshairs" size={26} color='whitesmoke'/>
              </View>
            </TouchableOpacity>
            <View style={{borderBottomRightRadius:6, position:'absolute', left:0, top:0, overflow:'hidden', backgroundColor:'rgba(255,255,255,0.8)', padding:6}}>
              <Text style={{fontWeight:'600', fontSize:12}}>Your Location</Text>
            </View>
          </View>
      </View>
    </View>
    <TouchableOpacity style={{alignSelf:'center'}} onPress={next}>
      <Button1 text={'Continue'}/>
    </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    dropdown: {
      margin: 10,
      marginVertical:12,
      height: 50,
      backgroundColor: 'rgba(255,255,255,0)',
      borderBottomWidth:3,
      borderRadius:5,
      borderColor:'#497844',
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
      color:'#397844'
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textItem: {
      flex: 1,
      fontSize: 16,
    },
    placeholderStyle: {
      fontSize: 16,
      color:'rgba(25, 71, 21,0.5)'
    },
    selectedTextStyle: {
      fontSize: 16,
      color:'rgba(25, 71, 21,0.9)',
      fontWeight:'600',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      backgroundColor:'rgba(225,225,22hb5,1)',
      borderRadius:10
    },
    selectedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: '#295d16',
      marginTop: 8,
      marginRight: 12,
      overflow:'hidden',
      shadowOffset: {
        width: -2,
        height: 2,
      }},
      list:{
        borderRadius:6,
        shadowColor:'black',
        shadowOffset:{width:0, height:5},
        shadowRadius:4,
        shadowOpacity:0.5
      }
  });
  