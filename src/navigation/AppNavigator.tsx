import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import EventListScreen from "../screens/EventListScreen";
import EventFormScreen from "../screens/EventFormScreen";
import { getCurrentUser } from "../storage/userStorage";
import { ActivityIndicator, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    EventList: undefined;
    EventForm: {eventId? : string} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState<"Login" | "EventList" | null>(null);

    useEffect(() => {
        async function checkSession() {
            try {
                const user = await getCurrentUser();
                setInitialRoute(user ? "EventList" : "Login");
            } catch {
                setInitialRoute("Login");
            }
        }

        checkSession();
    }, []);

    if (initialRoute === null) {
        return (
            <View style={commonStyles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Inscription" }} />
                <Stack.Screen name="EventList" component={EventListScreen} options={{ title: "Liste des événements" }} />
                <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: "Ajouter un événement" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
