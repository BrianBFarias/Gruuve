
import React,{useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SignInContext } from './Authentication/authTriggers/authContext';
import Main from './App/Main';
import Authentication from './Authentication/Authentication';

export default function RootNavigator(){

    const {signedIn} = useContext(SignInContext)

    return(
    <NavigationContainer>
        {signedIn.userToken === null ? (<Authentication />) : (<Main />)}            
    </NavigationContainer>
    )
}