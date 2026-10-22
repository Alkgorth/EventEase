// src/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import EventListScreen from "../screens/EventListScreen";
import EventFormScreen from "../screens/EventFormScreen";
import { getCurrentUser } from "../storage/userStorage";
import { commonStyles } from "../styles/commonStyles";
import { colors, fonts } from "../styles/theme";

/**
 * Typage strict des routes de la pile de navigation (React Navigation).
 * Permet l'autocomplétion et la vérification des paramètres d'écrans par TypeScript.
 */
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  EventList: undefined;
  EventForm: { eventId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navigateur principal de l'application EventEase (Navigation par pile native).
 * Vérifie au démarrage si une session utilisateur existe pour choisir l'écran initial.
 */
export const AppNavigator = () => {
  // initialRoute reste à null pendant la lecture asynchrone de la session
  const [initialRoute, setInitialRoute] = useState<"Login" | "EventList" | null>(null);

  useEffect(() => {
    async function checkSession() {
      try {
        const user = await getCurrentUser();
        // Si un utilisateur est connecté, on démarre sur EventList, sinon sur Login
        setInitialRoute(user ? "EventList" : "Login");
      } catch {
        setInitialRoute("Login");
      }
    }

    checkSession();
  }, []);

  // Écran d'attente pendant la lecture de la session pour éviter tout clignotement
  if (initialRoute === null) {
    return (
      <View style={commonStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventList" component={EventListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventForm" component={EventFormScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
