import React, { useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback, Alert} from "react-native";
import {AuthForm} from '../AuthenticationStyling'
import Icon1 from 'react-native-vector-icons/Ionicons'
import Logo from '../../../assets/images/logo.png'
import { LocationName } from '../../components/ConstantFunctions/LocName';

import Section1 from './RegisterParts/Register(Section 1)';
import Section2 from './RegisterParts/Register(Section 2)'
import Section3 from './RegisterParts/Register(Section 3)'
import Section4 from './RegisterParts/Register(Section 4)';
import Section5 from './RegisterParts/Register(Section 5)';

import auth from '@react-native-firebase/auth';
import Loading from '../../components/Loading';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

interface ImageRetrieveData {
  uri: string | undefined;
  data: string | undefined;
  mime: string | undefined;
  height: number | undefined;
  width: number | undefined;
  x: number | undefined;
  y: number | undefined;
}

interface coordinate {
  latitude: number | 0;
  longitude: number | 0;
}

const ImageURLs = new Map();

const Register = ({navigation}: any) => {
  const [section, setSection] = useState(0)
  const [load, setLoad] = useState(false)

  // First Section
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfrimation, setPasswordConfirmation] = useState("")
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")

  // Second Section
  const [organization, setOrganization] = useState("");
  const [age, setAge] = useState(0);
  const [birthDate, setBirthDate] = useState(null);
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState<string>();
  const [location, setLocation] = useState<coordinate>({latitude:27, longitude:-81});

  // Third Section
  const [hobbies, setHobbies] = useState<string[]>([]);

  // Fourth Section
  const [genderPreference, setGenderPreference] = useState("");
  const [ageMin, setAgeMin] = useState(18)
  const [ageMax, setAgeMax] = useState(70)
  const [radius, setRadius] = useState(50) 

  // Fifth Section
  const [Image1, setImage1] = useState<ImageRetrieveData | undefined>();
  const [Image2, setImage2] = useState<ImageRetrieveData | undefined>();
  const [Image3, setImage3] = useState<ImageRetrieveData | undefined>();
  const [Image4, setImage4] = useState<ImageRetrieveData | undefined>();
  
// Animations amongst sections
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const section0 = new Animated.Value(1);
  const section1 = new Animated.Value(0);
  const section2 = new Animated.Value(0);
  const section3 = new Animated.Value(0);
  const section4 = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      delay:300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(()=>{
    Animated.timing(section1, {
      toValue: 1,
      duration: 600, 
      useNativeDriver: false,
    }).start();
    Animated.timing(section3, {
      toValue: 1,
      duration: 600, 
      useNativeDriver: false,
    }).start();   
  },[section])

  useEffect(()=>{
    Animated.timing(section3, {
      toValue: 1,
      duration: 600, 
      useNativeDriver: false,
    }).start();
    Animated.timing(section4, {
      toValue: 1,
      duration: 600, 
      useNativeDriver: false,
    }).start();   
  },[section])

  function showAddInfo(){

    Animated.timing(section0, {
      toValue: 0,
      duration: 600, 
      useNativeDriver: false,
    }).start();
    setTimeout(function(){
      setSection(section+1);
    }, 600)  
  }

  function showPage3(){
    // re-establish that section1 is visible (it was set to 0 before)
    section2.setValue(1)

    Animated.timing(section2, {
      toValue: 0,
      duration: 600, 
      useNativeDriver: false,
    }).start();
    setTimeout(function(){
      setSection(section+1);
    }, 600)  
  }

  function showPage2(){
    // re-establish that section1 is visible (it was set to 0 before)
    section1.setValue(1)

    Animated.timing(section1, {
      toValue: 0,
      duration: 600, 
      useNativeDriver: false,
    }).start();
    setTimeout(function(){
      setSection(section+1);
    }, 600)  
  }

  function showImageUpload(){
    section3.setValue(1)

    Animated.timing(section3, {
      toValue: 0,
      duration: 600, 
      useNativeDriver: false,
    }).start();
    setTimeout(function(){
      setSection(section+1);
    }, 600)  
  }

  const SaveImages = async (uid: any) => {
    // path to existing file on filesystem

    if(Image1 && Image1.uri && Image1.data){
      let path = `${uid}/`;
      let fileName = path + Image1.uri.substring(Image1.uri.lastIndexOf('/') + 1);
      ImageURLs.set(1, fileName)

      try{
        await storage().ref(fileName).putString(Image1.data, "base64", {contentType: 'image/jpg'});
      }
      catch(e){
        console.log(e)
        return;
      }
    }
    const imagesArray = [Image2, Image3, Image4];

    imagesArray.forEach(async (image, index) => {
      if (image?.uri && image.data) {
        let path = `${uid}/`;
        let fileName =path + image.uri.substring(image.uri.lastIndexOf('/') + 1);
        ImageURLs.set(index+2, fileName)

        try{
          await storage().ref(fileName).putString(image.data, "base64", {contentType: 'image/jpg'});
        }
        catch(e){
          console.log(e)
          return;
        }
      }else{
        ImageURLs.set(index+2, null)
      }
    });
  }

  const onRegister = async () => {
    if(!Image1){
      Alert.alert("Please Select a Main Image")
      return;
    }
    if(location.latitude!=0 && location.longitude == 0){
      Alert.alert("Please Select Location")
      return;
    }

    const locationText = await LocationName({latitude: location.latitude, longitude: location.longitude});

    setLoad(true)
        auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (response:any) => {
            const uid = response.user.uid

            await SaveImages(uid);

            const ImageList = [];

            for (let i = 1; i <= 4; i++) {
                const imageURL = await ImageURLs.get(i);
                if (imageURL !== null) {
                    ImageList.push(imageURL);
                }
            }

            const lng = location.longitude
            const lat = location.latitude

            const data = {
              uid: uid,
              newAccount: true,
              Email: email,
              First: first,
              Last: last,
              Sex: gender,
              Organization: organization,
              Location: { Latitude: lat, Longitude: lng, area:locationText },
              BirthDate: birthDate,
              Hobbies: hobbies,
              ImageURLs: ImageList,
              Reject: [],
              Decline: [],
              Preference: {
                Sex: genderPreference,
                AgeRange: { min: Number(ageMin), max: Number(ageMax) },
                Radius: radius,
              },
              premiumMember:false,
              Height:height,
              School:"",
            };
          firestore().
                collection('Users')
                .doc(uid)
                .set(data)
                .then(() => {
                    setLoad(false)
                    return;
                })
                .catch((error:any) => {
                  console.log(error)
                  Alert.alert("Error", error.message || "An unknown error occurred");
                  setLoad(false)
                });
        })
        .catch((error:any) => {
          if(error.code === 'auth/email-already-in-use'){
            Alert.alert("Registration Failed", "The supplied email is already in use. Either use a different one or reset your Password")
          }
          setSection(0)
          setLoad(false)
      });
}

 const moveBack = () =>{
  setSection(section-1);
 }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {!load ?
          <View style={{flex:1, backgroundColor:'rgb(245,245,245)'}}>
              <View style={{flex:1}}>
            <SafeAreaView />
            <View>
              <Animated.Image source={Logo} style={[AuthForm.logo,{opacity:fadeAnim}]} />
              <View style={AuthForm.back}>
                <TouchableOpacity onPress={section > 0 ?  moveBack : navigation.goBack} style={{paddingLeft:10}}>
                  <Icon1 size={35} color={'#1e451a'} name='chevron-back-outline'/>
                </TouchableOpacity>
              </View>
            </View>
              <View  style={AuthForm.infoBox}>
              {section === 0 &&
                  <Animated.View style={[{opacity: section0,  height:'75%'}]}>
                    <Section1 
                    setFirst={setFirst} 
                    first={first} 
                    setLast={setLast} 
                    last={last} 
                    setEmail={setEmail} 
                    email={email} 
                    setPassword={setPassword} 
                    password={password} 
                    setPasswordConfirmation={setPasswordConfirmation} 
                    passwordConfrimation={passwordConfrimation} 
                    showAddInfo={showAddInfo} 
                    navigation={navigation}/>
                  </Animated.View>}
    
              {section === 1 &&
                <Animated.View style={{opacity: section1, height:'75%' }}>
                  <Section2 
                  location={location} 
                  setLocation={setLocation} 
                  organization={organization} 
                  setOrganization={setOrganization} 
                  age={age} 
                  setAge={setAge} 
                  setBirthDate={setBirthDate} 
                  gender={gender} 
                  setGender={setGender} 
                  height={height}
                  setHeight={setHeight}
                  nextSection={showPage2}/>
                </Animated.View>}

              {section === 2 && 
                <Animated.View style={{opacity: section3, height:'75%' }}>
                  <Section3 
                  nextSection={showImageUpload} 
                  hobbies={hobbies} 
                  setHobbies={setHobbies}/>
              </Animated.View>
              }

              {section === 3 &&
                <Animated.View style={{opacity: section3, height:'75%' }}>
                  <Section4 
                  nextSection={showImageUpload} 
                  setGenderPreference={setGenderPreference} 
                  genderPreference={genderPreference} 
                  currMin={ageMin} currMax={ageMax} 
                  setCurrMin={setAgeMin} 
                  setCurrMax={setAgeMax} 
                  radius={radius} 
                  setRadius={setRadius} />
                </Animated.View>}
    
    
              {section === 4 &&
                <Animated.View style={{opacity: section4, height:'75%'}}>
                  <Section5 
                  setImage1={setImage1} 
                  setImage2={setImage2} 
                  setImage3={setImage3} 
                  setImage4={setImage4} 
                  Image1={Image1} 
                  Image2={Image2} 
                  Image3={Image3} 
                  Image4={Image4} 
                  onRegister={onRegister}/>
                </Animated.View>}
            </View>
              </View>
          </View>:
          <Loading />}
    </TouchableWithoutFeedback>
  );
}

export default Register;