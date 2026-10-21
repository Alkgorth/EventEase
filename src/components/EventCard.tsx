import { StyleSheet, Text, View, Button } from "react-native";
import { EventItem } from "../types";
import { colors } from "../styles/theme";
import { commonStyles } from "../styles/commonStyles";

type Props = {
  event: EventItem;
  onEdit: () => void;
};

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

export function EventCard({ event, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {event.title}
        </Text>
        <Text style={event.participated ? styles.participated : styles.notParticipated}>
          {event.participated ? "✓ Participé" : "Non participé"}
        </Text>
      </View>

      <Text style={styles.date}>{formatDate(event.date)}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={commonStyles.actions}>
        <Button
          title="Modifier"
          onPress={onEdit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  participated: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondary,
  },
  notParticipated: {
    fontSize: 12,
    color: "#6b7280",
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
  },
});