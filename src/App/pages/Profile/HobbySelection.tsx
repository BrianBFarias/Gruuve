import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { Hobbies } from "../../../Authentication/ProfileOptions";
import { useState } from "react";

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export function HobbySelection({isVisible, setIsVisible, hobbies, setHobbies}:any){
    const [tempHobbies, setTempHobbies] = useState(hobbies);

    // Hobby select Screen
    const renderHobby = ({ item }: any) => {
        if (tempHobbies && tempHobbies.includes(item)) {
            return (
                <Pressable
                    key={item}
                    style={style.selectedHobby} 
                    onPress={() => toggleSelection(item)}>
                    <Text style={style.text1}>{item}</Text>
                </Pressable>
            );
        } else {
            return (
                <Pressable
                    key={item}
                    style={style.hobby} 
                    onPress={() => toggleSelection(item)}>
                    <Text style={style.text2}>{item}</Text>
                </Pressable>
            );
        }
    };

    const toggleSelection = (item: string) => {
        if (tempHobbies.length < 4 && !tempHobbies.includes(item)) {
            // Create a new array by spreading the existing hobbies array
            const newHobbies = [...tempHobbies, item];
            // Update state with the new array
            setTempHobbies(newHobbies);
        }else if(tempHobbies.includes(item) && tempHobbies.length>2){
            const newHobbies = tempHobbies.filter((e: string) => e !== item)
            // Update state with the new array
            setTempHobbies(newHobbies);
        }
    };

    async function confirmation(){
        const uid = auth().currentUser?.uid;
        setHobbies(tempHobbies)

        await firestore().collection("Users").doc(uid).update({Hobbies:tempHobbies});
        setIsVisible(false)
    }

    return(
    <Modal 
        isVisible={isVisible} 
        animationOut={'slideOutDown'} 
        animationIn={'slideInUp'}
        useNativeDriver={true} 
        hideModalContentWhileAnimating={true} 
        backdropOpacity={0}
        style={{flex: 1, margin: 0}}>
            <View style={{flex:1, backgroundColor:'white', width:'100%', height:'100%', position:'absolute'}}>
                <SafeAreaView />
                <View style={{flexDirection:'row', justifyContent:'space-between', width:'85%', alignSelf:'center', marginVertical:10}}>
                    <Pressable onPress={() => {setIsVisible(false)}}>
                        <Text style={style.button}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={confirmation}>
                        <Text style={style.button}>Ok</Text>
                    </Pressable>
                </View>
            <ScrollView style={{flex:1}}>
            <View style={{ flex: 1, justifyContent: 'space-between'}}>
                <FlatList
                    contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 5, gap:10, columnGap:14}}
                    data={Hobbies}
                    renderItem={renderHobby}
                    keyExtractor={(item) => item}
                />
            </View>
            </ScrollView>
            <SafeAreaView/>
            </View>
    </Modal>
    )
}


const style= StyleSheet.create({
    hobby:{ 
        padding: 8,
        backgroundColor: 'rgb(230,230,230)', 
        borderRadius: 10 
    },
    selectedHobby:{
        padding: 8,
        backgroundColor: '#39782c', 
        borderRadius: 10,
        color:'white'
    },
    text1:{
        fontWeight:'500',
        color:'white'
    },
    text2:{
        fontWeight:'500',
        color:'black',
        opacity:0.8
    },
    button:{
        fontSize:20,
        fontWeight:'600',
        color:'green'
    }
})