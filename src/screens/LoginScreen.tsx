// page de connexion pour les utilisateurs

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../storage/userStorage";
import { commonStyles } from "../styles/commonStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {

        if (!email.trim() || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        const user = await loginUser(email, password);
        if (user === null) {
            setError("Email ou mot de passe incorrect.");
            return;
        }

        setError("");
        navigation.replace("EventList");
    }

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Connexion</Text>
            <TextInput
                style={commonStyles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={commonStyles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {error !== "" && <Text>{error}</Text>}
            <Button
                title="Se connecter"
                onPress={handleLogin}
            />
            <Button
                title="Pas de compte ? Inscrivez-vous"
                onPress={() => navigation.navigate("Register")}
            />
        </View>
    );
}