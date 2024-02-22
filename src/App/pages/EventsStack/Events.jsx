import React, { useContext, useEffect, useState } from "react";
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import icons from "../../../components/icons";
import Loading from "../../../components/Loading";

export const EventsPage = ({navigation}) =>{
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        // Simulating data fetching delay for testing purposes
        const fetchData = () => {
            setTimeout(() => {
                setFetching(false);
            }, 2000); // Adjust the timeout duration as needed (in milliseconds)
        };

        fetchData();
    }, []);

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        {fetching ?
        <Loading />:
        <View style={{flex:2}}>
            <TouchableOpacity style={{position:'absolute', bottom:0, right:0, shadowColor:'black', shadowRadius:5, shadowOpacity:0.6, shadowOffset:{width:2, height:1}, borderRadius: 50, backgroundColor:'#29612F', margin:30, padding:5}} onPress={()=>{navigation.navigate('New Event')}}>
                <icons.Ionicons name={'add'} size={40} color={'white'} />
            </TouchableOpacity>
        </View>}
    </LinearGradient>
    )
}