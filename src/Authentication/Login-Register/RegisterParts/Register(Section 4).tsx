import { Button, ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import {AuthForm} from '../../AuthenticationStyling'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { useEffect, useState } from "react";
import ImagePicker from 'react-native-image-crop-picker';
import Button1 from "../../../components/Button";


export default function Section4({setImage1,setImage2, setImage3, setImage4, Image1, Image2, Image3, Image4, onRegister}:any){
    const [permissionGranted, setPermissionGranted] = useState(false)

    useEffect(()=>{
        request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result:any) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    setPermissionGranted(false)
                  break;
                case RESULTS.DENIED:
                    setPermissionGranted(false)
                  break;
                case RESULTS.LIMITED:
                  console.log('The permission is limited: some actions are possible');
                  break;
                case RESULTS.GRANTED:
                    setPermissionGranted(true)
                  break;
                case RESULTS.BLOCKED:
                    setPermissionGranted(false)
                  break;
              }
        });
    })

    function RemoveImage(index:any){
        switch(index){
            case 0: setImage1(undefined)
            break;
            case 1: setImage2(undefined)
            break;
            case 2: setImage3(undefined)
            break;
            case 3: setImage4(undefined)
            break;
        }
    }

    const onImageGalleryClick = (imageNum:any) => {
        ImagePicker.openPicker({
            width: 300,
            height: 340,
            cropping: true,
            mediaType:'photo',
            includeBase64:true,
          }).then(image => {
            if (image && image.sourceURL && image.cropRect) {
                const saveImage = {
                    uri: image.sourceURL,
                    data: image.data,
                    mime: image.mime,
                    height: 340,
                    width: 300,
                    x: image.cropRect.x,
                    y: image.cropRect.y,
                }
                switch (imageNum) {
                  case 1:
                    setImage1(saveImage);
                    break;
                  case 2:
                    setImage2(saveImage);
                    break;
                  case 3:
                    setImage3(saveImage);
                    break;
                  case 4:
                    setImage4(saveImage);
                    break;
                }
              }
        });
    }

    function validate(){
      if(!Image1){
        return
      }
      else{
        onRegister()
      }
    }


    function renderCroppedImage({imageData, index}:any) {
        if (!imageData) return(
            <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor:'rgba(0,0,0,0.6)',
                  borderWidth:3,
                  borderRadius:5,
                  borderStyle:'dashed',
                  zIndex:4
                }} >
                <Icon style={{}} color="whitesmoke" name="picture-o" size={20} />
                {index === 0?
                 <Icon2 style={{position:'absolute', left:-8, top:-8, backgroundColor:'green', borderRadius:15, overflow:'hidden', padding:3, color:'whitesmoke'}} name="star" size={20} />:
                <Icon2 style={{position:'absolute', left:-8, top:-8}} color="#3b3b3b" name="add-circle" size={25} />}
            </View>
        );

        return (
            <View style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
                <Image
                    source={{ uri: `data:${imageData.mime};base64,${imageData.data}` }} 
                    style={{ width: '100%', height: '100%', borderRadius:5}}
                    resizeMode="cover"
                />
                <TouchableOpacity onPress={()=>{RemoveImage(index)}} style={{ position: 'absolute', left: -8, top: -8,padding:2, backgroundColor: '#153808', borderRadius: 20, overflow: 'hidden' }}>
                    <Icon2 color="white" name="close" size={20} />
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        <View style={{display:'flex', justifyContent:'space-between', height:'100%'}}>
            <View >
                <Text style={AuthForm.header3}>Show em your shine</Text>
                <Text style={[AuthForm.sub, {paddingHorizontal:10}]}>Add pictures of Yourself! You need at least a Main Picture to continue.</Text>
            </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              paddingHorizontal:20
            }}
          >
            {[...Array(4)].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "45%",
                  aspectRatio: 3 / 3.4,
                  margin: "2%",
                  borderRadius: 5,
                }}
                onPress={() => {
                  onImageGalleryClick(index + 1); // Add 1 to index to match image number
                }}
              >
                {index === 0  ? (
                    renderCroppedImage({ imageData: Image1, index:index })

                ) : index === 1 ? (
                    renderCroppedImage({ imageData: Image2, index:index  })

                ) : index === 2 ? (
                    renderCroppedImage({ imageData: Image3, index:index  })

                ) : index === 3 ? (
                    renderCroppedImage({ imageData: Image4, index:index  })

                ) : (null)}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>{onRegister()}} >
            <Button1 text={'Finalize'}/>
        </TouchableOpacity>
        </View>
      );
}