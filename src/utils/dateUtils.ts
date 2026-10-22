// src/utils/dateUtils.ts

/**
 * Valide une date saisie au format JJ/MM/AAAA et la convertit en chaîne ISO 8601.
 * 
 * Sécurités implémentées :
 * 1. Expression régulière : vérifie strictement le format 2 chiffres / 2 chiffres / 4 chiffres.
 * 2. Mois JavaScript : retire 1 au mois saisi (les mois vont de 0 à 11 en JS).
 * 3. Heure à midi (12h) : évite tout décalage d'un jour lors de la conversion UTC (toISOString).
 * 4. Calendrier réel : rejette les dates impossibles (ex: 31/02) que le constructeur Date() corrige silencieusement.
 * 
 * @param text La chaîne saisie par l'utilisateur (ex: "25/10/2026")
 * @returns La chaîne ISO 8601 (ex: "2026-10-25T10:00:00.000Z") ou null si invalide
 */
export function parseDateInput(text: string): string | null {
    // 1. Découpage et vérification de la forme JJ/MM/AAAA
    const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match === null) {
        return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    // 2. Création de la date fixée à midi pour neutraliser les décalages de fuseau UTC
    const date = new Date(year, month - 1, day, 12);

    // 3. Vérification du calendrier réel : si le 31/02 a été saisi, Date() glisse en mars
    const isReal =
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year;

    return isReal ? date.toISOString() : null;
}

/**
 * Formate dynamiquement la saisie de l'utilisateur au format JJ/MM/AAAA pendant la frappe.
 * Insère automatiquement les slashes '/' après 2 et 4 chiffres saisis.
 * 
 * @param text Le texte saisi au clavier (avec ou sans séparateurs)
 * @returns La chaîne formatée (ex: "25/10/2026")
 */
export function formatDateInput(text: string): string {
    // Ne conserve que les chiffres et limite à 8 chiffres (JJ + MM + AAAA)
    const digits = text.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

/**
 * Convertit une date stockée en ISO 8601 vers le format d'affichage pour formulaire JJ/MM/AAAA.
 * Utilisé pour préremplir le champ de date lors de la modification d'un événement.
 * 
 * @param isoString La chaîne ISO stockée (ex: "2026-10-25T12:00:00.000Z")
 * @returns La date au format "25/10/2026", ou une chaîne vide si invalide
 */
export function isoToDateInput(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return "";
    }

    // padStart(2, "0") garantit d'avoir deux chiffres pour le jour et le mois (ex: "05" au lieu de "5")
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 car les mois débutent à 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}