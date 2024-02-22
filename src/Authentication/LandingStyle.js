import { StyleSheet } from "react-native"

const Style = StyleSheet.create({
    container:{
        height:'100%',
        display:'flex',
        overflow:'hidden',
        justifyContent:'space-between',
        paddingBottom:'10%',
        paddingTop:'20%',
        backgroundColor:'transparent',
    },  
    image:{
        height: 250,
        position:'absolute',
        display:'flex',
        resizeMode:'contain',
        alignSelf:'center',
        backgroundColor:'transparent',
        borderRadius:200,
        zIndex:2
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        alignSelf: 'center',
        backgroundColor: '#3f8644',
      },
      text: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
    button2: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:30,
        borderRadius: 4,
        elevation: 3,
        alignSelf: 'center',
      },
      text2: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#497844',
      },
      options:{
        marginBottom:'15%',
      },
      info:{
        textAlign:'center',
        fontFamily:'Arial',
        fontSize:15
      }
})

export default Style;