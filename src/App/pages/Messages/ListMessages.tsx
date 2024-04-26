import { useEffect, useState } from "react"
import { View, Text, Button, FlatList, TouchableOpacity, Pressable } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Loading2 from "../../../components/Loading2"
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler"
import icons from "../../../components/icons"

type Message ={
    id:string,
    lastMessage:string,
    to:string,
}

export const ListMessages = ({navigation, route}:any) =>{
    const [messages, setMessages] = useState<Message[]>([])
    const [fetching, setFetching] = useState(true)

    let prevOpenedRow:any;
    let row: Array<any> = [];

    useEffect(()=>{
        setFetching(false)
    },[])

    const renderItem = (item:any, index:any , onClick:any) => {
        const closeRow = (index:any) => {
          if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
          }
          prevOpenedRow = row[index];
        };
    
        const renderRightActions = (onClick:any) => {

          return (
            <TouchableOpacity
              style={{
                margin: 0,
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor:'#9c2222',
                opacity:0.8
              }}
              onPress={onClick} >
              <View style={{marginHorizontal:30}}>
                <icons.FontAwesome6 name='trash' color="whitesmoke" size={20} style={{shadowColor:'black', shadowRadius:3, shadowOpacity:0.4, shadowOffset:{height:0, width:0}}} />
              </View>
            </TouchableOpacity>
          );
        };

    
        return (
            <View style={{backgroundColor:'#9c2222'}}>
                <Swipeable
                renderRightActions={() =>
                renderRightActions(onClick)
                }
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
                >
                <Pressable onPress={()=>{navigation.navigate('Event', { eventId: item.id })}}>
                  <LinearGradient 
                      colors={['white', 'whitesmoke']}
                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                      locations={[0.4,1]}
                      style={{padding: 10, paddingVertical:14}}>

                  {/* TOP */}
                  <View style={{flexDirection:'row', justifyContent:'space-between'}} >
                      <View style={{flexDirection:'row', justifyContent:'flex-start', gap:10, padding:2}}>
                        <Text style={{color:'black', fontWeight:'700', fontSize:25, opacity:0.7}}>{item.weekday}</Text>
                        <Text style={{color:'black', fontWeight:'500', fontSize:18, opacity:0.5, alignSelf:'flex-end', marginBottom:3}}> {item.days == 'Today'? 'Today' :  (`in ${item.days} `+ (item.days === '1' ? `Day`:'Days'))}</Text>
                      </View>
                      <icons.Foundation name='torsos-all' size={30} color={'#3c6941'} style={{alignSelf:'center', opacity:0.8}}/>
                  </View>

                  <View style={{backgroundColor:'black', borderRadius:10, height:2, width:'80%', opacity:0.3}} />

                  {/* Bottom */}
                  <View style={{flexDirection:'row', justifyContent:'space-between', width:'96%', marginTop:6, paddingHorizontal:4}}>
                    <Text style={{color:'black', fontWeight:'600', opacity:0.5, fontSize:20, shadowColor:'green', shadowOffset:{width:0, height:0}, shadowRadius:2, shadowOpacity:0.3}}>{item.title}</Text>
                    <Text style={{color:'black', fontWeight:'600', opacity:0.5, fontSize:16, alignSelf:'center', shadowColor:'green', shadowOffset:{width:0, height:0}, shadowRadius:2, shadowOpacity:0.3}}> {item.time}</Text>
                  </View>
                  </LinearGradient>
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
            
            {fetching ?
                <Loading2 />:
                <GestureHandlerRootView style={{ flex: 1}}>
                {messages && messages.length == 0 && !fetching ?
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
                    <View style={{height: 4, backgroundColor:'#3c6941'}} />
                    <FlatList
                    data={messages}
                    onRefresh={() => onRefresh()}
                    refreshing={fetching}
                    ItemSeparatorComponent={() => <View style={{height: 4, backgroundColor:'#3c6941'}} />}
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