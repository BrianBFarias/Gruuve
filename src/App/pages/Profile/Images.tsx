import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native"
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import ImagePicker from 'react-native-image-crop-picker';
import Icons from "../../../components/icons";

export const Images =({allImages, setAllImages}:any) =>{
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
        allImages.pop()
    }

    const onImageGalleryClick = (imageNum:any) => {
        ImagePicker.openPicker({
            width: 300,
            height: 320,
            cropping: true,
            mediaType:'photo',
            includeBase64:true,
            forceJpg:true
          }).then(image => {

            if (image && image.sourceURL && image.cropRect) {
                const saveImage = {
                    uri: image.sourceURL,
                    data: image.data,
                    mime: image.mime,
                    height: 320,
                    width: 300,
                    x: image.cropRect.x,
                    y: image.cropRect.y,
                }

                switch (allImages.length) {
                  case 1:
                    // Save Image 1
                    break;
                  case 2:
                    // Save Image 2
                    break;
                  case 3:
                    // Save Image 3
                    break;
                }
              }
        });
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
                <ActivityIndicator size="small" color="black" />
            </View>
            )
        }
        console.log(index)
        console.log(allImages.length)

        if (index < allImages.length){
            return (
                <View style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
                    <Image
                        source={{ uri: `${allImages[index]}` }} 
                        style={{ width: '100%', height: '100%', borderRadius:5}}
                        resizeMode="cover"
                    />
                    <TouchableOpacity onPress={()=>{RemoveImage(index+1)}} style={{ position: 'absolute', left: -8, top: -8,padding:2, backgroundColor: '#153808', borderRadius: 20, overflow: 'hidden' }}>
                        <Icons.MaterialIcons color="white" name="close" size={20}/>
                    </TouchableOpacity>
                </View>
            );
        }else{
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
    }

    return(<>
        {allImages ? <View
        style={{flexDirection: "row", flexWrap: "wrap", paddingHorizontal:0, justifyContent:'space-evenly'}}>
            {[...Array(3)].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  width: "30%",
                  aspectRatio: 3 / 3.2,
                  borderRadius: 5,
                }}
                onPress={() => {
                  onImageGalleryClick(index + 1); // Add 1 to index to match image number
                }}
              >
                {index === 0 ? (
                    renderCroppedImage({ index:index  })

                ) : index === 1 ? (
                    renderCroppedImage({ index:index  })

                ) : index === 2 ? (
                    renderCroppedImage({ index:index  })

                ) : (null)}
              </TouchableOpacity>
            ))}
        </View>:
        <View
        style={{flexDirection: "row", flexWrap: "wrap", paddingHorizontal:0, justifyContent:'space-evenly'}}>
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                style={{
                  width: "30%",
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