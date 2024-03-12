import { View, Image, Text, Dimensions, ScrollView, SafeAreaView, TouchableOpacity } from "react-native"
import icons from "../../../components/icons";
const windowWidth = Dimensions.get('window').width;

export default function ProfileMain({userData, disabled}:any){
    console.log(userData)
    return(
        <ScrollView style={{width:'100%'}} bounces={false}>
            <SafeAreaView />
            <TouchableOpacity style={{height: 120, width:120, shadowColor:'black', shadowOffset:{height:0, width:0}, shadowRadius:4, shadowOpacity:0.5, alignSelf:'center', borderRadius:150, borderColor:'green', borderWidth:4}}>
                <View style={{position:'absolute', top:0, right:0, height:30, width:30, backgroundColor:'white', margin:2, zIndex:3, borderRadius:20, justifyContent:'center'}}>
                    <View style={{alignSelf:'center'}}><icons.MaterialIcons name='edit' size={20} color='black'/></View>
                </View>
                <View style={{position:'relative', height: '100%', width:'100%', overflow:'hidden', borderRadius:150, borderColor:'rgb(215,215,215)', borderWidth:4}}>
                    {disabled && 
                    <View style={{position:'absolute', backgroundColor:'rgba(0,0,0,0.5)', width:'100%', height:'100%', zIndex:10, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'white', fontWeight:'700', textAlign:'center'}}> Account Disabled</Text>
                    </View>}
                    <Image 
                        source={{uri:"https://picsum.photos/300/320"}} 
                        style={{height:'100%', width:'100%'}}
                        resizeMode="cover"
                    />
                </View>
            </TouchableOpacity>
            <Text style={{textAlign:'center', margin:20, fontSize:18, fontWeight:'600'}}>{userData.First}</Text>
        </ScrollView>
    )
}