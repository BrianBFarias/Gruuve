import { View, Text} from "react-native"
import React, { useState } from "react"
import Modal from "react-native-modal";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import { Height } from "../../../Authentication/ProfileOptions";

export function HeightSelection({isVisible, setIsVisible, height, setHeight}:any){
    const [footSelectedIndex, setFootSelectedIndex] = useState(1)
    const [inchSelectedIndex, setInchSelectedIndex] = useState(1)


    function update(){
        setIsVisible(false)
    }

    return(
        <Modal 
        isVisible={isVisible} 
        animationOut={'slideOutDown'} 
        animationIn={'slideInUp'}
        useNativeDriver={true} 
        hideModalContentWhileAnimating={true} 
        backdropOpacity={0.4}
        onBackdropPress={()=>{update()}}
        style={{flex: 1, margin: 0}}>
            <View style={{width:'100%', height:'30%', position:'absolute', bottom:0}}>
                <View style={{backgroundColor:'white', borderTopLeftRadius:20, borderTopRightRadius:20, overflow:'hidden', flex:1, flexDirection:'row'}}>
                    <ScrollPicker
                        dataSource={["3", "4", "5", "6", "7"]}
                        selectedIndex={footSelectedIndex}
                        renderItem={(data, index) => {
                        return(<>
                            {footSelectedIndex === index ? 
                            <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
                                <Text style={{fontSize:26}}>{data}</Text>
                                <Text style={{opacity:0.8, fontWeight:'800', fontSize:20}}>Ft</Text>
                            </View>:
                            <View style={{flexDirection:'row', gap:10, opacity:0.6}}>
                                <Text>{data}</Text>
                                <Text style={{opacity:0, fontWeight:'800', fontSize:20}}>Ft</Text>
                            </View> }
                        </>)
                        }}
                        onValueChange={(data, selectedIndex) => {
                            setFootSelectedIndex(selectedIndex)
                        }}
                        wrapperBackground="#FFFFFF"
                        highlightColor="#d8d8d8"
                        itemHeight={45}
                        highlightBorderWidth={1}
                    />
                    <ScrollPicker
                        dataSource={["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]}
                        selectedIndex={inchSelectedIndex}
                        renderItem={(data, index) => {
                        return(<>
                            {inchSelectedIndex === index ? 
                            <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
                                <Text style={{fontSize:26}}>{data}</Text>
                                <Text style={{opacity:0.8, fontWeight:'800', fontSize:20}}>In</Text>
                            </View>:
                            <View style={{flexDirection:'row', gap:10, opacity:0.6}}>
                                <Text>{data}</Text>
                                <Text style={{opacity:0, fontWeight:'800', fontSize:20}}>In</Text>
                            </View> }
                        </>)
                        }}
                        onValueChange={(data, selectedIndex) => {
                            setInchSelectedIndex(selectedIndex)
                        }}
                        wrapperBackground="#FFFFFF"
                        itemHeight={45}
                        highlightColor="#d8d8d8"
                        highlightBorderWidth={1}
                    />
                </View>
            </View>
    </Modal>
    )
}