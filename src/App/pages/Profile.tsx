import React, { useContext } from "react";
import { View, SafeAreaView, Text, Button } from "react-native"
import auth from '@react-native-firebase/auth';

import { SignInContext } from '../../Authentication/authTriggers/authContext';

export const Profile = () =>{
    const {dispatchSignedIn} = useContext(SignInContext)

    function signOut(){
        auth()
        .signOut()
        .then(() => console.log('User signed out!'));
        dispatchSignedIn({type:"UPDATE_SIGN_IN",payload:{userToken:null}})
    }
    return(
    <View>
        <SafeAreaView />
        <Text style={{ alignSelf:'center', fontSize:20 }}>PROFILEE</Text>
        <Button onPress={signOut} title="Sign Out"/>
    </View>
    )
}