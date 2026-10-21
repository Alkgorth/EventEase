import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { EventItem } from "../types";
import { borderRadius, colors, fonts } from "../styles/theme";

type Props = {
  event: EventItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggleParticipate: () => void;
};

/**
 * Formate une date ISO en chaîne lisible en français.
 * Exemple : "2026-10-25T12:00:00.000Z" -> "25 octobre 2026"
 */
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return isoDate;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function EventCard({ event, onEdit, onDelete, onToggleParticipate }: Props) {
  return (
    <View style={styles.card}>
      {/* En-tête de la carte : Badge d'inscription à droite */}
      <View style={styles.badgeRow}>
        <View style={event.participated ? styles.badgeParticipated : styles.badgeNotParticipated}>
          <Text style={event.participated ? styles.badgeTextParticipated : styles.badgeTextNotParticipated}>
            {event.participated ? "✓ Inscrit" : "Non inscrit"}
          </Text>
        </View>
      </View>

      {/* Titre de l'événement */}
      <Text style={styles.title}>{event.title}</Text>

      {/* Description de l'événement */}
      <Text style={styles.description}>{event.description}</Text>

      {/* Date de l'événement avec icône calendrier */}
      <View style={styles.dateRow}>
        <Feather name="calendar" size={16} color={colors.primary} style={styles.calendarIcon} />
        <Text style={styles.dateText}>{formatDate(event.date)}</Text>
      </View>

      {/* Barre des boutons d'actions personnalisés */}
      <View style={styles.actionsRow}>
        {/* Bouton Participer / Se désinscrire */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            event.participated ? styles.unparticipateButton : styles.participateButton,
          ]}
          onPress={onToggleParticipate}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.actionButtonText,
              event.participated ? styles.unparticipateText : styles.participateText,
            ]}
          >
            {event.participated ? "Se désinscrire" : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        {/* Bouton Modifier */}
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={14} color={colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>

        {/* Bouton Supprimer */}
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
          activeOpacity={0.8}
        >
          <Feather name="trash-2" size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
    // Ombre douce pour faire flotter la carte sur le fond sable
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  badgeParticipated: {
    backgroundColor: "#E8F3EE",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  badgeTextParticipated: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.primary,
  },
  badgeNotParticipated: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  badgeTextNotParticipated: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  calendarIcon: {
    marginRight: 6,
  },
  dateText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.small,
  },
  actionButtonText: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  participateButton: {
    backgroundColor: colors.secondary,
  },
  participateText: {
    color: "#FFFFFF",
  },
  unparticipateButton: {
    backgroundColor: "#F3F4F6",
  },
  unparticipateText: {
    color: colors.textMuted,
  },
  editButton: {
    backgroundColor: "#EBF3EF",
  },
  editText: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
  },
  deleteText: {
    color: colors.danger,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
})