// src/components/CalendarModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Feather from "@expo/vector-icons/Feather";
import { borderRadius, colors, fonts } from "../styles/theme";
import { getEvents } from "../storage/eventStorage";

// Configuration de la localisation en français pour react-native-calendars
LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

type CalendarModalProps = {
  visible: boolean;
  currentDate?: string; // Au format JJ/MM/AAAA ou ISO
  onSelectDate: (formattedDate: string) => void;
  onClose: () => void;
};

/**
 * Convertit une date au format JJ/MM/AAAA ou ISO vers le format YYYY-MM-DD attendu par le calendrier.
 */
function dateToDayString(dateStr?: string): string {
  if (!dateStr) return "";
  const match = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  if (dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return "";
}

/**
 * Modale de sélection de date interactive avec react-native-calendars.
 * S'ouvre au clic sur l'icône de calendrier dans le formulaire d'événement.
 */
export function CalendarModal({
  visible,
  currentDate,
  onSelectDate,
  onClose,
}: CalendarModalProps) {
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!visible) return;

    async function loadMarkedEvents() {
      try {
        const events = await getEvents();
        const marks: Record<string, any> = {};

        // Marque chaque jour contenant un événement avec une pastille Corail
        events.forEach((ev) => {
          const dayKey = ev.date.split("T")[0];
          if (dayKey) {
            marks[dayKey] = {
              marked: true,
              dotColor: colors.secondary, // Corail #FF735C
            };
          }
        });

        // Met en surbrillance le jour actuellement sélectionné dans le champ
        const currentDayKey = dateToDayString(currentDate);
        if (currentDayKey) {
          marks[currentDayKey] = {
            ...(marks[currentDayKey] || {}),
            selected: true,
            selectedColor: colors.primary, // Sarcelle #125B50
          };
        }

        setMarkedDates(marks);
      } catch {
        // En cas d'erreur de lecture, aucun blocage
      }
    }

    loadMarkedEvents();
  }, [visible, currentDate]);

  function handleDayPress(day: { dateString: string }) {
    // day.dateString est au format "YYYY-MM-DD"
    const parts = day.dateString.split("-");
    if (parts.length === 3) {
      const formatted = `${parts[2]}/${parts[1]}/${parts[0]}`; // Convertit en "JJ/MM/AAAA"
      onSelectDate(formatted);
      onClose();
    }
  }

  const initialDate = dateToDayString(currentDate) || undefined;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* En-tête de la modale */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Feather name="calendar" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.title}>Choisir une date</Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.closeIconButton}>
              <Feather name="x" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Sélectionnez un jour. Les pastilles corail signalent vos événements existants.
          </Text>

          {/* Calendrier interactif react-native-calendars */}
          <View style={styles.calendarWrapper}>
            <Calendar
              current={initialDate}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: "#FFFFFF",
                calendarBackground: "#FFFFFF",
                textSectionTitleColor: colors.textMuted,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: "#FFFFFF",
                todayTextColor: colors.secondary,
                dayTextColor: colors.text,
                textDisabledColor: "#D1D5DB",
                dotColor: colors.secondary,
                selectedDotColor: "#FFFFFF",
                arrowColor: colors.primary,
                monthTextColor: colors.primary,
                textDayFontFamily: fonts.regular,
                textMonthFontFamily: fonts.bold,
                textDayHeaderFontFamily: fonts.semiBold,
                textDayFontSize: 15,
                textMonthFontSize: 17,
                textDayHeaderFontSize: 13,
              }}
            />
          </View>

          {/* Bouton de fermeture */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.cancelButtonText}>Fermer</Text>
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
    padding: 16,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  closeIconButton: {
    padding: 4,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
    lineHeight: 18,
  },
  calendarWrapper: {
    borderRadius: borderRadius.medium,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cancelButton: {
    height: 46,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textMuted,
  },
});

