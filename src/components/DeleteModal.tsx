import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { borderRadius, colors, fonts } from "../styles/theme";

type DeleteModalProps = {
  visible: boolean;
  eventTitle: string;
  eventDate?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Formate une date pour l'affichage dans le récapitulatif de la modale.
 */
function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  const slashMatch = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slashMatch) {
    const day = Number(slashMatch[1]);
    const month = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);
    const d = new Date(year, month - 1, day, 12);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Modale personnalisée de confirmation de suppression (conforme à la charte EventEase).
 * Réutilisable sur l'écran de liste (EventListScreen) et le formulaire (EventFormScreen).
 */
export function DeleteModal({
  visible,
  eventTitle,
  eventDate,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Arrière-plan semi-transparent */}
      <View style={styles.overlay}>
        {/* Carte de la modale */}
        <View style={styles.modalCard}>
          {/* Badge icône poubelle en haut */}
          <View style={styles.iconBadge}>
            <Feather name="trash-2" size={24} color="#B93826" />
          </View>

          {/* Titre fort */}
          <Text style={styles.title}>Supprimer cet événement ?</Text>

          {/* Explication */}
          <Text style={styles.subtitle}>
            Il sera retiré de vos événements et des participations enregistrées sur cet appareil. Cette action est définitive.
          </Text>

          {/* Encart récapitulatif de l'événement */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle} numberOfLines={2}>
              {eventTitle}
            </Text>
            {eventDate ? (
              <Text style={styles.summaryDate}>{formatDateDisplay(eventDate)}</Text>
            ) : null}
            <Text style={styles.summaryAuthor}>Créé par vous</Text>
          </View>

          {/* Bouton Annuler */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          {/* Bouton Oui, supprimer */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Oui, supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEECE8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.background, // Fond Sable #F4F1DE
    borderRadius: borderRadius.medium,
    padding: 14,
    marginBottom: 20,
  },
  summaryTitle: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  summaryDate: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  summaryAuthor: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  cancelButton: {
    height: 48,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primary,
  },
  confirmButton: {
    height: 48,
    borderRadius: borderRadius.medium,
    backgroundColor: "#B93826", // Rouge brique / terracotta de la maquette
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
