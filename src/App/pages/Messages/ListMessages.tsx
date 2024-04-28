import { useEffect, useState } from "react"
import { View, Text, Button, FlatList, TouchableOpacity, Pressable, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Loading2 from "../../../components/Loading2"
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler"
import icons from "../../../components/icons"
import FastImage from "react-native-fast-image"

type Message ={
    id:string,
    lastMessage:string,
    to:string,
    newMessage:boolean
}

type Preview ={
    id:string,
    lastMessage:string,
    url:string,
    toFirst:string,
    toLast:string,
    newMessage:boolean
}

const windowWidth= Dimensions.get('window').width

export const ListMessages = ({navigation, route}:any) =>{
    const [messages, setMessages] = useState<Message[]>(route.params.messages)
    const [messagePreviews, setMessagePreviews] = useState<Preview[]>(route.params.messages)

    const [fetching, setFetching] = useState(false)
    const [loading, setLoading] = useState(true)

    let prevOpenedRow:any;
    let row: Array<any> = [];

    useEffect(()=>{
        setLoading(false)
        // TODO: fetch Message Data Here
        setTimeout(()=>{
            setMessagePreviews([
                {id:'123',
                lastMessage:'Heyyyy',
                url:`https://picsum.photos/320/300`,
                newMessage:true,
                toFirst:'Yaki',
                toLast:'Locki'
                },
                {id:'135',
                lastMessage:'Thanks see u then',
                url:`https://picsum.photos/320/300`,
                newMessage:false,
                toFirst:'Jackie',
                toLast:'Miata'
                }
            ])
        },200)
    },[])

    const renderItem = (item:Preview, index:number , onClick:Function) => {
        const closeRow = (index:any) => {
          if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
          }
          prevOpenedRow = row[index];
        };
    
        const renderRightActions = (onClick:any) => {
            // end convo option
          return (
            <TouchableOpacity
              style={{
                margin: 0,
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor:'rgb(200,200,200)',
                zIndex:20
              }}
              onPress={onClick} >
              <View style={{marginHorizontal:30, alignItems:'center'}}>
                <icons.Ionicons name='close' color="black" size={30}/>
                <Text style={{opacity:0.5, fontWeight:'600', fontSize:12}}>Close</Text>
              </View>
            </TouchableOpacity>
          );
        };

    
        return (
            <View style={{position:'relative',backgroundColor:'rgb(120,120,120)',marginVertical:0, zIndex:22}}>
                <Swipeable
                renderRightActions={() =>
                renderRightActions(onClick)
                }
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
                >
                <Pressable onPress={()=>{navigation.navigate('Message', { messageId: item.id, name:`${item.toFirst} ${item.toLast}` })}}>
                  <View style={{flex:1, backgroundColor:'white', paddingHorizontal:'5%', paddingVertical:10, flexDirection:'row', gap:10}}>
                    <View style={[{width:windowWidth/5, height:windowWidth/5, borderRadius:windowWidth/4, overflow:'hidden', borderWidth:3, borderColor:'transparent',}, item.newMessage && {borderWidth:2, borderColor:'green', padding:1}]}>
                        <FastImage
                            source={{ uri: `${item.url}`, cache: FastImage.cacheControl.immutable, priority: FastImage.priority.high}} 
                            style={[{ width: '100%', height: '100%', backgroundColor:'rgba(0,0,0,0.1)', borderRadius:windowWidth/4}]}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={{alignSelf:'center'}}>
                        <View>
                            <Text style={{fontWeight:'700', fontSize:18}}>{item.toFirst}</Text>
                        </View>
                        <View style={[item.newMessage? {opacity:1}:{opacity:0.4}]}>
                            <Text style={{fontWeight:'600',fontSize:14}}>{item.lastMessage}</Text>
                        </View>
                    </View>
                  </View>
                </Pressable>
            </Swipeable>
            </View>
        );
      };

    function leaveMessage({item, index}:any){

    }

      function onRefresh() {
        setFetching(true)
        // fetchMessages();
        setTimeout(()=>{
          setFetching(false)
        }, 600)
      }


    return(
        <View style={{flex:1, backgroundColor:'red'}}>
            <LinearGradient 
            colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
            start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
            locations={[0.4,1]}
            style={{flex:1}}>
            
            {loading ?
                <Loading2 />:
                <GestureHandlerRootView style={{ flex: 1}}>
                {messagePreviews && messagePreviews.length == 0 && !fetching ?
                <FlatList
                data={[{}]}
                onRefresh={() => onRefresh()}
                refreshing={fetching}
                renderItem={() =>
                    <View>
                        <Text style={{alignSelf:'center', fontWeight:'600', fontSize:20, opacity:0.5, marginTop:'30%'}}>No Messages</Text>
                        <Text style={{alignSelf:'center', fontWeight:'600', fontSize:16, opacity:0.3, marginTop:'3%'}}>Try Sending more Event Requests!</Text>
                    </View>
                }
                />:
                <>
                    <FlatList
                    data={messagePreviews}
                    onRefresh={() => onRefresh()}
                    refreshing={fetching}
                    ItemSeparatorComponent={() => <View style={{position:'relative', height: 1, backgroundColor:'black', width:'90%', alignSelf:'center', borderRadius:4, opacity:0.1, zIndex:100}} />}
                    renderItem={({ item, index }) =>
                    renderItem(item, index, () => {
                        // confirm deletion here
                        leaveMessage({ item, index });
                    })
                    }
                    keyExtractor={(item:any) => item.id} 
                    />
                </>}
                </GestureHandlerRootView>
            }
                
            </LinearGradient>
        </View>
    )
}