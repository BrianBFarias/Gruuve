import firestore from '@react-native-firebase/firestore';
import { toDate } from '../../../components/ConstantFunctions/Date';

export const FetchEvents = async ({user}:any) => {
  const querySnapshot = await firestore().collection('Events').where("Host", "==", `${user.user.uid}`).get();

  const documents = querySnapshot.docs;
  const eventPromises = documents.map(async (doc) => {
      const eventData = doc.data();

      // [0] = Days till, [1] = weekday, [2] = timestamp
      const timeComponents = toDate({ date: eventData.Date });

      return {
          id: eventData.id,
          title: eventData.Title,
          days: timeComponents[0],
          weekday: timeComponents[1],
          time: timeComponents[2]
      };
  });

  const resolvedEvents = await Promise.all(eventPromises);
  return resolvedEvents;
};

