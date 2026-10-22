// src\screens\EventListScreen.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { RootStackParamList } from "../navigation/AppNavigator";
import { EventCard } from "../components/EventCard";
import { DeleteModal } from "../components/DeleteModal";
import { deleteEvent, getEvents, toggleParticipate } from "../storage/eventStorage";
import { getCurrentUser, logoutUser } from "../storage/userStorage";
import { borderRadius, colors, fonts } from "../styles/theme";
import { EventItem, User } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EventList">;

export default function EventListScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          const [user, storedEvents] = await Promise.all([
            getCurrentUser(),
            getEvents(),
          ]);
          setCurrentUser(user);
          setEvents(storedEvents);
        } catch {
          setEvents(await getEvents());
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }, [])
  );

  async function handleLogout() {
    await logoutUser();
    navigation.replace("Login");
  }

  function handleDeleteClick(item: EventItem) {
    setEventToDelete(item);
  }

  async function handleConfirmDelete() {
    if (!eventToDelete) return;
    await deleteEvent(eventToDelete.id);
    setEventToDelete(null);
    setEvents(await getEvents());
  }

  async function handleToggleParticipated(id: string) {
    await toggleParticipate(id);
    setEvents(await getEvents());
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Ligne 1 : Logo miniature et Titre EventEase alignés à gauche */}
      <View style={styles.brandRow}>
        <Image
          source={require("../../assets/images/miniature_EventEase2.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={styles.brandTitle}>
          Event<Text style={styles.brandTitleEase}>Ease</Text>
        </Text>
      </View>

      {/* Ligne 2 : Boutons d'action centrés en dessous */}
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("EventForm")}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.createButtonText}>Ajouter un événement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel="Se déconnecter"
        >
          <Feather name="log-out" size={15} color={colors.danger} style={{ marginRight: 6 }} />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onEdit={() =>
              navigation.navigate("EventForm", { eventId: item.id })
            }
            onDelete={() => handleDeleteClick(item)}
            onToggleParticipate={() => handleToggleParticipated(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Salutation personnalisée avec le prénom de l'utilisateur */}
            <Text style={styles.userGreeting}>
              BONJOUR {(currentUser?.name || "VOUS").toUpperCase()}
            </Text>

            {/* Titre chaleureux conforme à la maquette */}
            <Text style={styles.mainTitle}>On se retrouve bientôt ?</Text>

            {/* En-tête de section : Titre et compteur d'événements */}
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>À l{"'"}affiche</Text>
              <Text style={styles.sectionCount}>
                {events.length} événement{events.length > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>Aucun événement pour le moment</Text>
            <Text style={styles.emptySubtitle}>
              Appuyez sur « Ajouter un événement » ci-dessus pour planifier votre premier événement.
            </Text>
          </View>
        }
      />

      {/* Modale de confirmation de suppression personnalisée */}
      <DeleteModal
        visible={eventToDelete !== null}
        eventTitle={eventToDelete?.title || ""}
        eventDate={eventToDelete?.date}
        onCancel={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  // Ligne 1 : Marque alignée à gauche
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },

  logoIcon: {
    width: 34,
    height: 34,
    marginRight: 10,
  },

  brandTitle: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.primary, // Sarcelle #125B50
  },

  brandTitleEase: {
    color: colors.secondary, // Corail #FF735C
  },

  // Ligne 2 : Boutons d'actions centrés en dessous
  topActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: borderRadius.full,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  createButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: "#FFFFFF",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.full,
    backgroundColor: "#FEE2E2",
  },

  logoutButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.danger,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  headerSection: {
    marginTop: 8,
    marginBottom: 16,
  },

  userGreeting: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },

  mainTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
    marginBottom: 20,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },

  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
  },

  sectionCount: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
