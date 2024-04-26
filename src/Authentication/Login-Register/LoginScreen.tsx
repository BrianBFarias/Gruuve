import React, { useContext, useState } from 'react';
import { Text, View, SafeAreaView, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { AuthForm } from '../AuthenticationStyling'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons'
import Logo from '../../../assets/images/logo.png'
import InputField from '../../components/InputField'
import Loading from '../../components/Loading';

import GoogleAuth from './GoogleAuth';
import Button1 from '../../components/Button';
import auth from '@react-native-firebase/auth';

import { SignInContext } from '../authTriggers/authContext';


const LoginScreen = ({ navigation }: any) => {
    const [email, setemail] = useState("Brian03032003@gmail.com")
    const [password, setPassword] = useState("850423Ab_GRU")
    const [loading, setLoading] = useState(false)

    const {dispatchSignedIn} = useContext(SignInContext)


    function forgotPassword() {
        console.log('FORGOT PASSWORD')
    }

    function submitLogin() {
        setLoading(true)
        auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (response:any) => {
          if(response){
            setLoading(false)
            dispatchSignedIn({type:"UPDATE_SIGN_IN",payload:{userToken:"signed-in"}})
            }
        })
        .catch((error:any) => {
        setLoading(false)
          Alert.alert("Error", error.message || "An unknown error occurred");
      });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {!loading?
            <View style={{flex:1,}}>
                <View>
                    <SafeAreaView />
                    <View >
                    <Image source={Logo} style={AuthForm.logo} />
                    <View style={AuthForm.back}>
                        <TouchableOpacity onPress={navigation.goBack}>
                            <Icon1 size={35} color={'#1e451a'} name='chevron-back-outline' />
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
              <View style={AuthForm.infoBox}>     
              <View style={{height:'75%'}}>
                  <View style={{paddingHorizontal:20}}>
                    <Text style={AuthForm.header}>Welcome Back!</Text>
                    <Text style={AuthForm.header2}>Get back in the game Champ</Text>
                  </View>
                  <View style={{flex:1}}>
                      <View style={{ marginHorizontal: 10, marginTop: '10%', padding: 10, borderRadius: 10, overflow: 'hidden' }}>
                          <InputField
                              label={'Email'}
                              icon={<Icon name="email" size={25} color="#052b05"/>}
                              keyboardType="email-address"
                              inputType={undefined}
                              fieldButtonLabel={null}
                              fieldButtonFunction={() => { }}
                              setText={setemail}
                              currText={email}
                              autoFocus={true}
                          />
                          <InputField
                              label={'Password'}
                              icon={<Icon name="lock" size={25} color="#052b05"/>}
                              inputType="password"
                              fieldButtonLabel={"Forgot?"}
                              fieldButtonFunction={forgotPassword}
                              keyboardType={undefined}
                              setText={setPassword}
                              currText={password}
                          />
                      </View>
                      {/* <View style={{flexDirection:'row', marginBottom:20}}>
                        <View style={AuthForm.bar}/>
                            <Text style={AuthForm.or}> or </Text>
                        <View style={AuthForm.bar}/>
                      </View>
                      <GoogleAuth/> */}
                  </View>
                  <TouchableOpacity style={{alignSelf:'center', marginTop:'15%'}} onPress={submitLogin}>
                      <Button1 text={'Login'}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={{alignSelf:'center', marginTop:'10%'}} onPress={()=>{navigation.navigate('Register')}}>
                        <Text style={AuthForm.switch} >Dont Have an Account? Create One</Text>
                    </TouchableOpacity>
              </View>
              </View>
          </View>:
          <Loading />}
        </TouchableWithoutFeedback>
    );
}
export default LoginScreen;
