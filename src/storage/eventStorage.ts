import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventItem } from "../types";

const EVENT_KEY = "events";

// Lit tous les événements enregistrés ; renvoie [] s'il n'y en a pas ou si la lecture échoue
export async function getEvents(): Promise<EventItem[]> {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENT_KEY);
    return eventsJson === null ? [] : JSON.parse(eventsJson);
  } catch {
    return [];
  }
}

// Enregistre la liste complète des événements (elle remplace l'ancienne)
export async function saveEvents(events: EventItem[]): Promise<void> {
  const json = JSON.stringify(events);
  await AsyncStorage.setItem(EVENT_KEY, json);
}

// Ajoute un nouvel événement à la liste existante
export async function addEvent(event: EventItem): Promise<void> {
  const events = await getEvents();
  // On crée un nouveau tableau avec tous les anciens événements (...events) plus le nouveau
  const updatedEvents = [...events, event];
  await saveEvents(updatedEvents);
}

export async function updateEvent(event: EventItem): Promise<void> {
  // mise à jour de l'événement, utiliser .map()
  
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