// src/components/FormContainer.tsx
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../styles/theme";

type Props = {
  /** Composants enfants à afficher à l'intérieur du conteneur (notion children / ReactNode) */
  children: ReactNode;
  /** Styles personnalisés optionnels appliqués au ScrollView intérieur */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Conteneur réutilisable pour tous les écrans à formulaire de l'application.
 * 
 * Résout les problèmes de superposition du clavier virtuel sur mobile :
 * 1. KeyboardAvoidingView adapte la hauteur disponible selon la plateforme
 *    ('padding' sur iOS, 'height' sur Android).
 * 2. ScrollView permet de faire défiler le contenu si l'écran est petit ou encombré.
 * 3. keyboardShouldPersistTaps="handled" permet de valider les boutons directement
 *    même si le clavier est ouvert (sans nécessiter un premier tap pour fermer le clavier).
 */
export function FormContainer({ children, contentContainerStyle }: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
});
