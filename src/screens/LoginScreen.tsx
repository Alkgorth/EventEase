// page de connexion pour les utilisateurs

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { RootStackParamList } from "../navigation/AppNavigator";
import { loginUser } from "../storage/userStorage";
import { commonStyles } from "../styles/commonStyles";
import { colors } from "../styles/theme";
import { FormContainer } from "../components/FormContainer";

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
        <FormContainer>
            {/* Logo officiel dans son encart dédié */}
            <View style={commonStyles.logoCard}>
                <Image
                    source={require("../../assets/images/logo_reference.png")}
                    style={commonStyles.logoImage}
                    resizeMode="contain"
                />
            </View>

            {/* Titre et sous-titre alignés à gauche (conforme à la maquette) */}
            <Text style={commonStyles.authTitle}>Heureux de vous revoir</Text>
            <Text style={commonStyles.authSubtitle}>
                Retrouvez les rencontres qui vous ressemblent.
            </Text>

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

            {error !== "" && <Text style={commonStyles.errorText}>{error}</Text>}

            {/* Bouton principal de connexion */}
            <TouchableOpacity
                style={commonStyles.primaryButton}
                onPress={handleLogin}
                activeOpacity={0.8}
            >
                <Text style={commonStyles.primaryButtonText}>Se connecter</Text>
            </TouchableOpacity>

            {/* Lien bicolore vers la création de compte */}
            <TouchableOpacity
                style={commonStyles.linkContainer}
                onPress={() => navigation.navigate("Register")}
                activeOpacity={0.7}
            >
                <Text style={commonStyles.linkText}>
                    Pas encore de compte ?{" "}
                    <Text style={commonStyles.linkHighlight}>Créer un compte</Text>
                </Text>
            </TouchableOpacity>

            {/* Encadré d'information : Version de démonstration */}
            <View style={commonStyles.demoCard}>
                <Feather name="smartphone" size={20} color={colors.primary} />
                <Text style={commonStyles.demoCardText}>
                    Version de démonstration : connexion simplifiée, sans serveur. Vos données restent sur cet appareil.
                </Text>
            </View>
        </FormContainer>
    );
}
