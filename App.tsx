// App.tsx
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';
import AsyncStorage from "@react-native-async-storage/async-storage";

async function dumpStorage() {
  const keys = await AsyncStorage.getAllKeys();
  const entries = await AsyncStorage.multiGet(keys);
  console.log("Contenu du stockage :", entries);
}
dumpStorage();

export default function App() {
  // Chargement des polices Nunito au démarrage de l'application
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  // Pendant le chargement des polices, on affiche un écran d'attente aux couleurs de la charte
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
