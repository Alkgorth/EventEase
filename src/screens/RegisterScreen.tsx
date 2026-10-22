// src\screens\RegisterScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";

import { registerUser } from "../storage/userStorage";
import { commonStyles } from "../styles/commonStyles";
import { colors, fonts } from "../styles/theme";
import { User } from "../types";
import { FormContainer } from "../components/FormContainer";

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
        <FormContainer>
            {/* Bouton retour en haut à gauche */}
            <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.backButton}
                activeOpacity={0.7}
                accessibilityLabel="Retour à la connexion"
            >
                <Feather name="arrow-left" size={24} color={colors.primary} />
            </TouchableOpacity>

            {/* Logo officiel dans son encart dédié */}
            <View style={commonStyles.logoCard}>
                <Image
                    source={require("../../assets/images/logo_reference.png")}
                    style={commonStyles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* Titre et sous-titre alignés à gauche */}
            <Text style={commonStyles.authTitle}>Faisons connaissance</Text>
            <Text style={commonStyles.authSubtitle}>
                Un compte, et de nouveaux moments à partager.
            </Text>

            {/* Champ Nom complet */}
            <TextInput
                style={commonStyles.input}
                placeholder="Prénom"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
            />

            {/* Champ Adresse e-mail avec icône enveloppe */}
            <View style={commonStyles.inputWithIcon}>
                <TextInput
                    style={commonStyles.inputField}
                    placeholder="Adresse e-mail"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                <Feather name="mail" size={20} color={colors.primary} style={commonStyles.inputIcon} />
            </View>

            {/* Champ Mot de passe avec icône oeil */}
            <View style={commonStyles.inputWithIcon}>
                <TextInput
                    style={commonStyles.inputField}
                    placeholder="Mot de passe"
                    placeholderTextColor={colors.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {/* NOTE: Rendre l'icône oeil active pour afficher/masquer le mot de passe dès que nous aurons un moment */}
                <Feather name="eye-off" size={20} color={colors.primary} style={commonStyles.inputIcon} />
            </View>

            <Text style={styles.passwordHint}>
                6 caractères minimum pour votre mot de passe.
            </Text>

            {error !== "" && <Text style={commonStyles.errorText}>{error}</Text>}

            {/* Bouton principal de création de compte */}
            <TouchableOpacity
                style={commonStyles.primaryButton}
                onPress={handleRegister}
                activeOpacity={0.8}
            >
                <Text style={commonStyles.primaryButtonText}>Créer mon compte</Text>
            </TouchableOpacity>

            {/* Lien bicolore vers la connexion */}
            <TouchableOpacity
                style={commonStyles.linkContainer}
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.7}
            >
                <Text style={commonStyles.linkText}>
                    Déjà membre ?{" "}
                    <Text style={commonStyles.linkHighlight}>Se connecter</Text>
                </Text>
            </TouchableOpacity>

            {/* Encadré d'information : Compte de démonstration local */}
            <View style={commonStyles.demoCard}>
                <Feather name="smartphone" size={20} color={colors.primary} />
                <Text style={commonStyles.demoCardText}>
                    Compte de démonstration local, sans validation par e-mail ni backend réel.
                </Text>
            </View>
        </FormContainer>
    );
}

const styles = StyleSheet.create({
    backButton: {
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingRight: 16,
        marginBottom: 8,
    },
    passwordHint: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.textMuted,
        alignSelf: "flex-start",
        marginTop: -8,
        marginBottom: 16,
    },
});
