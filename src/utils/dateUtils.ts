// src\utils\dateUtils.ts
// Valide une date au format JJ/MM/AAAA et la convertit en ISO.
export function parseDateInput(text: string): string | null {
    const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match === null) {
        return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const date = new Date(year, month - 1, day, 12);

    const isReal =
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year;

    return isReal ? date.toISOString() : null;
}

// Formate la saisie en date JJ/MM/AAAA.
export function formatDateInput(text: string): string {
    const digits = text.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 2) {
        return digits;
    }
    if (digits.length <= 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

// Convertit une date ISO au format JJ/MM/AAAA.
export function isoToDateInput(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
        return "";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}