import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./Login-Register/LoginScreen";
import Register from "./Login-Register/RegisterScreen";
import Landing from './Landing'

const Stack = createNativeStackNavigator();

const Authentication = () =>{
    
    return(
        <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Landing">
            <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
            name="Register"
            component={Register}
            options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
            />
      </Stack.Navigator>
    )
}

export default Authentication;