import { View, Text, TouchableOpacity} from "react-native"
import icons from "./icons"
export const PopUp = (props) =>{

    return(
        <View style={{position:'absolute', height:'100%', width:'100%', backgroundColor:'rgba(0,0,0,0.6)', zIndex:101, justifyContent:'center'}}>
            <View style={{alignSelf:'center', backgroundColor:'white', padding:20, borderRadius:10, shadowColor:'black', shadowOffset:{height:0, width:0}, shadowRadius:50, shadowOpacity:1, gap:10}}>
                <Text style={{alignSelf:'center', fontSize:22, fontWeight:'700', marginBottom:15}}>Welcome to Gruuve</Text>
                <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                    <icons.MaterialCommunityIcons name="close" color={'#8B2929'} size={34}/>
                    <Text>Reject a User</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                    <icons.MaterialCommunityIcons name="infinity" color={'black'} size={34}/>
                    <Text>Decline an Event</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center', gap:10}}>
                    <icons.MaterialCommunityIcons name="send-check" color={'#5F8B58'} size={34}/>
                    <Text>Show interest for an Event</Text>
                </View>
                <TouchableOpacity style={{alignSelf:'center', backgroundColor:'black', paddingVertical:5, paddingHorizontal:'10%', borderRadius:10, marginTop:15}} onPress={props.onAccept}>
                    <Text style={{color:'white', fontSize:18}}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}