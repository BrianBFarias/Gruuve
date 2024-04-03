import { Text, TouchableOpacity, View, FlatList, Pressable, StyleSheet, LogBox } from "react-native";
import Button1 from "../../../components/Button";
import { Hobbies } from '../../ProfileOptions';
import { AuthForm } from "../../AuthenticationStyling";

export default function Section3({ hobbies, setHobbies, nextSection }: any) {
    LogBox.ignoreAllLogs();

    function next() {
        if(hobbies.length < 2){
            return;
        }
        nextSection();
    }

    const toggleSelection = (item: string) => {
        if (hobbies.length < 4 && !hobbies.includes(item)) {
            // Create a new array by spreading the existing hobbies array
            const newHobbies = [...hobbies, item];
            // Update state with the new array
            setHobbies(newHobbies);
        }else if(hobbies.includes(item)){
            const newHobbies = hobbies.filter((e: string) => e !== item)
            // Update state with the new array
            setHobbies(newHobbies);
        }
    };

    const renderItem = ({ item }: any) => {
        if (hobbies && hobbies.includes(item)) {
            return (
                <Pressable
                    key={item}
                    style={style.selectedHobby} 
                    onPress={() => toggleSelection(item)}>
                    <Text style={style.text1}>{item}</Text>
                </Pressable>
            );
        } else {
            return (
                <Pressable
                    key={item}
                    style={style.hobby} 
                    onPress={() => toggleSelection(item)}>
                    <Text style={style.text2}>{item}</Text>
                </Pressable>
            );
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between'}}>
            <Text style={AuthForm.header3}>Select Hobbies ({4-hobbies.length})</Text>
            <FlatList
                contentContainerStyle={{overflow:'scroll', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 5, gap:10, columnGap:14}}
                data={Hobbies}
                renderItem={renderItem}
                keyExtractor={(item) => item}
            />
            <TouchableOpacity style={{ alignSelf: 'center', marginTop:5 }} onPress={next}>
                <Button1 text={'Continue'} />
            </TouchableOpacity>
        </View>
    )
}

const style= StyleSheet.create({
    hobby:{ 
        padding: 8,
        backgroundColor: 'rgb(215,215,215)', 
        borderRadius: 10 
    },
    selectedHobby:{
        padding: 8,
        backgroundColor: '#39782c', 
        borderRadius: 10,
        color:'white'
    },
    text1:{
        fontWeight:'500',
        color:'white'
    },
    text2:{
        fontWeight:'500',
        color:'black',
        opacity:0.8
    },
})