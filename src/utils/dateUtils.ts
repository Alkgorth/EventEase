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

export function formatDateInput(text: string): string {
    const cleaned = text.replace(/\D/g, "");

    const numbers = cleaned.slice(0, 8);

    if (numbers.length <= 4) {
        return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
}