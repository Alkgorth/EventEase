// src\styles\commonStyles.ts
import { StyleSheet } from "react-native";
import { borderRadius, colors, fonts, spacing } from "./theme";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  // Titres et sous-titres d'authentification alignés à gauche (conforme à la maquette)
  authTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: 6,
    alignSelf: "flex-start",
  },

  authSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 24,
    alignSelf: "flex-start",
    lineHeight: 22,
  },

  // Carte du logo officiel EventEase
  logoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
    width: "100%",
    maxWidth: 280,
  },

  logoImage: {
    width: 200,
    height: 100,
  },

  // Conteneur de champ avec icône intégrée à droite
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.medium,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    width: "100%",
  },

  inputField: {
    flex: 1,
    height: "100%",
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },

  inputIcon: {
    marginLeft: 10,
  },

  // Champ simple sans icône (pour les formulaires généraux)
  input: {
    width: "100%",
    height: 50,
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.medium,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },

  errorText: {
    color: colors.danger,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },

  // Bouton principal plein (Sarcelle)
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  primaryButtonText: {
    color: colors.cardBackground,
    fontFamily: fonts.bold,
    fontSize: 16,
  },

  // Lien textuel bicolore
  linkContainer: {
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 12,
  },

  linkText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },

  linkHighlight: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },

  // Encadré informatif « Version de démonstration »
  demoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F3EE",
    borderRadius: borderRadius.medium,
    padding: 16,
    marginTop: 16,
    width: "100%",
    gap: 12,
  },

  demoCardText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.primary,
    lineHeight: 18,
  },

  actions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    flexWrap: "wrap",
  },
});