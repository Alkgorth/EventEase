import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { EventCard } from "../components/EventCard";
import { getEvents, seedSampleEvents } from "../storage/eventStorage";
import { logoutUser } from "../storage/userStorage";
import { colors } from "../styles/theme";
import { EventItem } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "EventList">;

export default function EventListScreen({ navigation }: Props) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadEvents() {
        setEvents(await getEvents());
        setLoading(false);
      }
      loadEvents();
    }, [])
  );

  async function handleLogout() {
    await logoutUser();
    navigation.replace("Login");
  }

  async function handleSeed() {
    setEvents(await seedSampleEvents());
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Button title="Ajouter un événement" onPress={() => navigation.navigate("EventForm")} />
        <Button title="Se déconnecter" onPress={handleLogout} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onEdit={() =>
              navigation.navigate(
                "EventForm",
                { eventId: item.id })}
          />
        )}

        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun événement pour le moment.</Text>
            <Text style={styles.emptyText}>
              Appuyez sur « Ajouter un événement » pour en créer un.
            </Text>
            {/* TODO étape 4.2 : supprimer ce bouton de test */}
            <Button title="Charger des exemples de test" onPress={handleSeed} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1
  },

  empty: {
    alignItems: "center",
    paddingVertical: 48
  },

  emptyText: {
    textAlign: "center",
    color: colors.text,
    marginBottom: 8
  },
});
