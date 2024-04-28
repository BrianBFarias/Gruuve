import { useState } from "react"
import { View, SafeAreaView, Text, Dimensions, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native"
import icons from "../../../components/icons"
const windowHeight= Dimensions.get('window').height

export const Message = ({navigation, route}:any) =>{
    const [name, setName] = useState(route.params.name)
    const [message, setMessage] = useState('')

    return(
        <KeyboardAvoidingView style={{flex:1, backgroundColor:'white', zIndex:1}} >
            <View style={{alignItems:'center'}}>
                <TouchableOpacity>
                    <Text style={{fontWeight:'800', fontSize:20}}>{name}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, justifyContent:'flex-end'}}>
                {/* prev messages */}
                <ScrollView style={{flex:1}}>

                </ScrollView>
            </View>
            <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={55}>
                <View style={{width:'95%', alignSelf:'center', flexDirection:'row', alignItems:'flex-end', padding:4, gap:10}}>
                    <TextInput
                        style={style.input}
                        onChangeText={(value)=>{setMessage(value)}}
                        value={message}
                        numberOfLines={4}
                        placeholder="Message"
                        multiline={true}
                        textBreakStrategy="highQuality"
                        inputMode="text"
                        />
                    <View style={{alignItems:'flex-end', marginVertical:4}}>
                        <Pressable>
                            <icons.Ionicons name='send' size={30} color={'green'} />
                        </Pressable>
                    </View>
                </View>
                <SafeAreaView/>
            </KeyboardAvoidingView>
        </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    input: {
        textAlign:'left',
        width:'90%',
        padding:8,
        paddingTop:9,
        paddingLeft:10,
        flexGrow:1,
        fontSize:16,
        maxHeight:150,
        borderRadius:20,
        backgroundColor:'rgb(225,225,225)',
        overflow:'hidden'
    },
})