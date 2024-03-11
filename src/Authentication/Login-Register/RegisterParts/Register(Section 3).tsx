import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Button, Alert, Animated, Dimensions} from "react-native";
import {AuthForm} from '../../AuthenticationStyling'
import Button1 from '../../../components/Button';
import {SliderRange, Slider} from '../../../components/slider/SliderRange';
import { Dropdown } from 'react-native-element-dropdown';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome6'
import { GenderPreferences } from '../../ProfileOptions';

const windowWidth = Dimensions.get('window').width;

export default function Section3({nextSection, currMin, currMax, setCurrMin, setCurrMax, genderPreference, setGenderPreference, radius, setRadius}:any){
  const [isFocus0, setIsFocus0] = useState(false);

  function next(){
    console.log(currMin, currMax)
    nextSection()
  }

    return(
      <View style={{display:'flex', justifyContent:'space-between', height:'100%'}}>
        <Text style={AuthForm.header3}>Preferences</Text>
        <View style={{backgroundColor:'transparent', marginHorizontal:10, padding:10, paddingVertical:20, borderRadius:10, overflow:'hidden', flex:1, gap:30}}>
          <View style={styles.option}>
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
        renderLeftIcon={() => (
          <Icon3 style={styles.icon} name="person" size={20} />
        )}
        renderRightIcon={() => (
          isFocus0 ? 
          <Icon style={styles.icon}  name="chevron-up" size={30} />:
          <Icon style={styles.icon} name="chevron-down" size={30} />
        )} />
          </View>
          <View style={styles.option}>
            <SliderRange min={18} max={70} currMin={currMin} currMax={currMax} onValueChange={(range: any) =>{setCurrMax(range.max); setCurrMin(range.min)}} title={'Desired Age Range'} WIDTH={windowWidth*.8}/>
          </View>
          <View>
            <Slider min={10} max={100} onValueChange={(range: any) =>{setRadius(range.radius)}} radius={radius} title={'Search Radius'} unit={'miles'} WIDTH={windowWidth*.8}/>
          </View>
        </View>
      <TouchableOpacity style={{alignSelf:'center'}} onPress={next}>
        <Button1 text={'Continue'}/>
      </TouchableOpacity>
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
    marginVertical:12,
    height: 50,
    backgroundColor: 'transparent',
    borderBottomWidth:3,
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
    color:'rgba(25, 71, 21,0.6)'
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
    backgroundColor:'black'
  },
  list:{
    borderRadius:6,
    shadowColor:'black',
    shadowOffset:{width:0, height:5},
    shadowRadius:4,
    shadowOpacity:0.5
  },
  option:{
  }
})