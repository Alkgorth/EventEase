import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useState } from "react";

import { registerUser } from "../storage/userStorage";
import { commonStyles } from "../styles/commonStyles";
import { User } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleRegister() {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName || !trimmedEmail || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }
        if (!trimmedEmail.includes("@")) {
            setError("Veuillez saisir une adresse email valide.");
            return;
        }
        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        const newUser: User = {
            id: Date.now().toString(),
            name: trimmedName,
            email: trimmedEmail,
            password,
        };

        const created = await registerUser(newUser);
        if (!created) {
            setError("Cette adresse email est déjà utilisée.");
            return;
        }

        setError("");
        navigation.navigate("Login");
    }

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Inscription</Text>
            <TextInput
                style={commonStyles.input}
                placeholder="Prénom"
                value={name}
                onChangeText={setName}
            />
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
                title="S'inscrire"
                onPress={handleRegister}
            />
            <Button
                title="Déjà un compte ? Connectez-vous"
                onPress={() => navigation.navigate("Login")}
            />
        </View>
    );
}