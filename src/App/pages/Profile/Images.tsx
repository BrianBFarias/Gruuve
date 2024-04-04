import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import ImagePicker from 'react-native-image-crop-picker';
import Icons from "../../../components/icons";
import { Chase } from 'react-native-animated-spinkit'
import FastImage from 'react-native-fast-image';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';


export const Images =({allImages, setAllImages, setSaving}:any) =>{
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
    function RemoveImage(index: any) {
      if (index >= 0) {
        const updatedImages = [...allImages]; // Create a copy of the original array
        updatedImages.splice(index, 1); // Remove the element at the specified index
        setAllImages(updatedImages); // Update state with the modified array
      }
    }

    function saveImage(){

    }

    const onImageGalleryClick = async (index:any) => {
      const uid = auth().currentUser?.uid;
        try{
          ImagePicker.openPicker({
            width: 300,
            height: 320,
            cropping: true,
            mediaType:'photo',
            includeBase64:true,
            forceJpg:true,
          }).then(async image => {

            // if image selected clear old image and set new one
            if (image && image.sourceURL && image.cropRect && image.data) {
                const saveImage = {
                    uri: image.sourceURL,
                    data: image.data,
                    mime: image.mime,
                    height: 320,
                    width: 300,
                    x: image.cropRect.x,
                    y: image.cropRect.y,
                }
                setSaving(true)
                // Adding image to end
                if(index+1 > allImages.length){

                  let path = `${uid}/`;
                  let fileName =path + saveImage.uri.substring(saveImage.uri.lastIndexOf('/') + 1);

                  try{
                    await storage().ref(fileName).putString(saveImage.data, "base64", {contentType: 'image/jpg'});
                  }
                  catch(e){
                    console.log(e)
                    return;
                  }

                  const url = await storage().refFromURL('gs://greekgators-38675.appspot.com/' + fileName).getDownloadURL();

                  setAllImages((allImages: any) => [...allImages, url]);

                  firestore()
                  .collection('Users')
                  .doc(uid)
                  .get()
                  .then(doc => {
                    if (doc.exists) {
                        const currentImageURLs = doc.data()?.ImageURLs || []; // Get the current array or initialize to empty array
                        const updatedImageURLs = [...currentImageURLs, fileName]; // Append the new image URL
                        
                        // Update Firestore with the modified array
                        return firestore()
                            .collection('Users')
                            .doc(uid)
                            .update({
                                ImageURLs: updatedImageURLs
                            }).then(()=>{
                              setSaving(false)
                            })
                    } else {
                        console.log('Document does not exist');
                    }
                })
                .then(() => {
                    console.log('Image URLs updated in Firestore');
                })
                .catch(error => {
                    console.error('Error updating document: ', error);
                });
                }

                // Replcaing existing image
                else{
                  const selectedImageRef = storage().refFromURL(allImages[index]);

                  let path = `${uid}/`;
                  let fileName =path + saveImage.uri.substring(saveImage.uri.lastIndexOf('/') + 1);

                  try{
                    await storage().ref(fileName).putString(saveImage.data, "base64", {contentType: 'image/jpg'});
                    await selectedImageRef.delete();
                  }
                  catch(e){
                    console.log(e)
                    return;
                  }

                  const url = await storage().refFromURL('gs://greekgators-38675.appspot.com/' + fileName).getDownloadURL();

                  let temp = allImages;
                  temp[index] = url;
                  setAllImages(temp);

                  firestore()
                  .collection('Users')
                  .doc(uid)
                  .get()
                  .then(doc => {
                    if (doc.exists) {
                        const imageURLs = doc.data()?.ImageURLs || []; // Get the current array or initialize to empty array
                        imageURLs[index] = fileName // Append the new image URL
                        
                        // Update Firestore with the modified array
                        return firestore()
                            .collection('Users')
                            .doc(uid)
                            .update({
                                ImageURLs: imageURLs
                            }).then(()=>{
                              setSaving(false)
                            })
                    } else {
                        console.log('Document does not exist');
                    }
                })
                .then(() => {
                    console.log('Image URLs updated in Firestore');
                })
                .catch(error => {
                    console.error('Error updating document: ', error);
                });

                }

            }
            // no new image selected no changes made
            else{
              return;
            }
        });
        }catch(error){
          console.warn(error)
          return;
        }
    }

    function renderCroppedImage({index}:any) {
        if(index == -1){
            return(
            <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius:5,
                  zIndex:4
                }} >
                <Chase size={40} color="white" />
            </View>
            )
        }
        // console.log(index)
        // console.log(allImages.length)

        if (index < allImages.length){
            return (
                <View style={[{ position: 'relative', width: '100%', height: '100%', overflow: 'visible', borderRadius:5 }, index == 0?{zIndex:19, borderColor:'green', borderWidth:3, borderRadius:10}:null]}>
                    <FastImage
                        source={{ uri: `${allImages[index]}`, cache: FastImage.cacheControl.immutable}} 
                        style={{ width: '100%', height: '100%', backgroundColor:'rgba(0,0,0,0.1)', borderRadius:5}}
                        resizeMode="cover"
                    />
                    <TouchableOpacity 
                    onPress={()=>{if(index !=0){RemoveImage(index)}}} 
                    style={[{ position: 'absolute', left: -8, top: -8,padding:2, backgroundColor: '#153808', borderRadius: 20, overflow: 'hidden', zIndex:40}]} disabled={index==0?true:false}>
                        <Icons.MaterialIcons color="white" name={index == 0 ?"star":"close"} size={20}/>
                    </TouchableOpacity>
                </View>
            );
        }
        else if(index == allImages.length){
            return(
                <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgb(255,255,255)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderColor:'rgba(27, 97, 26,0.6)',
                      borderWidth:2,
                      borderRadius:5,
                      zIndex:4
                    }} >
                    <Icons.MaterialIcons style={{}} color="green" name="add-circle" size={35} />
                </View>
            );
        } 
        else{
          return(
            <View
          style={{
            flex: 1,
            backgroundColor: "black",
            opacity:0.2,
            justifyContent: "center",
            alignItems: "center",
            borderWidth:2,
            borderRadius:5,
            zIndex:4,
          }} />
          )
        }
    }

    return(<>
        {allImages ? <View
        style={{flexDirection: "row", flexWrap: "wrap", paddingHorizontal:0, justifyContent:'center', gap:10}}>
            {[...Array(4)].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "45%",
                  aspectRatio: 3 / 3.2,
                  borderRadius: 5,
                }}
                onPress={() => {
                  if(index <= allImages.length){onImageGalleryClick(index)}; // Add 1 to index to match image number
                }}
              >
                {renderCroppedImage({ index:index  })}
              </TouchableOpacity>
            ))}
        </View>:
        <View
        style={{flexDirection: "row", flexWrap: "wrap", paddingHorizontal:0, justifyContent:'center', gap:10}}>
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                style={{
                  width: "45%",
                  aspectRatio: 3 / 3.2,
                  borderRadius: 5,
                }}
              >
                {renderCroppedImage({ index:-1  })}
              </View>
            ))}
        </View>}
        </>
    )

}