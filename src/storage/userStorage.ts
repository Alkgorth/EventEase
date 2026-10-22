// src/storage/userStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

/** Clé de stockage pour la liste complète des utilisateurs inscrits */
const USER_KEY = "user";

/** Clé de stockage pour l'utilisateur actuellement connecté (session active) */
const SESSION_KEY = "currentUser";

/**
 * Nettoie une adresse email en retirant les espaces et en la passant en minuscules.
 * Permet d'éviter les erreurs de casse (ex: "Test@Domaine.fr" devient "test@domaine.fr").
 */
function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/**
 * Récupère tous les comptes enregistrés dans AsyncStorage.
 * Renvoie un tableau vide [] si aucun compte n'est enregistré ou en cas d'erreur.
 */
async function getUsers(): Promise<User[]> {
    try {
        const json = await AsyncStorage.getItem(USER_KEY);
        return json === null ? [] : JSON.parse(json);
    } catch {
        return [];
    }
}

/**
 * Enregistre un nouvel utilisateur après avoir vérifié que son email n'est pas déjà pris.
 * 
 * @param user Les données du compte à enregistrer
 * @returns true si l'inscription a réussi, false si l'email existe déjà
 */
export async function registerUser(user: User): Promise<boolean> {
    const users = await getUsers();
    const email = normalizeEmail(user.email);

    // Vérifie si un compte existe déjà avec cette adresse
    const emailAlreadyUsed = users.some((u) => u.email === email);
    if (emailAlreadyUsed) {
        return false;
    }

    // Crée une copie de l'utilisateur avec l'email normalisé grâce au spread operator
    const newUser: User = { ...user, email };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify([...users, newUser]));
    return true;
}

/**
 * Tente de connecter un utilisateur en vérifiant la correspondance email/mot de passe.
 * Si les identifiants sont corrects, la session active est enregistrée sous SESSION_KEY.
 * 
 * @param email L'adresse email saisie
 * @param password Le mot de passe saisi (non modifié pour préserver d'éventuels espaces choisis)
 * @returns L'objet User si connexion réussie, null si identifiants incorrects
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
    const users = await getUsers();
    const cleanEmail = normalizeEmail(email);

    const user = users.find((u) => u.email === cleanEmail && u.password === password);
    if (user === undefined) {
        return null;
    }

    // Enregistrement de la session dans AsyncStorage
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
}

/**
 * Récupère l'utilisateur actuellement connecté au lancement de l'application.
 * Utilisé par AppNavigator pour rediriger directement vers la liste d'événements si connecté.
 * 
 * @returns L'utilisateur de la session courante ou null si déconnecté
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const json = await AsyncStorage.getItem(SESSION_KEY);
        return json === null ? null : JSON.parse(json);
    } catch {
        return null;
    }
}

/**
 * Déconnecte l'utilisateur en supprimant la session dans AsyncStorage.
 */
export async function logoutUser(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
}
