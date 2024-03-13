import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import firebase from "@react-native-firebase/firestore";

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

export async function accept({ eventID, userID }: { eventID: string, userID: string }){
    ReactNativeHapticFeedback.trigger("impactLight", options);
    // const data = {
    //     eventID: eventID,
    //     userID: userID
    // }
    // await firebase().collection('Interests').add(data).then(()=>{

    // })
}

export async function decline({ eventID, userID }: { eventID: string, userID: string }){
    ReactNativeHapticFeedback.trigger("impactLight", options);
    // const data = {
    //     eventID: eventID,
    //     userID: userID
    // }
    // await firebase().collection('Declines').add(data).then(()=>{

    // })
}

export async function reject({ hostId, userID }: { hostId: string, userID: string }){
    ReactNativeHapticFeedback.trigger("impactLight", options);
    // const data = {
    //     eventID: hostId,
    //     userID: userID
    // }
    // await firebase().collection('Rejects').add(data).then(()=>{

    // })
}