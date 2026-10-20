import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';

import AsyncStorage from "@react-native-async-storage/async-storage";

async function dumpStorage() {
	const keys = await AsyncStorage.getAllKeys();
	const entries = await AsyncStorage.multiGet(keys);
	console.log("Contenu du stockage :", entries);
}
dumpStorage();

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}