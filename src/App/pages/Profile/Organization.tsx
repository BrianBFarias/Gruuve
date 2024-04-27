import { Pressable, SafeAreaView, Text, View, FlatList, StyleSheet, TextInput } from "react-native"
import Modal from "react-native-modal";
import icons from "../../../components/icons";
import { GreekOptions } from "../../../Authentication/ProfileOptions";
import React, { useState } from "react";

type  option={
    label:string,
    value: string
}

export function Organization({isVisible, setIsVisible, currOrg, setCurrOrg}:any){
    const [filteredOrganization, setFilteredOrganization] = useState<option[]>(GreekOptions)
    const [search, setSearch] = useState('')

    const renderOrganization = ({ item }: { item: option }) => {
        if(item.value === currOrg){
            return (
                <Pressable
                    key={item.value}
                    style={style.selected} 
                    onPress={() => toggleSelection(item.value)}>
                    <Text style={[style.text, {color:'white'}]}>{item.label}</Text>
                </Pressable>
            );
        }else{
            return (
                <Pressable
                    key={item.value}
                    style={style.option} 
                    onPress={() => toggleSelection(item.value)}>
                    <Text style={[style.text, {opacity:0.8}]}>{item.label}</Text>
                </Pressable>
            );
        }
    };

    const filterOrganizations = (searchText: string) => {
        const filteredOrgs = GreekOptions.filter((org: option) => {
            return org.label.toLowerCase().includes(searchText.toLowerCase());
        });
        setFilteredOrganization(filteredOrgs);
    };

    const toggleSelection = (value: string) => {
        setCurrOrg(value)
    };

    const updateFilter = (value:string) =>{
        setSearch(value)
        filterOrganizations(value)
    }

    const save = () => {
        setIsVisible(false)
        return;
    }

    return(
        <Modal
        isVisible={isVisible} 
        animationOut={'slideOutDown'} 
        animationIn={'slideInUp'}
        useNativeDriver={false}
        backdropColor="white"
        backdropOpacity={0}
        style={{flex: 1, margin: 0}}
        hideModalContentWhileAnimating={false} 
        onSwipeCancel={()=>{setIsVisible(false)}}
        >
            <View style={{flex:1, alignItems:'center', backgroundColor:'white'}}>
                <SafeAreaView  />
                <View style={{width:'90%'}}>
                    <Pressable style={{position:'absolute', top:0, left:0}} onPress={save}>
                        <icons.FontAwesome6 size={30} name={'chevron-left'} color={'#0a400b'} />
                    </Pressable>
                </View>
                <View style={{flex:0.2, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:24, fontWeight:'800', color:'#1c4516'}}>{currOrg}</Text>
                    <View style={{flex:1, position:'absolute'}}>
                        <icons.FontAwesome6 name={'building-columns'} size={100} opacity={0.1} color={'black'} />
                    </View>
                </View>
                <View style={{width:'100%', alignItems:'center'}}>
                    <TextInput
                        style={style.input}
                        onChangeText={(value)=>{updateFilter(value)}}
                        value={search}
                        placeholder="Search Organization"
                        keyboardType="numeric"
                    />
                    <View style={{width:'90%',height:2, borderRadius:10, backgroundColor:'black', marginBottom:2, opacity:0.6}}/>
                </View>
                <View style={{flex:0.8, margin:4, borderBottomLeftRadius:50, borderBottomRightRadius:50, overflow:'hidden'}}>
                    <FlatList 
                        contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 5, gap:10, paddingBottom:'8%'}}
                        data={filteredOrganization}
                        renderItem={renderOrganization}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    option:{
        backgroundColor:'rgba(0,0,0,0.1)',
        borderRadius:10,
        padding:6
    },
    selected:{
        borderColor:'transparent',
        borderRadius:10,
        backgroundColor:'green',
        padding:6
    },
    text:{
        fontSize:13,
        color:'black',
        fontWeight:'600'
    },
    input: {
        width:'90%',
        borderRadius:10,
        padding: 10,
    }
})