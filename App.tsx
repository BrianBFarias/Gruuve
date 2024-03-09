import 'react-native-gesture-handler'
import  {SignInContextProvider} from './src/Authentication/authTriggers/authContext'
import RootNavigator from './src/rootNavigation';
import { StatusBar, View } from 'react-native';

export default function App() {
  

    return (
      <SignInContextProvider>
        <View style={{flex:1}}>
          <StatusBar  barStyle="dark-content" translucent={true} />
          <RootNavigator />
        </View>
      </SignInContextProvider>
    );
}