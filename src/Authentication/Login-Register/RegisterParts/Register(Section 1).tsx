import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {AuthForm} from '../../AuthenticationStyling'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Octicons'

import InputField from '../../../components/InputField'

import GoogleAuth from '../GoogleAuth';
import Button1 from '../../../components/Button';


export default function Section1({setFirst, first, setLast, last, setEmail, email, setPassword, password, setPasswordConfirmation, passwordConfrimation, showAddInfo, navigation}:any){
  const [passwordsMatch, setPasswordsMatch] = useState(false)

  useEffect(()=>{
    if(password === passwordConfrimation && password !== ""){
      setPasswordsMatch(true)

    }
    else{
      setPasswordsMatch(false)
    }
  },[password, passwordConfrimation])
  
    return(
          <KeyboardAwareScrollView contentContainerStyle={{display:'flex', justifyContent:'flex-start', flex:1}} bounces={false}>
            <View style={{flex:1}} >
                <View style={{paddingHorizontal:20}}>
                    <Text style={AuthForm.header}>Let's get Started</Text>
                    <Text style={AuthForm.header2}>its free...</Text>
                  </View>
              <View style={{backgroundColor:'transparent', marginHorizontal:10, marginTop:'1%', padding:10, paddingVertical:20, borderRadius:10}}>
              <InputField
                  label={'First Name'}
                  icon={<Icon2 name="person" size={25} color="#194715" />}
                  keyboardType="email-address"
                  inputType={undefined}
                  fieldButtonLabel={null}
                  fieldButtonFunction={() => { } } 
                  setText={setFirst}
                  currText = {first}
                  autoFocus={true}
                  />
                  <InputField
                  label={'Last Name'}
                  icon={<Icon2 name="person" size={25} color="#194715" />}
                  keyboardType="email-address"
                  inputType={undefined}
                  fieldButtonLabel={null}
                  fieldButtonFunction={() => { } } 
                  setText={setLast}
                  currText = {last}
                  />
                <InputField
                  label={'Email'}
                  icon={<Icon name="email" size={25} color="#194715"/>}
                  keyboardType="email-address"
                  inputType={undefined}
                  fieldButtonLabel={null}
                  fieldButtonFunction={() => { } } 
                  setText={setEmail}
                  currText = {email}
                  />
                <InputField
                  label={'Password'}
                  icon={<Icon name={passwordsMatch? "lock" : "lock-open"} size={25} color={passwordsMatch? "#194715" : "#8f1d1d"} />}
                  inputType="password"
                  fieldButtonLabel={null}
                  fieldButtonFunction={() => { } } 
                  keyboardType={undefined}
                  setText={setPassword}
                  currText = {password}/>
                <InputField
                  label={'Password Confirmation'}
                  icon={<Icon name={passwordsMatch? "lock" : "lock-open"}  size={25} color={passwordsMatch? "#194715" : "#8f1d1d"}/>}
                  inputType="password"
                  fieldButtonLabel={null}
                  fieldButtonFunction={() => { } } 
                  keyboardType={undefined}
                  setText={setPasswordConfirmation}
                  currText = {passwordConfrimation}/>
              </View>
            </View>
          <TouchableOpacity style={{alignSelf:'center'}} onPress={showAddInfo}>
            <Button1 text={'Create Account'}/>
          </TouchableOpacity>
          <TouchableOpacity style={{alignSelf:'center', marginTop:'10%'}} onPress={()=>{navigation.navigate('Login')}}>
                  <Text style={AuthForm.switch} >Already Have an Account? Login</Text>
                </TouchableOpacity>
          </KeyboardAwareScrollView>
          )}