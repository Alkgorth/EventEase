// src/storage/eventStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventItem } from "../types";

/** Clé de stockage pour la liste complète des événements */
const EVENT_KEY = "events";

/**
 * Lit tous les événements enregistrés, triés par ordre chronologique (du plus proche au plus lointain).
 * Renvoie un tableau vide [] s'il n'y a aucun événement ou en cas d'erreur de lecture.
 * 
 * Source unique de vérité : centralise le tri chronologique pour toute l'application.
 * 
 * @returns La liste des événements triés par date croissante
 */
export async function getEvents(): Promise<EventItem[]> {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENT_KEY);
    if (eventsJson === null) {
      return [];
    }
    const events: EventItem[] = JSON.parse(eventsJson);

    // Tri chronologique : comparaison des timestamps en millisecondes
    return events.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();

      // Sécurité si une date était corrompue
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;

      // Soustraction : résultat négatif si A est avant B (A arrive en premier)
      return timeA - timeB;
    });
  } catch {
    return [];
  }
}

/**
 * Enregistre la liste complète des événements dans AsyncStorage (remplace l'ancienne liste).
 * 
 * @param events Le tableau des événements à persister
 */
export async function saveEvents(events: EventItem[]): Promise<void> {
  const json = JSON.stringify(events);
  await AsyncStorage.setItem(EVENT_KEY, json);
}

/**
 * Ajoute un nouvel événement à la liste existante.
 * Utilise l'opérateur spread (...events) pour créer un nouveau tableau sans modifier l'existant.
 * 
 * @param event L'événement à ajouter
 */
export async function addEvent(event: EventItem): Promise<void> {
  const events = await getEvents();
  const updatedEvents = [...events, event];
  await saveEvents(updatedEvents);
}

/**
 * Met à jour un événement existant dans la liste.
 * Utilise Array.prototype.map pour remplacer uniquement l'élément ayant le même id.
 * 
 * @param updatedEvent L'événement modifié
 */
export async function updateEvent(updatedEvent: EventItem): Promise<void> {
  const events = await getEvents();
  const updatedEvents = events.map((event) =>
    event.id === updatedEvent.id ? updatedEvent : event
  );
  await saveEvents(updatedEvents);
}

/**
 * Récupère un événement précis grâce à son identifiant unique.
 * Utilise l'opérateur de coalescence des nuls (??) pour renvoyer null si find renvoie undefined.
 * 
 * @param id L'identifiant de l'événement recherché
 * @returns L'événement trouvé ou null
 */
export async function getEventById(id: string): Promise<EventItem | null> {
  const events = await getEvents();
  const event = events.find((e) => e.id === id);
  return event ?? null;
}

/**
 * Supprime un événement de la liste en conservant tous les autres.
 * Utilise Array.prototype.filter pour exclure l'identifiant ciblé.
 * 
 * @param id L'identifiant de l'événement à supprimer
 */
export async function deleteEvent(id: string): Promise<void> {
  const events = await getEvents();
  const remainingEvents = events.filter((event) => event.id !== id);
  await saveEvents(remainingEvents);
}

/**
 * Inverse l'état de participation d'un événement (Inscrit <-> Non inscrit).
 * Combine map et l'opérateur spread pour cloner l'objet en inversant uniquement le booléen participated.
 * 
 * @param id L'identifiant de l'événement visé
 */
export async function toggleParticipate(id: string): Promise<void> {
  const events = await getEvents();
  const updatedEvents = events.map((event) =>
    event.id === id ? { ...event, participated: !event.participated } : event
  );
  await saveEvents(updatedEvents);
}