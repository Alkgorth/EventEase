// src/components/FormContainer.tsx
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../styles/theme";

type Props = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

// Enveloppe un formulaire : le contenu reste visible quand le clavier s'affiche
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
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
});
