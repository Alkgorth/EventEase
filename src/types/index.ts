// src\types\index.ts
export interface EventItem {
	id: string;
	title: string;
	description: string;
	date: string;
	participated: boolean;
}

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
}