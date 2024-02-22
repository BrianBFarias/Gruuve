import { StyleSheet } from "react-native"

export const AuthForm = StyleSheet.create({
    background:{
        display:'flex',
        height:'100%',
        backgroundColor:'transparent',
        flex:1
    },
    infoBox:{
        height:'100%',
        borderTopRightRadius:0,
        borderTopLeftRadius:0,
        overflow:'hidden',
    },
    header:{
        textAlign:'left',
        color:'#497844',
        fontFamily:'Arial',
        fontSize:40,
        fontWeight:'900',
    },
    header2:{
        textAlign:'left',
        color:'#679662',
        fontFamily:'Arial',
        fontSize:20,
        fontWeight:'900',
    },
    header3:{
        textAlign:'center',
        color:'#497844',
        fontFamily:'Arial',
        fontSize:20,
        fontWeight:'900',
    },
    sub:{
        textAlign:'center',
        color:'rgba(0,0,0,0.8)',
        fontFamily:'Arial',
        fontSize:14,
        fontWeight:'600',
    },
    logo:{
        height:80,
        resizeMode:'contain',
        alignSelf:'center',
    },
    back:{
        position: 'absolute', 
        height:'100%', 
        justifyContent:'center', 
        fontWeight:'700'
    },
    bar:{
        width:'30%',
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.5)',
        borderRadius:8,
        height:0,
        justifyContent:'center',
        alignSelf:'center',
        marginHorizontal:'8%'
    },
    or:{
        color:'rgba(0,0,0,0.7)',
    },
    switch:{
        color:'#1e451a',
        textDecorationLine:'underline',
        fontWeight:'500',
        fontFamily:'Arial'
    }
})
