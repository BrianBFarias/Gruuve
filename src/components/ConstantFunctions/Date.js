// [0] = Days till, [1] = weekday, [2] = timestamp
export function toDate({date}){
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
  
    var hours = dateVal.getHours();
    var minutes = dateVal.getMinutes();
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
  
    return [Difference_In_Days == 0 ?'Today':`${Difference_In_Days}`, weekday, timestamp];
  }