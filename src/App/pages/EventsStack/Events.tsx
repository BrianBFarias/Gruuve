import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Button, Dimensions, Touchable, Pressable, Image, StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import icons from "../../../components/icons";
import Loading from "../../../components/Loading";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { FetchEvents } from "./FetchEvents";

type EventProp ={
    id:string,
    title:string,
    days:string,
    time:string,
    weekday:string
}

export const EventsPage = ({navigation, route}:any) =>{
    const [loading, setLoading] = useState(true)
    const [Events, setEvents] = useState<EventProp[]>()
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
      fetchEvents()
      setFetching(false);
      setLoading(false);
      
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
              <TouchableOpacity onPress={onClick} style={{marginHorizontal:30}}>
                <icons.FontAwesome6 name='trash' color="#9c2222" size={20} style={{shadowColor:'white', shadowRadius:3, shadowOpacity:0.4, shadowOffset:{height:0, width:0}}} />
              </TouchableOpacity>
            </View>
          );
        };

    
        return (
            <View style={{backgroundColor:'rgba(0,0,0,0.1)'}}>
                <Swipeable
                renderRightActions={() =>
                renderRightActions(onClick)
                }
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
                >
                <Pressable onPress={()=>{console.log('pressed')}}>
                  <LinearGradient 
                      colors={['whitesmoke', 'rgb(120,160,120)']}
                      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                      locations={[0.4,1]}
                      style={{padding: 10, paddingVertical:14}}>

                  {/* TOP */}
                  <View style={{flexDirection:'row', justifyContent:'space-between'}} >
                      <View style={{flexDirection:'row', justifyContent:'flex-start', gap:10, padding:2}}>
                        <Text style={{color:'black', fontWeight:'700', fontSize:25, opacity:0.7}}>{item.weekday}</Text>
                        <Text style={{color:'black', fontWeight:'500', fontSize:18, opacity:0.5, alignSelf:'flex-end', marginBottom:3}}> {item.days == 'Today'? 'Today' :  (`in ${item.days} `+ (item.days === '1' ? `Day`:'Days'))}</Text>
                      </View>
                      <icons.Foundation name='torsos-all' size={30} color={'white'} style={{alignSelf:'center'}}/>
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
        // fetchEvents();
        setTimeout(()=>{
          setFetching(false)
        }, 600)
      }

    return(
    <LinearGradient 
        colors={['rgb(255,255,255)', 'rgb(215,215,215)']}
        start={{x: 0.0, y: 0}} end={{x: 0, y: 1}}
        locations={[0.4,1]}
        style={{flex:1}}>
        {loading ?
        <Loading />:
        <GestureHandlerRootView style={{ flex: 1}}>
          {Events && Events.length == 0 && !loading ?
          <FlatList
          data={[{}]}
          onRefresh={() => onRefresh()}
          refreshing={fetching}
          renderItem={() =>
            <Text style={{alignSelf:'center', fontWeight:'600', fontSize:20, opacity:0.5, marginTop:'20%'}}>No Events</Text>
          }
          />:
          <>
            <View style={{height: 4, backgroundColor:'#3c6941'}} />
            <FlatList
            data={Events}
            onRefresh={() => onRefresh()}
            refreshing={fetching}
            ItemSeparatorComponent={() => <View style={{height: 4, backgroundColor:'#3c6941'}} />}
            renderItem={({ item, index }) =>
              renderItem(item, index, () => {
                // confirm deletion here
                confirmDeleteItem({ item, index });
              })
            }
            keyExtractor={(item:any) => item.id} 
            />
          </>}
          <TouchableOpacity style={{position:'absolute', bottom:0, right:0, shadowColor:'black', shadowRadius:5, shadowOpacity:0.6, shadowOffset:{width:2, height:1}, borderRadius: 50, backgroundColor:'#29612F', margin:30, padding:5}} onPress={()=>{navigation.navigate('New Event')}}>
              <icons.Ionicons name={'add'} size={40} color={'white'} />
          </TouchableOpacity>
        </GestureHandlerRootView>}
      <Modal isVisible={showPopup} animationOut={'slideOutDown'} onSwipeCancel={cancelDeletion} onBackdropPress={cancelDeletion} swipeDirection={'down'} useNativeDriver={true} hideModalContentWhileAnimating={true} style={{flex:1}} animationIn={'slideInUp'}>
        <View style={{ alignSelf:'center', gap:10, backgroundColor:'white', width:'100%', paddingHorizontal:20, paddingVertical:15,  borderRadius:15, height:'auto',justifyContent:'flex-start', position:'absolute', bottom:0}}>
          <Text style={{textAlign:'center', fontSize:20, fontWeight:'500', paddingHorizontal:10}}>Are you sure You Want to Delete this Event?</Text>
          <Text style={{textAlign:'center', fontSize:14, fontWeight:'700', opacity:0.6}}>This action is irreversible and you will lose all you're likes for this event.</Text>
          <View style={{height:2, width:'100%', backgroundColor:'black', opacity:0.3, borderRadius:5}}/>
          <TouchableOpacity onPress={deleteEvent} style={{flexDirection:'column', justifyContent:'space-between', gap:10}}>
            <Text style={[styles.confirmationOption, {color:'#ab0c0c'}]}>Yes, Im sure</Text>
            <View style={{height:1, width:'85%', backgroundColor:'black', opacity:0.3, borderRadius:5, alignSelf:'center'}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{setShowPopup(false)}} style={{flexDirection:'column', justifyContent:'space-between', gap:10}}>
            <Text style={styles.confirmationOption}>No, I want more likes!!</Text>
            <View style={{height:1, width:'85%', backgroundColor:'black', opacity:0.3, borderRadius:5, alignSelf:'center'}}/>
          </TouchableOpacity>
          <View style={{height:4, backgroundColor:'black', width:'20%', borderRadius:4, alignSelf:'center', opacity:0.5, marginTop:10}}/>
        </View>
      </Modal>
    </LinearGradient>
    )
}

const styles = StyleSheet.create({
  confirmationOption:{
    textAlign:'center',
    fontSize:16,
    fontWeight:'600'
  },
})