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

const windowWidth = Dimensions.get('window').width;

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
                <Pressable onPress={()=>{console.log('pressed')}}>
                  <LinearGradient 
                      colors={['whitesmoke', 'whitesmoke']}
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
        <View style={{ alignSelf:'center', gap:10, backgroundColor:'white', width:windowWidth, paddingHorizontal:20, paddingBottom:45,  borderRadius:15, justifyContent:'flex-start', position:'absolute', bottom:-20}}>
          <View style={{height:4, backgroundColor:'black', width:'20%', borderRadius:4, alignSelf:'center', opacity:0.5, marginTop:10}}/>
          <Text style={{textAlign:'center', fontSize:20, fontWeight:'700', paddingHorizontal:10}}>Confirm Event Deletion?</Text>
          <Text style={{textAlign:'center', fontSize:12, fontWeight:'500', opacity:0.6}}>This action is irreversible and you will lose all you're likes for this event.</Text>
          <View style={{flexDirection:'row', justifyContent:'space-around'}}>
            <TouchableOpacity onPress={deleteEvent} style={{justifyContent:'space-between', marginVertical:6, backgroundColor:'#ab0c0c', padding:15, borderRadius:60,}}>
              <Text style={[styles.confirmationOption, {color:'white',}]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setShowPopup(false)}} style={{justifyContent:'space-between', marginVertical:6, backgroundColor:'black', padding:15, borderRadius:60}}>
              <Text style={[styles.confirmationOption,  {color:'white',}]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
    )
}

const styles = StyleSheet.create({
  confirmationOption:{
    textAlign:'center',
    fontSize:18,
    fontWeight:'600'
  },
})