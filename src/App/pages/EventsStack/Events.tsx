import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, Button, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import icons from "../../../components/icons";
import Loading from "../../../components/Loading";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { Button2Solid } from "../../../components/Button";

const WIDTH = Dimensions.get('window').width;

const TEST = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First',
        date: Date(),
        likes:20,
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second',
        date: Date(),
        likes:20,      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third',
        date: Date(),
        likes:20,      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d71',
        title: 'Fourth',
        date: Date(),
        likes:20}]

type EventProps ={
    title:string | null,
    date:Date | null,
    likes:number | null,
}

export const EventsPage = ({navigation, route}:any) =>{
    const [loading, setLoading] = useState(true)
    const [Events, setEvents] = useState([{}]);
    const [showPopup, setShowPopup] = useState(false);
    const [deletionSelection, setDeletionSelection] = useState([{} as EventProps, -1]);

    let prevOpenedRow:any;
    let row: Array<any> = [];

    useEffect(() => {
        const {user} = route.params

        setEvents(TEST)
        setLoading(false);
    }, []);

    const renderItem = ({ item, index }:any, onClick:any) => {
        
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
            <View style={{backgroundColor:'rgba(0,0,0,0.1)', marginVertical:5, marginHorizontal:15, borderRadius:6, overflow:'hidden'}}>
                <Swipeable
                renderRightActions={() =>
                renderRightActions(onClick)
                }
                onSwipeableOpen={() => closeRow(index)}
                ref={(ref) => (row[index] = ref)}
                >
                <LinearGradient 
                    colors={['#4A8050', '#5EAC52']}
                    start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                    locations={[0.4,1]}
                    style={{padding: 10, borderRadius:6,}}>

                {/* TOP */}
                <View>
                    <Text>{item.date}</Text>
                    <View>
                        <Text>{item.Days}</Text>
                    </View>
                </View>

                <View />

                {/* Bottom */}
                <View>

                </View>
                </LinearGradient>
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
        setDeletionSelection([{} as EventProps, -1])
        setShowPopup(false)
      }
    
      function deleteEvent() {
        let index = deletionSelection[1]
        let a = Events;
        if(typeof index == 'number' && index>=0){
          a.splice(index, 1);
          console.log(a);
          setEvents([...a]);
          setShowPopup(false)
        }
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
          <FlatList
          data={Events}
          renderItem={(v) =>
            renderItem(v, () => {
                // confirm deletion here
                confirmDeleteItem(v);
            })
          }
          keyExtractor={(item:any) => item.id} 
          />
          <TouchableOpacity style={{position:'absolute', bottom:0, right:0, shadowColor:'black', shadowRadius:5, shadowOpacity:0.6, shadowOffset:{width:2, height:1}, borderRadius: 50, backgroundColor:'#29612F', margin:30, padding:5}} onPress={()=>{navigation.navigate('New Event')}}>
              <icons.Ionicons name={'add'} size={40} color={'white'} />
          </TouchableOpacity>
      </GestureHandlerRootView>}
      <Modal isVisible={showPopup} animationOut={'slideOutDown'} onSwipeCancel={cancelDeletion} onBackdropPress={cancelDeletion} swipeDirection={'down'} useNativeDriver={true} hideModalContentWhileAnimating={true} style={{flex:1}} animationIn={'slideInUp'}>
        <View style={{ alignSelf:'center', gap:20, backgroundColor:'white', width:WIDTH, paddingBottom:'30%', padding:20,  borderTopRightRadius:20, borderTopLeftRadius:20, height:'auto',justifyContent:'flex-start', position:'absolute', bottom:'-5%'}}>
          <Text style={{textAlign:'center', fontSize:22, fontWeight:'500', paddingHorizontal:10}}>Are you sure You Want to Delete this Event?</Text>
          <Text style={{textAlign:'center', fontSize:16, fontWeight:'700', opacity:0.6}}>This action is irreversible and you will lose all you're likes</Text>
          <TouchableOpacity onPress={deleteEvent}>
            <Button2Solid text={'Delete Event'} color={'#ad1717'}/>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
    )
}