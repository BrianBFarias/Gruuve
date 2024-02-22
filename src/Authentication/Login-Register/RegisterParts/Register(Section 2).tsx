import React, { useEffect, useRef, useState,  } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView} from "react-native";
import {AuthForm} from '../../AuthenticationStyling'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome6'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { GreekOptions, Genders, Hobbies } from '../../ProfileOptions';
import Button1 from '../../../components/Button';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import findAge from '../../../components/ConstantFunctions/Age';

export default function Section2({location, setLocation, organization, setOrganization, age, setAge, setGender, gender, hobbies, setHobbies, showPreferencePage, setBirthDate}:any){
  const [isFocus0, setIsFocus0] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus4, setIsFocus4] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [permissionGranted, setPermissionGranted] = useState(false)
  const ref = useRef<any>(null)
  
  async function grantAccess(){
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result:any) => {
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
    await grantAccess()

    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 60000,
    })
    .then(location => {
      const longitude = location.longitude;
      const latitude = location.latitude;

      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + 'AIzaSyBTOio8IArwobWjnwXjukT9PtTNlS3981g')
        .then((response) => response.json())
        .then((responseJson) => {
      const locationText = responseJson.results[0].address_components[2].long_name + ', ' + responseJson.results[0].address_components[3].long_name;
      
      setLocation({Location:locationText, Coordinates:{Longitude:longitude, Latitude:latitude}})
      ref.current?.setAddressText(locationText);
  })
  })
  .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
  })
  }

  function next(){
    // if(age.value === 0 || organization === "" || location.Location === "" || age === 0 ){
    //   return;
    // }
    // else if(hobbies.length === 0){
    //   return;
    // }
    // else if(location.Coordinates.longitude === 0 || location.Coordinates.latitude === 0){
    //   return;
    // }
    showPreferencePage()
  }
  
  function LocationSelected(data:any){
    fetch('https://maps.googleapis.com/maps/api/geocode/json?place_id=' + data.place_id + '&key=' + 'AIzaSyBTOio8IArwobWjnwXjukT9PtTNlS3981g')
    .then((response) => response.json())
    .then(async (responseJson) => {
        const lng = responseJson.results[0].geometry.location.lng;
        const lat = responseJson.results[0].geometry.location.lat;

       await setLocation({Location:data.description,Coordinates: {Longitude: lng,Latitude: lat}})
      })
      console.log(location)
  } 
  
  useEffect(() => {
      ref.current?.setAddressText(location.Location);
  }, [ref]);

  const AgeConfirmation = (date:any) => {
    console.log("A date has been picked: ", date);

    const ageNum = findAge(date)
    if(ageNum<18){
      Alert.alert('Age Warning', 'You Must be at least 18 to register with Gruuve')
    }
    setAge(ageNum)
    setBirthDate(date)
    
    setDatePickerVisibility(false);
  };


  const renderItem = (item: { label: any}) => {
    return (
      <View style={styles.item}>
        <Text style={{color:'black'}}>{item.label}</Text>
        <Icon color="white" name="check-circle" size={20} />
      </View>
    );
  };

  const renderSelectedItem =  (item: any, unSelect:any) => {
    return (
      <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
        <View style={{shadowColor: 'black', shadowRadius:3,shadowOpacity:0.5, shadowOffset: {width: 0,height: 1,},}}>
          <View style={styles.selectedStyle}>
            <Text style={{color:'white', marginHorizontal:12}}>{item.label}</Text>
            <Icon color="white" name="close" size={17} style={{backgroundColor:'rgba(0,0,0,0.2)', paddingVertical:8, paddingHorizontal:4}} />
          </View>
        </View>
    </TouchableOpacity>
    );
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
          <Icon style={styles.icon} name="chevron-up" size={30} />:
          <Icon style={styles.icon} name="chevron-down" size={30} />
        )} />
        <View style={[{zIndex:8,  backgroundColor:'white', borderRadius:10, paddingVertical:12, paddingHorizontal:20, marginVertical:10}]}>
          <View style={{flexDirection:'row', gap:5, alignItems: 'flex-end'}}>
          <Icon3 color={'#124211'} size={20} name='location-dot'/>
            <View style={{flex: 1, alignSelf:'stretch', height:'100%', width:'80%'}}>
              <View style={{position:'absolute',backgroundColor:'transparent', top:-12, width:'100%'}}>
                <GooglePlacesAutocomplete
                  placeholder='Search Location'
                  styles={{textInput:{backgroundColor:'transparent', alignSelf:'center'}, textInputContainer:{color:'red'}}}
                  textInputProps={{
                    placeholderTextColor: 'rgba(0,0,0,0.5)',
                    value: location.Location,
                    onChange: text =>{setLocation({Location:text})},
                    returnKeyType: "search"
                  }}
                  enablePoweredByContainer={false}
                  onPress={(data, details = null) => {
                    LocationSelected(data)
                  }}
                  ref={ref}
                  query={{
                    key: 'AIzaSyBTOio8IArwobWjnwXjukT9PtTNlS3981g',
                    language: 'en',
                  }}
                />
              </View>
            </View>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={(e)=>{ setLocationPosition(); e.stopPropagation()}}>
              <Icon3 size={20} color={'#124211'} name='location-crosshairs'/>
            </TouchableOpacity>
          </View>
        </View>
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
          <Icon style={styles.icon} color="#3f8644" name="chevron-up" size={30} />:
          <Icon style={styles.icon} color="#3f8644" name="chevron-down" size={30} />
        )}/>
      <TouchableOpacity style={styles.dropdown} onPress={()=>{setDatePickerVisibility(true);}}>
        <Text style={[age==0?{opacity:0.6, fontWeight:'500'}:{opacity:1, fontWeight:'600'}, {color:'#194715', fontSize:16}]}>{age === 0 ? 'Select Birthday': age}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={AgeConfirmation}
        onCancel={()=>{ setDatePickerVisibility(false);}}
        />
        <ScrollView style={{overflow:'visible'}} alwaysBounceVertical={false}>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.list}
            search
            activeColor={'rgba(10, 110, 10, .15)'}
            onFocus={() => setIsFocus4(true)}
            onBlur={() => setIsFocus4(false)}
            dropdownPosition='top'
            data={Hobbies}
            alwaysRenderSelectedItem={true}
            labelField="label"
            valueField="value"
            placeholder="Select at least 1 Hobby"
            searchPlaceholder="Search..."
            value={hobbies}
            maxSelect={3}
            renderItem={renderItem}
            renderRightIcon={() => (
              isFocus4 ? 
              <Icon style={styles.icon} name="chevron-up" size={30} />:
              <Icon style={styles.icon} name="chevron-down" size={30} />
            )}
            onChange={item => {
              setHobbies(item);
            }}
            renderLeftIcon={() => (
              <Icon
                style={styles.icon}
                color="black"
                name="star-shooting"
                size={20}
              />
            )}
            selectedStyle={styles.selectedStyle}
            renderSelectedItem={(item, unSelect) => (renderSelectedItem(item, unSelect))}
          />
        </ScrollView>
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
  