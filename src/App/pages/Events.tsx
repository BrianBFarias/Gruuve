import React, {useEffect, useState, } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, Pressable} from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EventsPage } from "./EventsStack/Events";
import { NewEvent } from "./EventsStack/CreateEvent";
import {LikesPage} from "./EventLikes/Likes";
import icons from "../../components/icons";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loading from "../../components/Loading";

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
      setLoading(false); 
    }
  };

  useEffect(()=>{
    fetchData();
  })

  return (
    <View style={{ flex: 1 }}>
        <EventsContent user={user} loading={loading}/>
    </View>
  );
};

const EventsContent = ({ user, loading }:any) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName="EventList">
      {!loading ?
      <>
      <Stack.Screen
      name="EventList"
      component={EventsPage}
      initialParams={{ user: { user }, filter:0 }}
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
              <Pressable>
                <icons.Ionicons size={30} name={'filter'} color={'white'} />
              </Pressable>
            </View>
          </LinearGradient>
        ),
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: 'rgb(255,255,255)',
        },
        animation:'fade'
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
    <Stack.Screen 
    name="Event"
    component={LikesPage}
    options={{
      header: ({ navigation }) => (
        <LinearGradient
        colors={['rgb(248,248,248)','rgb(242,242,242)']}
        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
        locations={[0.4, 1]}
        style={{ paddingBottom: 10, paddingHorizontal: 20 }}>
        <SafeAreaView />
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, alignItems: 'center', height:30 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, bottom: 0, height: 30, width: 30 }}>
            <icons.FontAwesome size={30} name={'chevron-left'} color={'#0a400b'} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      ),
      headerShadowVisible: false,
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: 'rgb(255,255,255)',
      },
      animation:'slide_from_left'
    }}
    />
    </>:
    <Stack.Screen
    name="Loading"
    component={Loading}
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
    }}
  />}
    </Stack.Navigator> 
  );
};

