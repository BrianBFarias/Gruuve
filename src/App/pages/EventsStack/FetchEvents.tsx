import firestore from '@react-native-firebase/firestore';

export const FetchEvents = async ({user}:any) => {
  const querySnapshot = await firestore().collection('Events').where("Host", "==", `${user.user.uid}`).get();

  const documents = querySnapshot.docs;
  const eventPromises = documents.map(async (doc) => {
      const eventData = doc.data();

      // [0] = Days till, [1] = weekday, [2] = timestamp
      const timeComponents = await retrieveCardDate({ date: eventData.Date });

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

// [0] = Days till, [1] = weekday, [2] = timestamp
async function retrieveCardDate({date}:any){
  const dateVal = new Date(date.seconds * 1000);
  const currDateVal = new Date()

  let Difference_In_Time = dateVal.getTime()-currDateVal.getTime()
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  let weekday;

  switch(dateVal.getDay()) {
    case 0: 
      weekday = 'Sun';
      break;
    case 1:
      weekday = 'Mon';
      break;
    case 2:
      weekday = 'Tue';
      break;
    case 3:
      weekday = 'Wed';
      break;
    case 4:
      weekday = 'Thu';
      break;
    case 5:
      weekday = 'Fri';
      break;
    case 6:
      weekday = 'Sat';
      break;
    default:
      weekday = '';
      break;
  }

  var hours:any = dateVal.getHours();
  var minutes:any = dateVal.getMinutes();
  var meridiem = 'am';
  
  // Convert hours to 12-hour format
  if (hours > 12) {
    hours -= 12;
    meridiem = 'pm';
  }
  
  // Add leading zero if necessary
  hours = (hours < 10 ? '0' : '') + hours;
  minutes = (minutes < 10 ? '0' : '') + minutes;
  
  var timestamp = hours + ':' + minutes  + ' ' + meridiem;

  return [Difference_In_Days == 1 ?'Today':`${Difference_In_Days}`, weekday, timestamp];
}