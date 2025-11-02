import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import AppRoot from './frontend/App';

function App() {
  return <AppRoot />;
}

registerRootComponent(App);
export default App;
