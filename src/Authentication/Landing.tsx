import React, { useContext, useEffect, useState } from "react";
import { View, SafeAreaView, Text, Animated, Pressable, Easing, StyleSheet, TouchableOpacity } from "react-native";
import Style from './LandingStyle';

import Logo from '../../assets/images/logo.png'
import { Button2, Button3 } from "../components/Button";
import { SignInContext } from "./authTriggers/authContext";
import auth from '@react-native-firebase/auth';

const colorList = [
    {offset: '59%', color: 'rgba(255,255,255,1)', opacity: '0.9'},
    {offset: '59%', color: 'rgba(255,255,255,1)', opacity: '0.9'},
    {offset: '59%', color: 'rgba(255,255,255,1)', opacity: '0.9'},
    {offset: '100%', color: 'rgba(255,255,255,1)', opacity: '0'}
  ]

const Landing = ({navigation}: any) =>{
    let scaleIn = new Animated.Value(20);
    let rotation = new Animated.Value(0);

    const {dispatchSignedIn} = useContext(SignInContext)

    function onAuthStateChanged(user: any) {
        if(user){
            dispatchSignedIn({type:"UPDATE_SIGN_IN",payload:{userToken:"signed-in"}})
        }else{
            dispatchSignedIn({type:"UPDATE_SIGN_IN",payload:{userToken:null}})
        }
    }

  useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; 
    }, []);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['-180deg', '0deg'],
      });

    useEffect(()=>{
        scaleIn.setValue(50);
        Animated.timing(scaleIn, {
        toValue: 1,
        duration: 1000,
        delay:1000,
        easing: Easing.in(Easing.elastic(0.75)),
        useNativeDriver: false,
        }).start();
        
    }, [scaleIn])


    useEffect(() => {
          Animated.timing(
            rotation,
            {
              toValue: 1,
              delay:1000,
              easing: Easing.elastic(1.1),
              duration: 2000,
              useNativeDriver: true,
            }
          ).start();
      }, [scaleIn]);

    function RegisterPage(){
        navigation.navigate("Register" as never);
    }

    function LoginPage(){
        navigation.navigate("Login" as never);
    }

    return(
        <View style={{backgroundColor:'transparent'}}>
            <View style={Style.container}>
                <View style={{alignSelf:'center', height:250, width:250, zIndex:1}}>
                    <Animated.View style={{alignSelf:'center',position:"absolute", height:250, width:250, top:0, transform:[{scale:scaleIn}]}}>
                        <Animated.Image source={Logo} style={[Style.image, {transform:[{rotate: spin}]}]}  />
                    </Animated.View>
                </View>
                <Text style={styles.info}>
                    <Text style={styles.bold}>Welcome to Gruuve</Text>{"\n"}
                    <Text style={styles.description}>Build memories with people</Text>{"\n"}
                    <Text style={styles.description}>like you...</Text>
                    <Text style={styles.description}>for you...</Text>{"\n"}
                </Text>               
                <View style={Style.options}>
                    <TouchableOpacity style={{alignSelf:'center'}} onPress={RegisterPage}>
                        <Button2 text={'Create Account'}/>
                    </TouchableOpacity>
                    <Pressable style={Style.button2} onPress={LoginPage}>
                        <Button3 text={'Login'}/>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    info: {
      fontFamily: 'Arial', // Choose an appropriate font
      fontSize: 18, // Adjust size as needed
      textAlign: 'center', // Center the text
      color: '#333', // Adjust color as needed
    },
    bold: {
      fontWeight: 'bold', // Make "Welcome to Greek Gators" bold
      color: '#1e451a', // Adjust color as needed
      fontSize: 24,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        color: '#1e451a',
        marginBottom: 5, // Add some spacing between lines
      },
  });
  

export default Landing;