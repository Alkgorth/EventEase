// src\storage\userStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USER_KEY = 'user';
const SESSION_KEY = 'currentUser';

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

async function getUsers(): Promise<User[]> {
    try {
        const json = await AsyncStorage.getItem(USER_KEY);
        return json === null ? [] : JSON.parse(json);
    } catch {
        return [];
    }
}

export async function registerUser(user: User): Promise<boolean> {
    const users = await getUsers();
    const email = normalizeEmail(user.email);

    const emailAlreadyUsed = users.some((u) => u.email === email);
    if (emailAlreadyUsed) {
        return false;
    }
    const newUser: User = { ...user, email };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify([...users, newUser]));
    return true;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
    const users = await getUsers();
    const cleanEmail = normalizeEmail(email);

    const user = users.find((u) => u.email === cleanEmail && u.password === password);
    if (user === undefined) {
        return null;
    }
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
}

export async function getCurrentUser(): Promise<User | null> {
    try {
        const json = await AsyncStorage.getItem(SESSION_KEY);
        return json === null ? null : JSON.parse(json);
    } catch {
        return null;
    }
}

export async function logoutUser(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
}
