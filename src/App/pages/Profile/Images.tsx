import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native"
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";
import ImagePicker from 'react-native-image-crop-picker';
import Icons from "../../../components/icons";

export const Images =({setImage2, setImage3, setImage4, Image2, Image3, Image4}:any) =>{
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

                switch (imageNum) {
                  case 1:
                    setImage2(saveImage);
                    break;
                  case 2:
                    setImage3(saveImage);
                    break;
                  case 3:
                    setImage4(saveImage);
                    break;
                }
              }
        });
    }

    function renderCroppedImage({imageData, index}:any) {
        if (!imageData) return(
            <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor:'rgba(0,0,0,0.6)',
                  borderWidth:3,
                  borderRadius:5,
                  borderStyle:'dashed',
                  zIndex:4
                }} >
                <Icons.FontAwesome style={{}} color="whitesmoke" name="picture-o" size={20} />
                <Icons.MaterialIcons style={{position:'absolute', left:-8, top:-8}} color="#3b3b3b" name="add-circle" size={25} />
            </View>
        );

        return (
            <View style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
                <Image
                    source={{ uri: `data:${imageData.mime};base64,${imageData.data}` }} 
                    style={{ width: '100%', height: '100%', borderRadius:5}}
                    resizeMode="cover"
                />
                <TouchableOpacity onPress={()=>{RemoveImage(index+1)}} style={{ position: 'absolute', left: -8, top: -8,padding:2, backgroundColor: '#153808', borderRadius: 20, overflow: 'hidden' }}>
                    <Icons.MaterialIcons color="white" name="close" size={20} />
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View
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
                    renderCroppedImage({ imageData: Image2, index:index  })

                ) : index === 1 ? (
                    renderCroppedImage({ imageData: Image3, index:index  })

                ) : index === 2 ? (
                    renderCroppedImage({ imageData: Image4, index:index  })

                ) : (null)}
              </TouchableOpacity>
            ))}
        </View>
    )

}