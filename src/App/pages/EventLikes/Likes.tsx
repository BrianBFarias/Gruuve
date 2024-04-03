import { useEffect, useState } from "react"
import { Text, View } from "react-native"

export const LikesPage = ({route}:any) =>{
    const [loading, setLoading] = useState(true)
    const [likes, setLikes] = useState<any[]>([])

    useEffect(()=>{
        // fetch likes
        setLoading(false)
    },[])

    return(
    <View>
        <Text style={{alignSelf:'center'}}>{route.params.eventId}</Text>
    </View>
    )
}