import LinearGradient from 'react-native-linear-gradient';
import {StyleSheet, Text, View} from "react-native";
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function Button1({ text }) {
    return (
        <View style={style.container}>
            <LinearGradient
                colors={['#295d16', '#558843']}
                start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                locations={[0,1]}
                style={style.submit}>
                <Text style={style.submit_Text}>{text}</Text>
            </LinearGradient>
        </View>
    );
}

export function Button2({ text }) {
    return (
        <View style={style.container}>
            <LinearGradient
                colors={['#295d16', '#558843']}
                start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                locations={[0,1]}
                style={style.submit2}>
                <Text style={style.submit_Text}>{text}</Text>
            </LinearGradient>
        </View>
    );
}

export function Button3({ text }) {

    return (
        <LinearGradient
            colors={['#295d16', '#558843']}
            start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
            locations={[0,1]}
            style={style.container2}>
            <View style={style.submit3}>
                <Text style={style.submit_Text2}>{text}</Text>
            </View>
        </LinearGradient>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: 'transparent', // Set a specific background color here
        shadowColor: 'black',
        alignSelf:'center',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
    },
    container2: {
        backgroundColor: 'red', // Set a specific background color here
        shadowColor: 'white',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        borderRadius: 12,
    },
    submit: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: 70,
        padding: 10,
        borderRadius: 20,
    },
    submit2: {
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        width:windowWidth-100,
        alignSelf: 'center',
        paddingHorizontal: 70,
        paddingVertical:14,
        margin:3,
        padding: 10,
        borderRadius: 10,
    },
    submit3: {
        backgroundColor: 'whitesmoke',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width:windowWidth-100,
        paddingHorizontal: 70,
        paddingVertical:8,
        margin:3,
        padding: 10,
        borderRadius: 10,
    },
    submit_Text: {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white',
    },
    submit_Text2: {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#395d16',
    },
});
