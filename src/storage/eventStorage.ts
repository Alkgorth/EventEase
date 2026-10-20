import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventItem } from "../types";

const EVENT_KEY = "events";

export async function getEvents(): Promise<EventItem[]> {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENT_KEY);
    return eventsJson === null ? [] : JSON.parse(eventsJson);
  } catch {
    return [];
  }
}

export async function saveEvents(events: EventItem[]): Promise<void> {
  const json = JSON.stringify(events);
  await AsyncStorage.setItem(EVENT_KEY, json);
}

/**
 * Insère des événements d'exemple dans le stockage.
 * Pratique pour tester immédiatement l'affichage de la liste (étape 2.4)
 * avant même d'avoir développé le formulaire d'ajout (étape 2.5).
 * A SUPPRIMER UNE FOIS à L'ETAPE 4.2
 */
export async function seedSampleEvents(): Promise<EventItem[]> {
  const samples: EventItem[] = [
    {
      id: "1",
      title: "Atelier React Native & Expo",
      description: "Découverte des composants, de la navigation par pile et de la persistance avec AsyncStorage.",
      date: "2026-10-25T14:00:00.000Z",
      participated: true,
    },
    {
      id: "2",
      title: "Meetup Développeurs Mobile",
      description: "Échanges autour des nouveautés React Native, retours d'expérience et démonstrations de projets.",
      date: "2026-11-05T18:30:00.000Z",
      participated: false,
    },
    {
      id: "3",
      title: "Hackathon 24h Code & Design",
      description: "Création d'une application innovante en équipe. Repas et boissons offerts tout au long de l'événement.",
      date: "2026-11-20T09:00:00.000Z",
      participated: false,
    },
  ];

  await saveEvents(samples);
  return samples;
}

/**
 * Supprime tous les événements du stockage (utile pour réinitialiser les tests).
 * A SUPPRIMER UNE FOIS à L'ETAPE 4.2
 */
export async function clearEvents(): Promise<void> {
  await AsyncStorage.removeItem(EVENT_KEY);
}
