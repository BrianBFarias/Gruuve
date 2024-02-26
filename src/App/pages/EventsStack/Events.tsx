import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Button, Dimensions, Touchable, Pressable, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import icons from "../../../components/icons";
import Loading from "../../../components/Loading";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { Button2Solid } from "../../../components/Button";
import { FetchEvents } from "./FetchEvents";
const WIDTH = Dimensions.get('window').width;

type EventProp ={
    id:string,
    title:string,
    days:string,
    time:string,
    weekday:string
}

export const EventsPage = ({navigation, route}:any) =>{
    const [loading, setLoading] = useState(false)
    const [Events, setEvents] = useState<EventProp[]>([])
    const [showPopup, setShowPopup] = useState(false);
    const [deletionSelection, setDeletionSelection] = useState([{} as EventProp, -1]);
    const [fetching, setFetching] = useState(false)

    let prevOpenedRow:any;
    let row: Array<any> = [];

    const fetchEvents = async () => {
      const {user} = route.params
      await FetchEvents({user})
      .then(eventList =>{
        if(eventList){
          setEvents(eventList)
        }
      })
    };

    useEffect(() => {
      setFetching(true);
      setLoading(true);
      fetchEvents()
      setLoading(false);
      setFetching(false);
    }, []);

    const renderItem = (item:EventProp, index:any , onClick:any) => {
        
        const closeRow = (index:any) => {
          if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close();
          }
          prevOpenedRow = row[index];
        };
    
        const renderRightActions = (onClick:any) => {

          return (
            <View
              style={{
                margin: 0,
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity onPress={onClick} style={{paddingHorizontal:20}}>
                <icons.FontAwesome6 name='trash' color="#9c2222" size={20} style={{shadowColor:'white', shadowRadius:3, shadowOpacity:0.4, shadowOffset:{height:0, width:0}}} />
              </TouchableOpacity>
            </View>
          );
        };

    
        return (
            <View style={{backgroundColor:'rgba(0,0,0,0.1)', marginVertical:5, marginHorizontal:15, borderRadius:4, overflow:'hidden'}}>
                <Swipeable
                renderRightActions={() =>
                renderRightActions(onClick)
                }
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
                >
                <Pressable onPress={()=>{console.log('pressed')}}>
                  <LinearGradient 
                      colors={['#4A8050', '#5EAC52']}
                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                      locations={[0.4,1]}
                      style={{padding: 10, borderRadius:4}}>

                  {/* TOP */}
                  <View style={{flexDirection:'row', justifyContent:'space-between'}} >
                      <View style={{flexDirection:'row', justifyContent:'flex-start', gap:10, padding:2}}>
                        <Text style={{color:'white', fontWeight:'700', fontSize:25}}>{item.weekday}</Text>
                        <Text style={{color:'white', fontWeight:'500', fontSize:18, opacity:0.7, alignSelf:'flex-end', marginBottom:3}}> {item.days == 'Today'? 'Today' :  (`in ${item.days} `+ (item.days === '1' ? `Day`:'Days'))}</Text>
                      </View>
                      <icons.Foundation name='torsos-all' size={30} color={'white'} style={{alignSelf:'center'}}/>
                  </View>

                  <View style={{backgroundColor:'black', borderRadius:10, height:3, width:'80%', opacity:0.3}} />

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

      const confirmDeleteItem = ({ item, index }:any) => {
        console.log(item, index);
        setDeletionSelection([item, index])
        setShowPopup(true)
      };

      function cancelDeletion(){
        setDeletionSelection([{} as EventProp, -1])
        setShowPopup(false)
      }
    
      function deleteEvent() {
        let index = deletionSelection[1]
        let a = Events;
        if(typeof index == 'number' && index>=0 && a){
          a.splice(index, 1);
          console.log(a);
          setEvents(a);
          setShowPopup(false)
        }
      }

      function onRefresh() {
        setFetching(true)
        fetchEvents();
        setFetching(false)
      }

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        {loading ?
        <Loading />:
        <GestureHandlerRootView style={{ flex: 2,marginTop:20 }}>
          {Events.length === 0 ?
          <FlatList
          data={[{}]}
          onRefresh={() => onRefresh()}
          refreshing={fetching}
          renderItem={({ item, index }) =>
            <Text style={{alignSelf:'center', fontWeight:'600', fontSize:20, opacity:0.5, marginTop:'20%'}}>No Events</Text>
          }
          />:
          <FlatList
          data={Events}
          onRefresh={() => onRefresh()}
          refreshing={fetching}
          renderItem={({ item, index }) =>
            renderItem(item, index, () => {
              // confirm deletion here
              confirmDeleteItem({ item, index });
            })
          }
          keyExtractor={(item:any) => item.id} 
          />}
          <TouchableOpacity style={{position:'absolute', bottom:0, right:0, shadowColor:'black', shadowRadius:5, shadowOpacity:0.6, shadowOffset:{width:2, height:1}, borderRadius: 50, backgroundColor:'#29612F', margin:30, padding:5}} onPress={()=>{navigation.navigate('New Event')}}>
              <icons.Ionicons name={'add'} size={40} color={'white'} />
          </TouchableOpacity>
        </GestureHandlerRootView>}
      <Modal isVisible={showPopup} animationOut={'slideOutDown'} onSwipeCancel={cancelDeletion} onBackdropPress={cancelDeletion} swipeDirection={'down'} useNativeDriver={true} hideModalContentWhileAnimating={true} style={{flex:1}} animationIn={'slideInUp'}>
        <View style={{ alignSelf:'center', gap:20, backgroundColor:'white', width:'100%', padding:20,  borderRadius:20, height:'auto',justifyContent:'flex-start', position:'absolute', bottom:0}}>
          <Text style={{textAlign:'center', fontSize:20, fontWeight:'500', paddingHorizontal:10}}>Are you sure You Want to Delete this Event?</Text>
          <Text style={{textAlign:'center', fontSize:14, fontWeight:'700', opacity:0.6}}>This action is irreversible and you will lose all you're likes</Text>
          <TouchableOpacity onPress={deleteEvent}>
            <Button2Solid text={"Yes, I'm sure"} color={'#ad1717'}/>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
    )
}