import React, {useEffect, useState, } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsPage } from "./EventsStack/Events";
import { NewEvent } from "./EventsStack/CreateEvent";
import icons from "../../components/icons";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loading from '../../components/Loading';

const Stack = createNativeStackNavigator();

export const Events = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const uid = auth().currentUser?.uid;
      const userData = await firestore().collection('Users').doc(uid).get();
      if (userData._data) {
        setUser(userData._data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // Set loading to false after data fetching is complete
    }
  };

  useEffect(()=>{
    fetchData();

  })

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={['#29612F', '#0a400b']}
            start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
            locations={[0.4, 1]}
            style={{ paddingBottom: 10, paddingHorizontal: 20 }}>
              <SafeAreaView />
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, alignItems: 'center' }}>
                  <Text style={{ fontWeight: '800', fontSize: 26, opacity: 1, color: 'white' }}>Your Events</Text>
                </View>
          </LinearGradient>
          <Loading />
        </View>
      ) : (
        <EventsContent user={user} />
      )}
    </View>
  );
};

const EventsContent = ({ user }:any) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="EventList">
    <Stack.Screen
      name="EventList"
      component={EventsPage}
      initialParams={{ user: { user } }}
      options={{
        header: () => (
          <LinearGradient
            colors={['#29612F', '#0a400b']}
            start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
            locations={[0.4, 1]}
            style={{ paddingBottom: 10, paddingHorizontal: 20 }}>
            <SafeAreaView />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', fontSize: 26, opacity: 1, color: 'white' }}>Your Events</Text>
            </View>
          </LinearGradient>
        ),
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: 'rgb(255,255,255)',
        },
        animation: 'simple_push'
      }}
    />
    <Stack.Screen
      name="New Event"
      component={NewEvent}
      initialParams={{ user }}
      options={{
        header: ({ navigation }) => (
          <LinearGradient
            colors={['#29612F', '#0a400b']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            locations={[0.4, 1]}
            style={{ paddingBottom: 10, paddingHorizontal: 20 }}>
            <SafeAreaView />
            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, bottom: 0, height: 30, width: 30 }}>
                <icons.FontAwesome size={30} name={'chevron-left'} color={'white'} />
              </TouchableOpacity>
              <Text style={{ fontWeight: '600', fontSize: 26, opacity: 1, color: 'white' }}>New Event</Text>
            </View>
          </LinearGradient>
        ),
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: 'rgb(255,255,255)',
        },
        animation: 'simple_push'
      }}
    />
    </Stack.Navigator> 
  );
};

