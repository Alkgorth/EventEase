// src/types/index.ts

/**
 * Modèle représentant un événement dans l'application EventEase.
 */
export interface EventItem {
  /** Identifiant unique de l'événement (ex: timestamp sous forme de chaîne) */
  id: string;
  /** Titre de l'événement */
  title: string;
  /** Description détaillée de l'événement */
  description: string;
  /**
   * Date au format ISO 8601 UTC (ex: "2026-10-25T12:00:00.000Z").
   * Stockée en chaîne car AsyncStorage ne conserve que des chaînes sérialisées JSON.
   */
  date: string;
  /**
   * État de participation de l'utilisateur sur cet appareil :
   * true = Inscrit, false = Non inscrit.
   */
  participated: boolean;
}

/**
 * Modèle représentant un utilisateur de l'application EventEase.
 */
export interface User {
  /** Identifiant unique du compte */
  id: string;
  /** Prénom ou nom de l'utilisateur affiché dans l'en-tête de bienvenue */
  name: string;
  /** Adresse email normalisée (minuscules, sans espaces) servant d'identifiant */
  email: string;
  /**
   * Mot de passe du compte.
   * Note pédagogique pour la soutenance : stocké en local dans AsyncStorage
   * dans le cadre de ce prototype sans backend distant.
   */
  password: string;
}