import { Text, View } from "react-native"

export const LikesPage = ({route}:any) =>{

    return(
    <View>
        <Text style={{alignSelf:'center'}}>{route.params.eventId}</Text>
    </View>
    )
}